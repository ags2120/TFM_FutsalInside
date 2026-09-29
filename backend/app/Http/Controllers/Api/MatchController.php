<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithFlatCollection;
use App\Http\Controllers\Controller;
use App\Http\Requests\MatchesIndexRequest;
use App\Http\Resources\MatchResource;
use App\Http\Resources\MatchSummaryResource;
use App\Models\Game;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class MatchController extends Controller
{
    use RespondsWithFlatCollection;

    /**
     * List shape only: the summary bar needs the two clubs and the
     * competition, not the event log. Loading those here would multiply the
     * row count by the number of matches on the page for no visible gain.
     *
     * Filters map to how the store splits the /live, /upcoming and /recent
     * rails plus the per-day calendar: a calendar date, a status bucket
     * (`live,halftime`) or a single team.
     */
    public function index(MatchesIndexRequest $request): JsonResponse
    {
        $matches = Game::query()
            ->with(['homeTeam', 'awayTeam', 'competition'])
            ->when($request->calendarDate(), fn ($query, string $date) => $query
                ->whereDate('datetime', $date))
            ->when($request->statuses(), fn ($query, array $statuses) => $query
                ->whereIn('status', $statuses))
            ->when($request->teamId(), fn ($query, int $teamId) => $query
                ->forTeam($teamId))
            ->orderByDesc('datetime')
            ->orderBy('id')
            ->paginate($request->perPage());

        return $this->flatCollection($matches, MatchSummaryResource::class, 'matches');
    }

    /**
     * Detail shape: everything the match screen renders, including the event
     * log and the metric table.
     */
    public function show(int $id): JsonResponse
    {
        $match = Game::query()
            ->with([
                'homeTeam',
                'awayTeam',
                'competition',
                // `Match.mvpPlayer` and every `MatchEvent.player` are declared
                // as full Player shapes on the frontend, so their own `team`
                // relation must be present too.
                'mvpPlayer' => fn ($query) => $query
                    ->with(['team', 'latestStatistic']),
                'events' => fn ($query) => $query
                    ->with([
                        'player' => fn ($query) => $query->with(['team', 'latestStatistic']),
                        'team',
                        'assistPlayer' => fn ($query) => $query->with(['team', 'latestStatistic']),
                    ])
                    ->orderBy('minute')
                    ->orderBy('id'),
                // Schema order, not insertion or primary-key order: the table
                // has no default sort, so the rendered metric sequence would
                // otherwise be undefined.
                'statistics' => fn ($query) => $query->inSchemaOrder(),
            ])
            ->find($id);

        if ($match === null) {
            throw new NotFoundHttpException("Match {$id} not found.");
        }

        return response()->json([
            'data' => (new MatchResource($match))->resolve(),
        ]);
    }
}
