<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use App\Models\Vehicle;
use App\Models\Category;
use App\Enums\VehicleStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class VehicleController extends Controller
{
    /**
     * Liste des véhicules avec FILTRAGE (Public & Admin)
     */
    public function index(Request $request)
    {
        $query = Vehicle::with('category');

        // Filtre recherche par texte (marque ou modèle)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('brand', 'LIKE', "%{$search}%")
                  ->orWhere('model', 'LIKE', "%{$search}%");
            });
        }

        // Filtres simples
        if ($request->filled('category_id')) $query->where('category_id', $request->category_id);
        if ($request->filled('transmission')) $query->where('transmission', $request->transmission);
        if ($request->filled('fuel_type')) $query->where('fuel_type', $request->fuel_type);
        if ($request->filled('seats')) $query->where('seats', $request->seats);

        // Filtres de prix
        if ($request->filled('min_price')) $query->where('daily_rate', '>=', $request->min_price);
        if ($request->filled('max_price')) $query->where('daily_rate', '<=', $request->max_price);

        // Filtre de disponibilité par dates 
        if ($request->filled(['start_date', 'end_date'])) {
            $query->whereDoesntHave('rentals', function ($q) use ($request) {
                $q->whereNotIn('status', ['cancelled', 'completed'])
                  ->where(function ($inner) use ($request) {
                      $inner->where('start_date', '<=', $request->end_date)
                            ->where('end_date', '>=', $request->start_date);
                  });
            });
        }

        $user = null;
        try {
            if (request()->bearerToken()) {
                $user = auth('api')->user();
            }
        } catch (\Throwable $e) {
            $user = null;
        }

        if ($user && $user->role === 'admin') {
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }
        } else {
            $query->where('status', VehicleStatus::AVAILABLE->value);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    /**
     * Création d'un véhicule (Admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand'         => 'required|string|max:255',
            'model'         => 'required|string|max:255',
            'year'          => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'license_plate' => 'required|string|unique:vehicles', 
            'category_id'   => 'required|exists:categories,id',
            'daily_rate'    => 'required|numeric|min:0',
            'fuel_type'     => 'required|in:essence,diesel,electric,hybrid',
            'transmission'  => 'required|in:manual,automatic',
            'seats'         => 'required|integer|min:1',
            'mileage'       => 'required|integer|min:0',
            'status'        => 'required|in:available,rented,maintenance,unavailable',
            'image'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096', 
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('vehicles', 'public');
        }

        $vehicle = Vehicle::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Véhicule créé avec succès', 
            'vehicle' => $vehicle->load('category')
        ], 201);
    }

    /**
     * Détails d'un véhicule (Public)
     */
    public function show($id)
    {
        $vehicle = Vehicle::with('category')->find($id);
        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Véhicule non trouvé'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data'    => $vehicle
        ]);
    }

    /**
     * Mise à jour d'un véhicule (Admin)
     */
    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $validated = $request->validate([
            'brand'         => 'sometimes|string|max:255',
            'model'         => 'sometimes|string|max:255',
            'year'          => 'sometimes|integer|min:1900|max:' . (date('Y') + 1),
            'license_plate' => 'sometimes|string|unique:vehicles,license_plate,' . $vehicle->id,
            'category_id'   => 'sometimes|exists:categories,id',
            'daily_rate'    => 'sometimes|numeric|min:0',
            'fuel_type'     => 'sometimes|in:essence,diesel,electric,hybrid',
            'transmission'  => 'sometimes|in:manual,automatic',
            'seats'         => 'sometimes|integer|min:1',
            'mileage'       => 'sometimes|integer|min:0',
            'status'        => 'sometimes|in:available,rented,maintenance,unavailable',
            'image'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096'
        ]);
    
        if ($request->hasFile('image')) {
            $newImage = $request->file('image')->store('vehicles', 'public');
            if ($vehicle->image) {
                Storage::disk('public')->delete($vehicle->image);
            }
            $validated['image'] = $newImage;
        }
    
        $vehicle->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Mise à jour réussie', 
            'vehicle' => $vehicle->load('category')
        ]);
    }

    /**
     * Suppression d'un véhicule (Admin)
     */
    public function destroy($id)
    {
        $vehicle = Vehicle::findOrFail($id);

        // Si le véhicule a des réservations actives, bloquer la suppression
        $hasActiveRentals = $vehicle->rentals()
            ->whereIn('status', ['confirmed', 'active'])
            ->exists();

        if ($hasActiveRentals) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer un véhicule ayant des locations en cours ou confirmées.'
            ], 422);
        }
        
        $vehicle->delete();

        return response()->json([
            'success' => true,
            'message' => 'Véhicule supprimé avec succès'
        ]);
    }

    /**
     * Historique des locations du véhicule (Admin)
     */
    public function vehicleHistory($vehicleId)
    {
        $rentals = Rental::with('user')
            ->where('vehicle_id', $vehicleId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success'    => true,
            'vehicle_id' => $vehicleId, 
            'history'    => $rentals
        ]);
    }

    /**
     * Liste des véhicules disponibles (Public)
     */
    public function disponible()
    {
        $vehicles = Vehicle::with('category')
            ->where('status', VehicleStatus::AVAILABLE->value)
            ->orderBy('brand')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $vehicles
        ]);
    }

    /**
     * Statistiques globales de la flotte (Admin)
     */
    public function getVehicleStats()
    {
        $byStatus = Vehicle::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        $byFuel = Vehicle::select('fuel_type', DB::raw('count(*) as count'))
            ->groupBy('fuel_type')
            ->get();

        $byCategory = Category::withCount('vehicles')->get(['name', 'vehicles_count']);

        $mileageStats = [
            'average'              => round((float) Vehicle::avg('mileage'), 0),
            'highest'              => Vehicle::max('mileage') ?: 0,
            'total_fleet_distance' => Vehicle::sum('mileage') ?: 0
        ];

        $pricingStats = [
            'min_daily' => Vehicle::min('daily_rate') ?: 0,
            'max_daily' => Vehicle::max('daily_rate') ?: 0,
            'avg_daily' => round((float) Vehicle::avg('daily_rate'), 2),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'total_vehicles'        => Vehicle::count(),
                'status_distribution'   => $byStatus,
                'category_distribution' => $byCategory,
                'fuel_distribution'     => $byFuel,
                'technical_stats'       => $mileageStats,
                'pricing_overview'      => $pricingStats
            ]
        ]);
    }

    /**
     * Changer le statut d'un véhicule (Admin)
     */
    public function changeStatus(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:available,rented,maintenance,unavailable',
        ]);

        $vehicle->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour avec succès', 
            'vehicle' => $vehicle
        ]);
    }
}
