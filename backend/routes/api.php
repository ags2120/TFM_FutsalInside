<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\CompetitionController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\MatchController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\PlayerMatchesController;
use App\Http\Controllers\Api\PlayerStatisticsController;
use App\Http\Controllers\Api\StandingController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\TeamStatisticsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public read-only API
|--------------------------------------------------------------------------
|
| Reading competition data is unauthenticated by design. Everything that
| mutates state or reads a user's personal data lives behind `auth:sanctum`
| (bearer tokens); only GET routes exist outside that group, so the public
| surface still cannot mutate data.
|
*/

Route::get('/competitions', [CompetitionController::class, 'index'])
    ->name('competitions.index');

Route::get('/standings', [StandingController::class, 'index'])
    ->name('standings.index');

Route::get('/teams', [TeamController::class, 'index'])
    ->name('teams.index');
Route::get('/teams/{id}', [TeamController::class, 'show'])
    ->whereNumber('id')
    ->name('teams.show');
Route::get('/teams/{id}/statistics', [TeamStatisticsController::class, 'forTeam'])
    ->whereNumber('id')
    ->name('teams.statistics');

Route::get('/players', [PlayerController::class, 'index'])
    ->name('players.index');
Route::get('/players/{id}', [PlayerController::class, 'show'])
    ->whereNumber('id')
    ->name('players.show');
Route::get('/players/{id}/statistics', [PlayerStatisticsController::class, 'forPlayer'])
    ->whereNumber('id')
    ->name('players.statistics');
Route::get('/players/{id}/matches', [PlayerMatchesController::class, 'index'])
    ->whereNumber('id')
    ->name('players.matches');

Route::get('/player-statistics', [PlayerStatisticsController::class, 'index'])
    ->name('player-statistics.index');

Route::get('/matches', [MatchController::class, 'index'])
    ->name('matches.index');
Route::get('/matches/{id}', [MatchController::class, 'show'])
    ->whereNumber('id')
    ->name('matches.show');

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
|
| Session establishment is stateless: both credential endpoints return a
| Sanctum personal access token (7-day lifetime) rather than a cookie. The
| throttle limiter is defined in AppServiceProvider.
|
*/

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])
        ->middleware('throttle:auth')
        ->name('auth.register');
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:auth')
        ->name('auth.login');
    Route::post('/logout', [AuthController::class, 'logout'])
        ->middleware('auth:sanctum')
        ->name('auth.logout');
    Route::get('/me', [AuthController::class, 'me'])
        ->middleware('auth:sanctum')
        ->name('auth.me');
});

/*
|--------------------------------------------------------------------------
| Authenticated user data
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/favorites', [FavoriteController::class, 'index'])
        ->name('favorites.index');
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle'])
        ->name('favorites.toggle');
});
