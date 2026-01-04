<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductsTableSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();
        
        $products = [
            [
                'sku' => 'PROD001',
                'name' => 'Laptop HP Pavilion',
                'description' => 'Laptop HP Pavilion con procesador i5, 8GB RAM, 512GB SSD',
                'category_id' => $categories->where('name', 'Electrónica')->first()->id,
                'stock_quantity' => 15,
                'minimum_stock' => 5,
                'price' => 799.99,
                'cost_price' => 650.00,
                'location' => 'Estante A-1',
                'unit' => 'unidad'
            ],
            [
                'sku' => 'PROD002',
                'name' => 'Camisa de Algodón',
                'description' => 'Camisa de algodón 100%, talla M, color azul',
                'category_id' => $categories->where('name', 'Ropa')->first()->id,
                'stock_quantity' => 50,
                'minimum_stock' => 20,
                'price' => 29.99,
                'cost_price' => 15.00,
                'location' => 'Estante B-2',
                'unit' => 'pieza'
            ],
            [
                'sku' => 'PROD003',
                'name' => 'Arroz Integral',
                'description' => 'Arroz integral orgánico, paquete de 1kg',
                'category_id' => $categories->where('name', 'Alimentos')->first()->id,
                'stock_quantity' => 100,
                'minimum_stock' => 30,
                'price' => 4.99,
                'cost_price' => 2.50,
                'location' => 'Estante C-3',
                'unit' => 'kg'
            ],
            [
                'sku' => 'PROD004',
                'name' => 'Agua Mineral',
                'description' => 'Agua mineral natural, botella de 600ml',
                'category_id' => $categories->where('name', 'Bebidas')->first()->id,
                'stock_quantity' => 200,
                'minimum_stock' => 50,
                'price' => 1.50,
                'cost_price' => 0.60,
                'location' => 'Estante D-4',
                'unit' => 'botella'
            ],
            [
                'sku' => 'PROD005',
                'name' => 'Silla de Oficina',
                'description' => 'Silla ergonómica para oficina, color negro',
                'category_id' => $categories->where('name', 'Oficina')->first()->id,
                'stock_quantity' => 10,
                'minimum_stock' => 3,
                'price' => 129.99,
                'cost_price' => 85.00,
                'location' => 'Estante E-5',
                'unit' => 'unidad'
            ],
            [
                'sku' => 'PROD006',
                'name' => 'Balón de Fútbol',
                'description' => 'Balón oficial tamaño 5, material sintético',
                'category_id' => $categories->where('name', 'Deportes')->first()->id,
                'stock_quantity' => 25,
                'minimum_stock' => 10,
                'price' => 24.99,
                'cost_price' => 12.00,
                'location' => 'Estante F-6',
                'unit' => 'pieza'
            ],
            [
                'sku' => 'PROD007',
                'name' => 'Juego de Mesa',
                'description' => 'Juego de mesa familiar para 2-6 jugadores',
                'category_id' => $categories->where('name', 'Juguetes')->first()->id,
                'stock_quantity' => 8,
                'minimum_stock' => 5,
                'price' => 39.99,
                'cost_price' => 22.00,
                'location' => 'Estante G-7',
                'unit' => 'juego'
            ],
            [
                'sku' => 'PROD008',
                'name' => 'Novela Best Seller',
                'description' => 'Novela más vendida del año, tapa dura',
                'category_id' => $categories->where('name', 'Libros')->first()->id,
                'stock_quantity' => 30,
                'minimum_stock' => 15,
                'price' => 19.99,
                'cost_price' => 9.00,
                'location' => 'Estante H-8',
                'unit' => 'libro'
            ],
            [
                'sku' => 'PROD009',
                'name' => 'Termómetro Digital',
                'description' => 'Termómetro digital infrarrojo sin contacto',
                'category_id' => $categories->where('name', 'Salud')->first()->id,
                'stock_quantity' => 12,
                'minimum_stock' => 5,
                'price' => 49.99,
                'cost_price' => 25.00,
                'location' => 'Estante I-9',
                'unit' => 'unidad'
            ],
            [
                'sku' => 'PROD010',
                'name' => 'Lámpara de Mesa',
                'description' => 'Lámpara LED ajustable para escritorio',
                'category_id' => $categories->where('name', 'Hogar')->first()->id,
                'stock_quantity' => 18,
                'minimum_stock' => 8,
                'price' => 34.99,
                'cost_price' => 18.00,
                'location' => 'Estante J-10',
                'unit' => 'unidad'
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        // Crear 20 productos adicionales con factory
        Product::factory(20)->create();
    }
}