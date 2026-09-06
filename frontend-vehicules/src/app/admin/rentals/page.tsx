"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Rental, RentalStatus } from "@/types/rental";
import { toast } from "sonner";

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
      <h1 className="text-3xl font-bold tracking-tight">Gestion des Locations</h1>
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
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
              <TableRow><TableCell colSpan={7} className="text-center py-8">Chargement des locations...</TableCell></TableRow>
            ) : rentals.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Aucune location trouvée</TableCell></TableRow>
            ) : rentals.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.id}</TableCell>
                <TableCell className="font-medium">{r.user?.name || 'Client Inconnu'}</TableCell>
                <TableCell>{r.vehicle?.brand} {r.vehicle?.model}</TableCell>
                <TableCell>{new Date(r.start_date).toLocaleDateString('fr-FR')} - {new Date(r.end_date).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell className="font-bold">{formatPrice(r.total_amount)}</TableCell>
                <TableCell>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
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
                <TableCell className="text-right space-x-2">
                  <Link href={`/admin/rentals/${r.id}/edit`}>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </Link>
                  <select 
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value as RentalStatus)}
                    className="text-xs p-1.5 border rounded-md bg-background"
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Modal */}
      {actionConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-lg max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-destructive">
              {actionConfirm.type === 'cancel' ? "Confirmer l'annulation" : "Confirmer la suppression"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {actionConfirm.type === 'cancel' 
                ? "Êtes-vous certain de vouloir annuler cette location ? Le véhicule sera immédiatement libéré." 
                : "Êtes-vous certain de vouloir supprimer définitivement cette location de l'historique ?"}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActionConfirm(null)}
                disabled={submittingAction}
              >
                Retour
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleConfirmAction}
                disabled={submittingAction}
              >
                {submittingAction ? "Traitement..." : "Confirmer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
