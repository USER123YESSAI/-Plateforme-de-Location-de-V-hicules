"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Scale,
  ShieldCheck,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export function TermsUpdateModal() {
  const { user, updateUser } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // N'afficher que si l'utilisateur est authentifié et qu'une mise à jour est requise
  if (!user || !user.terms_update_required) {
    return null;
  }

  const handleAccept = async () => {
    if (!accepted) {
      setError("Veuillez cocher la case pour confirmer votre acceptation.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/accept-terms", {
        terms_accepted: true,
      });

      if (response.data?.user) {
        updateUser(response.data.user);
        toast.success("Conditions acceptées avec succès.");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Erreur lors de la validation des conditions.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Mise à jour réglementaire
            </span>
            <h2 className="text-xl font-bold text-foreground">
              Nouvelles Conditions d’utilisation
            </h2>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Nous avons récemment mis à jour nos{" "}
          <strong className="text-foreground">Conditions d’utilisation</strong> et notre{" "}
          <strong className="text-foreground">Politique de confidentialité</strong>. Pour continuer à accéder à votre compte et réserver des véhicules sur la plateforme, veuillez prendre connaissance des documents et accepter la nouvelle version.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/conditions-utilisation"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl border bg-muted/30 hover:bg-muted/70 transition-colors text-xs font-medium text-foreground"
          >
            <span className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              Conditions d’utilisation
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>

          <Link
            href="/politique-confidentialite"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl border bg-muted/30 hover:bg-muted/70 transition-colors text-xs font-medium text-foreground"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Politique de confidentialité
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
        </div>

        {error && (
          <div className="p-3 text-xs text-red-900 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <label
          htmlFor="modal-terms-checkbox"
          className="flex items-start gap-3 p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer select-none"
        >
          <input
            id="modal-terms-checkbox"
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-xs text-foreground leading-relaxed">
            Je confirme avoir lu et j’accepte la nouvelle version des{" "}
            <strong>Conditions d’utilisation</strong> et de la{" "}
            <strong>Politique de confidentialité</strong>.
          </span>
        </label>

        <div className="pt-2">
          <Button
            onClick={handleAccept}
            disabled={loading || !accepted}
            className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-sm font-semibold shadow-md shadow-blue-500/20"
          >
            {loading ? (
              "Enregistrement..."
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Accepter et continuer
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
