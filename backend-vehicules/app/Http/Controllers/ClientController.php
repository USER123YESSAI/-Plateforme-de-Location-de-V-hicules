<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Liste des clients (Admin)
     */
    public function index()
    {
        $clients = User::where('role', 'client')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'count'   => $clients->count(),
            'data'    => $clients
        ]);
    }

    /**
     * Détail d'un client (Admin)
     */
    public function show($id)
    {
        $client = User::where('role', 'client')->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data'    => $client
        ]);
    }

    /**
     * Modifier un client (Admin)
     */
    public function update(Request $request, $id)
    {
        $client = User::where('role', 'client')->findOrFail($id);

        $validated = $request->validate([
            'name'           => 'sometimes|string|max:255',
            'email'          => 'sometimes|email|unique:users,email,' . $id,
            'phone'          => 'sometimes|string|max:20',
            'license_number' => 'sometimes|string|max:50',
            'license_expiry' => 'sometimes|date',
            'address'        => 'sometimes|string',
        ]);

        $client->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Informations du client mises à jour avec succès',
            'data'    => $client
        ]);
    }

    /**
     * Supprimer un client (Admin)
     */
    public function destroy($id)
    {
        $client = User::where('role', 'client')->findOrFail($id);
        
        if ($client->rentals()->whereIn('status', ['pending', 'confirmed', 'active'])->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer un client ayant des locations actives ou en attente.'
            ], 422);
        }

        $client->delete();

        return response()->json([
            'success' => true,
            'message' => 'Client supprimé de la plateforme avec succès'
        ]);
    }

    /**
     * Historique des locations d'un client (Admin)
     */
    public function rentals($id)
    {
        $client = User::with(['rentals' => function($query) {
            $query->orderBy('created_at', 'desc');
        }, 'rentals.vehicle'])->findOrFail($id);

        return response()->json([
            'success'     => true,
            'client_name' => $client->name,
            'history'     => $client->rentals
        ]);
    }
}