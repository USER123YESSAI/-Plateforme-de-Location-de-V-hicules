"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Vehicle, Category } from "@/types/vehicle";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { getImageUrl, formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTransmission, setSelectedTransmission] = useState<string>("");
  const [selectedFuel, setSelectedFuel] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Récupération des catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        const data = res.data.data || res.data || [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Récupération des véhicules filtrés
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | undefined> = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory) params.category_id = selectedCategory;
      if (selectedTransmission) params.transmission = selectedTransmission;
      if (selectedFuel) params.fuel_type = selectedFuel;
      if (maxPrice) params.max_price = maxPrice;

      const response = await api.get('/vehicles', { params });
      const data = response.data.data || response.data || [];
      setVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("[Location Express] Failed to fetch vehicles:", error);
      toast.error("Impossible de charger les véhicules");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedTransmission, selectedFuel, maxPrice]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVehicles();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchVehicles]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedTransmission("");
    setSelectedFuel("");
    setMaxPrice("");
  };

  const hasActiveFilters = Boolean(search || selectedCategory || selectedTransmission || selectedFuel || maxPrice);

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Notre Flotte de Véhicules</h1>
            <p className="text-muted-foreground mt-1">
              Trouvez le véhicule idéal pour tous vos déplacements au meilleur prix.
            </p>
          </div>
          <div className="text-sm font-medium text-muted-foreground bg-card px-3.5 py-1.5 rounded-full border shadow-2xs self-start md:self-auto">
            {vehicles.length} véhicule{vehicles.length > 1 ? "s" : ""} disponible{vehicles.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* Barre de Recherche et Filtres */}
        <div className="bg-card p-5 rounded-xl border shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Recherche textuelle */}
            <div className="lg:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                Recherche par marque ou modèle
              </label>
              <Input
                type="text"
                placeholder="Ex: Peugeot, Toyota, Mercedes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background"
              />
            </div>

            {/* Sélecteur de catégorie */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Boîte de vitesses */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                Transmission
              </label>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Toutes</option>
                <option value="automatic">Automatique</option>
                <option value="manual">Manuelle</option>
              </select>
            </div>

            {/* Carburant */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                Carburant
              </label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Tous</option>
                <option value="essence">Essence</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Électrique</option>
                <option value="hybrid">Hybride</option>
              </select>
            </div>
          </div>

          {/* Deuxième rangée : Prix max et reset */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/50">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prix max/jour :</span>
              <div className="flex items-center gap-2">
                {[30000, 50000, 100000].map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => setMaxPrice(maxPrice === String(price) ? "" : String(price))}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                      maxPrice === String(price)
                        ? "bg-primary text-primary-foreground border-primary font-medium"
                        : "bg-background hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    &le; {formatPrice(price)}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        </div>

        {/* Grille de Véhicules */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 rounded-xl bg-card border animate-pulse" />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-card rounded-xl border p-12 text-center space-y-3 max-w-lg mx-auto">
            <div className="text-4xl">🚗</div>
            <h3 className="text-lg font-bold">Aucun véhicule ne correspond à vos critères</h3>
            <p className="text-sm text-muted-foreground">
              Modifiez vos critères de recherche ou réinitialisez les filtres pour découvrir d&apos;autres véhicules disponibles.
            </p>
            {hasActiveFilters && (
              <Button onClick={handleResetFilters} variant="outline" size="sm" className="mt-2">
                Effacer les filtres
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 group flex flex-col justify-between">
                <div>
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {vehicle.image ? (
                      <img 
                        src={getImageUrl(vehicle.image) || ""} 
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm font-medium">
                        {vehicle.brand} {vehicle.model}
                      </div>
                    )}
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-background/85 backdrop-blur-md shadow-2xs">
                      {vehicle.category?.name || "Standard"}
                    </span>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                      {vehicle.brand} {vehicle.model}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Année {vehicle.year}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Caractéristiques rapides */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-md bg-muted/60 capitalize">
                        {vehicle.transmission === "automatic" ? "Boîte Auto" : "Boîte Manuelle"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-muted/60 capitalize">
                        {vehicle.fuel_type}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-muted/60">
                        {vehicle.seats} places
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 pt-1 border-t border-border/40">
                      <span className="text-2xl font-extrabold text-primary">{formatPrice(vehicle.daily_rate)}</span>
                      <span className="text-xs text-muted-foreground">/jour</span>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-0">
                  <Link href={`/vehicles/${vehicle.id}`} className="w-full">
                    <Button className="w-full font-medium shadow-xs">
                      Voir & Réserver
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
