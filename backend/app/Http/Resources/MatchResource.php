<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\Concerns\SerialisesOptionalFields;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Game
 */
final class MatchResource extends JsonResource
{
    use SerialisesOptionalFields;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->withoutNulls([
            'id' => $this->id,
            'homeTeam' => new TeamResource($this->whenLoaded('homeTeam')),
            'awayTeam' => new TeamResource($this->whenLoaded('awayTeam')),
            'homeScore' => $this->home_score,
            'awayScore' => $this->away_score,
            // Enum backed value, never the Spanish label.
            'status' => $this->status?->value,
            'minute' => $this->minute,
            // The frontend contract models a match by calendar day only; the
            // kickoff time is not part of `Match`.
            'date' => $this->datetime?->format('Y-m-d'),
            'competition' => new CompetitionResource($this->whenLoaded('competition')),
            'venue' => $this->venue,
            'referee' => $this->referee,
            'attendance' => $this->attendance,
            // Only served when the relation is actually present: a scheduled
            // match has no MVP, and a wrapped `whenLoaded(null)` would
            // serialise as an explicit `null` in the JSON response.
            'mvpPlayer' => $this->when(
                $this->relationLoaded('mvpPlayer') && $this->mvpPlayer !== null,
                new PlayerResource($this->mvpPlayer)
            ),
            // An upcoming match has no log yet; an empty array would claim the
            // event stream exists, so both are only served when non-empty.
            'events' => $this->when(
                $this->relationLoaded('events') && $this->events->isNotEmpty(),
                MatchEventResource::collection($this->events)
            ),
            'statistics' => $this->when(
                $this->relationLoaded('statistics') && $this->statistics->isNotEmpty(),
                MatchStatisticResource::collection($this->statistics)
            ),
        ]);
    }
}
