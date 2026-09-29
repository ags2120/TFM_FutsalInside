<?php

namespace Database\Seeders;

use App\Models\Player;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Order matters: the match tables reference players (including the MVP
     * foreign key), and player statistics reference both players and
     * competitions, so parents always land before their children.
     */
    public function run(): void
    {
        $this->call([
            CompetitionSeeder::class,
            TeamSeeder::class,
            PlayerSeeder::class,
            MatchSeeder::class,
            StatisticsSeeder::class,
            CareerSeeder::class,
        ]);

        $this->seedUsers();
        $this->verify();
    }

    private function seedUsers(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@futsalinside.test'],
            [
                'username' => 'admin',
                'password' => 'password',
                'avatar_url' => null,
            ],
        );

        $this->command?->info('Users: 1');
    }

    /**
     * Post-seed sanity pass. Counts drift as the generator tops the dataset
     * up, so the checks are invariants the UI relies on rather than exact
     * row totals: full squads, a played fixture feed for every club, no
     * orphaned event, and an open career stint for every player.
     */
    private function verify(): void
    {
        $expected = [
            'competitions' => 5,
            'teams' => 34,
            'team_competition' => 50,
            'team_statistics' => 50,
        ];

        foreach ($expected as $table => $count) {
            $actual = DB::table($table)->count();

            if ($actual !== $count) {
                $this->command?->error("{$table}: expected {$count} rows, found {$actual}.");

                throw new RuntimeException("Seed verification failed on [{$table}].");
            }
        }

        $this->assertSquadSizes();
        $this->assertPlayedFixtureFeed();
        $this->assertEventCoherence();
        $this->assertCareerCoverage();

        $live = DB::table('matches')->whereIn('status', ['live', 'halftime'])->count();

        $this->command?->info('Verified: invariants hold | Live/halftime fixtures: '.$live);
        $this->command?->info('Players loaded: '.Player::query()->count());
    }

    /**
     * Every team fields a full futsal squad and the match feeds can always
     * pick scorers, MVPs and crew.
     */
    private function assertSquadSizes(): void
    {
        $short = DB::table('players')
            ->select('team_id', DB::raw('count(*) as total'))
            ->groupBy('team_id')
            ->having('total', '<', 10)
            ->first();

        if ($short !== null) {
            throw new RuntimeException("Team {$short->team_id} fields only {$short->total} players.");
        }

        $noKeeper = DB::table('players')
            ->select('team_id', DB::raw('SUM(position = \'portero\') as keepers'))
            ->groupBy('team_id')
            ->havingRaw('SUM(position = \'portero\') < 2')
            ->first();

        if ($noKeeper !== null) {
            throw new RuntimeException("Team {$noKeeper->team_id} does not carry two goalkeepers.");
        }

        $orphan = DB::table('players')
            ->leftJoin('teams', 'players.team_id', '=', 'teams.id')
            ->whereNull('teams.id')
            ->count();

        if ($orphan > 0) {
            throw new RuntimeException("{$orphan} players reference a missing team.");
        }
    }

    /**
     * Any competition with fixtures must give every participating team a
     * finished fixture feed, and a played match always carries its seven
     * metrics (so both match-detail tabs render).
     *
     * COUNT DISTINCT is not an option here: a finished match gives one point to
     * each side, so the tally is per (competition, team) summed over home and
     * away appearances.
     */
    private function assertPlayedFixtureFeed(): void
    {
        $finishedPerSlot = [];
        $everySlot = [];

        foreach (DB::table('matches')->get(['id', 'status', 'competition_id', 'team_home_id', 'team_away_id']) as $match) {
            $homeSlot = (int) $match->competition_id.':'.(int) $match->team_home_id;
            $awaySlot = (int) $match->competition_id.':'.(int) $match->team_away_id;

            $everySlot[$homeSlot] = true;
            $everySlot[$awaySlot] = true;

            if ($match->status === 'finished') {
                $finishedPerSlot[$homeSlot] = ($finishedPerSlot[$homeSlot] ?? 0) + 1;
                $finishedPerSlot[$awaySlot] = ($finishedPerSlot[$awaySlot] ?? 0) + 1;
            }
        }

        $underfed = null;
        foreach (array_keys($everySlot) as $slot) {
            if (($finishedPerSlot[$slot] ?? 0) < 5) {
                $underfed = $slot;
                break;
            }
        }

        if ($underfed !== null) {
            throw new RuntimeException("Team/competition {$underfed} has fewer than 5 finished fixtures.");
        }

        $played = DB::table('matches')
            ->whereIn('status', ['finished', 'live', 'halftime'])
            ->get(['id', 'status', 'home_score', 'away_score']);

        foreach ($played as $match) {
            $stats = DB::table('match_statistics')->where('match_id', $match->id)->count();

            if ($stats !== 7) {
                throw new RuntimeException("Match {$match->id} has {$stats}/7 statistic rows.");
            }
        }
    }

    /**
     * MVP and player-event references must resolve to real players, and the
     * goal feed must agree with the scoreline field for every fixture.
     */
    private function assertEventCoherence(): void
    {
        $playerIds = DB::table('players')->pluck('id');

        $mvp = DB::table('matches')
            ->whereNotNull('mvp_player_id')
            ->whereNotIn('mvp_player_id', $playerIds)
            ->count();

        if ($mvp > 0) {
            throw new RuntimeException("{$mvp} matches reference a missing MVP player.");
        }

        $orphanAssists = DB::table('match_events')
            ->whereNotNull('assist_player_id')
            ->whereNotIn('assist_player_id', $playerIds)
            ->count();

        if ($orphanAssists > 0) {
            throw new RuntimeException("{$orphanAssists} assists reference a missing player.");
        }

        $mismatch = DB::table('matches as m')
            ->leftJoin('match_events as goals', fn ($join) => $join
                ->on('goals.match_id', '=', 'm.id')
                ->where('goals.event_type', '=', 'goal')
                ->whereColumn('goals.team_id', 'm.team_home_id'))
            ->where('m.status', '!=', 'scheduled')
            ->select('m.id')
            ->selectRaw('MAX(m.home_score) home_score, COUNT(goals.id) as home_goals')
            ->groupBy('m.id')
            ->havingRaw('MAX(m.home_score) <> COUNT(goals.id)')
            ->first();

        if ($mismatch !== null) {
            throw new RuntimeException("Match {$mismatch->id} home goals disagree with its home_score.");
        }
    }

    /**
     * Every player needs an open stint at their current club so the timeline
     * never renders an empty history and the API's open-stint-last order holds.
     */
    private function assertCareerCoverage(): void
    {
        $missing = DB::table('players')
            ->leftJoin('career_entries', function ($join): void {
                $join->on('career_entries.player_id', '=', 'players.id')
                    ->whereNull('career_entries.end_date')
                    ->whereColumn('career_entries.team_id', 'players.team_id');
            })
            ->whereNull('career_entries.id')
            ->count();

        if ($missing > 0) {
            throw new RuntimeException("{$missing} players lack an open stint at their current club.");
        }
    }
}
