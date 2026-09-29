<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * A tracked metric recorded for both sides of a fixture.
 *
 * This enum is the single source of truth for the metric keys. It is consumed
 * by the `match_statistics` migration, the `MatchStatistic` cast, and mirrors
 * the `MatchStatisticType` union in `core/models/match.model.ts`.
 *
 * The backed values are part of the API contract and must stay language
 * neutral. `label()` exists for internal use (logs, console output) and must
 * never be exposed by an API resource: the frontend owns all display strings
 * so that a single client can render in any language.
 */
enum MatchStatisticType: string
{
    case Possession = 'possession';
    case Shots = 'shots';
    case ShotsOnTarget = 'shots_on_target';
    case Corners = 'corners';
    case Fouls = 'fouls';
    case YellowCards = 'yellow_cards';
    case RedCards = 'red_cards';

    /**
     * Column values for schema definitions, in declaration order.
     *
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Internal-use description. Not part of the API contract; see the class
     * docblock.
     */
    public function label(): string
    {
        return match ($this) {
            self::Possession => 'Posesión',
            self::Shots => 'Tiros',
            self::ShotsOnTarget => 'Tiros a puerta',
            self::Corners => 'Córneres',
            self::Fouls => 'Faltas',
            self::YellowCards => 'Tarjetas amarillas',
            self::RedCards => 'Tarjetas rojas',
        };
    }
}
