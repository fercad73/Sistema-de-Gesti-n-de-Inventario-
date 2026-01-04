<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategoriesTableSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Electrónica', 'color' => '#007bff', 'icon' => 'fa-laptop'],
            ['name' => 'Ropa', 'color' => '#dc3545', 'icon' => 'fa-tshirt'],
            ['name' => 'Alimentos', 'color' => '#28a745', 'icon' => 'fa-utensils'],
            ['name' => 'Bebidas', 'color' => '#17a2b8', 'icon' => 'fa-wine-bottle'],
            ['name' => 'Hogar', 'color' => '#ffc107', 'icon' => 'fa-home'],
            ['name' => 'Oficina', 'color' => '#6c757d', 'icon' => 'fa-briefcase'],
            ['name' => 'Deportes', 'color' => '#fd7e14', 'icon' => 'fa-football-ball'],
            ['name' => 'Juguetes', 'color' => '#e83e8c', 'icon' => 'fa-gamepad'],
            ['name' => 'Libros', 'color' => '#20c997', 'icon' => 'fa-book'],
            ['name' => 'Salud', 'color' => '#6610f2', 'icon' => 'fa-heartbeat'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}