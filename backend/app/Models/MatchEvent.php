<?php

namespace App\Models;

use App\Enums\MatchEventType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'match_id',
        'player_id',
        'team_id',
        'assist_player_id',
        'event_type',
        'minute',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'event_type' => MatchEventType::class,
            'minute' => 'integer',
        ];
    }

    public function scopeGoals(Builder $query): Builder
    {
        return $query->where('event_type', MatchEventType::Goal->value);
    }

    public function scopeDisciplinary(Builder $query): Builder
    {
        return $query->whereIn('event_type', [
            MatchEventType::YellowCard->value,
            MatchEventType::RedCard->value,
        ]);
    }

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class, 'match_id');
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function assistPlayer(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'assist_player_id');
    }
}
