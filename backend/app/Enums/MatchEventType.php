<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * An incident recorded against a fixture.
 *
 * Mirrors the `MatchEventType` union in `core/models/match.model.ts`.
 */
enum MatchEventType: string
{
    case Goal = 'goal';
    case YellowCard = 'yellowcard';
    case RedCard = 'redcard';
    case Substitution = 'substitution';
    case Timeout = 'timeout';

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
            self::Goal => 'Gol',
            self::YellowCard => 'Tarjeta amarilla',
            self::RedCard => 'Tarjeta roja',
            self::Substitution => 'Cambio',
            self::Timeout => 'Parada de tiempo muerto',
        };
    }

    /**
     * Only goals carry an assisting player, so `match_events.assist_player_id`
     * is meaningful exclusively for this type.
     */
    public function allowsAssist(): bool
    {
        return $this === self::Goal;
    }

    public function isDisciplinary(): bool
    {
        return $this === self::YellowCard || $this === self::RedCard;
    }
}
