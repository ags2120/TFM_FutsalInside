<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\Concerns\SerialisesOptionalFields;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
final class UserResource extends JsonResource
{
    use SerialisesOptionalFields;

    /**
     * The frontend's `User` contract declares `avatarUrl` as optional, so a
     * null column must be absent from the payload rather than serialised as
     * null (see the trait's docblock for the required-vs-optional rule).
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->withoutNulls([
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'avatarUrl' => $this->avatar_url,
        ]);
    }
}
