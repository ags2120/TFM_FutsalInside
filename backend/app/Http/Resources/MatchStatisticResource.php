<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\MatchStatistic;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin MatchStatistic
 */
final class MatchStatisticResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            // Canonical enum key. The display label lives in the frontend.
            'type' => $this->type?->value,
            'homeValue' => $this->home_value,
            'awayValue' => $this->away_value,
        ];
    }
}
