<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\MatchStatus;

/**
 * Collection filters for the match list endpoint.
 *
 * The frontend store splits fixtures into live/upcoming/recent buckets and
 * offers a per-day calendar, so the server accepts the same knobs instead of
 * forcing the client to download every fixture and filter in memory.
 */
final class MatchesIndexRequest extends PaginationRequest
{
    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            ...parent::rules(),
            'date' => ['sometimes', 'date_format:Y-m-d'],
            // One status or a comma-separated group, e.g. `live,halftime`.
            'status' => ['sometimes', 'string', 'regex:/^[a-z]+(,[a-z]+)*$/'],
            'team' => ['sometimes', 'integer', 'min:1'],
        ];
    }

    /**
     * @return list<string>
     */
    public function statuses(): array
    {
        $statuses = MatchStatus::values();

        // Unknown values are ignored rather than rejected: the store asks for
        // stable buckets (`live,halftime`) and a seeder may add a status later.
        return array_values(array_filter(
            explode(',', (string) $this->input('status')),
            static fn (string $status): bool => in_array($status, $statuses, true),
        ));
    }

    public function calendarDate(): ?string
    {
        return $this->input('date');
    }

    public function teamId(): ?int
    {
        return $this->filled('team') ? $this->integer('team') : null;
    }
}
