<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Inventory Management API',
        'version' => '1.0.0',
        'endpoints' => [
            'api' => '/api',
            'health' => '/api/health',
            'documentation' => 'https://documentation-url.com'
        ]
    ]);
});