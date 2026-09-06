"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role !== 'admin') router.push('/vehicles');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      <aside className="w-64 bg-background border-r flex flex-col h-full">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-primary">Location Express Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin/dashboard" className="block p-2 rounded hover:bg-accent text-sm font-medium">Tableau de bord</Link>
          <Link href="/admin/vehicles" className="block p-2 rounded hover:bg-accent text-sm font-medium">Véhicules</Link>
          <Link href="/admin/rentals" className="block p-2 rounded hover:bg-accent text-sm font-medium">Locations</Link>
          <Link href="/admin/clients" className="block p-2 rounded hover:bg-accent text-sm font-medium">Clients</Link>
          <Link href="/admin/payments" className="block p-2 rounded hover:bg-accent text-sm font-medium">Paiements</Link>
          <Link href="/admin/categories" className="block p-2 rounded hover:bg-accent text-sm font-medium">Catégories</Link>
          <Link href="/admin/revenue" className="block p-2 rounded hover:bg-accent text-sm font-medium">Rapports Financiers</Link>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={logout}>Déconnexion</Button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto h-full">
        {children}
      </main>
    </div>
  );
}
