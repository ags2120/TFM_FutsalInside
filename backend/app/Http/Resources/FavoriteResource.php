<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Favorite
 */
final class FavoriteResource extends JsonResource
{
    /**
     * `entity_type` is surfaced as `type` and is a canonical enum value, so a
     * client can switch on it without parsing prose.
     *
     * The `name` column is a denormalised snapshot kept so a favourites list
     * renders without loading every referenced match, team and player.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->entity_type?->value,
            'entityId' => $this->entity_id,
            'name' => $this->name,
            'addedAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
