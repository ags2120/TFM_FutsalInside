<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlayerStatistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'player_id',
        'competition_id',
        'season',
        'matches_played',
        'goals',
        'assists',
        'yellow_cards',
        'red_cards',
        'minutes_played',
        'rating',
        'expected_goals',
        'expected_assists',
        'pass_accuracy',
        'shot_accuracy',
        'defensive_actions',
        'saves',
        'blocks',
        'steals',
        'goal_participation',
    ];

    protected function casts(): array
    {
        return [
            'matches_played' => 'integer',
            'goals' => 'integer',
            'assists' => 'integer',
            'yellow_cards' => 'integer',
            'red_cards' => 'integer',
            'minutes_played' => 'integer',
            'rating' => 'decimal:1',
            'expected_goals' => 'decimal:2',
            'expected_assists' => 'decimal:2',
            'pass_accuracy' => 'decimal:2',
            'shot_accuracy' => 'decimal:2',
            'defensive_actions' => 'integer',
            'saves' => 'integer',
            'blocks' => 'integer',
            'steals' => 'integer',
            'goal_participation' => 'decimal:2',
        ];
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function competition(): BelongsTo
    {
        return $this->belongsTo(Competition::class);
    }
}
