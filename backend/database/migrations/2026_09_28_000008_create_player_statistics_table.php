<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('player_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('player_id')->constrained()->cascadeOnDelete();
            $table->foreignId('competition_id')->constrained()->cascadeOnDelete();
            $table->string('season', 20);
            $table->unsignedInteger('matches_played')->default(0);
            $table->unsignedInteger('goals')->default(0);
            $table->unsignedInteger('assists')->default(0);
            $table->unsignedInteger('yellow_cards')->default(0);
            $table->unsignedInteger('red_cards')->default(0);
            $table->unsignedInteger('minutes_played')->default(0);
            $table->decimal('rating', 3, 1)->nullable();
            $table->decimal('expected_goals', 5, 2)->default(0);
            $table->decimal('expected_assists', 5, 2)->default(0);
            $table->decimal('pass_accuracy', 5, 2)->default(0);
            $table->decimal('shot_accuracy', 5, 2)->default(0);
            $table->unsignedInteger('defensive_actions')->default(0);
            $table->unsignedInteger('saves')->default(0);
            $table->unsignedInteger('blocks')->default(0);
            $table->unsignedInteger('steals')->default(0);
            $table->decimal('goal_participation', 5, 2)->default(0);
            $table->timestamps();

            $table->unique(['player_id', 'season', 'competition_id']);
            $table->index('competition_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_statistics');
    }
};
