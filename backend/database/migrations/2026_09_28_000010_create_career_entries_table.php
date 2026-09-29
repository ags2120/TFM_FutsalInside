<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('career_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('player_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->unsignedInteger('matches_played')->default(0);
            $table->unsignedInteger('goals')->default(0);
            $table->timestamps();

            $table->index('player_id');
            $table->index(['player_id', 'start_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('career_entries');
    }
};
