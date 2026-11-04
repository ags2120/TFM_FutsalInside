<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Payload for POST /auth/login.
 *
 * No length rule on the password: this endpoint verifies an existing
 * credential, and rejecting short inputs here would only leak which accounts
 * were created under older policy. Failure is reported as a uniform 401.
 */
final class LoginRequest extends FormRequest
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
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ];
    }
}
