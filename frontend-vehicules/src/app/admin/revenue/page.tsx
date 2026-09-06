"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminRevenuePage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueReport = async () => {
      try {
        const res = await api.get('/rentals/revenue-report');
        setReport(res.data.data || res.data);
      } catch (error) {
        console.error("[Location Express] Failed to fetch revenue report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenueReport();
  }, []);

  if (loading) return <div className="text-center py-10">Chargement du rapport financier...</div>;
  if (!report) return <div className="text-center py-10 text-muted-foreground">Impossible de charger le rapport financier.</div>;

  const overview = report.overview || {};
  const monthlyChart = report.monthly_chart || [];
  const topVehicles = report.top_performing_vehicles || [];
  const statusBreakdown = report.status_breakdown || [];
  const currency = report.currency || "FCFA";
  const formatNum = (val: number) => new Intl.NumberFormat('fr-FR').format(Math.round(val || 0));

  const monthNames = [
    "", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Rapports Financiers et Revenus</h1>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNum(overview.total_revenue)} {currency}</div>
            <p className="text-xs text-muted-foreground">Incluant locations & assurances</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Part Locations de base</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNum(overview.total_rental_only)} {currency}</div>
            <p className="text-xs text-muted-foreground">Hors options additionnelles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Assurances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNum(overview.total_insurance_revenue)} {currency}</div>
            <p className="text-xs text-muted-foreground">Généré par les options d'assurance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Panier Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNum(overview.average_order_value)} {currency}</div>
            <p className="text-xs text-muted-foreground">Par commande finalisée</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenus Mensuels (Année en cours)</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyChart.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">Aucune donnée mensuelle.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mois</TableHead>
                    <TableHead className="text-right">Revenu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyChart.map((item: any) => (
                    <TableRow key={item.month}>
                      <TableCell className="font-medium">{monthNames[item.month] || `Mois ${item.month}`}</TableCell>
                      <TableCell className="text-right font-bold">{formatNum(item.total)} {currency}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Top Performing Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Véhicules Performants</CardTitle>
          </CardHeader>
          <CardContent>
            {topVehicles.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">Aucune location enregistrée.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Véhicule</TableHead>
                    <TableHead className="text-right">Revenu Généré</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topVehicles.map((vehicle: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{vehicle.brand} {vehicle.model}</TableCell>
                      <TableCell className="text-right font-bold text-green-600">{formatNum(vehicle.revenue)} {currency}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques par Statut de Location</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Statut</TableHead>
                <TableHead>Nombre de locations</TableHead>
                <TableHead className="text-right">Valeur cumulative</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statusBreakdown.map((item: any) => (
                <TableRow key={item.status}>
                  <TableCell className="capitalize font-medium">{item.status}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell className="text-right font-bold">{formatNum(item.value)} {currency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
