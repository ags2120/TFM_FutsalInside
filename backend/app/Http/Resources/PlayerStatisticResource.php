<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\Concerns\SerialisesOptionalFields;
use App\Models\PlayerStatistic;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PlayerStatistic
 */
final class PlayerStatisticResource extends JsonResource
{
    use SerialisesOptionalFields;

    /**
     * Season totals for one player in one competition.
     *
     * The `career*` fields are not columns on this table: they are cross-season
     * aggregates the controllers attach per row (see
     * PlayerStatisticsController::attachCareerTotals). The resource defaults
     * them to 0 so an unattached row still satisfies the required Number
     * contract instead of silently dropping a key.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->withoutNulls([
            'playerId' => $this->player_id,
            'season' => $this->season,
            'goals' => $this->goals,
            'assists' => $this->assists,
            'yellowCards' => $this->yellow_cards,
            'redCards' => $this->red_cards,
            'matchesPlayed' => $this->matches_played,
            'minutesPlayed' => $this->minutes_played,
            'saves' => $this->saves,
            'blocks' => $this->blocks,
            'steals' => $this->steals,
            'careerGoals' => (int) ($this->career_goals ?? 0),
            'careerAssists' => (int) ($this->career_assists ?? 0),
            'careerYellowCards' => (int) ($this->career_yellow_cards ?? 0),
            'careerRedCards' => (int) ($this->career_red_cards ?? 0),
            'careerMatchesPlayed' => (int) ($this->career_matches_played ?? 0),
            // Narrowed from `decimal:2`, which would otherwise serialise as a
            // string and break the declared `number` contract.
            'expectedGoals' => (float) $this->expected_goals,
            'expectedAssists' => (float) $this->expected_assists,
            'goalParticipation' => (float) $this->goal_participation,
            'passAccuracy' => (float) $this->pass_accuracy,
            'shotAccuracy' => (float) $this->shot_accuracy,
            'defensiveActions' => $this->defensive_actions,
        ]);
    }
}
