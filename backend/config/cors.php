<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute in
    | web browsers. You are free to adjust these settings as needed.
    |
    | The Angular dev server runs on http://localhost:4200 while the API is
    | served by `php artisan serve` on http://localhost:8000; the app calls
    | the API straight from the browser (no dev proxy), so these headers must
    | welcome the local origin. The API is read-only and unauthenticated, so a
    | wildcard origin with credentials disabled is acceptable here.
    |
    */

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
