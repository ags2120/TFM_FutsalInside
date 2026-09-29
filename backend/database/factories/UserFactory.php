<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * Mirrors the `users` table, which uses `username` in place of Laravel's
     * stock `name` and carries no `email_verified_at` column.
     *
     * The `User` model casts `password` to `hashed`, so a plain string is
     * passed here and hashed on the way in.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'username' => fake()->unique()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'password' => 'password',
            'avatar_url' => null,
            'refresh_token' => null,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * A user holding a refresh token, i.e. an active session.
     */
    public function withRefreshToken(): static
    {
        return $this->state(fn (array $attributes): array => [
            'refresh_token' => Str::random(64),
        ]);
    }

    public function withAvatar(): static
    {
        return $this->state(fn (array $attributes): array => [
            'avatar_url' => 'https://example.test/avatars/'.fake()->uuid().'.png',
        ]);
    }
}
