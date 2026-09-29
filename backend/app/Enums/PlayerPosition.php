<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Futsal playing position.
 *
 * Mirrors the `PlayerPosition` union in `core/models/player.model.ts`. Spanish
 * labels mirror `player-position.pipe.ts`.
 */
enum PlayerPosition: string
{
    case Goalkeeper = 'portero';
    case Closure = 'cierre';
    case Winger = 'ala';
    case Pivot = 'pivot';

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
            self::Goalkeeper => 'Portero',
            self::Closure => 'Cierre',
            self::Winger => 'Ala',
            self::Pivot => 'Pívot',
        };
    }

    /**
     * Goalkeepers are the only players for whom saves, blocks and steals carry
     * meaning; these are the metrics seeded from the frontend mocks.
     */
    public function isGoalkeeper(): bool
    {
        return $this === self::Goalkeeper;
    }
}
