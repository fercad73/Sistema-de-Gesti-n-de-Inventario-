<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $categories = Category::pluck('id')->toArray();
        
        return [
            'sku' => 'SKU' . strtoupper(Str::random(6)) . rand(100, 999),
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(2),
            'category_id' => $this->faker->randomElement($categories),
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'minimum_stock' => $this->faker->numberBetween(5, 20),
            'price' => $this->faker->randomFloat(2, 1, 1000),
            'cost_price' => $this->faker->randomFloat(2, 0.5, 800),
            'location' => 'Estante ' . $this->faker->randomLetter() . '-' . $this->faker->randomNumber(2),
            'barcode' => $this->faker->ean13(),
            'unit' => $this->faker->randomElement(['unidad', 'pieza', 'kg', 'litro', 'paquete']),
            'weight' => $this->faker->optional()->randomFloat(3, 0.1, 50),
            'dimensions' => $this->faker->optional()->randomElement(['10x20x30', '15x15x15', '5x10x20']),
            'is_active' => $this->faker->boolean(90),
        ];
    }

    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => $this->faker->numberBetween(1, 5),
            'minimum_stock' => $this->faker->numberBetween(5, 10),
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }

    public function highStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => $this->faker->numberBetween(50, 200),
        ]);
    }
}