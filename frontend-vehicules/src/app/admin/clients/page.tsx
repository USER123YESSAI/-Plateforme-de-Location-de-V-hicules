"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientRentals, setSelectedClientRentals] = useState<any[]>([]);
  const [showRentals, setShowRentals] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await api.get('/clients');
      setClients(response.data.data || response.data || []);
    } catch (error) {
      console.error("[Location Express] Failed to fetch clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Supprimer ce client ?")) {
      try {
        await api.delete(`/clients/${id}`);
        fetchClients();
      } catch (error) {
        alert("Erreur de suppression");
      }
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
      alert("Erreur lors de la récupération des locations");
      setSelectedClientRentals([]);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Gestion des Clients</h1>
      
      {showRentals && (
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Locations du client</h2>
            <Button variant="outline" onClick={() => setShowRentals(false)}>Fermer</Button>
          </div>
          {selectedClientRentals.length === 0 ? (
            <p className="text-muted-foreground">Aucune location pour ce client</p>
          ) : (
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
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.vehicle?.brand} {r.vehicle?.model}</TableCell>
                    <TableCell>{new Date(r.start_date).toLocaleDateString()} - {new Date(r.end_date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatPrice(r.total_price || r.total_amount)}</TableCell>
                    <TableCell>{r.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
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
              <TableRow><TableCell colSpan={7} className="text-center">Chargement...</TableCell></TableRow>
            ) : clients.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center">Aucun client trouvé</TableCell></TableRow>
            ) : clients.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone || '-'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    c.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {c.role}
                  </span>
                </TableCell>
                <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/admin/clients/${c.id}/edit`}>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => viewClientRentals(c.id)}>Voir Locations</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)} disabled={c.role === 'admin'}>Supprimer</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
