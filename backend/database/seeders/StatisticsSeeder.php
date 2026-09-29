<?php

namespace Database\Seeders;

use App\Enums\MatchEventType;
use App\Enums\MatchStatus;
use App\Enums\PlayerPosition;
use Database\Seeders\Concerns\SeedsFromJson;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class StatisticsSeeder extends Seeder
{
    use SeedsFromJson;

    /** Statuses whose fixtures feed player aggregates. */
    private const PLAYED = [
        MatchStatus::Finished->value,
        MatchStatus::Live->value,
        MatchStatus::Halftime->value,
    ];

    public function run(): void
    {
        $teamStats = $this->load('team_statistics');
        $playerStats = $this->derivePlayerStatistics($this->load('player_statistics'));

        $this->assertArithmeticIsConsistent($teamStats);

        $this->upsertChunked(
            'player_statistics',
            $playerStats,
            ['player_id', 'season', 'competition_id'],
        );
        $this->upsertChunked(
            'team_statistics',
            $teamStats,
            ['team_id', 'season', 'competition_id'],
        );

        $this->command?->info('Player statistics: '.count($playerStats));
        $this->command?->info('Team statistics: '.count($teamStats));
    }

    /**
     * Player aggregates are computed from the match play itself, not authored
     * by hand, so the "9 goles" on a profile is exactly the sum of the goal
     * events on that player's match feed. One row is produced per player and
     * competition the team actually took part in (season label follows the
     * competition), ratings are inherited from the hand-authored dataset where
     * they exist and generated deterministically for the rest.
     *
     * @param  list<array<string, mixed>>  $seedRows
     * @return list<array<string, mixed>>
     */
    private function derivePlayerStatistics(array $seedRows): array
    {
        $seasonByCompetition = [];
        foreach ($this->load('competitions') as $competition) {
            $seasonByCompetition[(int) $competition['id']] = $competition['season'];
        }

        $players = DB::table('players')->get(['id', 'team_id', 'position']);
        $roster = [];
        foreach ($players as $player) {
            $roster[(int) $player->team_id][] = $player;
        }

        $matches = DB::table('matches')->whereIn('status', self::PLAYED)->get(['id', 'competition_id', 'team_home_id', 'team_away_id']);

        $matchCompetition = [];
        $played = [];
        foreach ($matches as $match) {
            $competition = (int) $match->competition_id;
            $matchCompetition[(int) $match->id] = $competition;
            $home = (int) $match->team_home_id;
            $away = (int) $match->team_away_id;
            $played[$home][$competition] = ($played[$home][$competition] ?? 0) + 1;
            $played[$away][$competition] = ($played[$away][$competition] ?? 0) + 1;
        }

        // Goals, assists and discipline are tallied per match, so each count is
        // scoped to the player and the competition the incident happened in.
        $goals = [];
        $assists = [];
        $yellowCards = [];
        $redCards = [];

        foreach (DB::table('match_events')->get(['match_id', 'player_id', 'assist_player_id', 'event_type']) as $event) {
            $competition = $matchCompetition[(int) $event->match_id] ?? null;
            if ($competition === null) {
                continue;
            }

            $eventType = $event->event_type;
            $playerId = (int) $event->player_id;

            if ($eventType === MatchEventType::Goal->value) {
                $goals[$playerId][$competition] = ($goals[$playerId][$competition] ?? 0) + 1;
                if ($event->assist_player_id !== null) {
                    $assists[(int) $event->assist_player_id][$competition] = ($assists[(int) $event->assist_player_id][$competition] ?? 0) + 1;
                }
            } elseif ($eventType === MatchEventType::YellowCard->value) {
                $yellowCards[$playerId][$competition] = ($yellowCards[$playerId][$competition] ?? 0) + 1;
            } elseif ($eventType === MatchEventType::RedCard->value) {
                $redCards[$playerId][$competition] = ($redCards[$playerId][$competition] ?? 0) + 1;
            }
        }

        // The hand-authored rows stay the source of truth for a star's rating:
        // a real player keeps the figure their profile already shows elsewhere.
        $ratingByPlayer = [];
        foreach ($seedRows as $row) {
            $ratingByPlayer[(int) $row['player_id']] ??= isset($row['rating']) ? (float) $row['rating'] : null;
        }

        $rows = [];
        foreach ($played as $teamId => $byCompetition) {
            $squad = $roster[$teamId] ?? [];
            foreach ($byCompetition as $competition => $matchesPlayed) {
                $season = $seasonByCompetition[$competition] ?? '2025/2026';

                foreach ($squad as $player) {
                    $playerId = (int) $player->id;
                    $position = $player->position;
                    $minutes = $matchesPlayed * $this->minutesPerMatch($position, $playerId);

                    $rows[] = [
                        'player_id' => $playerId,
                        'competition_id' => $competition,
                        'season' => $season,
                        'matches_played' => $matchesPlayed,
                        'goals' => $goals[$playerId][$competition] ?? 0,
                        'assists' => $assists[$playerId][$competition] ?? 0,
                        'yellow_cards' => $yellowCards[$playerId][$competition] ?? 0,
                        'red_cards' => $redCards[$playerId][$competition] ?? 0,
                        'minutes_played' => $minutes,
                        'rating' => $ratingByPlayer[$playerId] ?? $this->generatedRating($position, $playerId),
                        'expected_goals' => $this->round2((($goals[$playerId][$competition] ?? 0) * 1.08) + (crc32("xg-{$playerId}") % 100) / 100),
                        'expected_assists' => $this->round2((($assists[$playerId][$competition] ?? 0) * 0.92) + (crc32("xa-{$playerId}") % 80) / 100),
                        'pass_accuracy' => $this->passAccuracy($position, $playerId),
                        'shot_accuracy' => $this->shotAccuracy($position, $playerId),
                        'defensive_actions' => $this->defensiveActions($position, $playerId),
                        'saves' => $position === PlayerPosition::Goalkeeper->value ? $matchesPlayed * 4 + (crc32("saves-{$playerId}") % 8) : 0,
                        'blocks' => $this->blocks($position, $playerId),
                        'steals' => $this->steals($position, $playerId, $matchesPlayed),
                        'goal_participation' => ($goals[$playerId][$competition] ?? 0) + ($assists[$playerId][$competition] ?? 0),
                    ];
                }
            }
        }

        return $rows;
    }

    private function minutesPerMatch(string $position, int $playerId): int
    {
        if ($position === PlayerPosition::Goalkeeper->value) {
            return 40;
        }

        return 28 + (crc32("minutes-{$playerId}") % 10);
    }

    private function generatedRating(string $position, int $playerId): float
    {
        $jitter = crc32("rating-{$playerId}") % 13;

        $base = match ($position) {
            PlayerPosition::Goalkeeper->value => 7.2,
            PlayerPosition::Closure->value => 7.0,
            PlayerPosition::Pivot->value => 7.0,
            default => 6.9,
        };

        return (float) round($base + ($jitter / 10), 1);
    }

    private function round2(float $value): float
    {
        return (float) round($value, 2);
    }

    private function passAccuracy(string $position, int $playerId): float
    {
        $jitter = crc32("pass-{$playerId}") % 8;

        return (float) match ($position) {
            PlayerPosition::Goalkeeper->value => 82 + $jitter,
            PlayerPosition::Closure->value => 86 + $jitter,
            PlayerPosition::Pivot->value => 77 + $jitter,
            default => 80 + $jitter,
        };
    }

    private function shotAccuracy(string $position, int $playerId): float
    {
        $jitter = crc32("shot-{$playerId}") % 12;

        return (float) match ($position) {
            PlayerPosition::Goalkeeper->value => 20 + $jitter,
            PlayerPosition::Closure->value => 24 + $jitter,
            PlayerPosition::Winger->value => 32 + $jitter,
            default => 34 + $jitter,
        };
    }

    private function defensiveActions(string $position, int $playerId): int
    {
        $jitter = crc32("defence-{$playerId}") % 8;

        return match ($position) {
            PlayerPosition::Goalkeeper->value => 26 + $jitter,
            PlayerPosition::Closure->value => 20 + $jitter,
            PlayerPosition::Winger->value => 10 + $jitter,
            default => 6 + $jitter,
        };
    }

    private function blocks(string $position, int $playerId): int
    {
        $jitter = crc32("blocks-{$playerId}") % 4;

        return match ($position) {
            PlayerPosition::Closure->value => 2 + $jitter,
            PlayerPosition::Goalkeeper->value => 0,
            default => 1 + $jitter % 3,
        };
    }

    private function steals(string $position, int $playerId, int $matchesPlayed): int
    {
        $jitter = crc32("steals-{$playerId}") % 5;

        return match ($position) {
            PlayerPosition::Closure->value => ($matchesPlayed * 2) + $jitter,
            PlayerPosition::Goalkeeper->value => $matchesPlayed + $jitter,
            PlayerPosition::Pivot->value => $matchesPlayed + $jitter % 3,
            default => $matchesPlayed + $jitter,
        };
    }

    /**
     * The exporter derives goals_difference and points from the W/D/L split.
     * Re-checking them here guards the derived values against a bad fixture.
     *
     * @param  list<array<string, mixed>>  $teamStats
     */
    private function assertArithmeticIsConsistent(array $teamStats): void
    {
        foreach ($teamStats as $stat) {
            $expectedPlayed = $stat['wins'] + $stat['draws'] + $stat['losses'];
            $expectedDifference = $stat['goals_for'] - $stat['goals_against'];
            $expectedPoints = ($stat['wins'] * 3) + $stat['draws'];

            if ($expectedPlayed !== $stat['matches_played']) {
                throw new InvalidArgumentException(sprintf(
                    'Team %d in competition %d: W/D/L sums to %d but matches_played is %d.',
                    $stat['team_id'],
                    $stat['competition_id'],
                    $expectedPlayed,
                    $stat['matches_played'],
                ));
            }

            if ($expectedDifference !== $stat['goals_difference'] || $expectedPoints !== $stat['points']) {
                throw new InvalidArgumentException(sprintf(
                    'Team %d in competition %d: derived goal difference/points disagree with stored values.',
                    $stat['team_id'],
                    $stat['competition_id'],
                ));
            }

            if ($stat['form'] !== null && ! preg_match('/^[WDL]{1,5}$/', $stat['form'])) {
                throw new InvalidArgumentException(sprintf(
                    'Team %d in competition %d: form [%s] is not a valid W/D/L string.',
                    $stat['team_id'],
                    $stat['competition_id'],
                    $stat['form'],
                ));
            }
        }

        $duplicate = DB::table('team_statistics')
            ->selectRaw('team_id, competition_id, count(*) as total')
            ->groupBy('team_id', 'competition_id')
            ->havingRaw('count(*) > 1')
            ->first();

        if ($duplicate !== null) {
            throw new InvalidArgumentException(
                "Team {$duplicate->team_id} has {$duplicate->total} rows in competition {$duplicate->competition_id}."
            );
        }
    }
}
