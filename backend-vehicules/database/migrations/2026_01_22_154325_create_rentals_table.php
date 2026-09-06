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
        if (Schema::hasTable('rentals')) {
            // Table already exists (created by earlier migration). Skip creating.
            return;
        }

        Schema::create('rentals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Client
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->foreignId('insurance_id')->nullable()->constrained()->nullOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('pickup_location');
            $table->string('return_location');
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'active', 'completed', 'cancelled'])->default('pending');
            $table->decimal('daily_rate', 10, 2)->nullable();
            $table->decimal('insurance_rate', 10, 2)->nullable();
            $table->integer('total_days')->nullable();
            $table->decimal('subtotal', 12, 2)->nullable();
            $table->decimal('insurance_total', 12, 2)->nullable();
            $table->decimal('total_amount', 12, 2)->nullable(); // Calculé
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};
