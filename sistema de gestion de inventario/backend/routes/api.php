<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\StockMovementController;
use App\Http\Controllers\API\DashboardController;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Productos
    Route::apiResource('products', ProductController::class);
    Route::post('/products/{id}/stock', [ProductController::class, 'updateStock']);
    Route::get('/products/low-stock', [ProductController::class, 'lowStock']);
    Route::get('/products/statistics', [ProductController::class, 'statistics']);
    
    // Categorías
    Route::apiResource('categories', CategoryController::class);
    
    // Movimientos de stock
    Route::apiResource('stock-movements', StockMovementController::class)->only(['index', 'show']);
    Route::get('/stock-movements/statistics', [StockMovementController::class, 'statistics']);
    Route::get('/stock-movements/recent', [StockMovementController::class, 'recentMovements']);
    
    // Dashboard
    Route::get('/dashboard/statistics', [DashboardController::class, 'statistics']);
    Route::get('/dashboard/recent-activity', [DashboardController::class, 'recentActivity']);
    Route::get('/dashboard/alerts', [DashboardController::class, 'alerts']);
});

// Ruta de verificación de salud
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toDateTimeString(),
        'service' => 'Inventory Management API',
        'version' => '1.0.0'
    ]);
});