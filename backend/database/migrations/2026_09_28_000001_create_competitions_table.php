<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('competitions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('country');
            $table->string('season', 20);
            $table->string('logo_url', 500)->nullable();
            $table->timestamps();

            $table->index(['name', 'season']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('competitions');
    }
};
