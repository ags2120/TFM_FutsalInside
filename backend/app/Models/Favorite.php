<?php

namespace App\Models;

use App\Enums\FavoriteEntityType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'entity_type',
        'entity_id',
        'name',
    ];

    protected function casts(): array
    {
        return [
            'entity_type' => FavoriteEntityType::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the entity (Match, Team, or Player) that this favorite references.
     */
    public function entity(): Model
    {
        if (! $this->entity_type instanceof FavoriteEntityType) {
            throw new \InvalidArgumentException("Unknown entity type: {$this->entity_type}");
        }

        return $this->entity_type->resolve($this->entity_id);
    }
}
