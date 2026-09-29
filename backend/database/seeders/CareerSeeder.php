<?php

namespace Database\Seeders;

use App\Enums\PlayerPosition;
use Database\Seeders\Concerns\SeedsFromJson;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CareerSeeder extends Seeder
{
    use SeedsFromJson;

    public function run(): void
    {
        $entries = $this->load('career_entries');
        $entries = array_merge($entries, $this->buildSupplementalEntries($entries));

        foreach ($entries as $entry) {
            if ($entry['end_date'] !== null && $entry['end_date'] < $entry['start_date']) {
                throw new InvalidArgumentException(sprintf(
                    'Player %d: career stint ends (%s) before it starts (%s).',
                    $entry['player_id'],
                    $entry['end_date'],
                    $entry['start_date'],
                ));
            }
        }

        // career_entries has no unique constraint to conflict against, so the
        // rows are rebuilt instead of upserted. This keeps re-seeding
        // idempotent rather than appending a second copy of every stint.
        DB::table('career_entries')->delete();

        $this->insertChunked('career_entries', $entries);
        $open = array_filter($entries, fn (array $e): bool => $e['end_date'] === null);

        $this->command?->info('Career entries: '.count($entries).' | Open stints: '.count($open));
    }

    /**
     * Not every hand-authored player ships a history, and the generated squad
     * players start with none, so the timeline would render empty. Every
     * player without an open stint at their current club gets one here, and
     * the generated players additionally get a youth/reserve club they left.
     *
     * @param  list<array<string, mixed>>  $existingEntries
     * @return list<array<string, mixed>>
     */
    private function buildSupplementalEntries(array $existingEntries): array
    {
        $rows = [];

        $openAt = [];
        foreach ($existingEntries as $entry) {
            if ($entry['end_date'] === null) {
                $openAt[$entry['player_id']] = $entry['team_id'];
            }
        }

        $players = DB::table('players')
            ->join('teams', 'players.team_id', '=', 'teams.id')
            ->get(['players.id', 'players.team_id', 'players.position', 'players.birth_date']);

        foreach ($players as $player) {
            $playerId = (int) $player->id;
            $teamId = (int) $player->team_id;

            if (isset($openAt[$playerId]) && (int) $openAt[$playerId] === $teamId) {
                continue;
            }

            $joinYear = (int) $player->birth_date + 20 + (crc32("career-join-{$playerId}") % 6);
            $joinYear = max(2016, min(2025, $joinYear));

            $rows[] = [
                'player_id' => $playerId,
                'team_id' => $teamId,
                'start_date' => "{$joinYear}-07-01",
                'end_date' => null,
                'matches_played' => 8 + (crc32("career-matches-{$playerId}") % 26),
                'goals' => $this->careerGoals($player->position, $playerId),
            ];

            if ($playerId > 166 && crc32("career-youth-{$playerId}") % 100 < 60) {
                $club = 1 + (crc32("career-club-{$playerId}") % 34);
                if ($club === $teamId) {
                    $club = $club === 34 ? 1 : $club + 1;
                }

                $rows[] = [
                    'player_id' => $playerId,
                    'team_id' => $club,
                    'start_date' => ($joinYear - (3 + (crc32('career-span-'.$playerId) % 4))).'-07-01',
                    'end_date' => "{$joinYear}-06-30",
                    'matches_played' => 20 + (crc32("career-youth-matches-{$playerId}") % 40),
                    'goals' => $this->careerGoals($player->position, $playerId + 1000),
                ];
            }
        }

        return $rows;
    }

    private function careerGoals(string $position, int $seed): int
    {
        return match ($position) {
            PlayerPosition::Goalkeeper->value => 0,
            PlayerPosition::Closure->value => 1 + (crc32("goals-{$seed}") % 4),
            PlayerPosition::Winger->value => 4 + (crc32("goals-{$seed}") % 14),
            default => 4 + (crc32("goals-{$seed}") % 12),
        };
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     */
    private function insertChunked(string $table, array $rows, int $chunk = 500): void
    {
        foreach (array_chunk($rows, $chunk) as $chunkRows) {
            DB::table($table)->insert($chunkRows);
        }
    }
}
