<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\FormResult;
use App\Models\TeamStatistic;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * One row of a competition league table.
 *
 * @mixin TeamStatistic
 */
final class StandingResource extends JsonResource
{
    /**
     * Requires the `ranked()` scope, which supplies `position`; the column does
     * not exist in the table.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'competitionId' => $this->competition_id,
            'position' => $this->position,
            'team' => new TeamResource($this->whenLoaded('team')),
            'played' => $this->matches_played,
            'won' => $this->wins,
            'drawn' => $this->draws,
            'lost' => $this->losses,
            'goalsFor' => $this->goals_for,
            'goalsAgainst' => $this->goals_against,
            'goalDifference' => $this->goals_difference,
            'points' => $this->points,
            // Stored as a compact string (`WWWDW`); the contract wants an array.
            'form' => array_map(
                fn (FormResult $result): string => $result->value,
                FormResult::fromCompactString($this->form)
            ),
        ];
    }
}
