<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\Concerns\SerialisesOptionalFields;
use App\Models\CareerEntry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CareerEntry
 */
final class CareerEntryResource extends JsonResource
{
    use SerialisesOptionalFields;

    /**
     * A stint at one club. Not a `player_statistics` row: entries are the
     * player's club history, and the totals here are career scoped.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->withoutNulls([
            'team' => new TeamResource($this->whenLoaded('team')),
            'startDate' => $this->start_date?->format('Y-m-d'),
            // Absent while the stint is current, which is how the frontend
            // distinguishes an active spell from a closed one.
            'endDate' => $this->end_date?->format('Y-m-d'),
            'matchesPlayed' => $this->matches_played,
            'goals' => $this->goals,
        ]);
    }
}
