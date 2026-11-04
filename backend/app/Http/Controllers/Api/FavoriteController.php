<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\FavoriteEntityType;
use App\Http\Controllers\Controller;
use App\Http\Requests\ToggleFavoriteRequest;
use App\Http\Resources\FavoriteResource;
use App\Models\Favorite;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Authenticated favourites list.
 *
 * The server is the single source of truth: there is no localStorage mirror
 * and no merge path from the pre-auth era — an anonymous visitor's client-side
 * list is discarded when they log in.
 */
final class FavoriteController extends Controller
{
    /**
     * The whole list for one user (bounded by what a person favourites), so
     * it is served unpaginated to match the frontend's `FavoritesResponse`.
     */
    public function index(Request $request): JsonResponse
    {
        $favorites = Favorite::query()
            ->where('user_id', $request->user()->getAuthIdentifier())
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'favorites' => FavoriteResource::collection($favorites)->resolve(),
            'total' => $favorites->count(),
        ]);
    }

    /**
     * Idempotent add/remove: an existing row is deleted, a missing one is
     * created with a server-computed name snapshot. The response reports the
     * resulting state (`favorite: null` means "removed") so the client can
     * update its signals from one round-trip.
     */
    public function toggle(ToggleFavoriteRequest $request): JsonResponse
    {
        /** @var FavoriteEntityType $type */
        $type = FavoriteEntityType::from($request->validated('type'));
        $entityId = (int) $request->validated('entityId');
        $userId = (int) $request->user()->getAuthIdentifier();

        $favorite = DB::transaction(function () use ($type, $entityId, $userId): ?Favorite {
            $existing = Favorite::query()
                ->where('user_id', $userId)
                ->where('entity_type', $type)
                ->where('entity_id', $entityId)
                ->lockForUpdate()
                ->first();

            if ($existing !== null) {
                $existing->delete();

                return null;
            }

            return Favorite::create([
                'user_id' => $userId,
                'entity_type' => $type,
                'entity_id' => $entityId,
                'name' => $this->entityName($type, $entityId),
            ]);
        });

        return response()->json([
            'favorite' => $favorite === null
                ? null
                : (new FavoriteResource($favorite))->resolve(),
            'total' => Favorite::query()->where('user_id', $userId)->count(),
        ]);
    }

    /**
     * Resolve the display snapshot for the referenced row. Matches have no
     * name column of their own, so the fixture is rendered as a derby line.
     */
    private function entityName(FavoriteEntityType $type, int $entityId): string
    {
        $query = $type->modelClass()::query();

        if ($type === FavoriteEntityType::Match) {
            $query->with(['homeTeam', 'awayTeam']);
        }

        /** @var Model $entity */
        $entity = $query->findOrFail($entityId);

        return match ($type) {
            FavoriteEntityType::Match => "{$entity->homeTeam->name} vs {$entity->awayTeam->name}",
            default => (string) $entity->name,
        };
    }
}
