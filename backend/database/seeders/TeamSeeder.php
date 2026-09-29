<?php

namespace Database\Seeders;

use Database\Seeders\Concerns\SeedsFromJson;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    use SeedsFromJson;

    public function run(): void
    {
        $teams = $this->load('teams');
        $pivot = $this->load('team_competition');

        $this->upsertChunked('teams', $teams, ['id']);
        $this->upsertChunked('team_competition', $pivot, ['team_id', 'competition_id']);

        $this->command?->info('Teams: '.count($teams).' | Entries: '.count($pivot));
    }
}
