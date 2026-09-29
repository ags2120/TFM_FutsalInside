<?php

declare(strict_types=1);

namespace App\Http\Controllers\Concerns;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Shapes collection responses to match the frontend list contracts.
 *
 * The Angular stores declare flat envelopes such as `{ matches, total }`
 * (`match.model.ts`), not Laravel's default `{ data, meta, links }`. Keeping
 * the translation in one place stops the two drifting apart per controller.
 */
trait RespondsWithFlatCollection
{
    /**
     * @param  class-string<JsonResource>  $resource
     */
    protected function flatCollection(
        LengthAwarePaginator $paginator,
        string $resource,
        string $key,
    ): JsonResponse {
        return response()->json([
            $key => $resource::collection($paginator->items())->resolve(),
            'total' => $paginator->total(),
        ]);
    }
}
