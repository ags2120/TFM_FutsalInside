<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * The foot a player favours.
 */
enum DominantFoot: string
{
    case Left = 'left';
    case Right = 'right';
    case Both = 'both';

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
            self::Left => 'Izquierdo',
            self::Right => 'Derecho',
            self::Both => 'Ambi',
        };
    }
}
