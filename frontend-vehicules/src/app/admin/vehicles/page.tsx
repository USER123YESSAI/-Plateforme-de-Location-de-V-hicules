"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { VehicleImage } from "@/components/ui/vehicle-image";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SkeletonTable } from "@/components/ui/skeleton";
import Link from "next/link";
import { Vehicle } from "@/types/vehicle";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, History, Edit, Trash2 } from "lucide-react";

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await api.get("/vehicles");
      const vehiclesData = response.data.data || response.data || [];
      setVehicles(vehiclesData);
      setFilteredVehicles(vehiclesData);
    } catch (error) {
      console.error("[Location Express] Failed to fetch vehicles:", error);
      toast.error("Impossible de charger les véhicules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredVehicles(vehicles);
    } else {
      setFilteredVehicles(vehicles.filter((v) => v.status === statusFilter));
    }
  }, [statusFilter, vehicles]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/vehicles/${deleteTarget.id}`);
      toast.success(`Le véhicule "${deleteTarget.brand} ${deleteTarget.model}" a été supprimé.`);
      setDeleteTarget(null);
      fetchVehicles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  const handleChangeStatus = async (id: number, status: string) => {
    try {
      await api.put(`/vehicles/${id}/status`, { status });
      toast.success("Statut mis à jour avec succès");
      fetchVehicles();
    } catch (error) {
      toast.error("Erreur lors du changement de statut");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Gestion de la Flotte</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez vos véhicules, disponibilités et tarifs journaliers.
          </p>
        </div>
        <Link href="/admin/vehicles/new">
          <Button className="flex items-center gap-2 shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Ajouter un Véhicule</span>
          </Button>
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-4 bg-card p-4 rounded-xl border shadow-xs">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filtrer par statut :</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border rounded-lg text-sm bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-hidden"
          >
            <option value="all">Tous les statuts</option>
            <option value="available">Disponible (available)</option>
            <option value="rented">En location (rented)</option>
            <option value="maintenance">En maintenance (maintenance)</option>
            <option value="unavailable">Indisponible (unavailable)</option>
          </select>
        </div>
        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tableau avec conteneur défilant pour mobile */}
      <div className="bg-card rounded-xl border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Immatriculation</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix/Jour</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <SkeletonTable rows={5} cols={7} />
                  </TableCell>
                </TableRow>
              ) : filteredVehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Aucun véhicule trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredVehicles.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <div className="w-16 h-11 rounded-lg overflow-hidden border bg-muted shrink-0">
                        <VehicleImage
                          src={v.image}
                          alt={`${v.brand} ${v.model}`}
                          containerClassName="w-full h-full relative"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-sm text-foreground">{v.brand} {v.model}</div>
                      <div className="text-xs text-muted-foreground">Année {v.year} • {v.fuel_type}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-muted-foreground">{v.license_plate}</TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 rounded-md text-xs bg-muted font-medium">
                        {v.category?.name || "Standard"}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-sm">{formatPrice(v.daily_rate)}</TableCell>
                    <TableCell>
                      <select
                        value={v.status}
                        onChange={(e) => handleChangeStatus(v.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                          v.status === "available"
                            ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                            : v.status === "rented"
                            ? "bg-blue-500/15 text-blue-600 border-blue-500/30"
                            : v.status === "maintenance"
                            ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                            : "bg-red-500/15 text-red-600 border-red-500/30"
                        }`}
                      >
                        <option value="available">Disponible</option>
                        <option value="rented">En location</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="unavailable">Indisponible</option>
                      </select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/admin/vehicles/${v.id}/rentals`}>
                          <Button variant="outline" size="sm" className="h-8 px-2.5" title="Historique des locations">
                            <History className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Link href={`/admin/vehicles/${v.id}/edit`}>
                          <Button variant="outline" size="sm" className="h-8 px-2.5" title="Modifier le véhicule">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(v)}
                          className="h-8 px-2.5 text-destructive hover:bg-destructive/10"
                          title="Supprimer le véhicule"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Confirmation de suppression moderne */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Supprimer ce véhicule ?"
        description={`Êtes-vous certain de vouloir supprimer définitivement ${deleteTarget?.brand} ${deleteTarget?.model} (${deleteTarget?.license_plate}) ? Cette action est irréversible.`}
        confirmText="Supprimer définitivement"
        cancelText="Conserver"
        variant="destructive"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
