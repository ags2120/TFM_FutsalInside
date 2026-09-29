<?php

use App\Enums\MatchEventType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('match_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->constrained()->cascadeOnDelete();
            $table->foreignId('player_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assist_player_id')->nullable()->constrained('players')->nullOnDelete();
            $table->enum('event_type', MatchEventType::values());
            $table->unsignedTinyInteger('minute');
            $table->string('description', 500)->nullable();
            $table->timestamps();

            $table->index('match_id');
            $table->index('player_id');
            $table->index('event_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('match_events');
    }
};
