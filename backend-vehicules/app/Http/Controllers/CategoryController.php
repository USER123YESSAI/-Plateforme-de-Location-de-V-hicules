<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Liste simple des catégories pour les menus déroulants ou filtres
     */
    public function index()
    {
        // On récupère les catégories avec le compte des véhicules associés
        $categories = Category::withCount('vehicles')->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Création d'une catégorie (Admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:categories,name|max:255',
            'description' => 'nullable|string'
        ]);

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Catégorie créée',
            'category' => $category
        ], 201);
    }
    /**
 * Détail d'une catégorie avec ses véhicules
 */
public function show($id)
{
    // On récupère la catégorie avec ses véhicules disponibles
    $category = Category::with(['vehicles' => function($query) {
    $query->where('status', 'available')->orderBy('daily_rate', 'asc');
}])->find($id);

    if (!$category) {
        return response()->json([
            'success' => false,
            'message' => 'Catégorie non trouvée'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $category
    ]);
}
}