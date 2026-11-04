<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The hand-rolled refresh_token column predates Sanctum and was never
     * read by any code. Authentication now uses personal access tokens with a
     * fixed 7-day lifetime, so the column is dead weight.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('refresh_token');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('refresh_token', 500)->nullable()->after('avatar_url');
        });
    }
};
