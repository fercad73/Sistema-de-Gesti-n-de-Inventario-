<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku', 100)->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('stock_quantity')->default(0);
            $table->integer('minimum_stock')->default(5);
            $table->decimal('price', 10, 2);
            $table->decimal('cost_price', 10, 2)->nullable();
            $table->string('location', 100)->nullable();
            $table->string('image_url')->nullable();
            $table->string('barcode', 100)->nullable();
            $table->string('unit', 50)->default('unidad');
            $table->decimal('weight', 10, 3)->nullable();
            $table->string('dimensions', 100)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['sku']);
            $table->index(['name']);
            $table->index(['category_id']);
            $table->index(['stock_quantity']);
            $table->index(['is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};