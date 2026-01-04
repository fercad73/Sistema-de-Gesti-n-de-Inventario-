<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = StockMovement::with(['product', 'user'])
                ->latest('movement_date');
            
            // Filtros
            if ($request->type) {
                $query->where('type', $request->type);
            }
            
            if ($request->product_id) {
                $query->where('product_id', $request->product_id);
            }
            
            if ($request->start_date && $request->end_date) {
                $query->whereBetween('movement_date', [
                    $request->start_date,
                    $request->end_date
                ]);
            }
            
            if ($request->search) {
                $query->whereHas('product', function($q) use ($request) {
                    $q->where('name', 'like', "%{$request->search}%")
                      ->orWhere('sku', 'like', "%{$request->search}%");
                });
            }
            
            $perPage = $request->per_page ?? 20;
            $movements = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'data' => $movements,
                'pagination' => [
                    'current_page' => $movements->currentPage(),
                    'last_page' => $movements->lastPage(),
                    'per_page' => $movements->perPage(),
                    'total' => $movements->total(),
                ],
                'message' => 'Movimientos obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener movimientos: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $movement = StockMovement::with(['product', 'user'])->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $movement,
                'message' => 'Movimiento obtenido exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Movimiento no encontrado: ' . $e->getMessage()
            ], 404);
        }
    }

    public function statistics(Request $request)
    {
        try {
            $query = StockMovement::query();
            
            if ($request->start_date && $request->end_date) {
                $query->whereBetween('movement_date', [
                    $request->start_date,
                    $request->end_date
                ]);
            }
            
            $stats = $query->select(
                DB::raw('COUNT(*) as total_movements'),
                DB::raw('SUM(CASE WHEN type = "entrada" THEN quantity_change ELSE 0 END) as total_entradas'),
                DB::raw('SUM(CASE WHEN type = "salida" THEN quantity_change ELSE 0 END) as total_salidas'),
                DB::raw('COUNT(DISTINCT product_id) as products_affected')
            )->first();
            
            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Estadísticas de movimientos obtenidas exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }

    public function recentMovements()
    {
        try {
            $movements = StockMovement::with(['product', 'user'])
                ->latest('movement_date')
                ->limit(10)
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $movements,
                'message' => 'Movimientos recientes obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener movimientos recientes: ' . $e->getMessage()
            ], 500);
        }
    }
}