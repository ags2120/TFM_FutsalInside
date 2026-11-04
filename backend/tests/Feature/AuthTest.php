<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Locks the token-based auth contract the Angular AuthService consumes:
 * both credential endpoints return the flat `{ user, token }` envelope,
 * registration logs the user in immediately (decision: auto-login), tokens
 * expire after the configured seven days, and logout revokes only the
 * presented token.
 */
class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_creates_the_user_and_returns_a_usable_token(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'username' => 'maria',
            'email' => 'maria@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['user' => ['id', 'username', 'email'], 'token'])
            ->assertJsonPath('user.username', 'maria')
            ->assertJsonPath('user.email', 'maria@example.com');

        $this->assertGuest();

        $user = User::query()->where('email', 'maria@example.com')->firstOrFail();
        $this->assertTrue(Hash::check('secret123', $user->password));
        $this->assertCount(1, $user->tokens);

        $this->withToken($response->json('token'))
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('user.id', $user->id);
    }

    public function test_register_rejects_a_duplicate_email(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $this->postJson('/api/auth/register', [
            'username' => 'other',
            'email' => 'taken@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ])->assertStatus(422)->assertJsonValidationErrors(['email']);
    }

    public function test_register_requires_a_confirmed_eight_character_password(): void
    {
        $this->postJson('/api/auth/register', [
            'username' => 'maria',
            'email' => 'maria@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ])->assertStatus(422)->assertJsonValidationErrors(['password']);

        $this->postJson('/api/auth/register', [
            'username' => 'maria',
            'email' => 'maria@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'different',
        ])->assertStatus(422)->assertJsonValidationErrors(['password']);

        $this->assertDatabaseCount('users', 0);
    }

    public function test_login_returns_a_token_for_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['user' => ['id', 'username', 'email'], 'token']);

        $this->withToken($response->json('token'))
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'admin@example.com');
    }

    public function test_login_rejects_invalid_credentials_with_a_uniform_401(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(401)->assertJsonStructure(['message']);

        $this->postJson('/api/auth/login', [
            'email' => 'nobody@example.com',
            'password' => 'password',
        ])->assertStatus(401)->assertJsonStructure(['message']);
    }

    public function test_me_and_logout_require_a_bearer_token(): void
    {
        $this->getJson('/api/auth/me')->assertStatus(401);
        $this->postJson('/api/auth/logout')->assertStatus(401);
    }

    public function test_logout_revokes_only_the_presented_token(): void
    {
        $user = User::factory()->create();
        $desktop = $user->createToken('desktop')->plainTextToken;
        $phone = $user->createToken('phone')->plainTextToken;

        $this->withToken($desktop)
            ->postJson('/api/auth/logout')
            ->assertNoContent();

        // The logout request memoised the user on the guard; drop it so the
        // revoked token is actually re-checked instead of served from cache.
        $this->forgetAuthGuards();

        $this->withToken($desktop)->getJson('/api/auth/me')->assertStatus(401);
        $this->withToken($phone)->getJson('/api/auth/me')->assertOk();
    }

    public function test_token_expires_after_seven_days(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('futsalinside-spa')->plainTextToken;

        $this->withToken($token)->getJson('/api/auth/me')->assertOk();

        // The successful probe memoised the user; reset so the expiry check
        // below runs against the token row instead of the cached user.
        $this->forgetAuthGuards();
        $this->travel(8)->days();

        $this->withToken($token)->getJson('/api/auth/me')->assertStatus(401);
    }

    public function test_login_is_rate_limited_after_six_attempts(): void
    {
        User::factory()->create(['email' => 'admin@example.com']);

        foreach (range(1, 6) as $attempt) {
            $this->postJson('/api/auth/login', [
                'email' => 'admin@example.com',
                'password' => 'wrong-password',
            ])->assertStatus(401);
        }

        $this->postJson('/api/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(429);
    }
}
