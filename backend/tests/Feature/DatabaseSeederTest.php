<?php

namespace Tests\Feature;

use App\Enums\MatchEventType;
use App\Enums\MatchStatisticType;
use App\Enums\MatchStatus;
use App\Enums\PlayerPosition;
use App\Models\CareerEntry;
use App\Models\Competition;
use App\Models\Game;
use App\Models\MatchEvent;
use App\Models\MatchStatistic;
use App\Models\Player;
use App\Models\PlayerStatistic;
use App\Models\Team;
use App\Models\TeamStatistic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Locks in the guarantees the domain seeders are supposed to provide.
 *
 * The seed dataset is generated from the Angular mocks, and the fixtures were
 * rebuilt because the raw mock calendar double-booked clubs and stacked every
 * match into one kickoff slot. These assertions fail loudly if a future
 * regeneration of that data reintroduces either problem.
 */
class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_it_seeds_the_expected_row_counts(): void
    {
        $expected = [
            'competitions' => 5,
            'teams' => 34,
            'team_competition' => 50,
            'players' => 340,
            'player_statistics' => 400,
            'matches' => 141,
            'match_events' => 763,
            'match_statistics' => 798,
            'team_statistics' => 50,
            'career_entries' => 533,
        ];

        foreach ($expected as $table => $count) {
            $this->assertSame($count, DB::table($table)->count(), "{$table} row count");
        }
    }

    public function test_seeding_is_idempotent(): void
    {
        $before = [
            'players' => DB::table('players')->count(),
            'matches' => DB::table('matches')->count(),
            'match_events' => DB::table('match_events')->count(),
            'career_entries' => DB::table('career_entries')->count(),
            'player_statistics' => DB::table('player_statistics')->count(),
        ];

        $this->seed();

        foreach ($before as $table => $count) {
            $this->assertSame($count, DB::table($table)->count(), "{$table} duplicated on reseed");
        }
    }

    public function test_no_team_plays_two_matches_on_the_same_day(): void
    {
        $clashes = DB::table('matches as a')
            ->join('matches as b', function ($join): void {
                $join->on('b.id', '<', 'a.id')
                    ->whereRaw('DATE(a.datetime) = DATE(b.datetime)')
                    ->whereRaw('(b.team_home_id = a.team_home_id
                        OR b.team_home_id = a.team_away_id
                        OR b.team_away_id = a.team_home_id
                        OR b.team_away_id = a.team_away_id)');
            })
            ->selectRaw('a.id, b.id as other, DATE(a.datetime) as day')
            ->get();

        $this->assertTrue($clashes->isEmpty(), 'A team is double-booked on: '.$clashes->toJson());
    }

    public function test_a_competition_never_fields_two_fixtures_in_one_slot(): void
    {
        $clashes = DB::table('matches')
            ->selectRaw('competition_id, datetime, COUNT(*) as total')
            ->groupBy('competition_id', 'datetime')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        $this->assertTrue($clashes->isEmpty(), 'Kickoff slot collision: '.$clashes->toJson());
    }

    public function test_matchdays_stay_within_a_realistic_round_size(): void
    {
        // Every competition fields ten clubs, so a single matchday can hold at
        // most five fixtures.
        $largest = DB::table('matches')
            ->selectRaw('competition_id, DATE(datetime) as day, COUNT(*) as total')
            ->groupBy('competition_id', 'day')
            ->get()
            ->max('total');

        $this->assertLessThanOrEqual(5, $largest, 'A matchday exceeds five fixtures');
    }

    public function test_live_fixtures_are_kickoff_today(): void
    {
        $live = Game::live()->get();

        $this->assertNotEmpty($live, 'Expected a live matchday in the seed data.');

        foreach ($live as $game) {
            $this->assertTrue(
                $game->datetime->isToday(),
                "Match {$game->id} is in progress but not scheduled for today.",
            );
            $this->assertNotNull($game->minute, "Live match {$game->id} has no minute.");
        }
    }

    public function test_only_live_and_halftime_matches_carry_a_minute(): void
    {
        $stale = Game::query()
            ->whereNotIn('status', [MatchStatus::Live->value, MatchStatus::Halftime->value])
            ->whereNotNull('minute')
            ->get();

        $this->assertTrue($stale->isEmpty(), 'Non-live matches retain a minute: '.$stale->pluck('id')->toJson());
    }

    public function test_kickoff_times_come_from_the_agreed_evening_slots(): void
    {
        $allowed = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

        $used = DB::table('matches')
            ->selectRaw('DISTINCT TIME(datetime) as slot')
            ->orderBy('slot')
            ->pluck('slot')
            ->map(fn (string $slot): string => substr($slot, 0, 5))
            ->all();

        $this->assertNotEmpty($used);

        foreach ($used as $slot) {
            $this->assertContains($slot, $allowed, "Unexpected kickoff slot [{$slot}].");
        }
    }

    public function test_enum_columns_store_backed_values(): void
    {
        $game = Game::live()->firstOrFail();
        $this->assertInstanceOf(MatchStatus::class, $game->status);

        $player = Player::where('position', PlayerPosition::Goalkeeper->value)->firstOrFail();
        $this->assertTrue($player->isGoalkeeper());
        $this->assertNotNull($player->dominant_foot);

        $event = MatchEvent::firstOrFail();
        $this->assertInstanceOf(MatchEventType::class, $event->event_type);

        $statistic = MatchStatistic::firstOrFail();
        $this->assertInstanceOf(MatchStatisticType::class, $statistic->type);
    }

    /**
     * The frontend mocks must carry the same canonical keys the API exposes,
     * otherwise the match detail labels silently fall back to raw identifiers.
     */
    public function test_every_seeded_statistic_type_is_a_known_enum_key(): void
    {
        $known = MatchStatisticType::values();
        $used = DB::table('match_statistics')->distinct()->pluck('type')->all();

        $this->assertSame(
            [],
            array_values(array_diff($used, $known)),
            'match_statistics.json contains a type with no MatchStatisticType case'
        );

        $this->assertNotEmpty(
            $used,
            'No match statistics were seeded, so the contract is untested'
        );
    }

    /**
     * Locks the seven keys of the API contract. Widen this deliberately, in
     * both `MatchStatisticType` and the `MatchStatisticType` TS union, rather
     * than letting a metric appear in one language only.
     */
    public function test_the_statistic_contract_has_exactly_the_agreed_keys(): void
    {
        $this->assertSame([
            'possession',
            'shots',
            'shots_on_target',
            'corners',
            'fouls',
            'yellow_cards',
            'red_cards',
        ], MatchStatisticType::values());
    }

    /**
     * The generator is JavaScript, so it cannot import the PHP enum and has to
     * mirror the key list. That mirror is the one place the contract can drift
     * unnoticed, so assert it here, in order, against the enum.
     */
    public function test_the_generator_mirrors_the_enum_key_order(): void
    {
        $exporter = database_path('seed-data/export.cjs');
        $this->assertFileExists($exporter);

        $matched = preg_match(
            '/const STAT_TYPES = new Set\(\[(.*?)\]\);/s',
            (string) file_get_contents($exporter),
            $captures
        );

        $this->assertSame(1, $matched, 'export.cjs no longer declares a STAT_TYPES set');

        preg_match_all("/'([^']+)'/", $captures[1], $keys);

        $this->assertSame(
            MatchStatisticType::values(),
            $keys[1],
            'export.cjs has drifted from MatchStatisticType; update both together'
        );
    }

    /**
     * The API is language neutral: a serialised statistic must carry the
     * canonical key, never `label()`. The frontend owns every display string.
     */
    public function test_serialised_statistics_expose_keys_and_never_labels(): void
    {
        $statistic = MatchStatistic::firstOrFail();

        $this->assertSame($statistic->type->value, $statistic->toArray()['type']);

        $json = $statistic->toJson();
        $this->assertStringContainsString('"type":"'.$statistic->type->value.'"', $json);

        foreach (MatchStatisticType::cases() as $case) {
            if ($case->label() !== $case->value) {
                $this->assertStringNotContainsString($case->label(), $json);
            }
        }
    }

    /**
     * Both tables migrate with timestamp columns, so the models must manage
     * them and the seed data must populate them.
     */
    public function test_match_children_carry_audit_timestamps(): void
    {
        foreach ([MatchEvent::class, MatchStatistic::class] as $model) {
            $this->assertTrue(
                (new $model)->usesTimestamps(),
                "{$model} disables timestamps despite having created_at/updated_at columns"
            );

            $orphans = $model::query()
                ->whereNull('created_at')
                ->orWhereNull('updated_at')
                ->count();

            $this->assertSame(0, $orphans, "{$model} rows are missing timestamps");
        }
    }

    public function test_no_player_carries_duplicate_season_statistics(): void
    {
        $duplicates = DB::table('player_statistics')
            ->selectRaw('player_id, season, competition_id, COUNT(*) as total')
            ->groupBy('player_id', 'season', 'competition_id')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        $this->assertTrue($duplicates->isEmpty(), 'Duplicate player statistics: '.$duplicates->toJson());
    }

    public function test_team_statistics_arithmetic_is_self_consistent(): void
    {
        TeamStatistic::all()->each(function (TeamStatistic $statistic): void {
            $this->assertSame(
                $statistic->wins + $statistic->draws + $statistic->losses,
                $statistic->matches_played,
                "W/D/L does not sum to matches played for team {$statistic->team_id}.",
            );

            $this->assertSame(
                $statistic->goals_for - $statistic->goals_against,
                $statistic->goals_difference,
                "Goal difference mismatch for team {$statistic->team_id}.",
            );

            $this->assertSame(
                ($statistic->wins * 3) + $statistic->draws,
                $statistic->points,
                "Points mismatch for team {$statistic->team_id}.",
            );
        });
    }

    public function test_career_stints_are_sequential_and_never_zero_length(): void
    {
        $entries = CareerEntry::orderBy('player_id')->orderBy('start_date')->get()
            ->groupBy('player_id');

        $entries->each(function ($group, $playerId): void {
            $previous = null;

            foreach ($group as $entry) {
                if ($previous !== null) {
                    $this->assertGreaterThan(
                        $previous->start_date,
                        $entry->start_date,
                        "Player {$playerId} has overlapping career stints.",
                    );
                }

                if ($entry->end_date !== null) {
                    $this->assertGreaterThan(
                        $entry->start_date,
                        $entry->end_date,
                        "Player {$playerId} has a zero-length career stint.",
                    );
                }

                $previous = $entry;
            }
        });

        $this->assertTrue(CareerEntry::whereNull('end_date')->exists());
    }

    public function test_every_competition_forms_a_derivable_standings_table(): void
    {
        Competition::all()->each(function (Competition $competition): void {
            $rows = TeamStatistic::where('competition_id', $competition->id)->get();

            $this->assertCount(
                10,
                $rows,
                "Competition {$competition->id} should carry a full ten-team table.",
            );

            $ranked = $rows->sortByDesc(
                fn (TeamStatistic $statistic): array => [
                    $statistic->points,
                    $statistic->goals_difference,
                    $statistic->goals_for,
                ],
            )->values();

            $this->assertSame(
                10,
                $ranked->pluck('team_id')->unique()->count(),
                "Competition {$competition->id} has repeated clubs in its table.",
            );
        });
    }

    public function test_relationship_wiring_survives_the_seed(): void
    {
        $game = Game::live()->with(['homeTeam', 'awayTeam', 'competition', 'events', 'statistics'])->firstOrFail();

        $this->assertInstanceOf(Team::class, $game->homeTeam);
        $this->assertInstanceOf(Team::class, $game->awayTeam);
        $this->assertInstanceOf(Competition::class, $game->competition);
        $this->assertGreaterThan(0, $game->events->count());

        $game->statistics->each(function ($statistic): void {
            $this->assertNotNull($statistic->type);
        });

        $player = Player::with(['careerEntries', 'playerStatistics'])->firstOrFail();
        $this->assertGreaterThan(0, $player->careerEntries->count());
        $this->assertGreaterThan(0, $player->playerStatistics->count());
    }

    public function test_player_average_rating_is_derivable_from_statistics(): void
    {
        // Decision: Player.averageRating is computed from player_statistics.rating
        // rather than stored on the player row.
        $this->assertFalse(
            DB::getSchemaBuilder()->hasColumn('players', 'average_rating'),
            'average_rating should be derived, not stored.',
        );

        $statistic = PlayerStatistic::whereNotNull('rating')->firstOrFail();

        $this->assertGreaterThanOrEqual(1, (float) $statistic->rating);
        $this->assertLessThanOrEqual(10, (float) $statistic->rating);
    }
}
