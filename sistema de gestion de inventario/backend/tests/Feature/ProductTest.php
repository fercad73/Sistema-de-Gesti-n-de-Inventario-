<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    public function test_can_get_products()
    {
        Product::factory(5)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'sku', 'name', 'price', 'stock_quantity']
                ],
                'pagination'
            ]);
    }

    public function test_can_create_product()
    {
        $productData = [
            'sku' => 'TEST001',
            'name' => 'Test Product',
            'stock_quantity' => 10,
            'minimum_stock' => 5,
            'price' => 99.99,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/products', $productData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Producto creado exitosamente'
            ]);

        $this->assertDatabaseHas('products', [
            'sku' => 'TEST001',
            'name' => 'Test Product',
        ]);
    }

    public function test_can_update_product()
    {
        $product = Product::factory()->create();

        $updateData = [
            'name' => 'Updated Product Name',
            'price' => 149.99,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/products/{$product->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Producto actualizado exitosamente'
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Updated Product Name',
            'price' => 149.99,
        ]);
    }

    public function test_can_delete_product()
    {
        $product = Product::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Producto eliminado exitosamente'
            ]);

        $this->assertSoftDeleted('products', [
            'id' => $product->id,
        ]);
    }

    public function test_can_update_stock()
    {
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $stockData = [
            'quantity' => 5,
            'type' => 'entrada',
            'reason' => 'Reabastecimiento'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson("/api/products/{$product->id}/stock", $stockData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Stock actualizado exitosamente'
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 15,
        ]);
    }
}