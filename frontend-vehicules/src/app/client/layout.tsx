"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role !== 'client') router.push('/vehicles');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'client') {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      <aside className="w-64 bg-background border-r flex flex-col h-full">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-primary">Location Express</h2>
          <p className="text-sm text-muted-foreground mt-1">Espace Client</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/client/vehicles" className="block p-2 rounded hover:bg-accent text-sm font-medium">
            Véhicules
          </Link>
          <Link href="/client/my-rentals" className="block p-2 rounded hover:bg-accent text-sm font-medium">
            Mes Locations
          </Link>
          <Link href="/client/profile" className="block p-2 rounded hover:bg-accent text-sm font-medium">
            Mon Profil
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Link href="/client/vehicles" className="block w-full mb-2">
            <Button variant="outline" className="w-full">Nouvelle Réservation</Button>
          </Link>
          <Button variant="ghost" className="w-full" onClick={logout}>Déconnexion</Button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto h-full">
        {children}
      </main>
    </div>
  );
}
