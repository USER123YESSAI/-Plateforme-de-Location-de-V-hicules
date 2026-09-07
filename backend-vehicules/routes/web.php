<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => config('app.name', 'Toumaï Drive API'),
        'status' => 'online',
        'health' => url('/api/health'),
        'api_docs' => url('/api/vehicles')
    ]);
});
