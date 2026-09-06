"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Payment } from "@/types/payment";
import { toast } from "sonner";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundingId, setRefundingId] = useState<number | null>(null);
  const [submittingRefund, setSubmittingRefund] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/payments');
      setPayments(res.data.data || res.data || []);
    } catch (error) {
      console.error("[Location Express] Failed to fetch payments:", error);
      toast.error("Impossible de récupérer la liste des paiements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const confirmRefund = async () => {
    if (!refundingId) return;
    setSubmittingRefund(true);
    try {
      await api.post(`/payments/${refundingId}/refund`);
      toast.success("Paiement remboursé et réservation annulée avec succès");
      setRefundingId(null);
      fetchPayments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors du remboursement du paiement");
    } finally {
      setSubmittingRefund(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Paiements</h1>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Chargement des paiements...</div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Aucun paiement enregistré.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell className="font-medium">
                    {payment.rental?.user?.name || "Client Supprimé"}
                  </TableCell>
                  <TableCell>
                    {payment.rental?.vehicle ? `${payment.rental.vehicle.brand} ${payment.rental.vehicle.model}` : "Véhicule Supprimé"}
                  </TableCell>
                  <TableCell className="font-bold">{formatPrice(payment.amount)}</TableCell>
                  <TableCell className="capitalize">{payment.payment_method}</TableCell>
                  <TableCell className="font-mono text-xs">{payment.transaction_id || "-"}</TableCell>
                  <TableCell>{new Date(payment.paid_at || payment.created_at).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      payment.status === 'refunded' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      payment.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.status === 'completed' && (
                      <Button size="sm" variant="destructive" onClick={() => setRefundingId(payment.id)}>
                        Rembourser
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Confirmation Modal Remboursement */}
      {refundingId && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border shadow-lg max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-destructive">Confirmer le remboursement</h3>
            <p className="text-sm text-muted-foreground">
              Êtes-vous sûr de vouloir rembourser ce paiement ? Cette action annulera la réservation et libérera le véhicule dans la flotte.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setRefundingId(null)}
                disabled={submittingRefund}
              >
                Annuler
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={confirmRefund}
                disabled={submittingRefund}
              >
                {submittingRefund ? "Remboursement..." : "Confirmer le remboursement"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
