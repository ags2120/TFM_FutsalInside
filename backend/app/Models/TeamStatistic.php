<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamStatistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'competition_id',
        'season',
        'matches_played',
        'wins',
        'draws',
        'losses',
        'goals_for',
        'goals_against',
        'goals_difference',
        'points',
        'form',
        'clean_sheets',
        'avg_possession',
        'avg_shots_per_match',
    ];

    protected function casts(): array
    {
        return [
            'matches_played' => 'integer',
            'wins' => 'integer',
            'draws' => 'integer',
            'losses' => 'integer',
            'goals_for' => 'integer',
            'goals_against' => 'integer',
            'goals_difference' => 'integer',
            'points' => 'integer',
            'clean_sheets' => 'integer',
            'avg_possession' => 'decimal:2',
            'avg_shots_per_match' => 'decimal:2',
        ];
    }

    /**
     * Add the derived league position to the select.
     *
     * `team_statistics` has no `position` column: rank is a function of the
     * whole competition table, not a property of one row. The tie-break chain
     * (points, then goal difference, then goals scored) matches the order the
     * frontend mock uses.
     *
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeRanked(Builder $query): Builder
    {
        return $query
            ->select($this->qualifyColumn('*'))
            ->selectRaw(
                'RANK() OVER (PARTITION BY competition_id, season'
                .' ORDER BY points DESC, goals_difference DESC, goals_for DESC) as position'
            );
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function competition(): BelongsTo
    {
        return $this->belongsTo(Competition::class);
    }
}
