<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TeamStatisticResource;
use App\Models\Team;
use App\Models\TeamStatistic;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class TeamStatisticsController extends Controller
{
    /**
     * Single headline row for the club profile. As with players, the newest
     * season wins, preferring the national league over the cup.
     */
    public function forTeam(int $id): JsonResponse
    {
        if (! Team::whereKey($id)->exists()) {
            throw new NotFoundHttpException("Team {$id} not found.");
        }

        $statistic = TeamStatistic::query()
            ->where('team_id', $id)
            ->orderByDesc('season')
            ->orderBy('competition_id')
            ->first();

        if ($statistic === null) {
            throw new NotFoundHttpException("Team {$id} has no statistics.");
        }

        return response()->json([
            'data' => (new TeamStatisticResource($statistic))->resolve(),
        ]);
    }
}
