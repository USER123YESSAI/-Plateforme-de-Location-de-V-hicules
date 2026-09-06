<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. SoftDeletes sur vehicles
        if (Schema::hasTable('vehicles') && !Schema::hasColumn('vehicles', 'deleted_at')) {
            Schema::table('vehicles', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        // 2. SoftDeletes sur rentals
        if (Schema::hasTable('rentals') && !Schema::hasColumn('rentals', 'deleted_at')) {
            Schema::table('rentals', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        // 3. SoftDeletes sur users
        if (Schema::hasTable('users') && !Schema::hasColumn('users', 'deleted_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        // 4. Index de performance sur les requêtes fréquentes de disponibilité
        if (Schema::hasTable('rentals')) {
            Schema::table('rentals', function (Blueprint $table) {
                $table->index(['vehicle_id', 'status', 'start_date', 'end_date'], 'rentals_availability_index');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('rentals')) {
            Schema::table('rentals', function (Blueprint $table) {
                $table->dropIndex('rentals_availability_index');
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasTable('vehicles')) {
            Schema::table('vehicles', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};
