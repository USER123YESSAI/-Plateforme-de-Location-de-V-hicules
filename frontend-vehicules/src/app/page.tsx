"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { VehicleImage } from "@/components/ui/vehicle-image";
import { SkeletonCard } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Vehicle, Category } from "@/types/vehicle";
import { formatPrice } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Car,
  ShieldCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BadgePercent,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  // Widget recherche rapide
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [pickupAgency, setPickupAgency] = useState("Aéroport Hassan Djamous (NDJ)");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [vehRes, catRes] = await Promise.all([
          api.get("/vehicles/available"),
          api.get("/categories"),
        ]);
        const vehData = vehRes.data.data || vehRes.data || [];
        setFeaturedVehicles(Array.isArray(vehData) ? vehData.slice(0, 4) : []);

        const catData = catRes.data.data || catRes.data || [];
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoadingVehicles(false);
      }
    };
    loadInitialData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category_id", selectedCategory);
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);
    router.push(`/vehicles?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section avec Image de fond stylisée et dégradé */}
        <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-gradient-to-b from-primary/10 via-background to-background">
          <div className="container mx-auto px-4 text-center max-w-5xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 shadow-2xs animate-in fade-in slide-in-from-bottom-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Location de véhicules premium & grand public au Tchad</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
              Prenez le volant de <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                votre liberté
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Réservez en ligne en moins de 2 minutes. Flotte récente et révisée, assurance incluse, assistance 24/7 et annulation flexible.
            </p>

            {/* Widget de Recherche Rapide */}
            <div className="bg-card border rounded-2xl shadow-xl p-4 sm:p-6 max-w-4xl mx-auto text-left backdrop-blur-md">
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                {/* Agence de départ */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    Lieu de départ
                  </label>
                  <select
                    value={pickupAgency}
                    onChange={(e) => setPickupAgency(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-hidden"
                  >
                    <option value="Aéroport Hassan Djamous (NDJ)">Aéroport Hassan Djamous (NDJ)</option>
                    <option value="N'Djamena Centre-ville - Av. Charles de Gaulle">N&apos;Djamena Centre-ville - Av. Charles de Gaulle</option>
                    <option value="N'Djamena Sabangali">N&apos;Djamena Sabangali</option>
                    <option value="Moundou Centre">Moundou Centre</option>
                  </select>
                </div>

                {/* Catégorie */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Car className="h-3.5 w-3.5 text-primary" />
                    Catégorie
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-hidden"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Début - Fin
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="date"
                      min={today}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-11 px-2 rounded-lg border border-input bg-background text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-hidden w-full"
                    />
                    <input
                      type="date"
                      min={startDate || today}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-11 px-2 rounded-lg border border-input bg-background text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-hidden w-full"
                    />
                  </div>
                </div>

                {/* Bouton de recherche */}
                <div>
                  <Button
                    type="submit"
                    className="w-full h-11 font-semibold text-sm shadow-md bg-gradient-to-r from-primary to-blue-600 text-white hover:opacity-95 flex items-center justify-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>Trouver un véhicule</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Section Véhicules en vedette */}
        <section className="py-16 px-4 bg-muted/20 border-t">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Flotte récente</span>
                <h2 className="text-3xl font-extrabold tracking-tight mt-1">Véhicules Disponibles Immédiatement</h2>
              </div>
              <Link href="/vehicles" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                <span>Explorer tout le catalogue</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loadingVehicles ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : featuredVehicles.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border p-8">
                <Car className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-muted-foreground">Consultez notre catalogue complet pour voir tous les modèles.</p>
                <Link href="/vehicles" className="mt-4 inline-block">
                  <Button variant="outline">Voir les véhicules</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="group bg-card rounded-xl border overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative">
                        <VehicleImage
                          src={vehicle.image}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-background/85 backdrop-blur-md shadow-2xs">
                          {vehicle.category?.name || "Standard"}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {vehicle.brand} {vehicle.model}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="capitalize">{vehicle.transmission === "automatic" ? "Auto" : "Manuel"}</span>
                          <span>•</span>
                          <span className="capitalize">{vehicle.fuel_type}</span>
                          <span>•</span>
                          <span>{vehicle.seats} places</span>
                        </div>

                        <div className="pt-2 flex items-baseline gap-1">
                          <span className="text-xl font-extrabold text-primary">{formatPrice(vehicle.daily_rate)}</span>
                          <span className="text-xs text-muted-foreground">/jour</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <Link href={`/vehicles/${vehicle.id}`} className="w-full block">
                        <Button className="w-full font-medium" size="sm">
                          Réserver
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section Avantages */}
        <section id="features" className="py-20 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Pourquoi nous choisir</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
                L&apos;expérience de location sans mauvaise surprise
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-2xl border shadow-xs text-center space-y-3 hover:border-primary/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Car className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Flotte Récente & Contrôlée</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Tous nos véhicules sont révisés minutieusement après chaque location pour vous garantir confort et sécurité sur toutes les routes.
                </p>
              </div>

              <div className="bg-card p-6 rounded-2xl border shadow-xs text-center space-y-3 hover:border-primary/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <BadgePercent className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Tarifs 100% Transparents</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Zéro frais cachés. Le devis calculé en ligne inclut les assurances de base et correspond au prix exact facturé.
                </p>
              </div>

              <div className="bg-card p-6 rounded-2xl border shadow-xs text-center space-y-3 hover:border-primary/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Assistance & Support 7j/7</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Une équipe dédiée à votre disposition avant, pendant et après votre location, disponible 7j/7 par téléphone et WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Comment ça marche */}
        <section id="how-it-works" className="py-20 px-4 bg-muted/30 border-y">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Processus simple</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
                Comment réserver en 4 étapes ?
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-xl border relative shadow-2xs">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-base mb-4 shadow-xs">
                  1
                </div>
                <h4 className="text-lg font-bold mb-1">Choisissez votre véhicule</h4>
                <p className="text-sm text-muted-foreground">
                  Parcourez le catalogue et filtrez par catégorie, carburant et budget.
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl border relative shadow-2xs">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-base mb-4 shadow-xs">
                  2
                </div>
                <h4 className="text-lg font-bold mb-1">Sélectionnez vos dates</h4>
                <p className="text-sm text-muted-foreground">
                  Indiquez vos dates de départ et de retour ainsi que l&apos;agence de retrait.
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl border relative shadow-2xs">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-base mb-4 shadow-xs">
                  3
                </div>
                <h4 className="text-lg font-bold mb-1">Validez votre devis</h4>
                <p className="text-sm text-muted-foreground">
                  Vérifiez la disponibilité instantanée et confirmez votre réservation.
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl border relative shadow-2xs">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-base mb-4 shadow-xs">
                  4
                </div>
                <h4 className="text-lg font-bold mb-1">Prenez la route</h4>
                <p className="text-sm text-muted-foreground">
                  Récupérez vos clés en agence ou directement à l&apos;aéroport et profitez !
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Appel à l'action */}
        <section className="py-20 px-4 bg-gradient-to-tr from-primary via-blue-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Prêt pour votre prochain voyage ?
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Découvrez dès maintenant notre catalogue complet et profitez des meilleurs tarifs de location de véhicules au Tchad.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Link href="/vehicles">
                <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold shadow-md">
                  Voir tous les véhicules
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold border-white/40 text-white hover:bg-white hover:text-primary">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
