<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Lifecycle state of a fixture.
 *
 * The Spanish label is documentation/serialisation metadata only. The Angular
 * frontend owns user-facing copy (see `match-status.pipe.ts`), so changing a
 * label here never requires a database migration.
 */
enum MatchStatus: string
{
    case Scheduled = 'scheduled';
    case Live = 'live';
    case Halftime = 'halftime';
    case Finished = 'finished';
    case Postponed = 'postponed';
    case Cancelled = 'cancelled';

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
            self::Scheduled => 'Programado',
            self::Live => 'En Vivo',
            self::Halftime => 'Descanso',
            self::Finished => 'Finalizado',
            self::Postponed => 'Aplazado',
            self::Cancelled => 'Cancelado',
        };
    }

    /**
     * A fixture in one of these states has a kickoff in the past and may be
     * relied upon for results, statistics and event data.
     */
    public function isCompleted(): bool
    {
        return $this === self::Finished;
    }

    /**
     * A fixture in one of these states is in progress right now and may carry a
     * running score and a match minute.
     */
    public function isInProgress(): bool
    {
        return $this === self::Live || $this === self::Halftime;
    }

    /**
     * Fixtures that have not started. Statistics and events cannot exist.
     */
    public function isUpcoming(): bool
    {
        return $this === self::Scheduled;
    }
}
