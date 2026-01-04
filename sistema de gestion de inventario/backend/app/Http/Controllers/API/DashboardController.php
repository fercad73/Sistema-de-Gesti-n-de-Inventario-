<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function statistics()
    {
        try {
            // Estadísticas generales
            $totalProducts = Product::active()->count();
            $totalCategories = Category::count();
            $totalUsers = User::count();
            
            // Valor total del inventario
            $totalValue = Product::active()->sum(DB::raw('stock_quantity * price'));
            
            // Productos con stock bajo y agotados
            $lowStockProducts = Product::lowStock()->count();
            $outOfStockProducts = Product::outOfStock()->count();
            
            // Movimientos hoy
            $todayMovements = StockMovement::whereDate('movement_date', today())->count();
            
            // Productos más vendidos (mayores salidas)
            $topProducts = StockMovement::select('product_id', DB::raw('SUM(quantity_change) as total_salidas'))
                ->where('type', 'salida')
                ->whereDate('movement_date', '>=', now()->subDays(30))
                ->groupBy('product_id')
                ->orderBy('total_salidas', 'desc')
                ->limit(5)
                ->with('product')
                ->get();
            
            // Categorías con más productos
            $topCategories = Category::withCount('products')
                ->orderBy('products_count', 'desc')
                ->limit(5)
                ->get();
            
            // Movimientos por tipo (últimos 30 días)
            $movementsByType = StockMovement::select('type', DB::raw('COUNT(*) as count'))
                ->whereDate('movement_date', '>=', now()->subDays(30))
                ->groupBy('type')
                ->get();
            
            // Evolución del valor del inventario (últimos 7 días)
            $inventoryValueTrend = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i)->toDateString();
                $value = Product::whereDate('created_at', '<=', $date)
                    ->sum(DB::raw('stock_quantity * price'));
                
                $inventoryValueTrend[] = [
                    'date' => $date,
                    'value' => round($value, 2)
                ];
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'total_products' => $totalProducts,
                    'total_categories' => $totalCategories,
                    'total_users' => $totalUsers,
                    'total_value' => round($totalValue, 2),
                    'low_stock_products' => $lowStockProducts,
                    'out_of_stock_products' => $outOfStockProducts,
                    'today_movements' => $todayMovements,
                    'top_products' => $topProducts,
                    'top_categories' => $topCategories,
                    'movements_by_type' => $movementsByType,
                    'inventory_value_trend' => $inventoryValueTrend
                ],
                'message' => 'Estadísticas del dashboard obtenidas exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }

    public function recentActivity()
    {
        try {
            $activities = StockMovement::with(['product', 'user'])
                ->latest('movement_date')
                ->limit(15)
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $activities,
                'message' => 'Actividad reciente obtenida exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener actividad reciente: ' . $e->getMessage()
            ], 500);
        }
    }

    public function alerts()
    {
        try {
            $lowStockAlerts = Product::with('category')
                ->lowStock()
                ->limit(10)
                ->get();
            
            $outOfStockAlerts = Product::with('category')
                ->outOfStock()
                ->limit(10)
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'low_stock_alerts' => $lowStockAlerts,
                    'out_of_stock_alerts' => $outOfStockAlerts
                ],
                'message' => 'Alertas obtenidas exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener alertas: ' . $e->getMessage()
            ], 500);
        }
    }
}