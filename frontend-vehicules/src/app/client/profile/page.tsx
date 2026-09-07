"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, CreditCard, ShieldCheck, Calendar, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    license_number: "",
    license_expiry: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        license_number: user.license_number || "",
        license_expiry: user.license_expiry || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/profile", formData);
      if (res.data?.user) {
        updateUser(res.data.user);
      }
      toast.success("Profil mis à jour avec succès !");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Mon Profil
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Gérez vos coordonnées personnelles et les informations de votre permis de conduire.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Colonne Gauche : Carte Récapitulative Profil */}
        <Card className="rounded-2xl border bg-card shadow-2xs overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary to-blue-600 relative" />
          <CardContent className="p-6 pt-0 relative space-y-4">
            <div className="-mt-12 flex justify-between items-end">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card border-4 border-card text-primary font-black text-2xl shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Compte vérifié
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground">{user?.name || "Client"}</h2>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>

            <div className="pt-2 border-t space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>Rôle : <strong className="text-foreground capitalize">{user?.role || "client"}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>{formData.phone || "Téléphone non renseigné"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{formData.address || "Adresse non renseignée"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary shrink-0" />
                <span>Permis : <strong className="text-foreground">{formData.license_number || "Non renseigné"}</strong></span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colonne Droite : Formulaire de Modification */}
        <Card className="lg:col-span-2 rounded-2xl border bg-card shadow-2xs">
          <CardHeader className="p-6 pb-4 border-b">
            <CardTitle className="text-lg font-bold">Modifier mes informations</CardTitle>
            <CardDescription className="text-xs">
              Ces informations sont utilisées pour valider vos contrats de location et vos factures.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Coordonnées personnelles */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-foreground">Nom complet</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 rounded-xl"
                      placeholder="Votre nom"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground">Adresse Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 rounded-xl"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground">Numéro de Téléphone</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 rounded-xl"
                      placeholder="+221 77 000 00 00"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground">Adresse de Résidence</label>
                    <Input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="mt-1 rounded-xl"
                      placeholder="Dakar, Sénégal"
                    />
                  </div>
                </div>
              </div>

              {/* Permis de conduire */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Permis de Conduire
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-foreground">Numéro de Permis</label>
                    <Input
                      type="text"
                      value={formData.license_number}
                      onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                      placeholder="Ex: SN-12345678"
                      className="mt-1 rounded-xl uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground">Date d'Expiration du Permis</label>
                    <Input
                      type="date"
                      value={formData.license_expiry}
                      onChange={(e) => setFormData({ ...formData, license_expiry: e.target.value })}
                      className="mt-1 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" disabled={loading} className="rounded-xl shadow-xs px-6">
                  {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
