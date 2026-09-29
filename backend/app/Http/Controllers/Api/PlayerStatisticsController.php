<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlayerStatisticResource;
use App\Models\Player;
use App\Models\PlayerStatistic;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class PlayerStatisticsController extends Controller
{
    /**
     * Every season/competition row for every player. Multi-competition seasons
     * yield more than one row per player; consumers aggregate across rows the
     * same way the frontend top-scorers rail sums `goals` per player.
     */
    public function index(): JsonResponse
    {
        $rows = PlayerStatistic::query()
            ->orderBy('player_id')
            ->orderByDesc('season')
            ->orderBy('competition_id')
            ->get();

        $this->attachCareerTotals($rows);

        return response()->json([
            'statistics' => PlayerStatisticResource::collection($rows)->resolve(),
            'total' => $rows->count(),
        ]);
    }

    /**
     * Single headline row for the player profile, as the frontend store
     * expects one `PlayerStatistics` per player. The newest season is picked,
     * preferring the national league over the cup in a multi-row season.
     */
    public function forPlayer(int $id): JsonResponse
    {
        if (! Player::whereKey($id)->exists()) {
            throw new NotFoundHttpException("Player {$id} not found.");
        }

        $statistic = PlayerStatistic::query()
            ->where('player_id', $id)
            ->orderByDesc('season')
            ->orderBy('competition_id')
            ->first();

        if ($statistic === null) {
            throw new NotFoundHttpException("Player {$id} has no statistics.");
        }

        $this->attachCareerTotals(collect([$statistic]));

        return response()->json([
            'data' => (new PlayerStatisticResource($statistic))->resolve(),
        ]);
    }

    /**
     * Attach cross-season, cross-competition career totals onto every row.
     *
     * "Carrera" means everything the timeline shows: goals and appearances are
     * summed across every club stint in `career_entries`, so the headline
     * figures always agree with the "Trayectoria" card. Values a stint has no
     * record of (assists, discipline) keep summing the seasonal rows, which are
     * their only source.
     *
     * Eloquent models do not have these columns, so they are stamped as
     * attributes from a pair of grouped queries; PlayerStatisticResource reads
     * them under the `career*` names the frontend contract declares.
     *
     * @param  Collection<int, PlayerStatistic>  $rows
     */
    private function attachCareerTotals(Collection $rows): void
    {
        $ids = array_unique($rows->pluck('player_id')->all());

        $career = DB::table('career_entries')
            ->whereIn('player_id', $ids)
            ->selectRaw(
                'player_id,'
                .' SUM(goals) career_goals,'
                .' SUM(matches_played) career_matches_played'
            )
            ->groupBy('player_id')
            ->get()
            ->keyBy('player_id');

        $seasonal = PlayerStatistic::query()
            ->whereIn('player_id', $ids)
            ->selectRaw(
                'player_id,'
                .' SUM(assists) career_assists,'
                .' SUM(yellow_cards) career_yellow_cards,'
                .' SUM(red_cards) career_red_cards'
            )
            ->groupBy('player_id')
            ->get()
            ->keyBy('player_id');

        foreach ($rows as $row) {
            $id = $row->player_id;
            $stintTotals = $career->get($id);
            $seasonTotals = $seasonal->get($id);

            $row->career_goals = (int) ($stintTotals?->career_goals ?? 0);
            $row->career_matches_played = (int) ($stintTotals?->career_matches_played ?? 0);
            $row->career_assists = (int) ($seasonTotals?->career_assists ?? 0);
            $row->career_yellow_cards = (int) ($seasonTotals?->career_yellow_cards ?? 0);
            $row->career_red_cards = (int) ($seasonTotals?->career_red_cards ?? 0);
        }
    }
}
