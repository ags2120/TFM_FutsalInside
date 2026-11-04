<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\FavoriteEntityType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

/**
 * Payload for POST /favorites/toggle.
 *
 * Matches the frontend's `FavoriteToggleRequest` contract: the client sends
 * only `type` and `entityId`. The display name is a server-side snapshot
 * computed from the referenced row, so it can never disagree with the
 * database.
 */
final class ToggleFavoriteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::enum(FavoriteEntityType::class)],
            'entityId' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * `favorites.entity_id` has no foreign key because the target table varies
     * by type, so referential integrity cannot be expressed in the schema.
     * Checking it here keeps dangling rows out of the table instead of
     * surfacing a 404 later from the list endpoint.
     *
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                /** @var FavoriteEntityType $type */
                $type = FavoriteEntityType::from($this->validated('type'));

                $exists = $type->modelClass()::query()
                    ->whereKey($this->integer('entityId'))
                    ->exists();

                if (! $exists) {
                    $validator->errors()->add(
                        'entityId',
                        'The selected entity does not exist.',
                    );
                }
            },
        ];
    }
}
