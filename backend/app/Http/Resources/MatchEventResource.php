<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\Concerns\SerialisesOptionalFields;
use App\Models\MatchEvent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin MatchEvent
 */
final class MatchEventResource extends JsonResource
{
    use SerialisesOptionalFields;

    /**
     * `description` is intentionally not exposed: the frontend `MatchEvent`
     * contract has no such field, and it is null for every seeded row.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->withoutNulls([
            'id' => $this->id,
            'type' => $this->event_type?->value,
            'minute' => $this->minute,
            'player' => new PlayerResource($this->whenLoaded('player')),
            'team' => new TeamResource($this->whenLoaded('team')),
            // Only meaningful for goals; the foreign key is null for other
            // event types, and a null-mapped relation must be omitted rather
            // than serialised as `null`.
            'assistPlayer' => $this->when(
                $this->relationLoaded('assistPlayer') && $this->assistPlayer !== null,
                new PlayerResource($this->assistPlayer)
            ),
        ]);
    }
}
