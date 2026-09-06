"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Rental, RentalStatus } from "@/types/rental";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SkeletonTable } from "@/components/ui/skeleton";

export default function AdminRentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionConfirm, setActionConfirm] = useState<{
    type: 'cancel' | 'delete';
    rentalId: number;
  } | null>(null);
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const response = await api.get('/rentals');
      const data = response.data.data || response.data;
      setRentals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("[Location Express] Failed to fetch rentals:", error);
      toast.error("Erreur lors de la récupération des locations");
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const updateStatus = async (id: number, status: RentalStatus) => {
    try {
      await api.put(`/rentals/${id}/status`, { status });
      toast.success(`Statut mis à jour vers "${status}"`);
      fetchRentals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du statut");
    }
  };

  const handleConfirmAction = async () => {
    if (!actionConfirm) return;
    setSubmittingAction(true);
    try {
      if (actionConfirm.type === 'cancel') {
        await api.patch(`/rentals/${actionConfirm.rentalId}/cancel`);
        toast.success("Location annulée avec succès");
      } else if (actionConfirm.type === 'delete') {
        await api.delete(`/rentals/${actionConfirm.rentalId}`);
        toast.success("Location supprimée avec succès");
      }
      setActionConfirm(null);
      fetchRentals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Une erreur est survenue");
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gestion des Locations</h1>
          <p className="text-sm text-muted-foreground">Suivez, validez et gérez toutes les locations de vos clients.</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Prix Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <SkeletonTable rows={5} columns={7} />
              ) : rentals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Aucune location enregistrée pour le moment.
                  </TableCell>
                </TableRow>
              ) : rentals.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">#{r.id}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap">{r.user?.name || 'Client Inconnu'}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.vehicle?.brand} {r.vehicle?.model}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(r.start_date).toLocaleDateString('fr-FR')} → {new Date(r.end_date).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell className="font-bold whitespace-nowrap">{formatPrice(r.total_amount)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      r.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      r.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      r.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      r.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' :
                      r.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {r.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/rentals/${r.id}/edit`}>
                        <Button variant="outline" size="sm">Modifier</Button>
                      </Link>
                      <select 
                        value={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value as RentalStatus)}
                        className="text-xs p-1.5 border rounded-md bg-background focus:ring-1 focus:ring-primary"
                        aria-label="Changer le statut"
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmé</option>
                        <option value="active">En cours</option>
                        <option value="completed">Terminé</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setActionConfirm({ type: 'cancel', rentalId: r.id })} 
                        disabled={r.status === 'cancelled' || r.status === 'completed'}
                      >
                        Annuler
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => setActionConfirm({ type: 'delete', rentalId: r.id })}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ConfirmDialog
        open={actionConfirm !== null}
        onOpenChange={(open) => {
          if (!open && !submittingAction) setActionConfirm(null);
        }}
        title={actionConfirm?.type === 'cancel' ? "Confirmer l'annulation" : "Confirmer la suppression"}
        description={
          actionConfirm?.type === 'cancel'
            ? "Êtes-vous certain de vouloir annuler cette location ? Le véhicule sera immédiatement libéré."
            : "Êtes-vous certain de vouloir supprimer définitivement cette location de l'historique ? Cette action est irréversible."
        }
        confirmText={actionConfirm?.type === 'cancel' ? "Annuler la location" : "Supprimer définitivement"}
        variant="destructive"
        loading={submittingAction}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
