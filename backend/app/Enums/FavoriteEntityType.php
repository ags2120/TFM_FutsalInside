<?php

declare(strict_types=1);

namespace App\Enums;

use App\Models\Game;
use App\Models\Player;
use App\Models\Team;
use Illuminate\Database\Eloquent\Model;

/**
 * The kind of record a user's favorite points at.
 *
 * `favorites.entity_id` carries no foreign key because the target table varies
 * by type. This enum is the single place that mapping is expressed, which keeps
 * the polymorphic lookup honest.
 */
enum FavoriteEntityType: string
{
    case Match = 'match';
    case Team = 'team';
    case Player = 'player';

    /**
     * Column values for schema definitions, in declaration order.
     *
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::Match => 'Partido',
            self::Team => 'Equipo',
            self::Player => 'Jugador',
        };
    }

    /**
     * @return class-string<Model>
     */
    public function modelClass(): string
    {
        return match ($this) {
            self::Match => Game::class,
            self::Team => Team::class,
            self::Player => Player::class,
        };
    }

    public function resolve(int $id): Model
    {
        return $this->modelClass()::query()->findOrFail($id);
    }
}
