<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithFlatCollection;
use App\Http\Controllers\Controller;
use App\Http\Requests\PaginationRequest;
use App\Http\Resources\TeamResource;
use App\Models\Team;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class TeamController extends Controller
{
    use RespondsWithFlatCollection;

    public function index(PaginationRequest $request): JsonResponse
    {
        $teams = Team::query()
            ->orderBy('name')
            ->paginate($request->perPage());

        return $this->flatCollection($teams, TeamResource::class, 'teams');
    }

    /**
     * Serves the `TeamDetail` shape, which extends the list shape with a
     * roster. Sorting by shirt number keeps the squad in a predictable order.
     */
    public function show(int $id): JsonResponse
    {
        $team = Team::query()
            ->with([
                'players' => fn ($query) => $query
                    ->with('latestStatistic')
                    ->orderBy('shirt_number'),
            ])
            ->find($id);

        if ($team === null) {
            throw new NotFoundHttpException("Team {$id} not found.");
        }

        return response()->json([
            'data' => (new TeamResource($team))->resolve(),
        ]);
    }
}
