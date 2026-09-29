<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\Concerns\SerialisesOptionalFields;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Team
 */
final class TeamResource extends JsonResource
{
    use SerialisesOptionalFields;

    /**
     * Serves both the `Team` list shape and the `TeamDetail` shape the
     * frontend declares: the roster only appears when the relation is loaded,
     * so a collection of teams stays light while a single team can be
     * hydrated.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->withoutNulls([
            'id' => $this->id,
            'name' => $this->name,
            // Declared as a required string; null means "no badge" in the table.
            'shortName' => $this->requiredString($this->short_name),
            'badgeUrl' => $this->requiredString($this->badge_url),
            'country' => $this->country,
            'league' => $this->league,
            // Exposed as `founded` by the frontend contract; the column carries
            // the year of founding and nothing else.
            'founded' => $this->founded_year,
            'venue' => $this->venue,
            'coach' => $this->coach,
            'titles' => $this->titles,
            'stadiumCapacity' => $this->stadium_capacity,
            'players' => PlayerResource::collection($this->whenLoaded('players')),
        ]);
    }
}
