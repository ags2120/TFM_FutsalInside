<?php

namespace App\Models;

use App\Enums\MatchStatisticType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchStatistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'match_id',
        'type',
        'home_value',
        'away_value',
    ];

    protected function casts(): array
    {
        return [
            'type' => MatchStatisticType::class,
            'home_value' => 'integer',
            'away_value' => 'integer',
        ];
    }

    /**
     * Order metrics the way the enum declares them, so a client renders a
     * stable sequence instead of whatever the storage engine returns first.
     *
     * A `CASE` expression is used rather than MySQL's `FIELD()` because the
     * test suite runs on SQLite. Backticks are understood by both.
     *
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeInSchemaOrder(Builder $query): Builder
    {
        $branches = [];
        $bindings = [];

        foreach (MatchStatisticType::values() as $index => $value) {
            $branches[] = 'WHEN ? THEN ?';
            $bindings[] = $value;
            $bindings[] = $index;
        }

        return $query->orderByRaw(
            'CASE `type` '.implode(' ', $branches).' END',
            $bindings
        );
    }

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class, 'match_id');
    }
}
