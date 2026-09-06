<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Statistiques des véhicules les plus loués
     */
    public function vehicleStatistics(Request $request)
    {
        if (auth('api')->user()->role !== 'admin') {
            return response()->json(['message' => 'Action non autorisée'], 403);
        }
        $period = $request->period ?? 'all'; // Changement par défaut

        $query = Rental::selectRaw('
            vehicle_id,
            COUNT(*) as rental_count,
            SUM(total_amount) as total_revenue,
            AVG(total_days) as avg_duration
        ')
        // Élargir le statut pour inclure les locations confirmées
        ->whereIn('status', ['confirmed', 'completed']);

        // Filtres de date optionnels
        if ($period === 'month') {
            $query->whereMonth('created_at', now()->month)
                  ->whereYear('created_at', now()->year);
        } elseif ($period === 'year') {
            $query->whereYear('created_at', now()->year);
        }
        // Si 'all', on ne met pas de filtre de date

        $stats = $query->groupBy('vehicle_id')
            ->orderByDesc('rental_count')
            ->limit(10)
            ->get();

        $stats->load('vehicle:id,brand,model,license_plate');

        return response()->json([
            'success' => true,
            'data' => [
                'most_rented' => $stats,
                'period' => $period,
                'total_revenue' => round($stats->sum('total_revenue'), 2),
                'total_rentals' => (int) $stats->sum('rental_count')
            ]
        ]);
    }

    public function singleVehicleStats($id)
    {
        if (auth('api')->user()->role !== 'admin') {
            return response()->json(['message' => 'Action non autorisée'], 403);
        }
        // 1. On récupère le véhicule avec le compte de ses locations
        $vehicle = Vehicle::withCount('rentals')->find($id);

        if (!$vehicle) {
            return response()->json(['message' => 'Véhicule non trouvé'], 404);
        }

        // 2. On calcule le revenu total uniquement pour les locations confirmées/terminées
        $totalRevenue = \App\Models\Rental::where('vehicle_id', $id)
            ->whereIn('status', ['confirmed', 'completed'])
            ->sum('total_amount');

        // 3. On calcule la durée moyenne de location
        $avgDuration = \App\Models\Rental::where('vehicle_id', $id)
            ->whereIn('status', ['confirmed', 'completed'])
            ->avg('total_days');

        return response()->json([
            'success' => true,
            'data' => [
                'vehicle' => "{$vehicle->brand} {$vehicle->model}",
                'license_plate' => $vehicle->license_plate,
                'total_rentals' => $vehicle->rentals_count,
                'total_revenue' => (float) $totalRevenue,
                'average_duration_days' => round($avgDuration, 1),
                'current_status' => $vehicle->status
            ]
        ]);
    }

    public function revenueReport(Request $request)
    {
        if (auth('api')->user()->role !== 'admin') {
            return response()->json(['message' => 'Action non autorisée'], 403);
        }
        $year = $request->year ?? now()->year;

        // Revenus mensuels pour le graphique (agnostique du SGBD)
        $rentals = Rental::whereYear('created_at', $year)
            ->whereIn('status', ['confirmed', 'completed'])
            ->get();

        $monthlyRevenue = $rentals->groupBy(function ($val) {
            return \Carbon\Carbon::parse($val->created_at)->format('m');
        })->map(function ($row, $month) {
            return [
                'month'        => (int) $month,
                'revenue'      => $row->sum('total_amount'),
                'rental_count' => $row->count(),
            ];
        })->sortBy('month')->values();

        // Statistiques globales de l'année
        $yearlyStats = [
            'total_annual_revenue' => $monthlyRevenue->sum('revenue'),
            'total_annual_rentals' => $monthlyRevenue->sum('rental_count'),
            'average_monthly_revenue' => $monthlyRevenue->count() > 0 ? $monthlyRevenue->avg('revenue') : 0
        ];

        return response()->json([
            'success' => true,
            'year' => $year,
            'data' => [
                'summary' => $yearlyStats,
                'monthly_breakdown' => $monthlyRevenue,
                'currency' => 'FCFA'
            ]
        ]);
    }
}