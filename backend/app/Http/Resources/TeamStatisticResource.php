<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\Concerns\SerialisesOptionalFields;
use App\Models\TeamStatistic;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin TeamStatistic
 */
final class TeamStatisticResource extends JsonResource
{
    use SerialisesOptionalFields;

    /**
     * Per-competition aggregate for one team and season.
     *
     * The league *table* shape (`standings.model.ts`) is served by
     * StandingResource instead; the two are deliberately separate because the
     * frontend declares both and they differ in field names and in whether a
     * position exists.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->withoutNulls([
            'teamId' => $this->team_id,
            'season' => $this->season,
            'goalsScored' => $this->goals_for,
            'goalsConceded' => $this->goals_against,
            'cleanSheets' => $this->clean_sheets,
            'matchesPlayed' => $this->matches_played,
            'wins' => $this->wins,
            'draws' => $this->draws,
            'losses' => $this->losses,
            'avgBallPossession' => $this->avg_possession === null
                ? null
                : (float) $this->avg_possession,
            'avgShotsPerMatch' => $this->avg_shots_per_match === null
                ? null
                : (float) $this->avg_shots_per_match,
        ]);
    }
}
