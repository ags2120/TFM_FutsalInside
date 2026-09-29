<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\Concerns\SerialisesOptionalFields;
use App\Models\Player;
use App\Models\PlayerStatistic;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Player
 */
final class PlayerResource extends JsonResource
{
    use SerialisesOptionalFields;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $payload = [
            'id' => $this->id,
            'name' => $this->name,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            // Declared as a required string; every seeded player has a null
            // photo, which the mocks represent as an empty string.
            'photoUrl' => $this->requiredString($this->photo_url),
            'nationality' => $this->nationality,
            'birthDate' => $this->birth_date?->format('Y-m-d'),
            // Enum backed value, never `label()`: the API stays language
            // neutral and the client owns every display string.
            'position' => $this->position?->value,
            'shirtNumber' => $this->shirt_number,
            'team' => new TeamResource($this->whenLoaded('team')),
            // `decimal:2` casts serialise as strings, but the frontend contract
            // declares both as numbers, so they are narrowed here.
            'height' => $this->height === null ? null : (float) $this->height,
            'weight' => $this->weight === null ? null : (float) $this->weight,
            'dominantFoot' => $this->dominant_foot?->value,
            'marketValue' => $this->market_value,
            // Only present on the single-player shape (`PlayerDetail`), so the
            // list endpoint does not carry every stint of every player.
            'careerHistory' => CareerEntryResource::collection(
                $this->whenLoaded('careerEntries')
            ),
        ];

        if ($this->relationLoaded('latestStatistic') && $this->latestStatistic !== null) {
            $payload['radarAttributes'] = $this->radarAttributesFrom($this->latestStatistic);
            $payload['averageRating'] = $this->averageRating($this->latestStatistic);
        }

        return $this->withoutNulls($payload);
    }

    /**
     * Five 0-100 axes the frontend radar renders, derived from the player's
     * latest season row. The scales are deterministic: each axis is a
     * percentage or a weighted sum capped at 100, so a real row always yields
     * a number in range and there is no hand-authored mock data left.
     *
     * @return array{goals: int, assists: int, defense: int, physical: int, technique: int}
     */
    private function radarAttributesFrom(PlayerStatistic $statistic): array
    {
        $matches = max(1, $statistic->matches_played);

        return [
            'goals' => $this->clampTo100($statistic->goals / $matches * 100),
            'assists' => $this->clampTo100($statistic->assists / $matches * 100),
            'defense' => $this->clampTo100(
                ($statistic->defensive_actions * 2)
                + ($statistic->blocks * 5)
                + ($statistic->steals * 3)
                + ($statistic->saves * 2)
            ),
            // Minutes per 40-minute match: how much of each game the player
            // regularly completes, as a proxy for conditioning.
            'physical' => $this->clampTo100(
                $statistic->minutes_played / ($matches * 40) * 100
            ),
            'technique' => $this->clampTo100(
                ($statistic->pass_accuracy + $statistic->shot_accuracy) / 2
            ),
        ];
    }

    private function averageRating(PlayerStatistic $statistic): float
    {
        return (float) $statistic->rating;
    }

    private function clampTo100(float $value): int
    {
        return max(0, min(100, (int) round($value)));
    }
}
