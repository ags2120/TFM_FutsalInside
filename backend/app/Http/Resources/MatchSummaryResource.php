<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Compact row for the `/matches` list.
 *
 * This is deliberately not `MatchResource`: the frontend only needs the two
 * clubs, the scoreboard, the live flag, the calendar day and the competition
 * on a card. The event log, metric table, referee and MVP are detail-only and
 * are never carried into a collection of rows.
 *
 * @mixin Game
 */
final class MatchSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'homeTeam' => new TeamResource($this->whenLoaded('homeTeam')),
            'awayTeam' => new TeamResource($this->whenLoaded('awayTeam')),
            'homeScore' => $this->home_score,
            'awayScore' => $this->away_score,
            // Enum backed value, never the Spanish label.
            'status' => $this->status?->value,
            'date' => $this->datetime?->format('Y-m-d'),
            'competition' => new CompetitionResource($this->whenLoaded('competition')),
        ];
    }
}
