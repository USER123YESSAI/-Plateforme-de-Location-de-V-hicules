"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Rental } from "@/types/rental";
import { PaymentMethod } from "@/types/payment";
import { toast } from "sonner";

export default function MyRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingRental, setPayingRental] = useState<Rental | null>(null);
  const [cancellingRentalId, setCancellingRentalId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [submittingCancel, setSubmittingCancel] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const { user } = useAuth();
  const router = useRouter();

  const fetchRentals = useCallback(async (statusVal = statusFilter, yearVal = yearFilter) => {
    setLoading(true);
    try {
      const response = await api.get('/my-rentals', {
        params: {
          status: statusVal !== 'all' ? statusVal : undefined,
          year: yearVal !== 'all' ? yearVal : undefined
        }
      });
      const data = response.data.data?.data || response.data.data || response.data;
      setRentals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("[Location Express] Failed to fetch user rentals:", error);
      toast.error("Impossible de récupérer vos locations");
      setRentals([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, yearFilter]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchRentals(statusFilter, yearFilter);
  }, [user, router, statusFilter, yearFilter, fetchRentals]);

  const confirmCancel = async () => {
    if (!cancellingRentalId) return;
    setSubmittingCancel(true);
    try {
      await api.patch(`/rentals/${cancellingRentalId}/cancel`);
      toast.success("Réservation annulée avec succès");
      setCancellingRentalId(null);
      fetchRentals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'annulation");
    } finally {
      setSubmittingCancel(false);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingRental) return;
    setSubmittingPayment(true);
    try {
      await api.post(`/rentals/${payingRental.id}/pay`, {
        payment_method: paymentMethod,
        transaction_id: `TX-${Date.now()}`
      });
      toast.success("Paiement effectué avec succès ! Votre réservation est confirmée.");
      setPayingRental(null);
      fetchRentals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors du règlement de la réservation");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const downloadInvoice = async (rentalId: number) => {
    const toastId = toast.loading("Génération de la facture en cours...");
    try {
      const response = await api.get(`/rentals/${rentalId}/invoice`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `facture-${rentalId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("Facture téléchargée avec succès", { id: toastId });
    } catch (error) {
      console.error("Failed to download invoice:", error);
      toast.error("Erreur lors du téléchargement de la facture", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Mes Locations</h1>
      
      <div className="flex flex-wrap items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Statut :</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-md text-sm bg-background"
          >
            <option value="all">Tous</option>
            <option value="pending">En attente (pending)</option>
            <option value="confirmed">Confirmé (confirmed)</option>
            <option value="active">Actif (active)</option>
            <option value="completed">Terminé (completed)</option>
            <option value="cancelled">Annulé (cancelled)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Année :</label>
          <select 
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="p-2 border rounded-md text-sm bg-background"
          >
            <option value="all">Toutes</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Chargement de vos locations...</div>
        ) : rentals.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Vous n&apos;avez aucune location.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Début</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">
                    {rental.vehicle?.brand} {rental.vehicle?.model}
                  </TableCell>
                  <TableCell>{new Date(rental.start_date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{new Date(rental.end_date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      rental.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      rental.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      rental.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' :
                      rental.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {rental.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold">{formatPrice(rental.total_amount)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {rental.status === 'pending' && (
                      <Button size="sm" variant="default" onClick={() => setPayingRental(rental)}>
                        Payer
                      </Button>
                    )}
                    {['pending', 'confirmed'].includes(rental.status) && (
                      <Button size="sm" variant="destructive" onClick={() => setCancellingRentalId(rental.id)}>
                        Annuler
                      </Button>
                    )}
                    {['confirmed', 'active', 'completed'].includes(rental.status) && (
                      <Button size="sm" variant="outline" onClick={() => downloadInvoice(rental.id)}>
                        Facture PDF
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Confirmation Modal pour Annulation */}
      {cancellingRentalId && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-lg max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-destructive">Confirmer l&apos;annulation</h3>
            <p className="text-sm text-muted-foreground">
              Êtes-vous certain de vouloir annuler cette réservation ? Cette action libérera immédiatement le véhicule.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCancellingRentalId(null)}
                disabled={submittingCancel}
              >
                Retour
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={confirmCancel}
                disabled={submittingCancel}
              >
                {submittingCancel ? "Annulation..." : "Oui, annuler la réservation"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {payingRental && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-lg max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold">Régler la location</h3>
            <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
              <div>Véhicule : <strong>{payingRental.vehicle?.brand} {payingRental.vehicle?.model}</strong></div>
              <div>Montant à payer : <strong className="text-primary">{formatPrice(payingRental.total_amount)}</strong></div>
            </div>
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Moyen de paiement</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full mt-1.5 p-2 border rounded-md bg-background text-sm"
                >
                  <option value="card">Carte bancaire (Visa / Mastercard)</option>
                  <option value="mobile_money">Mobile Money (Wave / Orange Money)</option>
                  <option value="bank_transfer">Virement bancaire</option>
                  <option value="cash">Espèces en agence</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setPayingRental(null)} disabled={submittingPayment}>
                  Fermer
                </Button>
                <Button type="submit" disabled={submittingPayment}>
                  {submittingPayment ? "Traitement..." : "Confirmer le paiement"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
