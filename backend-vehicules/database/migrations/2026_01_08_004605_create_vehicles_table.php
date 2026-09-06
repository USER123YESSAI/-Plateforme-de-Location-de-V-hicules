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
       Schema::create('vehicles', function (Blueprint $table) {
    $table->id();
    $table->string('brand');
    $table->string('model');
    $table->integer('year');
    $table->string('license_plate')->unique();
    $table->foreignId('category_id')->constrained()->onDelete('cascade');
    $table->decimal('daily_rate', 10, 2);
    $table->enum('fuel_type', ['essence', 'diesel', 'electric', 'hybrid']);
    $table->enum('transmission', ['manual', 'automatic']);
    $table->integer('seats');
    $table->string('image')->nullable();
    $table->enum('status', ['available', 'rented', 'maintenance', 'unavailable'])->default('available');
    $table->integer('mileage')->default(0);
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
