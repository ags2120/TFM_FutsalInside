<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

/**
 * Token-based session endpoints (Sanctum personal access tokens).
 *
 * Stateless by design: `login` and `register` mint a bearer token, `logout`
 * revokes exactly the token that presented itself (other devices keep their
 * own), and there is no refresh flow — a token simply expires after the
 * configured 7-day lifetime and the client re-authenticates.
 */
final class AuthController extends Controller
{
    /**
     * Token name shown in `personal_access_tokens`; kept generic because the
     * only first-party client is the Angular SPA.
     */
    private const TOKEN_NAME = 'futsalinside-spa';

    /**
     * Create the account and log in immediately: registration returns the
     * same session payload as login so the frontend has a single
     * "establish session" code path.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create($request->safe()->only(['username', 'email', 'password']));

        return response()->json([
            'user' => (new UserResource($user))->resolve(),
            'token' => $user->createToken(self::TOKEN_NAME)->plainTextToken,
        ], 201);
    }

    /**
     * Verify credentials without starting a session — the response is a
     * bearer token, not a cookie, so the stock `web` guard is bypassed
     * entirely.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()
            ->where('email', $request->validated('email'))
            ->first();

        if ($user === null || ! Hash::check((string) $request->validated('password'), $user->password)) {
            return response()->json([
                'message' => 'These credentials do not match our records.',
            ], 401);
        }

        return response()->json([
            'user' => (new UserResource($user))->resolve(),
            'token' => $user->createToken(self::TOKEN_NAME)->plainTextToken,
        ]);
    }

    /**
     * Revoke only the presented token (single-device logout). Deleting the
     * row invalidates the bearer string server-side; the client clears its
     * copy regardless of the response.
     */
    public function logout(Request $request): Response
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->noContent();
    }

    /**
     * Session probe used by the SPA on bootstrap to detect tokens that were
     * revoked or expired while the tab was closed.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => (new UserResource($request->user()))->resolve(),
        ]);
    }
}
