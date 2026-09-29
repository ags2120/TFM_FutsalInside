<?php

namespace App\Models;

use App\Enums\MatchStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    use HasFactory;

    protected $table = 'matches';

    protected $fillable = [
        'datetime',
        'venue',
        'status',
        'home_score',
        'away_score',
        'minute',
        'referee',
        'attendance',
        'mvp_player_id',
        'competition_id',
        'team_home_id',
        'team_away_id',
    ];

    protected function casts(): array
    {
        return [
            'datetime' => 'datetime',
            'status' => MatchStatus::class,
            'home_score' => 'integer',
            'away_score' => 'integer',
            'minute' => 'integer',
            'attendance' => 'integer',
        ];
    }

    public function scopeLive(Builder $query): Builder
    {
        return $query->whereIn('status', [
            MatchStatus::Live->value,
            MatchStatus::Halftime->value,
        ]);
    }

    public function scopeFinished(Builder $query): Builder
    {
        return $query->where('status', MatchStatus::Finished->value);
    }

    /**
     * A fixture that can still be shown on a live scoreboard.
     */
    public function scopeInProgress(Builder $query): Builder
    {
        return $query->whereIn('status', [
            MatchStatus::Live->value,
            MatchStatus::Halftime->value,
            MatchStatus::Finished->value,
        ]);
    }

    /**
     * Every fixture a team took part in, home or away.
     *
     * This is a scope rather than a relation because the fixtures a team plays
     * hang off two foreign keys (`team_home_id` and `team_away_id`) and an
     * Eloquent relation can only span one. Model it as a relation and eager
     * loading a collection of teams would silently drop matches, because the
     * `team_away_id` clause cannot be bound per parent.
     *
     * The grouped form also guarantees the OR cannot leak to sibling fixtures
     * once chained with other constraints.
     */
    public function scopeForTeam(Builder $query, Team|int $team): Builder
    {
        $id = $team instanceof Team ? $team->getKey() : $team;

        return $query->where(
            fn (Builder $builder) => $builder
                ->where('team_home_id', $id)
                ->orWhere('team_away_id', $id)
        );
    }

    public function competition(): BelongsTo
    {
        return $this->belongsTo(Competition::class);
    }

    public function homeTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_home_id');
    }

    public function awayTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_away_id');
    }

    public function mvpPlayer(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'mvp_player_id');
    }

    public function events(): HasMany
    {
        return $this->hasMany(MatchEvent::class, 'match_id');
    }

    public function statistics(): HasMany
    {
        return $this->hasMany(MatchStatistic::class, 'match_id');
    }
}
