"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Vehicle } from "@/types/vehicle";
import { getImageUrl, formatPrice } from "@/lib/utils";

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vehicles');
      const vehiclesData = response.data.data || response.data || [];
      setVehicles(vehiclesData);
      setFilteredVehicles(vehiclesData);
    } catch (error) {
      console.error("[Location Express] Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredVehicles(vehicles);
    } else {
      setFilteredVehicles(vehicles.filter(v => v.status === statusFilter));
    }
  }, [statusFilter, vehicles]);

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchVehicles();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleChangeStatus = async (id: number, status: string) => {
    try {
      await api.put(`/vehicles/${id}/status`, { status });
      fetchVehicles();
    } catch (error) {
      alert('Erreur lors du changement de statut');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Véhicules</h1>
        <Link href="/admin/vehicles/new">
          <Button>Ajouter un Véhicule</Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filtrer par statut :</label>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">Tous</option>
          <option value="available">Disponible</option>
          <option value="rented">Loué</option>
          <option value="maintenance">Maintenance</option>
          <option value="unavailable">Indisponible</option>
        </select>
        <span className="text-sm text-muted-foreground">
          ({filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? 's' : ''})
        </span>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Marque & Modèle</TableHead>
              <TableHead>Immatriculation</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix/Jour</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-center">Chargement...</TableCell></TableRow>
            ) : filteredVehicles.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center">Aucun véhicule trouvé</TableCell></TableRow>
            ) : filteredVehicles.map((v) => (
              <TableRow key={v.id}>
                <TableCell>
                  {v.image ? (
                    <img 
                      src={getImageUrl(v.image) || ""} 
                      alt={`${v.brand} ${v.model}`}
                      className="w-16 h-12 object-cover rounded bg-muted"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                      N/A
                    </div>
                  )}
                </TableCell>
                <TableCell>{v.id}</TableCell>
                <TableCell className="font-medium">{v.brand} {v.model}</TableCell>
                <TableCell>{v.license_plate}</TableCell>
                <TableCell>{v.category?.name || '-'}</TableCell>
                <TableCell>{formatPrice(v.daily_rate)}</TableCell>
                <TableCell>
                  <select
                    value={v.status}
                    onChange={(e) => handleChangeStatus(v.id, e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-medium border cursor-pointer ${
                      v.status === 'available' ? 'bg-green-100 text-green-800 border-green-300' :
                      v.status === 'rented' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                      v.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                      'bg-red-100 text-red-800 border-red-300'
                    }`}
                  >
                    <option value="available" className="bg-background text-foreground text-sm">available</option>
                    <option value="rented" className="bg-background text-foreground text-sm">rented</option>
                    <option value="maintenance" className="bg-background text-foreground text-sm">maintenance</option>
                    <option value="unavailable" className="bg-background text-foreground text-sm">unavailable</option>
                  </select>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/admin/vehicles/${v.id}/rentals`}>
                    <Button variant="outline" size="sm">Historique</Button>
                  </Link>
                  <Link href={`/admin/vehicles/${v.id}/edit`}>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(v.id)}>Supprimer</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
