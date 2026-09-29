<?php

namespace Database\Seeders;

use App\Enums\MatchEventType;
use App\Enums\MatchStatisticType;
use App\Enums\MatchStatus;
use App\Enums\PlayerPosition;
use App\Models\Player;
use Carbon\CarbonImmutable;
use Database\Seeders\Concerns\SeedsFromJson;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class MatchSeeder extends Seeder
{
    use SeedsFromJson;

    /** Statuses that legitimately carry a running clock. */
    private const IN_PROGRESS = [MatchStatus::Live->value, MatchStatus::Halftime->value];

    /**
     * Statuses whose fixture has been played: a finished match and a live or
     * halftime one both carry a feeding event log and metric table.
     */
    private const PLAYED = [
        MatchStatus::Finished->value,
        MatchStatus::Live->value,
        MatchStatus::Halftime->value,
    ];

    /**
     * Referees are not competition-specific, so one pool covers every fixture.
     * Every match gets an assigned referee: the lineup exists for all of them.
     */
    private const REFEREES = [
        'Alberto Undiano Mallenco',
        'Carlos del Cerro Grande',
        'Antonio Mateu Lahoz',
        'Xavier Estrada Fernández',
        'Guillermo Cuadra Fernández',
        'Alejandro Hernández Hernández',
        'Jesús Gil Manzano',
        'José María Sánchez Martínez',
        'Juan Martínez Munuera',
        'César Soto Grado',
        'Pablo Figueroa Vázquez',
        'Alejandro Muñiz Ruiz',
    ];

    /** Every team must hold at least this many played fixtures per competition. */
    private const MIN_FINISHED = 5;

    /**
     * Anchor day for the relative day_offset values, so the calendar stays
     * current whenever the seeds are run. Overridable to pin tests.
     */
    private CarbonImmutable $anchor;

    public function run(): void
    {
        $this->anchor = CarbonImmutable::today();

        $statuses = MatchStatus::values();

        $matches = $this->load('matches');
        $matches = array_merge($matches, $this->buildFinishedFixtures($matches));
        $matches = $this->assignReferees($matches);

        $rows = array_map(function (array $match) use ($statuses): array {
            if (! in_array($match['status'], $statuses, true)) {
                throw new InvalidArgumentException(
                    "Match {$match['id']} has unknown status [{$match['status']}]."
                );
            }

            $datetime = $this->resolveKickoff((int) $match['day_offset'], $match['kickoff']);

            // day_offset/kickoff are scheduling inputs, not columns.
            unset($match['day_offset'], $match['kickoff']);

            return [
                ...$match,
                'datetime' => $datetime,
                'minute' => in_array($match['status'], self::IN_PROGRESS, true) ? $match['minute'] : null,
            ];
        }, $matches);

        $this->upsertChunked('matches', $rows, ['id']);

        // Plays (events + statistics) are derived from the matches themselves
        // at seed time, so a goal event can never disagree with its scoreline.
        // The children carry surrogate keys only, so they are rebuilt rather
        // than upserted; truncating first keeps re-seeding idempotent.
        $players = $this->playersByTeam();
        $events = [];
        $statistics = [];

        foreach (DB::table('matches')->whereIn('status', self::PLAYED)->orderBy('id')->get() as $match) {
            $this->buildMatchContent($match, $players, $events, $statistics);
        }

        DB::table('match_events')->delete();
        DB::table('match_statistics')->delete();

        $stamped = $this->stamp($events);
        $stampedStats = $this->stamp($statistics);

        $this->insertChunked('match_events', $stamped);
        $this->insertChunked('match_statistics', $stampedStats);

        $this->assertScheduleIsPlausible();
        $this->report(count($rows), count($events), count($statistics));
    }

    /**
     * Assign an official to every played fixture that ships without one.
     * Scheduled matches stay referee-less on purpose: the API contract omits
     * referee for upcoming games (a lineup has not happened yet), and the
     * resource only serves non-null columns.
     *
     * @param  list<array<string, mixed>>  $matches
     * @return list<array<string, mixed>>
     */
    private function assignReferees(array $matches): array
    {
        return array_map(function (array $match): array {
            if ($match['status'] !== MatchStatus::Scheduled->value) {
                $match['referee'] ??= self::REFEREES[$this->pick("referee-{$match['id']}", 0, count(self::REFEREES) - 1)];
            }

            return $match;
        }, $matches);
    }

    /**
     * Top up every (team, competition) that already holds fixtures so the team
     * has at least MIN_FINISHED played games there. Without this a team detail
     * page reckoned on "últimos partidos" (a finished-only rail) had nothing
     * to show. The scorelines are arbitrary; the event/statistic derivation in
     * buildMatchContent is what keeps them coherent.
     *
     * @param  list<array<string, mixed>>  $matches
     * @return list<array<string, mixed>>
     */
    private function buildFinishedFixtures(array $matches): array
    {
        $comps = array_values(array_unique(array_column($matches, 'competition_id')));
        $extra = [];
        $sequence = 0;

        foreach ($comps as $comp) {
            $comp = (int) $comp;
            $teams = $this->fixtureTeams($matches, $comp);
            sort($teams);

            $finished = array_fill_keys($teams, 0);
            foreach ($matches as $m) {
                if ((int) $m['competition_id'] !== $comp || $m['status'] !== MatchStatus::Finished->value) {
                    continue;
                }
                $finished[(int) $m['team_home_id']]++;
                $finished[(int) $m['team_away_id']]++;
            }

            $deficit = array_map(fn (int $played): int => max(0, self::MIN_FINISHED - $played), $finished);

            while (max($deficit) > 0) {
                $pool = array_values(array_filter($teams, fn (int $t): bool => $deficit[$t] > 0));

                if (count($pool) % 2 === 1) {
                    // A lone team needs an opponent; hand it to the club with
                    // the biggest completed fixture list so it barely notices.
                    $filler = $teams[0];
                    $fillerPlayed = -1;
                    foreach ($teams as $candidate) {
                        if (in_array($candidate, $pool, true)) {
                            continue;
                        }
                        if ($finished[$candidate] > $fillerPlayed) {
                            $fillerPlayed = $finished[$candidate];
                            $filler = $candidate;
                        }
                    }
                    $pool[] = $filler;
                }

                for ($i = 0; $i < count($pool); $i += 2) {
                    $home = $pool[$i];
                    $away = $pool[$i + 1];
                    if (($i / 2) % 2 === 1) {
                        [$home, $away] = [$away, $home]; // alternate the venue
                    }
                    $extra[] = $this->finishedFixture($comp, $home, $away, $sequence);
                    $sequence++;

                    $deficit[$home]--;
                    $deficit[$away]--;
                }
            }
        }

        return $extra;
    }

    /**
     * Slowly seeded clubs for a competition window, taken straight from the
     * fixtures that already exist for it.
     *
     * @param  list<array<string, mixed>>  $matches
     * @return list<int>
     */
    private function fixtureTeams(array $matches, int $comp): array
    {
        $teams = [];

        foreach ($matches as $m) {
            if ((int) $m['competition_id'] !== $comp) {
                continue;
            }
            $teams[(int) $m['team_home_id']] = true;
            $teams[(int) $m['team_away_id']] = true;
        }

        return array_map('intval', array_keys($teams));
    }

    /**
     * One deterministic closed fixture with an outcome, a venue and an
     * attendance figure, parked on a strictly historical day so it can never
     * collide with the current season's schedule.
     *
     * @return array<string, mixed>
     */
    private function finishedFixture(int $comp, int $home, int $away, int $sequence): array
    {
        $id = 1000 + $sequence;
        $roll = $this->pick("result-{$id}", 0, 99);

        if ($roll < 48) {
            $homeScore = $this->pick("homescore-{$id}", 2, 6);
            $awayScore = $this->pick("awayscore-{$id}", 0, $homeScore - 1);
        } elseif ($roll < 78) {
            $homeScore = $this->pick("drawwscore-{$id}", 1, 3);
            $awayScore = $homeScore;
        } else {
            $awayScore = $this->pick("awayscore-{$id}", 2, 6);
            $homeScore = $this->pick("homescore-{$id}", 0, $awayScore - 1);
        }

        return [
            'id' => $id,
            'competition_id' => $comp,
            'team_home_id' => $home,
            'team_away_id' => $away,
            'status' => MatchStatus::Finished->value,
            'home_score' => $homeScore,
            'away_score' => $awayScore,
            'day_offset' => -(self::MIN_FINISHED + $sequence + 45),
            'kickoff' => $this->pick("kickoff-{$id}", 0, 3) === 0 ? '20:30' : '19:00',
            'venue' => $this->pick("venue-{$sequence}", 0, 1) === 0 ? 'Pabellón Municipal' : 'Pabellón Porta Fira',
            'referee' => null,
            'attendance' => $this->pick("attendance-{$id}", 500, 4500),
            'mvp_player_id' => null,
        ];
    }

    /**
     * @param  array<int, list<array{id: int, position: string, shirt_number: int}>>  $players
     * @param  list<array<string, mixed>>  $events
     * @param  list<array<string, mixed>>  $statistics
     */
    private function buildMatchContent(
        object $match,
        array $players,
        array &$events,
        array &$statistics,
    ): void {
        $matchId = (int) $match->id;
        $homeTeam = (int) $match->team_home_id;
        $awayTeam = (int) $match->team_away_id;
        $playedTo = $match->status === MatchStatus::Finished->value ? 40 : max(1, (int) $match->minute);

        $homePlayers = $players[$homeTeam] ?? [];
        $awayPlayers = $players[$awayTeam] ?? [];

        // Goals must end exactly on the scoreline. The interleaving order is
        // cosmetic; the counters are what the statistics enforce.
        $goalSlots = array_merge(
            array_fill(0, (int) $match->home_score, 'home'),
            array_fill(0, (int) $match->away_score, 'away'),
        );

        $minutes = $this->goalMinutes($playedTo, count($goalSlots));

        foreach ($goalSlots as $index => $side) {
            $team = $side === 'home' ? $homeTeam : $awayTeam;
            $squad = $side === 'home' ? $homePlayers : $awayPlayers;
            $scorer = $this->pickScorer($matchId, $team, $index, $squad);

            $events[] = [
                'match_id' => $matchId,
                'player_id' => $scorer,
                'team_id' => $team,
                'assist_player_id' => $this->maybeAssist($matchId, $team, $index, $squad, $scorer),
                'event_type' => MatchEventType::Goal->value,
                'minute' => $minutes[$index] ?? min(40, $index + 1),
                'description' => null,
            ];
        }

        $yellowishHome = $this->disciplinary($matchId, $homeTeam, $homePlayers, $playedTo);
        $yellowishAway = $this->disciplinary($matchId, $awayTeam, $awayPlayers, $playedTo);

        $events = array_merge(
            $events,
            $yellowishHome['yellowcard'],
            $yellowishHome['redcard'],
            $yellowishAway['yellowcard'],
            $yellowishAway['redcard'],
        );

        // Card counts below must mirror the produced events exactly, so the
        // metric table and the event log can never contradict each other.
        $statistics = array_merge($statistics, $this->metricRows(
            $match,
            $yellowishHome['yellowcard'],
            $yellowishHome['redcard'],
            $yellowishAway['yellowcard'],
            $yellowishAway['redcard'],
        ));

        // A played fixture deserves a named man of the match, and the API only
        // serves an MVP when one exists. Pick from the winning side (either on
        // a draw) but never invent a player that is not on the roster.
        if ($match->mvp_player_id === null) {
            $mvpTeam = ((int) $match->home_score) >= ((int) $match->away_score) ? $homeTeam : $awayTeam;
            $mvpSquad = $mvpTeam === $homeTeam ? $homePlayers : $awayPlayers;

            if (count($mvpSquad) > 0) {
                DB::table('matches')
                    ->where('id', $matchId)
                    ->update(['mvp_player_id' => $mvpSquad[$this->pick("mvp-{$matchId}", 0, count($mvpSquad) - 1)]['id']]);
            }
        }
    }

    /**
     * Ascending goal minutes spread across the played portion of the match.
     *
     * @return list<int>
     */
    private function goalMinutes(int $playedTo, int $total): array
    {
        if ($total <= 1) {
            return $total === 1 ? [3] : [];
        }

        $minutes = [];
        for ($i = 0; $i < $total; $i++) {
            $minutes[] = max(1, min($playedTo, 2 + (int) round(($i + 0.5) * ($playedTo - 2) / $total)));
        }
        sort($minutes);

        return $minutes;
    }

    /**
     * A scorer from a field player, mostly from the two offensive spots.
     *
     * @param  list<array{id: int, position: string, shirt_number: int}>  $squad
     */
    private function pickScorer(int $matchId, int $team, int $index, array $squad): int
    {
        $candidates = array_values(array_filter(
            $squad,
            fn (array $p): bool => $p['position'] !== PlayerPosition::Goalkeeper->value,
        ));

        if (count($candidates) === 0) {
            $candidates = $squad;
        }
        if (count($candidates) === 0) {
            throw new InvalidArgumentException("Match {$matchId} has no roster for team {$team}.");
        }

        return $candidates[crc32("scorer-{$matchId}-{$team}-{$index}") % count($candidates)]['id'];
    }

    /**
     * Around half of the goals get an assist from a different teammate.
     *
     * @param  list<array{id: int, position: string, shirt_number: int}>  $squad
     */
    private function maybeAssist(int $matchId, int $team, int $index, array $squad, int $scorer): ?int
    {
        $candidates = array_values(array_filter(
            $squad,
            fn (array $p): bool => $p['position'] !== PlayerPosition::Goalkeeper->value && $p['id'] !== $scorer,
        ));

        if (count($candidates) === 0 || crc32("assist-{$matchId}-{$team}-{$index}") % 100 >= 55) {
            return null;
        }

        return $candidates[crc32("assist-pick-{$matchId}-{$team}-{$index}") % count($candidates)]['id'];
    }

    /**
     * Discipline feeds for one side. A yellow or a red card has a player and a
     * minute inside the played portion of the fixture.
     *
     * @param  list<array{id: int, position: string, shirt_number: int}>  $squad
     * @return array{yellowcard: list<array<string, mixed>>, redcard: list<array<string, mixed>>}
     */
    private function disciplinary(int $matchId, int $team, array $squad, int $playedTo): array
    {
        $cards = ['yellowcard' => [], 'redcard' => []];
        $yellows = crc32("yellows-{$matchId}-{$team}") % 3;
        $reds = crc32("reds-{$matchId}-{$team}") % 7 === 0 ? 1 : 0;

        for ($i = 0; $i < $yellows; $i++) {
            if (count($squad) === 0) {
                break;
            }
            $cards['yellowcard'][] = [
                'match_id' => $matchId,
                'player_id' => $squad[crc32("yc-{$matchId}-{$team}-{$i}") % count($squad)]['id'],
                'team_id' => $team,
                'assist_player_id' => null,
                'event_type' => MatchEventType::YellowCard->value,
                'minute' => max(2, min($playedTo, 3 + (crc32("yc-min-{$matchId}-{$team}-{$i}") % max(1, $playedTo - 2)))),
                'description' => null,
            ];
        }

        for ($i = 0; $i < $reds; $i++) {
            if (count($squad) === 0) {
                break;
            }
            $cards['redcard'][] = [
                'match_id' => $matchId,
                'player_id' => $squad[crc32("rc-{$matchId}-{$team}-{$i}") % count($squad)]['id'],
                'team_id' => $team,
                'assist_player_id' => null,
                'event_type' => MatchEventType::RedCard->value,
                'minute' => max(2, min($playedTo, 4 + (crc32("rc-min-{$matchId}-{$team}-{$i}") % max(1, $playedTo - 3)))),
                'description' => null,
            ];
        }

        return $cards;
    }

    /**
     * The seven-metric table shared by both sides of a played fixture. With no
     * event feed the scheduling input would be a black box, so possession and
     * shooting dials are drawn deterministically per match while the card
     * columns are the literal counts produced above.
     *
     * @return list<array<string, mixed>>
     */
    private function metricRows(object $match, array $yellowHome, array $redHome, array $yellowAway, array $redAway): array
    {
        $matchId = (int) $match->id;
        $homeScore = (int) $match->home_score;
        $awayScore = (int) $match->away_score;

        $possessionHome = 45 + $this->pick("possession-{$matchId}", 0, 13);
        $shotsHome = $homeScore + $this->pick("shots-home-{$matchId}", 5, 14);
        $shotsAway = $awayScore + $this->pick("shots-away-{$matchId}", 5, 14);
        $onTargetHome = min($shotsHome, $homeScore + $this->pick("ontarget-home-{$matchId}", 0, 5));
        $onTargetAway = min($shotsAway, $awayScore + $this->pick("ontarget-away-{$matchId}", 0, 5));

        return [
            ['match_id' => $matchId, 'type' => MatchStatisticType::Possession->value, 'home_value' => $possessionHome, 'away_value' => 100 - $possessionHome],
            ['match_id' => $matchId, 'type' => MatchStatisticType::Shots->value, 'home_value' => $shotsHome, 'away_value' => $shotsAway],
            ['match_id' => $matchId, 'type' => MatchStatisticType::ShotsOnTarget->value, 'home_value' => $onTargetHome, 'away_value' => $onTargetAway],
            ['match_id' => $matchId, 'type' => MatchStatisticType::Corners->value, 'home_value' => $this->pick("corners-home-{$matchId}", 2, 9), 'away_value' => $this->pick("corners-away-{$matchId}", 2, 9)],
            ['match_id' => $matchId, 'type' => MatchStatisticType::Fouls->value, 'home_value' => $this->pick("fouls-home-{$matchId}", 7, 19), 'away_value' => $this->pick("fouls-away-{$matchId}", 7, 19)],
            ['match_id' => $matchId, 'type' => MatchStatisticType::YellowCards->value, 'home_value' => count($yellowHome), 'away_value' => count($yellowAway)],
            ['match_id' => $matchId, 'type' => MatchStatisticType::RedCards->value, 'home_value' => count($redHome), 'away_value' => count($redAway)],
        ];
    }

    /**
     * Roster lookup grouped by club, in ascending player id so scorer picks
     * are stable across reseeds.
     *
     * @return array<int, list<array{id: int, position: string, shirt_number: int}>>
     */
    private function playersByTeam(): array
    {
        $grouped = [];

        foreach (Player::query()->orderBy('id')->get(['id', 'team_id', 'position', 'shirt_number']) as $player) {
            $grouped[(int) $player->team_id][] = [
                'id' => (int) $player->id,
                'position' => $player->position instanceof PlayerPosition ? $player->position->value : (string) $player->position,
                'shirt_number' => (int) $player->shirt_number,
            ];
        }

        return $grouped;
    }

    /**
     * Deterministic pseudo-random integer in [min, max]. Stable across reseeds
     * because it is derived purely from the input key, never from a global
     * RNG state.
     */
    private function pick(string $key, int $min, int $max): int
    {
        $range = $max - $min + 1;

        return $min + (crc32($key) % max(1, $range));
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     * @return list<array<string, mixed>>
     */
    private function stamp(array $rows): array
    {
        $now = now();

        return array_map(fn (array $row): array => ['created_at' => $now, 'updated_at' => $now] + $row, $rows);
    }

    /**
     * Turn a relative day offset plus kickoff time into an absolute datetime.
     */
    private function resolveKickoff(int $dayOffset, string $time): string
    {
        [$hour, $minute] = array_map('intval', explode(':', $time));

        return $this->anchor
            ->addDays($dayOffset)
            ->setTime($hour, $minute)
            ->format('Y-m-d H:i:s');
    }

    /**
     * A competition cannot field two fixtures in one slot, and no club may play
     * twice in a day. Different competitions may share a slot, since they play
     * in different venues.
     *
     * @param  list<array<string, mixed>>  $rows
     */
    private function insertChunked(string $table, array $rows, int $chunk = 500): void
    {
        foreach (array_chunk($rows, $chunk) as $chunkRows) {
            DB::table($table)->insert($chunkRows);
        }
    }

    private function assertScheduleIsPlausible(): void
    {
        $slotClash = DB::table('matches')
            ->selectRaw('competition_id, datetime, count(*) as total')
            ->groupBy('competition_id', 'datetime')
            ->havingRaw('count(*) > 1')
            ->get();

        if ($slotClash->isNotEmpty()) {
            $first = $slotClash->first();
            throw new InvalidArgumentException(sprintf(
                'Competition %d has %d fixtures in the %s slot.',
                $first->competition_id,
                $first->total,
                $first->datetime,
            ));
        }

        $dayClash = DB::table('matches as m')
            ->join('matches as o', function ($join): void {
                $join->on('o.id', '<', 'm.id')
                    ->whereRaw('DATE(o.datetime) = DATE(m.datetime)')
                    ->whereRaw('(o.team_home_id = m.team_home_id OR o.team_home_id = m.team_away_id OR o.team_away_id = m.team_home_id OR o.team_away_id = m.team_away_id)');
            })
            ->selectRaw('m.id, o.id as other, DATE(m.datetime) as day')
            ->first();

        if ($dayClash !== null) {
            throw new InvalidArgumentException(sprintf(
                'Match %d and match %d share a team on %s.',
                $dayClash->id,
                $dayClash->other,
                $dayClash->day,
            ));
        }
    }

    private function report(int $matches, int $events, int $statistics): void
    {
        $this->command?->info("Matches: {$matches} | Events: {$events} | Statistics: {$statistics}");

        $summary = DB::table('matches')
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->orderBy('status')
            ->get()
            ->map(fn (object $row): string => "{$row->status}={$row->total}")
            ->implode(' ');

        $this->command?->info("Status: {$summary}");
    }
}
