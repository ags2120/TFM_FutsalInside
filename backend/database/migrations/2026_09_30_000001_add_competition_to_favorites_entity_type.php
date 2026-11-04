<?php

declare(strict_types=1);

use App\Enums\FavoriteEntityType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('favorites', function (Blueprint $table) {
            $table->enum('entity_type', FavoriteEntityType::values())->change();
        });
    }

    public function down(): void
    {
        Schema::table('favorites', function (Blueprint $table) {
            $table->enum('entity_type', ['match', 'team', 'player'])->change();
        });
    }
};
