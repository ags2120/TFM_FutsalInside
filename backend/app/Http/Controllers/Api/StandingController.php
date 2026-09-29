<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StandingResource;
use App\Models\TeamStatistic;
use Illuminate\Http\JsonResponse;

final class StandingController extends Controller
{
    /**
     * League table for every competition/season, position attached by the
     * `ranked()` scope. The whole set is small (50 rows), so no pagination is
     * applied: the frontend standings view needs every table to satisfy its
     * competition/season selectors.
     */
    public function index(): JsonResponse
    {
        $standings = TeamStatistic::query()
            ->ranked()
            ->with('team')
            ->orderBy('competition_id')
            ->orderBy('season')
            ->orderBy('position')
            ->get();

        return response()->json([
            'standings' => StandingResource::collection($standings)->resolve(),
            'total' => $standings->count(),
        ]);
    }
}
