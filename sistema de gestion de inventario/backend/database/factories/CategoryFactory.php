<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $colors = ['#007bff', '#dc3545', '#28a745', '#17a2b8', '#ffc107', '#6c757d', '#fd7e14', '#e83e8c'];
        $icons = ['fa-box', 'fa-tag', 'fa-cube', 'fa-cubes', 'fa-shopping-cart', 'fa-store', 'fa-warehouse'];
        
        return [
            'name' => $this->faker->unique()->words(2, true),
            'description' => $this->faker->sentence(10),
            'color' => $this->faker->randomElement($colors),
            'icon' => $this->faker->randomElement($icons),
        ];
    }
}