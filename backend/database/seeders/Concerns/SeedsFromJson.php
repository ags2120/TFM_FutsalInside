<?php

namespace Database\Seeders\Concerns;

use Illuminate\Support\Facades\DB;
use RuntimeException;

trait SeedsFromJson
{
    /**
     * Read one of the canonical seed datasets in database/seeders/data.
     *
     * @return list<array<string, mixed>>
     */
    protected function load(string $dataset): array
    {
        $path = database_path("seeders/data/{$dataset}.json");

        if (! is_file($path)) {
            throw new RuntimeException("Missing seed dataset [{$dataset}] at {$path}.");
        }

        $decoded = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        if (! is_array($decoded)) {
            throw new RuntimeException("Seed dataset [{$dataset}] is not a JSON array.");
        }

        return $decoded;
    }

    /**
     * Insert rows in chunks, splitting the payload across statements so large
     * datasets stay well under the max_allowed_packet / param limits.
     *
     * @param  list<array<string, mixed>>  $rows
     * @param  list<string>  $uniqueBy
     * @return int Number of rows written
     */
    protected function upsertChunked(string $table, array $rows, array $uniqueBy, int $chunk = 500): int
    {
        $written = 0;

        foreach (array_chunk($rows, $chunk) as $chunkRows) {
            DB::table($table)->upsert($chunkRows, $uniqueBy);
            $written += count($chunkRows);
        }

        return $written;
    }
}
