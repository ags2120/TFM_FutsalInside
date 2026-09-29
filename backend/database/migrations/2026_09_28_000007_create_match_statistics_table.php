<?php

use App\Enums\MatchStatisticType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('match_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->constrained()->cascadeOnDelete();
            $table->enum('type', MatchStatisticType::values());
            $table->unsignedSmallInteger('home_value')->default(0);
            $table->unsignedSmallInteger('away_value')->default(0);
            $table->timestamps();

            $table->unique(['match_id', 'type']);
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('match_statistics');
    }
};
