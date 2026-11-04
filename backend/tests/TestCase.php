<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Drop memoised guard users between requests.
     *
     * In production the application (and therefore the auth manager) boots
     * once per HTTP request, so a RequestGuard's cached user can never leak
     * into the next request. A feature test shares one application instance
     * across every `$this->get()/post()` call, so without this reset a token
     * revoked or expired mid-test would keep authenticating from the cache.
     * Call it whenever a test asserts that a previously valid token is now
     * rejected.
     */
    protected function forgetAuthGuards(): void
    {
        $this->app->make('auth')->forgetGuards();
    }
}
