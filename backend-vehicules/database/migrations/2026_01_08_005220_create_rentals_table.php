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
       Schema::create('rentals', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
    $table->foreignId('insurance_id')->nullable()->constrained()->onDelete('set null');
    $table->date('start_date');
    $table->date('end_date');
    $table->string('pickup_location');
    $table->string('return_location');
    $table->enum('status', ['pending', 'confirmed', 'active', 'completed', 'cancelled'])->default('pending');
    $table->decimal('daily_rate', 10, 2);
    $table->decimal('insurance_rate', 10, 2)->default(0);
    $table->integer('total_days');
    $table->decimal('subtotal', 10, 2);
    $table->decimal('insurance_total', 10, 2)->default(0);
    $table->decimal('total_amount', 10, 2);
    $table->text('notes')->nullable();
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
