"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { DashboardStats } from "@/types/dashboard";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      const res = await api.get('/vehicles/stats');
      const data = res.data.data || res.data;
      setStats(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("[Location Express] Failed to fetch dashboard statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Rafraîchir toutes les 30 secondes pour les données en temps réel
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        {lastUpdate && (
          <span className="text-sm text-muted-foreground">
            Dernière mise à jour : {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-10">Chargement des statistiques...</div>
      ) : stats ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Total Véhicules</h3>
              <p className="text-2xl font-bold mt-2">{stats.total_vehicles || 0}</p>
            </div>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Prix Moyen/Jour</h3>
              <p className="text-2xl font-bold mt-2">{formatPrice(stats.pricing_overview?.avg_daily || 0)}</p>
            </div>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Kilométrage Moyen</h3>
              <p className="text-2xl font-bold mt-2">{stats.technical_stats?.average || 0} km</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Répartition par Statut</h3>
              <div className="space-y-2">
                {stats.status_distribution?.map((item: any) => (
                  <div key={item.status} className="flex justify-between">
                    <span className="capitalize">{item.status}</span>
                    <span className="font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Répartition par Catégorie</h3>
              <div className="space-y-2">
                {stats.category_distribution?.map((item: any) => (
                  <div key={item.name} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-bold">{item.vehicles_count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Répartition par Carburant</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.fuel_distribution?.map((item: any) => (
                <div key={item.fuel_type} className="text-center">
                  <div className="text-2xl font-bold">{item.count}</div>
                  <div className="text-sm text-muted-foreground capitalize">{item.fuel_type}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-muted-foreground">Impossible de charger les statistiques</div>
      )}
    </div>
  );
}
