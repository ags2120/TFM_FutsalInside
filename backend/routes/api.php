<?php

declare(strict_types=1);

use App\Http\Controllers\Api\CompetitionController;
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
| Every route here is unauthenticated by design: authentication is wired in a
| later phase. Only GET routes exist, so the surface cannot mutate data.
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
