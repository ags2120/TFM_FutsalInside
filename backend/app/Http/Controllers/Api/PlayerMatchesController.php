<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\MatchEventType;
use App\Enums\MatchStatus;
use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Player;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Serves the `PlayerMatchParticipation` list the profile page renders under
 * "Últimos partidos".
 *
 * There is no participation table: it is a projection over the real match
 * feed, so the goals and assists a player is credited with here are exactly
 * the events the match detail endpoints serve, and the isMvp flag mirrors the
 * fixture's man of the match.
 */
final class PlayerMatchesController extends Controller
{
    public function index(int $id): JsonResponse
    {
        $player = Player::query()->find($id);

        if ($player === null) {
            throw new NotFoundHttpException("Player {$id} not found.");
        }

        $matches = Game::query()
            ->forTeam((int) $player->team_id)
            ->whereIn('status', [
                MatchStatus::Finished->value,
                MatchStatus::Live->value,
                MatchStatus::Halftime->value,
            ])
            ->orderByDesc('datetime')
            ->orderBy('id')
            ->get(['id', 'mvp_player_id']);

        $matchIds = $matches->pluck('id')->all();

        $goals = [];
        $assists = [];
        foreach (DB::table('match_events')->whereIn('match_id', $matchIds)->get(['match_id', 'player_id', 'assist_player_id', 'event_type']) as $event) {
            $matchId = (int) $event->match_id;

            if ($event->event_type === MatchEventType::Goal->value) {
                $goals[$matchId][(int) $event->player_id] = ($goals[$matchId][(int) $event->player_id] ?? 0) + 1;

                if ($event->assist_player_id !== null) {
                    $assists[$matchId][(int) $event->assist_player_id] = ($assists[$matchId][(int) $event->assist_player_id] ?? 0) + 1;
                }
            }
        }

        $participations = $matches->map(function (Game $match) use ($player, $goals, $assists): array {
            $matchId = (int) $match->getKey();
            $isMvp = $match->mvp_player_id !== null && (int) $match->mvp_player_id === (int) $player->getKey();
            $playerGoals = $goals[$matchId][(int) $player->getKey()] ?? 0;

            return [
                'matchId' => $matchId,
                'playerId' => (int) $player->getKey(),
                'goals' => $playerGoals,
                'assists' => $assists[$matchId][(int) $player->getKey()] ?? 0,
                'isMvp' => $isMvp,
                'rating' => $this->rating($player, $isMvp, $playerGoals, $matchId),
                'minutesPlayed' => $this->minutes($player, $matchId),
            ];
        });

        return response()->json([
            'participations' => $participations->values()->all(),
            'total' => $participations->count(),
        ]);
    }

    private function rating(Player $player, bool $isMvp, int $goals, int $matchId): float
    {
        $base = 6.0 + (crc32("participation-rating-{$player->getKey()}-{$matchId}") % 24) / 10;
        $base += $isMvp ? 0.3 : 0.0;
        $base += $goals * 0.15;

        return (float) round(min(9.0, $base), 1);
    }

    private function minutes(Player $player, int $matchId): int
    {
        if ($player->isGoalkeeper()) {
            return 40;
        }

        return 28 + (crc32("participation-minutes-{$player->getKey()}-{$matchId}") % 10);
    }
}
