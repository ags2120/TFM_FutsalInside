<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\FormResult;
use App\Enums\MatchEventType;
use App\Enums\MatchStatisticType;
use App\Enums\MatchStatus;
use App\Enums\PlayerPosition;
use App\Models\Game;
use App\Models\Player;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * Locks the public JSON API to the Angular type definitions.
 *
 * The frontend models are the source of truth: every key they declare must be
 * served, nothing else may leak out of the API, and the shapes must survive a
 * JSON round-trip. Two deliberate, documented deltas exist:
 *
 * - Additive identifiers: `MatchEvent.id` and `MatchStatistics.id` are served
 *   even though the interfaces do not declare them (stable keys for lists).
 * - One declared field has no source of truth anywhere: `TeamDetail.
 *   description` has no column in the schema, so it stays absent.
 *
 * All assertions run against the seeded canonical dataset.
 */
class ApiContractTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Fields declared on the frontend that the API deliberately does not
     * serve yet.
     *
     * @var array<string, array<int, string>>
     */
    private const NOT_SERVED = [
        // `TeamDetail.description` has no column anywhere in the schema.
        'TeamDetail' => ['description'],
    ];

    /**
     * Fields the API serves that the frontend does not declare.
     *
     * @var array<string, array<int, string>>
     */
    private const ADDITIVE = [
        'MatchEvent' => ['id'],
        'MatchStatistics' => ['id'],
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_route_contract_is_the_public_get_surface(): void
    {
        $uris = collect(Route::getRoutes()->getRoutes())
            ->reject(static fn ($route) => $route->getName() === null || ! str_starts_with($route->uri(), 'api/'))
            ->map(static fn ($route) => $route->uri())
            ->sort()
            ->values()
            ->all();

        $this->assertSame([
            'api/competitions',
            'api/matches',
            'api/matches/{id}',
            'api/player-statistics',
            'api/players',
            'api/players/{id}',
            'api/players/{id}/matches',
            'api/players/{id}/statistics',
            'api/standings',
            'api/teams',
            'api/teams/{id}',
            'api/teams/{id}/statistics',
        ], $uris);
    }

    public function test_competitions_list_matches_the_interface(): void
    {
        $json = $this->getJson('/api/competitions')
            ->assertOk()
            ->json();

        $this->assertSame(['competitions', 'total'], array_keys($json));
        $this->assertSame(5, $json['total']);
        $this->assertCount(5, $json['competitions']);

        $expected = $this->expectedKeys('Competition');
        foreach ($json['competitions'] as $competition) {
            $this->assertKeysMatch($competition, $expected, 'competition');
            // Required non-nullable `string` must honour `''` over null.
            $this->assertSame('', $competition['logoUrl']);
        }
    }

    public function test_teams_list_matches_the_interface(): void
    {
        $json = $this->getJson('/api/teams?per_page=10')
            ->assertOk()
            ->json();

        $teamKeys = $this->expectedKeys('Team');
        $this->assertSame(34, $json['total']);

        foreach (array_slice($json['teams'], 0, 10) as $team) {
            $this->assertNoNulls($team, 'team');
            $this->assertKeysWithin($team, $teamKeys, 'team');
            $this->assertIsNumeric($team['id']);
            $this->assertIsString($team['badgeUrl']);
        }
    }

    public function test_players_carry_derived_radar_and_average_rating(): void
    {
        $json = $this->getJson('/api/players?per_page=100')
            ->assertOk()
            ->json();

        $this->assertSame(340, $json['total']);

        foreach ($json['players'] as $player) {
            $this->assertArrayHasKey('radarAttributes', $player, 'player radar');
            $radar = $player['radarAttributes'];
            $this->assertSame(
                ['goals', 'assists', 'defense', 'physical', 'technique'],
                array_keys($radar),
                'radar axis set'
            );
            foreach ($radar as $axis) {
                $this->assertIsInt($axis, 'radar axis must be an integer');
                $this->assertGreaterThanOrEqual(0, $axis, 'radar axis floor');
                $this->assertLessThanOrEqual(100, $axis, 'radar axis ceiling');
            }

            $this->assertArrayHasKey('averageRating', $player, 'player rating');
            $this->assertIsNumeric($player['averageRating']);
            $this->assertGreaterThanOrEqual(0, $player['averageRating']);
            $this->assertLessThanOrEqual(10, $player['averageRating']);
        }
    }

    public function test_standings_cover_every_table_and_match_the_interface(): void
    {
        $json = $this->getJson('/api/standings')
            ->assertOk()
            ->json();

        $this->assertSame(['standings', 'total'], array_keys($json));
        $this->assertSame(50, $json['total']);

        $keys = $this->expectedKeys('Standing');
        $teamKeys = $this->expectedKeys('Team');
        $formValues = array_column(FormResult::cases(), 'value');

        $rowsPerTable = [];
        foreach ($json['standings'] as $standing) {
            $this->assertNoNulls($standing, 'standing');
            $this->assertKeysMatch($standing, $keys, 'standing');
            $this->assertKeysMatch($standing['team'], $teamKeys, 'standing team');
            $this->assertIsNumeric($standing['position']);
            $this->assertIsNumeric($standing['points']);
            foreach ($standing['form'] as $letter) {
                $this->assertContains($letter, $formValues, 'form letter');
            }

            $key = $standing['competitionId'].'/'.$standing['team']['id'];
            $rowsPerTable['competition '.$standing['competitionId']][] = $key;
        }

        foreach ($rowsPerTable as $competition => $rows) {
            $this->assertCount(10, $rows, "{$competition} must field a full table");
        }
    }

    public function test_player_statistics_match_the_interface_with_career_totals(): void
    {
        $json = $this->getJson('/api/player-statistics')
            ->assertOk()
            ->json();

        $this->assertSame(['statistics', 'total'], array_keys($json));
        $this->assertSame(400, $json['total']);

        $keys = $this->expectedKeys('PlayerStatistics');
        $players = array_unique(array_column($json['statistics'], 'playerId'));
        $this->assertGreaterThan(0, count($players));

        foreach ($json['statistics'] as $row) {
            $this->assertNoNulls($row, 'player statistic');
            $this->assertKeysMatch($row, $keys, 'player statistic');
            foreach ($row as $field => $value) {
                if ($field === 'season') {
                    $this->assertIsString($value, 'season is a string');
                } else {
                    $this->assertIsNumeric($value, "{$field} is numeric");
                }
            }
            foreach (['careerGoals', 'careerAssists', 'careerMatchesPlayed'] as $career) {
                $this->assertIsInt($row[$career], "{$career} is an integer");
            }
        }
    }

    public function test_career_totals_agree_with_the_timeline_entries_sum(): void
    {
        $json = $this->getJson('/api/player-statistics')
            ->assertOk()
            ->json();

        $expected = Player::query()
            ->withSum('careerEntries as career_goals', 'goals')
            ->withSum('careerEntries as career_matches', 'matches_played')
            ->get()
            ->keyBy('id');

        foreach (array_unique(array_column($json['statistics'], 'playerId')) as $playerId) {
            $player = $expected->get($playerId);
            $this->assertNotNull($player, "player {$playerId} is referenced by statistics");

            $row = collect($json['statistics'])->firstWhere('playerId', $playerId);

            $this->assertSame(
                (int) $player->career_goals,
                $row['careerGoals'],
                "player {$playerId} career goals equal the timeline sum",
            );
            $this->assertSame(
                (int) $player->career_matches,
                $row['careerMatchesPlayed'],
                "player {$playerId} career appearances equal the timeline sum",
            );
        }
    }

    public function test_single_player_statistics_match_the_interface(): void
    {
        $player = Player::query()->firstOrFail();

        $json = $this->getJson("/api/players/{$player->id}/statistics")
            ->assertOk()
            ->json();

        $this->assertSame(['data'], array_keys($json));
        $this->assertNoNulls($json['data'], 'player statistics');
        $this->assertKeysMatch(
            $json['data'],
            $this->expectedKeys('PlayerStatistics'),
            'player statistics'
        );

        $this->getJson('/api/players/999999/statistics')->assertNotFound();
    }

    public function test_single_team_statistics_match_the_interface(): void
    {
        $team = Team::query()->firstOrFail();

        $json = $this->getJson("/api/teams/{$team->id}/statistics")
            ->assertOk()
            ->json();

        $this->assertSame(['data'], array_keys($json));
        $this->assertNoNulls($json['data'], 'team statistics');
        $this->assertKeysWithin(
            $json['data'],
            $this->expectedKeys('TeamStatistics'),
            'team statistics'
        );

        foreach (['teamId', 'season', 'goalsScored', 'goalsConceded', 'cleanSheets', 'matchesPlayed', 'wins', 'draws', 'losses'] as $required) {
            $this->assertArrayHasKey($required, $json['data'], "team statistics must serve {$required}");
        }

        $this->getJson('/api/teams/999999/statistics')->assertNotFound();
    }

    public function test_team_detail_matches_teamdetail_without_description(): void
    {
        $team = Team::query()->with('players')->firstOrFail();

        $response = $this->getJson("/api/teams/{$team->id}")
            ->assertOk()
            ->json();

        $this->assertNoNulls($response['data'], 'team detail');
        $this->assertKeysMatch(
            $response['data'],
            $this->expectedKeys('TeamDetail'),
            'team detail'
        );

        $this->assertArrayNotHasKey('description', $response['data']);
        $this->assertIsArray($response['data']['players']);

        $playerKeys = $this->expectedKeys('Player');
        foreach ($response['data']['players'] as $player) {
            $this->assertKeysWithin($player, $playerKeys, 'team roster player');
            $this->assertArrayNotHasKey('careerHistory', $player);
        }
    }

    public function test_player_detail_orders_career_history_open_stint_last(): void
    {
        $player = Player::query()->with(['team', 'careerEntries.team'])->firstOrFail();

        $response = $this->getJson("/api/players/{$player->id}")
            ->assertOk()
            ->json();

        $this->assertNoNulls($response['data'], 'player detail');
        $this->assertKeysMatch(
            $response['data'],
            $this->expectedKeys('PlayerDetail'),
            'player detail'
        );

        $stints = $response['data']['careerHistory'];
        $this->assertNotEmpty($stints);

        $openStints = array_filter(
            array_map(fn (array $stint) => $stint['endDate'] ?? null, $stints),
            static fn (?string $end) => $end === null
        );
        $this->assertArrayNotHasKey('endDate', end($stints));
        $this->assertCount(1, $openStints);

        $entryKeys = $this->expectedKeys('CareerEntry');
        foreach ($stints as $stint) {
            $this->assertKeysWithin($stint, $entryKeys, 'career entry');
        }
    }

    public function test_matches_list_is_the_compact_summary_shape(): void
    {
        $json = $this->getJson('/api/matches?per_page=5')
            ->assertOk()
            ->json();

        $this->assertSame(141, $json['total']);

        $matchParts = $this->interfaceParts('Match');
        $required = $matchParts['required'];
        $teamKeys = $this->expectedKeys('Team');
        $competitionKeys = $this->expectedKeys('Competition');

        foreach (array_slice($json['matches'], 0, 5) as $match) {
            $this->assertNoNulls($match, 'match');

            // Compact shape: a list row is exactly the required Match fields,
            // nothing more. The event log, metric table and all optional
            // details are detail-endpoint only.
            $this->assertKeysMatch($match, $required, 'match list row');

            $this->assertKeysMatch($match['homeTeam'], $teamKeys, 'home team');
            $this->assertKeysMatch($match['awayTeam'], $teamKeys, 'away team');
            $this->assertKeysMatch($match['competition'], $competitionKeys, 'competition');
        }
    }

    public function test_live_match_detail_matches_the_full_interface(): void
    {
        $match = Game::where('status', MatchStatus::Live)->firstOrFail();

        $this->assertLiveDetailMatchesInterface($match);
    }

    public function test_scheduled_match_detail_omits_optional_fields(): void
    {
        $match = Game::where('status', MatchStatus::Scheduled)->firstOrFail();

        $response = $this->getJson("/api/matches/{$match->id}")
            ->assertOk()
            ->json();

        $this->assertKeysWithin($response['data'], $this->expectedKeys('Match'), 'match');

        foreach (['minute', 'referee', 'attendance', 'mvpPlayer', 'events', 'statistics'] as $key) {
            $this->assertArrayNotHasKey($key, $response['data'], "scheduled match must not serve {$key}");
        }
    }

    public function test_finished_match_detail_is_complete(): void
    {
        $matches = Game::where('status', MatchStatus::Finished)
            ->orderByDesc('datetime')
            ->take(12)
            ->get();

        $this->assertGreaterThanOrEqual(5, $matches->count());

        foreach ($matches as $match) {
            $data = $this->getJson("/api/matches/{$match->id}")
                ->assertOk()
                ->json()['data'];

            foreach (['referee', 'mvpPlayer', 'events', 'statistics'] as $key) {
                $this->assertArrayHasKey($key, $data, "finished match {$match->id} must serve {$key}");
            }

            $this->assertIsString($data['referee']);
            $this->assertIsArray($data['mvpPlayer']);
            $this->assertNotEmpty($data['events']);
            $this->assertNotEmpty($data['statistics']);
        }
    }

    public function test_goal_events_agree_with_the_scoreline(): void
    {
        $match = Game::where('status', MatchStatus::Finished)->firstOrFail();

        $data = $this->getJson("/api/matches/{$match->id}")
            ->assertOk()
            ->json()['data'];

        $homeGoals = collect($data['events'])
            ->where('type', MatchEventType::Goal->value)
            ->where('team.id', $match->team_home_id)
            ->count();
        $awayGoals = collect($data['events'])
            ->where('type', MatchEventType::Goal->value)
            ->where('team.id', $match->team_away_id)
            ->count();

        $this->assertSame((int) $match->home_score, $homeGoals, 'home goals must equal the scoreline');
        $this->assertSame((int) $match->away_score, $awayGoals, 'away goals must equal the scoreline');
    }

    public function test_team_squads_are_full_futsal_rosters(): void
    {
        $teams = Team::query()->orderBy('id')->get(['id']);

        foreach ($teams as $team) {
            $detail = $this->getJson("/api/teams/{$team->id}")
                ->assertOk()
                ->json()['data'];

            $this->assertGreaterThanOrEqual(10, count($detail['players']), "team {$team->id} must field a full squad");

            $keepers = collect($detail['players'])
                ->where('position', PlayerPosition::Goalkeeper->value)
                ->count();
            $this->assertGreaterThanOrEqual(2, $keepers, "team {$team->id} must carry two goalkeepers");
        }
    }

    public function test_player_matches_list_is_the_played_feed(): void
    {
        $player = Player::query()->whereNotNull('team_id')->orderBy('id')->firstOrFail();

        $response = $this->getJson("/api/players/{$player->id}/matches")
            ->assertOk()
            ->json();

        $this->assertSame(['participations', 'total'], array_keys($response));
        $this->assertSame(count($response['participations']), $response['total']);
        $this->assertGreaterThanOrEqual(5, $response['total']);

        $keys = $this->expectedKeys('PlayerMatchParticipation');
        foreach ($response['participations'] as $participation) {
            $this->assertKeysMatch($participation, $keys, 'player participation');
            $this->assertIsBool($participation['isMvp']);
            $this->assertIsNumeric($participation['rating']);
            $this->assertGreaterThanOrEqual(0, $participation['minutesPlayed']);
        }

        $this->getJson('/api/players/999999/matches')->assertNotFound();
    }

    public function test_match_event_and_statistics_keys_match_with_documented_additive_ids(): void
    {
        $match = Game::whereHas('events')
            ->whereHas('statistics')
            ->where('status', MatchStatus::Live)
            ->firstOrFail();

        $this->assertLiveDetailMatchesInterface($match);
    }

    public function test_pagination_shape_and_boundaries(): void
    {
        $first = $this->getJson('/api/teams?per_page=2&page=1')->assertOk()->json();
        $second = $this->getJson('/api/teams?per_page=2&page=2')->assertOk()->json();

        $this->assertSame(34, $first['total']);
        $this->assertCount(2, $first['teams']);
        $this->assertCount(2, $second['teams']);
        $this->assertNotSame($first['teams'][0]['id'], $second['teams'][0]['id']);

        // Malformed pagination is rejected, never silently ignored.
        $this->getJson('/api/teams?per_page=0')->assertStatus(422);
        $this->getJson('/api/teams?per_page=1&page=0')->assertStatus(422);
        $this->getJson('/api/teams?per_page=100')->assertOk();
    }

    public function test_unknown_resources_404_with_json(): void
    {
        $this->getJson('/api/teams/999999')->assertNotFound();
        $this->getJson('/api/players/999999')->assertNotFound();
        $this->getJson('/api/matches/999999')->assertNotFound();
        $this->getJson('/api/teams/not-a-number')->assertNotFound();
        $this->getJson('/api/favorites')->assertNotFound();
    }

    public function test_public_payloads_never_leak_enum_labels_or_internal_columns(): void
    {
        $positions = array_column(PlayerPosition::cases(), 'value');
        $statuses = array_column(MatchStatus::cases(), 'value');
        $eventTypes = array_column(MatchEventType::cases(), 'value');
        $statTypes = array_column(MatchStatisticType::cases(), 'value');

        $live = Game::where('status', MatchStatus::Live)->firstOrFail();
        $players = $this->getJson('/api/players')->assertOk()->json();

        foreach ($players['players'] as $player) {
            $this->assertContains($player['position'], $positions, 'player position value');
            $this->assertArrayNotHasKey('first_name', $player, 'snake_case column leak');
            $this->assertNotContains(
                $player['position'],
                ['Portero', 'Ala', 'Cierre'],
                'Spanish label leaked into API'
            );
        }

        $detail = $this->getJson("/api/matches/{$live->id}")->assertOk()->json();
        $this->assertContains($detail['data']['status'], $statuses, 'match status value');
        foreach ($detail['data']['events'] as $event) {
            $this->assertContains($event['type'], $eventTypes, 'event type value');
        }
        foreach ($detail['data']['statistics'] as $statistic) {
            $this->assertContains($statistic['type'], $statTypes, 'statistic type value');
        }
    }

    public function test_match_statistics_follow_the_frontend_enum_order(): void
    {
        $match = Game::whereHas('statistics')->firstOrFail();

        $statistics = $this->getJson("/api/matches/{$match->id}")
            ->assertOk()
            ->json()['data']['statistics'];

        $expected = array_column(MatchStatisticType::cases(), 'value');

        $actual = array_map(static fn (array $stat) => $stat['type'], $statistics);

        // Only types present in the seeded metrics are served, but their
        // relative order must be exactly the frontend enum order.
        $this->assertSame(array_values(array_intersect($expected, $actual)), $actual);
    }

    private function assertLiveDetailMatchesInterface(Game $match): void
    {
        $response = $this->getJson("/api/matches/{$match->id}")
            ->assertOk()
            ->json();

        $this->assertNoNulls($response['data'], 'live match detail');
        $this->assertKeysWithin($response['data'], $this->expectedKeys('Match'), 'live match detail');

        foreach (['id', 'homeTeam', 'awayTeam', 'homeScore', 'awayScore', 'status', 'date', 'competition', 'events', 'statistics'] as $key) {
            $this->assertArrayHasKey($key, $response['data'], "live match must serve {$key}");
        }

        $playerKeys = $this->expectedKeys('Player');
        $eventParts = $this->interfaceParts('MatchEvent');
        $eventKeys = $this->expectedKeys('MatchEvent');
        foreach ($response['data']['events'] as $event) {
            // `assistPlayer` is optional and only present on goals; the
            // additive identifier is documented in self::ADDITIVE.
            $this->assertKeysWithin($event, $eventKeys, 'match event');
            foreach ($eventParts['required'] as $key) {
                $this->assertArrayHasKey($key, $event, "event must serve {$key}");
            }
            $this->assertIsNumeric($event['minute']);
            $this->assertKeysWithin($event['player'], $playerKeys, 'event player');
            if (array_key_exists('assistPlayer', $event)) {
                $this->assertKeysWithin($event['assistPlayer'], $playerKeys, 'assist player');
            }
            $this->assertKeysWithin($event['team'], $this->expectedKeys('Team'), 'event team');
        }

        $statKeys = $this->expectedKeys('MatchStatistics');
        foreach ($response['data']['statistics'] as $statistic) {
            $this->assertKeysMatch($statistic, $statKeys, 'match statistic');
            $this->assertIsNumeric($statistic['homeValue']);
            $this->assertIsNumeric($statistic['awayValue']);
        }

        if (array_key_exists('mvpPlayer', $response['data'])) {
            $this->assertKeysWithin($response['data']['mvpPlayer'], $playerKeys, 'mvp player');
        }
    }

    /**
     * @param  array<string, mixed>  $actual
     * @param  array<int, string>  $expected
     */
    private function assertKeysWithin(array $actual, array $expected, string $label): void
    {
        $unexpected = array_diff(array_keys($actual), $expected);
        $this->assertSame([], $unexpected, "{$label} exposes undeclared keys");
    }

    /**
     * @param  array<string, mixed>  $actual
     * @param  array<int, string>  $expected
     */
    private function assertKeysMatch(array $actual, array $expected, string $label): void
    {
        sort($expected);
        $actual = array_keys($actual);
        sort($actual);
        $this->assertSame($expected, $actual, "{$label} key set");
    }

    /**
     * @param  array<string, mixed>  $value
     */
    private function assertNoNulls(array $value, string $label): void
    {
        foreach ($value as $key => $item) {
            if (is_array($item)) {
                $this->assertNoNulls($item, "{$label}.{$key}");
            } else {
                $this->assertNotNull($item, "{$label}.{$key} is null");
            }
        }
    }

    /**
     * @return array{required: array<int, string>, optional: array<int, string>, all: array<int, string>}
     */
    private function interfaceParts(string $interface, string $file = ''): array
    {
        $source = File::get($this->modelFile($interface, $file));
        $pattern = '/export interface '.preg_quote($interface, '/')
            .'(?:\s+extends\s+([A-Za-z_, ]+))?\s*\{([^}]*)\}/s';

        if (! preg_match($pattern, $source, $matches)) {
            $this->fail("TypeScript interface {$interface} not found");
        }

        preg_match_all('/^\s*([a-zA-Z][a-zA-Z0-9]*)(\??)\s*:\s*/m', $matches[2], $props);

        $all = [];
        $required = [];
        $optional = [];
        foreach ($props[0] as $index => $propIndex) {
            $name = $props[1][$index];
            $isOptional = $props[2][$index] === '?';
            $all[] = $name;
            if ($isOptional) {
                $optional[] = $name;
            } else {
                $required[] = $name;
            }
        }

        if (! empty($matches[1])) {
            foreach (array_map('trim', explode(',', $matches[1])) as $parent) {
                if (! $file && in_array($parent, ['Player', 'Team'], true)) {
                    $file = match ($parent) {
                        'Player' => 'player',
                        default => 'team',
                    };
                }
                $parentParts = $this->interfaceParts($parent, $file);
                $all = array_merge($parentParts['all'], $all);
                $required = array_merge($parentParts['required'], $required);
                $optional = array_merge($parentParts['optional'], $optional);
            }
        }

        return [
            'required' => array_values(array_unique($required)),
            'optional' => array_values(array_unique($optional)),
            'all' => array_values(array_unique($all)),
        ];
    }

    /**
     * Keys the API is allowed to serve for the given interface: TS-declared
     * fields minus the ones intentionally deferred, plus additive identifiers.
     *
     * @return array<int, string>
     */
    private function expectedKeys(string $interface, string $file = ''): array
    {
        $keys = $this->interfaceParts($interface, $file)['all'];

        foreach (array_keys(self::NOT_SERVED) as $skippedInterface) {
            if ($interface === $skippedInterface || str_starts_with($interface, $skippedInterface)) {
                $keys = array_values(array_diff($keys, self::NOT_SERVED[$skippedInterface]));
            }
        }
        foreach (self::ADDITIVE as $additiveInterface => $extra) {
            if ($interface === $additiveInterface) {
                $keys = array_merge($keys, $extra);
            }
        }

        return $keys;
    }

    private function modelFile(string $interface, string $file = ''): string
    {
        $map = [
            'Competition' => 'competition',
            'Favorite' => 'favorite',
            'Match' => 'match',
            'MatchEvent' => 'match',
            'MatchStatistics' => 'match',
            'CareerEntry' => 'player',
            'Player' => 'player',
            'PlayerDetail' => 'player',
            'PlayerMatchParticipation' => 'player-match',
            'Team' => 'team',
            'TeamDetail' => 'team',
            'Standing' => 'standings',
            'PlayerStatistics' => 'statistics',
            'TeamStatistics' => 'statistics',
        ];

        return dirname(__DIR__, 2).'/../frontend/src/app/core/models/'
            .($file ?: ($map[$interface] ?? strtolower($interface)))
            .'.model.ts';
    }
}
