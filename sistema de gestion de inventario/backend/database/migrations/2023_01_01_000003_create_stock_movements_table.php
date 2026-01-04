<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['entrada', 'salida', 'ajuste', 'venta', 'compra']);
            $table->integer('quantity_change');
            $table->integer('previous_quantity');
            $table->integer('new_quantity');
            $table->string('reason', 255)->nullable();
            $table->string('reference', 100)->nullable();
            $table->timestamp('movement_date')->useCurrent();
            $table->timestamps();
            
            $table->index(['product_id']);
            $table->index(['movement_date']);
            $table->index(['type']);
            $table->index(['user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};