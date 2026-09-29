<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\Concerns\SerialisesOptionalFields;
use App\Models\Competition;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Competition
 */
final class CompetitionResource extends JsonResource
{
    use SerialisesOptionalFields;

    /**
     * All four fields are declared as required strings on the frontend
     * `Competition` interface, so none of them may be null.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->withoutNulls([
            'id' => $this->id,
            'name' => $this->name,
            'country' => $this->country,
            'logoUrl' => $this->requiredString($this->logo_url),
            'season' => $this->season,
        ]);
    }
}
