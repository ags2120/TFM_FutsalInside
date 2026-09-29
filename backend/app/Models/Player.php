<?php

namespace App\Models;

use App\Enums\DominantFoot;
use App\Enums\PlayerPosition;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'photo_url',
        'birth_date',
        'nationality',
        'height',
        'weight',
        'dominant_foot',
        'position',
        'shirt_number',
        'market_value',
        'team_id',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'height' => 'decimal:2',
            'weight' => 'decimal:2',
            'shirt_number' => 'integer',
            'market_value' => 'decimal:2',
            'dominant_foot' => DominantFoot::class,
            'position' => PlayerPosition::class,
        ];
    }

    public function scopeGoalkeepers(Builder $query): Builder
    {
        return $query->where('position', PlayerPosition::Goalkeeper->value);
    }

    public function isGoalkeeper(): bool
    {
        return $this->position === PlayerPosition::Goalkeeper;
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function matchEvents(): HasMany
    {
        return $this->hasMany(MatchEvent::class);
    }

    public function assistEvents(): HasMany
    {
        return $this->hasMany(MatchEvent::class, 'assist_player_id');
    }

    public function careerEntries(): HasMany
    {
        return $this->hasMany(CareerEntry::class);
    }

    public function playerStatistics(): HasMany
    {
        return $this->hasMany(PlayerStatistic::class);
    }

    /**
     * The row that backs the player's headline profile data.
     *
     * Rows are carried per competition within a season (league + European
     * cup), so "latest" is ambiguous. The national league is chosen first
     * (lowest competition id) within the newest season, which keeps the radar
     * and rating anchored on domestic form rather than a one-off cup run.
     */
    public function latestStatistic(): HasOne
    {
        return $this->hasOne(PlayerStatistic::class)
            ->ofMany(['season' => 'max', 'competition_id' => 'min']);
    }

    public function mvpGames(): HasMany
    {
        return $this->hasMany(Game::class, 'mvp_player_id');
    }
}
