<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('competition_id')->constrained()->cascadeOnDelete();
            $table->string('season', 20);
            $table->unsignedInteger('matches_played')->default(0);
            $table->unsignedInteger('wins')->default(0);
            $table->unsignedInteger('draws')->default(0);
            $table->unsignedInteger('losses')->default(0);
            $table->unsignedInteger('goals_for')->default(0);
            $table->unsignedInteger('goals_against')->default(0);
            $table->integer('goals_difference')->default(0);
            $table->unsignedInteger('points')->default(0);
            $table->char('form', 5)->nullable();
            $table->unsignedInteger('clean_sheets')->default(0);
            $table->decimal('avg_possession', 5, 2)->default(0);
            $table->decimal('avg_shots_per_match', 5, 2)->default(0);
            $table->timestamps();

            $table->unique(['team_id', 'season', 'competition_id']);
            $table->index('competition_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_statistics');
    }
};
