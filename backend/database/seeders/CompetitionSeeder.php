<?php

namespace Database\Seeders;

use Database\Seeders\Concerns\SeedsFromJson;
use Illuminate\Database\Seeder;

class CompetitionSeeder extends Seeder
{
    use SeedsFromJson;

    public function run(): void
    {
        $rows = $this->load('competitions');

        $this->upsertChunked('competitions', $rows, ['id']);

        $this->command?->info('Competitions: '.count($rows));
    }
}
