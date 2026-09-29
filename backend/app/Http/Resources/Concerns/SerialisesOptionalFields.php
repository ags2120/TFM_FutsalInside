<?php

declare(strict_types=1);

namespace App\Http\Resources\Concerns;

/**
 * Serialisation helpers for honouring the frontend's TypeScript contract.
 *
 * Two distinct cases, which are easy to conflate:
 *
 * - A field the contract declares as required (`logoUrl: string`) must never be
 *   null. The mocks represent "no image" as an empty string, so a missing
 *   column is normalised to `''` rather than dropped or sent as null.
 * - A field the contract declares as optional (`venue?: string`) must be
 *   genuinely absent when there is no value. Emitting `null` instead would put
 *   a value in the JSON that `string | undefined` does not admit.
 */
trait SerialisesOptionalFields
{
    /**
     * Remove keys whose value is null.
     *
     * `whenLoaded()` yields a MissingValue rather than null, so relations are
     * untouched by this and keep their own conditional behaviour.
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    protected function withoutNulls(array $payload): array
    {
        return array_filter($payload, static fn (mixed $value): bool => $value !== null);
    }

    /**
     * Normalise a nullable column to the empty string a required `string`
     * field expects.
     */
    protected function requiredString(?string $value): string
    {
        return $value ?? '';
    }
}
