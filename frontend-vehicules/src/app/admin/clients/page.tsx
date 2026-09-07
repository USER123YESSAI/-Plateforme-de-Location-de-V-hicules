"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SkeletonTable } from "@/components/ui/skeleton";
import { Pencil, FileText, Trash2 } from "lucide-react";

export default function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientRentals, setSelectedClientRentals] = useState<any[]>([]);
  const [showRentals, setShowRentals] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await api.get('/clients');
      setClients(response.data.data || response.data || []);
    } catch (error) {
      console.error("[Location Express] Failed to fetch clients:", error);
      toast.error("Erreur lors de la récupération des clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/clients/${clientToDelete}`);
      toast.success("Client supprimé avec succès");
      setClientToDelete(null);
      fetchClients();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  const viewClientRentals = async (clientId: number) => {
    try {
      const response = await api.get(`/clients/${clientId}/rentals`);
      const rentalsData = response.data.data || response.data || [];
      setSelectedClientRentals(Array.isArray(rentalsData) ? rentalsData : []);
      setShowRentals(true);
    } catch (error) {
      console.error("[Location Express] Failed to fetch client rentals:", error);
      toast.error("Erreur lors de la récupération des locations du client");
      setSelectedClientRentals([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gestion des Clients</h1>
          <p className="text-sm text-muted-foreground">Consultez et gérez les comptes utilisateurs et leur historique.</p>
        </div>
      </div>
      
      {showRentals && (
        <div className="bg-card p-6 rounded-lg border shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Locations du client</h2>
            <Button variant="outline" size="sm" onClick={() => setShowRentals(false)}>Fermer</Button>
          </div>
          {selectedClientRentals.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">Aucune location trouvée pour ce client</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedClientRentals.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">#{r.id}</TableCell>
                      <TableCell className="font-medium whitespace-nowrap">{r.vehicle?.brand} {r.vehicle?.model}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(r.start_date).toLocaleDateString('fr-FR')} → {new Date(r.end_date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="font-bold whitespace-nowrap">{formatPrice(r.total_price || r.total_amount)}</TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-secondary">
                          {r.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Inscrit le</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <SkeletonTable rows={5} columns={7} />
              ) : clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Aucun client trouvé.
                  </TableCell>
                </TableRow>
              ) : clients.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">#{c.id}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap">{c.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{c.email}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{c.phone || '—'}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      c.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {c.role}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/admin/clients/${c.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs inline-flex items-center gap-1">
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Modifier</span>
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => viewClientRentals(c.id)} className="h-8 px-2.5 text-xs inline-flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        <span>Locations</span>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => setClientToDelete(c.id)} 
                        disabled={c.role === 'admin'}
                        className="h-8 px-2.5 text-xs inline-flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Supprimer</span>
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
        open={clientToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setClientToDelete(null);
        }}
        title="Confirmer la suppression"
        description="Êtes-vous certain de vouloir supprimer ce compte client ? Toutes ses données associées seront définitivement retirées."
        confirmText="Supprimer définitivement"
        variant="destructive"
        loading={deleting}
        onConfirm={confirmDeleteClient}
      />
    </div>
  );
}
