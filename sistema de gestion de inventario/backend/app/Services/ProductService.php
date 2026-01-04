<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function createProduct(array $data, $image = null)
    {
        DB::beginTransaction();
        
        try {
            if ($image) {
                $imagePath = $image->store('products', 'public');
                $data['image_url'] = Storage::url($imagePath);
            }
            
            $product = Product::create($data);
            
            if ($product->stock_quantity > 0) {
                $product->recordStockMovement(
                    'entrada',
                    $product->stock_quantity,
                    'Stock inicial del producto'
                );
            }
            
            DB::commit();
            return $product;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateProduct(Product $product, array $data, $image = null)
    {
        DB::beginTransaction();
        
        try {
            $oldStock = $product->stock_quantity;
            
            if ($image) {
                // Eliminar imagen anterior si existe
                if ($product->image_url) {
                    $oldImage = str_replace('/storage/', '', $product->image_url);
                    Storage::disk('public')->delete($oldImage);
                }
                
                $imagePath = $image->store('products', 'public');
                $data['image_url'] = Storage::url($imagePath);
            }
            
            $product->update($data);
            
            // Registrar movimiento si el stock cambió
            $newStock = $product->stock_quantity;
            $stockDifference = $newStock - $oldStock;
            
            if ($stockDifference != 0) {
                $type = $stockDifference > 0 ? 'entrada' : 'salida';
                $reason = $data['reason'] ?? 'Actualización manual de stock';
                
                $product->recordStockMovement(
                    $type,
                    abs($stockDifference),
                    $reason
                );
            }
            
            DB::commit();
            return $product;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteProduct(Product $product)
    {
        DB::beginTransaction();
        
        try {
            // Eliminar imagen si existe
            if ($product->image_url) {
                $oldImage = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldImage);
            }
            
            $product->delete();
            
            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateStock(Product $product, $quantity, $type, $reason = null)
    {
        DB::beginTransaction();
        
        try {
            $oldStock = $product->stock_quantity;
            
            if ($type === 'entrada') {
                $product->increment('stock_quantity', $quantity);
            } elseif ($type === 'salida') {
                if ($product->stock_quantity < $quantity) {
                    throw new \Exception('Stock insuficiente');
                }
                $product->decrement('stock_quantity', $quantity);
            } else {
                $product->stock_quantity = $quantity;
                $product->save();
            }
            
            $product->refresh();
            
            $product->recordStockMovement(
                $type,
                $quantity,
                $reason ?? 'Ajuste manual de stock'
            );
            
            DB::commit();
            return $product;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getLowStockProducts($limit = 10)
    {
        return Product::with('category')
            ->lowStock()
            ->orderBy('stock_quantity')
            ->limit($limit)
            ->get();
    }

    public function getOutOfStockProducts($limit = 10)
    {
        return Product::with('category')
            ->outOfStock()
            ->orderBy('updated_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getInventoryValue()
    {
        return Product::active()->sum(DB::raw('stock_quantity * price'));
    }

    public function getStatistics()
    {
        return [
            'total_products' => Product::active()->count(),
            'total_value' => $this->getInventoryValue(),
            'low_stock_count' => Product::lowStock()->count(),
            'out_of_stock_count' => Product::outOfStock()->count(),
            'average_price' => Product::active()->avg('price'),
            'total_stock' => Product::active()->sum('stock_quantity')
        ];
    }
}