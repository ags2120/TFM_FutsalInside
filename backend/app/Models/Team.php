<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'short_name',
        'country',
        'league',
        'badge_url',
        'venue',
        'founded_year',
        'coach',
        'titles',
        'stadium_capacity',
    ];

    protected function casts(): array
    {
        return [
            'founded_year' => 'integer',
            'titles' => 'integer',
            'stadium_capacity' => 'integer',
        ];
    }

    public function players(): HasMany
    {
        return $this->hasMany(Player::class);
    }

    public function competitions(): BelongsToMany
    {
        return $this->belongsToMany(Competition::class, 'team_competition');
    }

    public function homeGames(): HasMany
    {
        return $this->hasMany(Game::class, 'team_home_id');
    }

    public function awayGames(): HasMany
    {
        return $this->hasMany(Game::class, 'team_away_id');
    }

    public function matchEvents(): HasMany
    {
        return $this->hasMany(MatchEvent::class);
    }

    public function careerEntries(): HasMany
    {
        return $this->hasMany(CareerEntry::class);
    }

    public function teamStatistics(): HasMany
    {
        return $this->hasMany(TeamStatistic::class);
    }
}
