<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Category::withProductCount();
            
            if ($request->search) {
                $query->search($request->search);
            }
            
            $categories = $query->orderBy('name')->get();
            
            return response()->json([
                'success' => true,
                'data' => $categories,
                'message' => 'Categorías obtenidas exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener categorías: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'color' => 'nullable|string|size:7',
            'icon' => 'nullable|string|max:50'
        ]);
        
        DB::beginTransaction();
        
        try {
            $category = Category::create($request->all());
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'data' => $category,
                'message' => 'Categoría creada exitosamente'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear categoría: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $category = Category::with(['products' => function($query) {
                $query->active()->latest()->limit(10);
            }])->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $category,
                'message' => 'Categoría obtenida exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada: ' . $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string',
            'color' => 'nullable|string|size:7',
            'icon' => 'nullable|string|max:50'
        ]);
        
        DB::beginTransaction();
        
        try {
            $category = Category::findOrFail($id);
            $category->update($request->all());
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'data' => $category,
                'message' => 'Categoría actualizada exitosamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar categoría: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        
        try {
            $category = Category::findOrFail($id);
            
            // Verificar si tiene productos asociados
            if ($category->products()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar la categoría porque tiene productos asociados'
                ], 400);
            }
            
            $category->delete();
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Categoría eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar categoría: ' . $e->getMessage()
            ], 500);
        }
    }
}