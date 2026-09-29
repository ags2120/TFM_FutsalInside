<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithFlatCollection;
use App\Http\Controllers\Controller;
use App\Http\Requests\PaginationRequest;
use App\Http\Resources\PlayerResource;
use App\Models\Player;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class PlayerController extends Controller
{
    use RespondsWithFlatCollection;

    public function index(PaginationRequest $request): JsonResponse
    {
        $players = Player::query()
            ->with(['team', 'latestStatistic'])
            ->orderBy('name')
            ->paginate($request->perPage());

        return $this->flatCollection($players, PlayerResource::class, 'players');
    }

    /**
     * Serves the `PlayerDetail` shape, which extends the list shape with a
     * career history. Stints are ordered oldest first and an open stint (no
     * end date) sorts last, so the current club reads as the latest entry.
     */
    public function show(int $id): JsonResponse
    {
        $player = Player::query()
            ->with([
                'team',
                'latestStatistic',
                'careerEntries' => fn ($query) => $query
                    ->with('team')
                    ->orderByRaw('end_date IS NULL, start_date ASC'),
            ])
            ->find($id);

        if ($player === null) {
            throw new NotFoundHttpException("Player {$id} not found.");
        }

        return response()->json([
            'data' => (new PlayerResource($player))->resolve(),
        ]);
    }
}
