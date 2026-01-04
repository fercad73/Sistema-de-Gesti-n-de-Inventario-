<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Product::with('category')
                ->active()
                ->search($request->search)
                ->byCategory($request->category_id)
                ->byStockStatus($request->stock_status);

            // Ordenación
            $sortField = $request->sort_field ?? 'created_at';
            $sortDirection = $request->sort_direction ?? 'desc';
            $query->orderBy($sortField, $sortDirection);

            // Paginación
            $perPage = $request->per_page ?? 15;
            $products = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => ProductResource::collection($products),
                'pagination' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                ],
                'message' => 'Productos obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(StoreProductRequest $request)
    {
        DB::beginTransaction();
        
        try {
            $data = $request->validated();
            
            // Manejar subida de imagen
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('products', 'public');
                $data['image_url'] = Storage::url($imagePath);
            }
            
            $product = Product::create($data);
            
            // Registrar movimiento inicial si hay stock
            if ($product->stock_quantity > 0) {
                $product->recordStockMovement(
                    'entrada',
                    $product->stock_quantity,
                    'Stock inicial del producto'
                );
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'data' => new ProductResource($product->load('category')),
                'message' => 'Producto creado exitosamente'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear producto: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $product = Product::with(['category', 'stockMovements.user'])->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => new ProductResource($product),
                'message' => 'Producto obtenido exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado: ' . $e->getMessage()
            ], 404);
        }
    }

    public function update(UpdateProductRequest $request, $id)
    {
        DB::beginTransaction();
        
        try {
            $product = Product::findOrFail($id);
            $data = $request->validated();
            
            // Guardar stock anterior para calcular diferencia
            $oldStock = $product->stock_quantity;
            
            // Manejar subida de imagen
            if ($request->hasFile('image')) {
                // Eliminar imagen anterior si existe
                if ($product->image_url) {
                    $oldImage = str_replace('/storage/', '', $product->image_url);
                    Storage::disk('public')->delete($oldImage);
                }
                
                $imagePath = $request->file('image')->store('products', 'public');
                $data['image_url'] = Storage::url($imagePath);
            }
            
            $product->update($data);
            
            // Registrar movimiento si el stock cambió
            $newStock = $product->stock_quantity;
            $stockDifference = $newStock - $oldStock;
            
            if ($stockDifference != 0) {
                $type = $stockDifference > 0 ? 'entrada' : 'salida';
                $reason = $request->reason ?? 'Actualización manual de stock';
                
                $product->recordStockMovement(
                    $type,
                    abs($stockDifference),
                    $reason
                );
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'data' => new ProductResource($product->load('category')),
                'message' => 'Producto actualizado exitosamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar producto: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        
        try {
            $product = Product::findOrFail($id);
            
            // Soft delete
            $product->delete();
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar producto: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer',
            'type' => 'required|in:entrada,salida,ajuste',
            'reason' => 'nullable|string|max:255'
        ]);
        
        DB::beginTransaction();
        
        try {
            $product = Product::findOrFail($id);
            $oldStock = $product->stock_quantity;
            
            if ($request->type === 'entrada') {
                $product->increment('stock_quantity', $request->quantity);
            } elseif ($request->type === 'salida') {
                if ($product->stock_quantity < $request->quantity) {
                    throw new \Exception('Stock insuficiente');
                }
                $product->decrement('stock_quantity', $request->quantity);
            } else {
                $product->stock_quantity = $request->quantity;
                $product->save();
            }
            
            $product->refresh();
            
            // Registrar movimiento
            $product->recordStockMovement(
                $request->type,
                $request->quantity,
                $request->reason ?? 'Ajuste manual de stock'
            );
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'data' => new ProductResource($product->load('category')),
                'message' => 'Stock actualizado exitosamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar stock: ' . $e->getMessage()
            ], 500);
        }
    }

    public function lowStock(Request $request)
    {
        try {
            $products = Product::with('category')
                ->lowStock()
                ->paginate($request->per_page ?? 15);
            
            return response()->json([
                'success' => true,
                'data' => ProductResource::collection($products),
                'message' => 'Productos con stock bajo obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos con stock bajo: ' . $e->getMessage()
            ], 500);
        }
    }

    public function statistics()
    {
        try {
            $totalProducts = Product::active()->count();
            $totalValue = Product::active()->sum(DB::raw('stock_quantity * price'));
            $lowStockCount = Product::lowStock()->count();
            $outOfStockCount = Product::outOfStock()->count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'total_products' => $totalProducts,
                    'total_value' => round($totalValue, 2),
                    'low_stock_count' => $lowStockCount,
                    'out_of_stock_count' => $outOfStockCount
                ],
                'message' => 'Estadísticas obtenidas exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }
}