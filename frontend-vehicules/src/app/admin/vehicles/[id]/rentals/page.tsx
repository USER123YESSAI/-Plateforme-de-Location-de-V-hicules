"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export default function VehicleRentalsHistoryPage() {
  const params = useParams<{ id: string }>();
  const [history, setHistory] = useState<any[]>([]);
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vehicle details first for context header
        const vehicleRes = await api.get(`/vehicles/${params.id}`);
        setVehicle(vehicleRes.data.data || vehicleRes.data);

        // Fetch history
        const historyRes = await api.get(`/vehicles/${params.id}/rentals`);
        setHistory(historyRes.data.history || historyRes.data.data || []);
      } catch (error) {
        console.error("[Location Express] Failed to fetch vehicle rentals history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/admin/vehicles">
            <Button variant="outline" size="sm" className="mb-2">&larr; Retour aux véhicules</Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Historique des Locations {vehicle && `- ${vehicle.brand} ${vehicle.model} (${vehicle.license_plate})`}
          </h1>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Chargement de l'historique...</div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Aucune location enregistrée pour ce véhicule.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Email Client</TableHead>
                <TableHead>Date Début</TableHead>
                <TableHead>Date Fin</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Montant Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>{rental.id}</TableCell>
                  <TableCell className="font-medium">{rental.user?.name || "Client Inconnu"}</TableCell>
                  <TableCell>{rental.user?.email || "-"}</TableCell>
                  <TableCell>{new Date(rental.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(rental.end_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rental.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      rental.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      rental.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      rental.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {rental.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold">{formatPrice(rental.total_amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
