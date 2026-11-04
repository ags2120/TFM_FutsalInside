<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\MatchStatus;
use App\Models\Competition;
use App\Models\Game;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Locks the favourites contract: both endpoints sit behind `auth:sanctum`,
 * the server owns the `name` snapshot (clients cannot inject one), the row
 * set is scoped to the caller, and toggle reports the resulting state so the
 * frontend can update its signals from one round-trip.
 */
class FavoritesTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_favorites_endpoints_require_a_bearer_token(): void
    {
        $this->getJson('/api/favorites')->assertStatus(401);

        $this->postJson('/api/favorites/toggle', [
            'type' => 'team',
            'entityId' => 1,
        ])->assertStatus(401);
    }

    public function test_toggle_adds_then_removes_a_team_favorite(): void
    {
        $team = $this->makeTeam();

        $added = $this->asUser()->postJson('/api/favorites/toggle', [
            'type' => 'team',
            'entityId' => $team->id,
        ]);

        $added->assertOk()
            ->assertJsonPath('favorite.type', 'team')
            ->assertJsonPath('favorite.entityId', $team->id)
            ->assertJsonPath('favorite.name', $team->name)
            ->assertJsonPath('total', 1);

        $this->assertDatabaseHas('favorites', [
            'user_id' => $this->user->id,
            'entity_type' => 'team',
            'entity_id' => $team->id,
        ]);

        $removed = $this->asUser()->postJson('/api/favorites/toggle', [
            'type' => 'team',
            'entityId' => $team->id,
        ]);

        $removed->assertOk()
            ->assertJsonPath('favorite', null)
            ->assertJsonPath('total', 0);

        $this->assertDatabaseCount('favorites', 0);
    }

    public function test_toggle_adds_then_removes_a_competition_favorite(): void
    {
        $competition = Competition::create([
            'name' => 'Liga Nacional de Futbol Sala (ESP)',
            'country' => 'Espana',
            'season' => '2025/26',
        ]);

        $added = $this->asUser()->postJson('/api/favorites/toggle', [
            'type' => 'competition',
            'entityId' => $competition->id,
        ]);

        $added->assertOk()
            ->assertJsonPath('favorite.type', 'competition')
            ->assertJsonPath('favorite.entityId', $competition->id)
            ->assertJsonPath('favorite.name', $competition->name)
            ->assertJsonPath('total', 1);

        $this->assertDatabaseHas('favorites', [
            'user_id' => $this->user->id,
            'entity_type' => 'competition',
            'entity_id' => $competition->id,
        ]);

        $removed = $this->asUser()->postJson('/api/favorites/toggle', [
            'type' => 'competition',
            'entityId' => $competition->id,
        ]);

        $removed->assertOk()
            ->assertJsonPath('favorite', null)
            ->assertJsonPath('total', 0);

        $this->assertDatabaseCount('favorites', 0);
    }

    public function test_index_returns_only_the_callers_rows(): void
    {
        $mine = $this->makeTeam('Mine FC');
        $theirs = $this->makeTeam('Theirs FC');

        $otherUser = User::factory()->create();
        $otherUser->favorites()->create([
            'entity_type' => 'team',
            'entity_id' => $theirs->id,
            'name' => $theirs->name,
        ]);

        $this->asUser()->postJson('/api/favorites/toggle', [
            'type' => 'team',
            'entityId' => $mine->id,
        ])->assertOk();

        $json = $this->asUser()->getJson('/api/favorites')->assertOk()->json();

        $this->assertSame(['favorites', 'total'], array_keys($json));
        $this->assertSame(1, $json['total']);
        $this->assertSame($mine->name, $json['favorites'][0]['name']);
        $this->assertArrayHasKey('addedAt', $json['favorites'][0]);
    }

    public function test_toggle_rejects_an_entity_that_does_not_exist(): void
    {
        $this->asUser()->postJson('/api/favorites/toggle', [
            'type' => 'team',
            'entityId' => 999,
        ])->assertStatus(422)->assertJsonValidationErrors(['entityId']);

        $this->assertDatabaseCount('favorites', 0);
    }

    public function test_toggle_rejects_an_unknown_type(): void
    {
        $team = $this->makeTeam();

        $this->asUser()->postJson('/api/favorites/toggle', [
            'type' => 'club',
            'entityId' => $team->id,
        ])->assertStatus(422)->assertJsonValidationErrors(['type']);
    }

    public function test_match_favorite_snapshots_a_derby_line(): void
    {
        $home = $this->makeTeam('Alpha FC');
        $away = $this->makeTeam('Beta FC');
        $competition = Competition::create([
            'name' => 'Liga',
            'country' => 'España',
            'season' => '2025/26',
        ]);
        $game = Game::create([
            'datetime' => now(),
            'status' => MatchStatus::Finished,
            'competition_id' => $competition->id,
            'team_home_id' => $home->id,
            'team_away_id' => $away->id,
        ]);

        $this->asUser()->postJson('/api/favorites/toggle', [
            'type' => 'match',
            'entityId' => $game->id,
        ])->assertOk()->assertJsonPath('favorite.name', 'Alpha FC vs Beta FC');
    }

    public function test_name_is_server_owned_even_when_the_client_sends_one(): void
    {
        $team = $this->makeTeam();

        $this->asUser()->postJson('/api/favorites/toggle', [
            'type' => 'team',
            'entityId' => $team->id,
            'name' => 'Injected name',
        ])->assertOk()->assertJsonPath('favorite.name', $team->name);
    }

    /**
     * Every request in a test carries a freshly minted token for the user
     * under test, mirroring how the SPA replays its stored bearer token.
     * Guards are reset first so each request really evaluates its own token
     * instead of inheriting the previous request's memoised user.
     */
    private function asUser(): static
    {
        $this->forgetAuthGuards();

        return $this->withToken(
            $this->user->createToken('tests')->plainTextToken,
        );
    }

    private function makeTeam(string $name = 'Sample FC'): Team
    {
        return Team::create([
            'name' => $name,
            'short_name' => strtoupper(substr($name, 0, 3)),
            'country' => 'España',
        ]);
    }
}
