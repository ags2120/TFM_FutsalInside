<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Credential endpoints are the only write surface in the API, so they
        // are the only place brute-force attempts pay off. Keyed by email + IP:
        // six attempts per minute throttles an attacker without locking out a
        // user who simply mistyped their password a few times from one network.
        RateLimiter::for('auth', function (Request $request): Limit {
            $email = strtolower((string) $request->input('email', ''));

            return Limit::perMinute(6)->by($email.'|'.$request->ip());
        });
    }
}
