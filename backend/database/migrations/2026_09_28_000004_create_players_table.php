<?php

use App\Enums\DominantFoot;
use App\Enums\PlayerPosition;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('photo_url', 500)->nullable();
            $table->date('birth_date');
            $table->string('nationality', 100);
            $table->decimal('height', 5, 2)->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->enum('dominant_foot', DominantFoot::values())->nullable();
            $table->enum('position', PlayerPosition::values());
            $table->unsignedTinyInteger('shirt_number');
            $table->decimal('market_value', 12, 2)->nullable();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->index('team_id');
            $table->index('position');
            $table->index('nationality');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
