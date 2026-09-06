"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Vehicle } from "@/types/vehicle";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getImageUrl, formatPrice } from "@/lib/utils";

export default function ClientVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/vehicles/available');
        setVehicles(response.data.data || response.data || []);
      } catch (error) {
        console.error("[Location Express] Failed to fetch vehicles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Véhicules Disponibles</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">Chargement des véhicules...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicles.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Aucun véhicule disponible pour le moment.
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted relative">
                  {vehicle.image ? (
                    <img 
                      src={getImageUrl(vehicle.image) || ""} 
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover bg-muted"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      {vehicle.brand} {vehicle.model}
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{vehicle.brand} {vehicle.model}</CardTitle>
                  <p className="text-sm text-muted-foreground">{vehicle.year} • {vehicle.category?.name || 'Catégorie standard'}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">{formatPrice(vehicle.daily_rate)}</span>
                    <span className="text-sm text-muted-foreground">/jour</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/client/vehicles/${vehicle.id}`} className="w-full">
                    <Button className="w-full">Réserver / Détails</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
