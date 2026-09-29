<?php

namespace Tests\Feature;

use App\Enums\FavoriteEntityType;
use App\Models\CareerEntry;
use App\Models\Competition;
use App\Models\Favorite;
use App\Models\Game;
use App\Models\MatchEvent;
use App\Models\MatchStatistic;
use App\Models\Player;
use App\Models\PlayerStatistic;
use App\Models\Team;
use App\Models\TeamStatistic;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Guards the Eloquent relationship map.
 *
 * These assertions protect the one mistake that is invisible in review and
 * silent at runtime: a relationship whose foreign key or pivot table name is
 * derived from the PHP class name rather than the actual column. `Game` is
 * mapped to the `matches` table, so `hasMany()` would otherwise guess
 * `game_id` and quietly resolve nothing.
 */
class RelationshipsTest extends TestCase
{
    use RefreshDatabase;

    private Competition $competition;

    private Team $home;

    private Team $away;

    private Player $scorer;

    private Player $keeper;

    private Game $game;

    protected function setUp(): void
    {
        parent::setUp();

        $this->competition = Competition::create([
            'name' => 'Liga Nacional de Futbol Sala (ESP)',
            'country' => 'Espana',
            'season' => '2025/2026',
            'logo_url' => null,
        ]);

        $this->home = Team::create([
            'name' => 'Barca',
            'short_name' => 'BAR',
            'country' => 'Espana',
            'league' => 'LNFS',
            'badge_url' => '/assets/teams/barcelona.png',
            'venue' => 'Palau Blaugrana',
            'founded_year' => 1986,
            'coach' => 'Juan Ramon Rocha',
            'titles' => 14,
            'stadium_capacity' => 7585,
        ]);

        $this->away = Team::create([
            'name' => 'Inter Movistar',
            'short_name' => 'INT',
            'country' => 'Espana',
            'league' => 'LNFS',
            'badge_url' => '/assets/teams/inter.png',
            'venue' => 'Pabellon Vista Alegre',
            'founded_year' => 1977,
            'coach' => 'Fabian Liquito',
            'titles' => 10,
            'stadium_capacity' => 3500,
        ]);

        $this->home->competitions()->attach($this->competition);
        $this->away->competitions()->attach($this->competition);

        $this->scorer = Player::create([
            'name' => 'Pito Martinez',
            'first_name' => 'Pito',
            'last_name' => 'Martinez',
            'photo_url' => '/assets/players/pito.png',
            'birth_date' => '1995-04-12',
            'nationality' => 'Espana',
            'height' => 1.78,
            'weight' => 72.5,
            'dominant_foot' => 'right',
            'position' => 'pivot',
            'shirt_number' => 9,
            'market_value' => 5_000_000,
            'team_id' => $this->home->id,
        ]);

        $this->keeper = Player::create([
            'name' => 'Juanjo Catato',
            'first_name' => 'Juanjo',
            'last_name' => 'Catato',
            'photo_url' => '/assets/players/catato.png',
            'birth_date' => '1990-01-01',
            'nationality' => 'Espana',
            'height' => 1.85,
            'weight' => 80.0,
            'dominant_foot' => 'left',
            'position' => 'portero',
            'shirt_number' => 1,
            'market_value' => 900_000,
            'team_id' => $this->home->id,
        ]);

        $this->game = Game::create([
            'datetime' => '2025-10-05 20:00:00',
            'venue' => 'Palau Blaugrana',
            'status' => 'finished',
            'home_score' => 3,
            'away_score' => 1,
            'minute' => null,
            'referee' => 'Sr. Perez',
            'attendance' => 7000,
            'mvp_player_id' => $this->scorer->id,
            'competition_id' => $this->competition->id,
            'team_home_id' => $this->home->id,
            'team_away_id' => $this->away->id,
        ]);

        MatchEvent::create([
            'match_id' => $this->game->id,
            'player_id' => $this->scorer->id,
            'team_id' => $this->home->id,
            'assist_player_id' => $this->keeper->id,
            'event_type' => 'goal',
            'minute' => 7,
            'description' => 'Buen chute desde el pivote',
        ]);

        MatchStatistic::create([
            'match_id' => $this->game->id,
            'type' => 'possession',
            'home_value' => 55,
            'away_value' => 45,
        ]);

        PlayerStatistic::create([
            'player_id' => $this->scorer->id,
            'competition_id' => $this->competition->id,
            'season' => '2025/2026',
            'matches_played' => 10,
            'goals' => 9,
            'assists' => 3,
            'yellow_cards' => 2,
            'red_cards' => 0,
            'minutes_played' => 700,
            'rating' => 8.4,
            'expected_goals' => 7.10,
            'expected_assists' => 2.20,
            'pass_accuracy' => 88.50,
            'shot_accuracy' => 55.00,
            'defensive_actions' => 40,
            'saves' => 0,
            'blocks' => 0,
            'steals' => 12,
            'goal_participation' => 1.20,
        ]);

        TeamStatistic::create([
            'team_id' => $this->home->id,
            'competition_id' => $this->competition->id,
            'season' => '2025/2026',
            'matches_played' => 10,
            'wins' => 7,
            'draws' => 2,
            'losses' => 1,
            'goals_for' => 30,
            'goals_against' => 14,
            'goals_difference' => 16,
            'points' => 23,
            'clean_sheets' => 3,
            'avg_possession' => 54.20,
            'avg_shots_per_match' => 14.50,
        ]);

        CareerEntry::create([
            'player_id' => $this->scorer->id,
            'team_id' => $this->away->id,
            'start_date' => '2019-09-01',
            'end_date' => '2022-06-30',
            'matches_played' => 80,
            'goals' => 60,
        ]);
    }

    public function test_the_game_model_maps_to_the_matches_table(): void
    {
        $this->assertSame('matches', (new Game)->getTable());
    }

    public function test_game_resolves_its_explicit_foreign_keys(): void
    {
        $game = $this->game->fresh();

        $this->assertSame('team_home_id', $game->homeTeam()->getForeignKeyName());
        $this->assertSame('team_away_id', $game->awayTeam()->getForeignKeyName());
        $this->assertSame('mvp_player_id', $game->mvpPlayer()->getForeignKeyName());
        $this->assertSame('competition_id', $game->competition()->getForeignKeyName());
    }

    /**
     * `Game` is a PHP class bound to the `matches` table, so Laravel's default
     * `game_id` guess is wrong. These must stay pinned to `match_id`.
     */
    public function test_game_child_relations_use_the_match_id_foreign_key(): void
    {
        $game = $this->game;

        $this->assertSame('match_id', $game->events()->getForeignKeyName());
        $this->assertSame('match_id', $game->statistics()->getForeignKeyName());

        $this->assertSame(1, $game->events()->count());
        $this->assertSame(1, $game->statistics()->count());
    }

    public function test_match_event_and_statistic_belong_to_a_game(): void
    {
        $this->assertTrue(MatchEvent::first()->game->is($this->game));
        $this->assertSame('match_id', MatchEvent::first()->game()->getForeignKeyName());

        $this->assertTrue(MatchStatistic::first()->game->is($this->game));
        $this->assertSame('match_id', MatchStatistic::first()->game()->getForeignKeyName());
    }

    public function test_game_belongs_to_both_teams_the_competition_and_the_mvp(): void
    {
        $game = $this->game;

        $this->assertTrue($game->homeTeam->is($this->home));
        $this->assertTrue($game->awayTeam->is($this->away));
        $this->assertTrue($game->competition->is($this->competition));
        $this->assertTrue($game->mvpPlayer->is($this->scorer));
        $this->assertNotSame($game->homeTeam->id, $game->awayTeam->id);
    }

    public function test_team_relationships(): void
    {
        $this->assertSame(2, $this->home->players()->count());
        $this->assertTrue($this->keeper->team->is($this->home));

        $this->assertSame(1, $this->home->homeGames()->count());
        $this->assertSame(1, $this->away->awayGames()->count());
        $this->assertSame(0, $this->home->awayGames()->count());

        $this->assertSame(1, $this->home->matchEvents()->count());
        $this->assertSame(1, $this->away->careerEntries()->count());
        $this->assertSame(1, $this->home->teamStatistics()->count());
    }

    public function test_player_relationships(): void
    {
        $this->assertTrue($this->scorer->team->is($this->home));
        $this->assertSame(1, $this->scorer->matchEvents()->count());
        $this->assertSame(1, $this->keeper->assistEvents()->count());
        $this->assertSame(1, $this->scorer->careerEntries()->count());
        $this->assertSame(1, $this->scorer->playerStatistics()->count());
        $this->assertSame(1, $this->scorer->mvpGames()->count());
    }

    public function test_competition_relationships(): void
    {
        $this->assertSame(1, $this->competition->games()->count());
        $this->assertSame(1, $this->competition->playerStatistics()->count());
        $this->assertSame(1, $this->competition->teamStatistics()->count());
    }

    public function test_team_competition_pivot_is_named_explicitly(): void
    {
        $this->assertSame('team_competition', $this->home->competitions()->getTable());
        $this->assertSame('team_competition', $this->competition->teams()->getTable());

        $this->assertSame(2, $this->competition->teams()->count());
        $this->assertSame(1, $this->home->competitions()->count());
        $this->assertTrue($this->competition->teams->contains($this->home));
    }

    public function test_player_statistic_relationships(): void
    {
        $stat = PlayerStatistic::first();

        $this->assertTrue($stat->player->is($this->scorer));
        $this->assertTrue($stat->competition->is($this->competition));
    }

    public function test_team_statistic_relationships(): void
    {
        $stat = TeamStatistic::first();

        $this->assertTrue($stat->team->is($this->home));
        $this->assertTrue($stat->competition->is($this->competition));
    }

    public function test_career_entry_relationships(): void
    {
        $entry = CareerEntry::first();

        $this->assertTrue($entry->player->is($this->scorer));
        $this->assertTrue($entry->team->is($this->away));
    }

    public function test_player_statistics_are_unique_per_player_season_and_competition(): void
    {
        $this->expectException(QueryException::class);

        PlayerStatistic::create([
            'player_id' => $this->scorer->id,
            'competition_id' => $this->competition->id,
            'season' => '2025/2026',
            'goals' => 99,
        ]);
    }

    public function test_team_statistics_are_unique_per_team_season_and_competition(): void
    {
        $this->expectException(QueryException::class);

        TeamStatistic::create([
            'team_id' => $this->home->id,
            'competition_id' => $this->competition->id,
            'season' => '2025/2026',
            'points' => 99,
        ]);
    }

    public function test_a_user_can_only_favorite_an_entity_once(): void
    {
        $user = $this->makeUser();

        Favorite::create([
            'user_id' => $user->id,
            'entity_type' => 'team',
            'entity_id' => $this->home->id,
            'name' => $this->home->name,
        ]);

        $this->expectException(QueryException::class);

        Favorite::create([
            'user_id' => $user->id,
            'entity_type' => 'team',
            'entity_id' => $this->home->id,
            'name' => $this->home->name,
        ]);
    }

    public function test_favorite_resolves_each_supported_entity_type(): void
    {
        $user = $this->makeUser();

        $targets = [
            'match' => [$this->game, 'Barca vs Inter Movistar'],
            'team' => [$this->home, $this->home->name],
            'player' => [$this->scorer, $this->scorer->name],
        ];

        foreach ($targets as $type => [$entity, $label]) {
            $favorite = Favorite::create([
                'user_id' => $user->id,
                'entity_type' => $type,
                'entity_id' => $entity->id,
                'name' => $label,
            ]);

            $this->assertTrue($favorite->fresh()->entity()->is($entity), "Failed for type: {$type}");
            $this->assertTrue($favorite->fresh()->user->is($user), "Failed for type: {$type}");
        }

        $this->assertSame(3, $user->favorites()->count());
    }

    public function test_favorite_rejects_an_unknown_entity_type(): void
    {
        $this->expectException(\ValueError::class);

        new Favorite([
            'entity_type' => 'bogus',
            'entity_id' => 1,
            'name' => 'nope',
        ]);
    }

    public function test_favorite_casts_the_entity_type_to_the_enum(): void
    {
        $user = User::factory()->create();
        $team = $this->home;

        $favorite = Favorite::create([
            'user_id' => $user->id,
            'entity_type' => FavoriteEntityType::Team,
            'entity_id' => $team->id,
            'name' => $team->name,
        ]);

        $fresh = $favorite->fresh();

        $this->assertInstanceOf(FavoriteEntityType::class, $fresh->entity_type);
        $this->assertSame(FavoriteEntityType::Team, $fresh->entity_type);
        $this->assertSame('Equipo', $fresh->entity_type->label());
        $this->assertTrue($fresh->entity()->is($team));
    }

    public function test_user_hashes_the_password_and_hides_secrets(): void
    {
        $user = $this->makeUser();

        $this->assertNotSame('secret123', $user->password);
        $this->assertTrue(password_verify('secret123', $user->password));

        $this->assertArrayNotHasKey('password', $user->toArray());
        $this->assertArrayNotHasKey('refresh_token', $user->toArray());
        $this->assertArrayNotHasKey('remember_token', $user->toArray());

        $this->assertSame('nitro', $user->username);
        $this->assertSame('/avatars/nitro.png', $user->avatar_url);
    }

    private function makeUser(): User
    {
        return User::create([
            'username' => 'nitro',
            'email' => 'nitro@example.com',
            'password' => 'secret123',
            'avatar_url' => '/avatars/nitro.png',
            'refresh_token' => 'rt-abc123',
        ]);
    }
}
