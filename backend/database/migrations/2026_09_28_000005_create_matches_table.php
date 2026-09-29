<?php

use App\Enums\MatchStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->dateTime('datetime');
            $table->string('venue')->nullable();
            $table->enum('status', MatchStatus::values());
            $table->unsignedTinyInteger('home_score')->default(0);
            $table->unsignedTinyInteger('away_score')->default(0);
            $table->unsignedTinyInteger('minute')->nullable();
            $table->string('referee')->nullable();
            $table->unsignedInteger('attendance')->nullable();
            $table->foreignId('mvp_player_id')->nullable()->constrained('players')->nullOnDelete();
            $table->foreignId('competition_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_home_id')->constrained('teams')->cascadeOnDelete();
            $table->foreignId('team_away_id')->constrained('teams')->cascadeOnDelete();
            $table->timestamps();

            $table->index('status');
            $table->index('datetime');
            $table->index('competition_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
