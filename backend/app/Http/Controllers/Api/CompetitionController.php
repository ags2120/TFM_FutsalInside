<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithFlatCollection;
use App\Http\Controllers\Controller;
use App\Http\Requests\PaginationRequest;
use App\Http\Resources\CompetitionResource;
use App\Models\Competition;
use Illuminate\Http\JsonResponse;

final class CompetitionController extends Controller
{
    use RespondsWithFlatCollection;

    public function index(PaginationRequest $request): JsonResponse
    {
        $competitions = Competition::query()
            ->orderBy('id')
            ->paginate($request->perPage());

        return $this->flatCollection(
            $competitions,
            CompetitionResource::class,
            'competitions',
        );
    }
}
