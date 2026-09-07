"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Payment } from "@/types/payment";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SkeletonTable } from "@/components/ui/skeleton";
import { RotateCcw } from "lucide-react";

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gestion des Paiements</h1>
          <p className="text-sm text-muted-foreground">Consultez l'historique des transactions et gérez les remboursements.</p>
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
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <SkeletonTable rows={5} columns={9} />
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    Aucun paiement enregistré pour le moment.
                  </TableCell>
                </TableRow>
              ) : payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">#{payment.id}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    {payment.rental?.user?.name || "Client Supprimé"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {payment.rental?.vehicle ? `${payment.rental.vehicle.brand} ${payment.rental.vehicle.model}` : "Véhicule Supprimé"}
                  </TableCell>
                  <TableCell className="font-bold whitespace-nowrap">{formatPrice(payment.amount)}</TableCell>
                  <TableCell className="capitalize whitespace-nowrap">{payment.payment_method}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">{payment.transaction_id || "-"}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(payment.paid_at || payment.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
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
                      <Button size="sm" variant="destructive" onClick={() => setRefundingId(payment.id)} className="h-8 px-2.5 text-xs inline-flex items-center gap-1">
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Rembourser</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ConfirmDialog
        open={refundingId !== null}
        onOpenChange={(open) => {
          if (!open && !submittingRefund) setRefundingId(null);
        }}
        title="Confirmer le remboursement"
        description="Êtes-vous certain de vouloir rembourser ce paiement ? Cette action annulera la réservation et libérera immédiatement le véhicule dans la flotte."
        confirmText="Confirmer le remboursement"
        variant="destructive"
        loading={submittingRefund}
        onConfirm={confirmRefund}
      />
    </div>
  );
}
