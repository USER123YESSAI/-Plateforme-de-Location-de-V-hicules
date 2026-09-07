"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Car,
  CalendarCheck,
  User,
  LogOut,
  Globe,
  Menu,
  X,
  Compass,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "client") router.push("/vehicles");
    }
  }, [user, loading, router]);

  // Fermer le menu mobile lors du changement d'URL
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading || !user || user.role !== "client") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Chargement de votre espace...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/client/vehicles", label: "Catalogue Véhicules", icon: Car, description: "Choisir et louer un véhicule" },
    { href: "/client/my-rentals", label: "Mes Locations", icon: CalendarCheck, description: "Historique & paiements" },
    { href: "/client/profile", label: "Mon Profil", icon: User, description: "Coordonnées & permis" },
  ];

  const getPageTitle = () => {
    if (pathname?.startsWith("/client/vehicles")) return "Catalogue Véhicules";
    if (pathname?.startsWith("/client/my-rentals")) return "Mes Locations";
    if (pathname?.startsWith("/client/profile")) return "Mon Profil";
    return "Espace Client";
  };

  const isNavActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Brand & Navigation */}
      <div className="flex flex-col">
        {/* En-tête Brand */}
        <div className="h-16 px-5 border-b flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-600 text-white shadow-md shadow-primary/20">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-foreground block leading-tight">
                Location Express
              </span>
              <span className="text-[11px] text-primary font-semibold tracking-wide flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Espace Client
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 text-muted-foreground hover:text-foreground"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Liens de navigation */}
        <nav className="p-3.5 space-y-1.5">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Navigation principale
          </div>
          {navItems.map((item) => {
            const active = isNavActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-lg ${active ? "bg-primary-foreground/15 text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="leading-tight">{item.label}</div>
                    <div className={`text-[10px] ${active ? "text-primary-foreground/80" : "text-muted-foreground/70"}`}>
                      {item.description}
                    </div>
                  </div>
                </div>
                {active && <ChevronRight className="h-4 w-4 text-primary-foreground" />}
              </Link>
            );
          })}

          <div className="pt-4 px-2">
            <Link href="/client/vehicles">
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-2 border-primary/25 text-primary hover:bg-primary/10 rounded-xl"
              >
                <Compass className="h-4 w-4" />
                <span>Trouver un véhicule</span>
              </Button>
            </Link>
          </div>
        </nav>
      </div>

      {/* Footer Sidebar : Utilisateur & Raccourcis */}
      <div className="p-3.5 border-t space-y-2.5 bg-muted/20">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>Voir le site public</span>
        </Link>

        {/* Profil Carte */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-xs shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : "C"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="p-1.5 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
            title="Se déconnecter"
            aria-label="Se déconnecter"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/15">
      {/* 1. SIDEBAR FIXE SUR DESKTOP (STICKY) */}
      <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 shrink-0 h-screen border-r bg-card z-30 sticky top-0">
        <SidebarContent />
      </aside>

      {/* 2. DRAWER MOBILE AVEC BACKDROP */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-xs z-40 animate-in fade-in duration-150"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-card border-r shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* 3. ZONE DE CONTENU PRINCIPALE (DÉFILEMENT INDÉPENDANT) */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* TopBar Header */}
        <header className="h-16 shrink-0 border-b bg-card/90 backdrop-blur-sm px-4 sm:px-6 lg:px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 -ml-1 text-muted-foreground hover:text-foreground"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                {getPageTitle()}
              </h1>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Espace Client</span>
                <span>/</span>
                <span className="text-foreground font-medium">{getPageTitle()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                <Globe className="h-3.5 w-3.5 mr-1.5" />
                Site public
              </Button>
            </Link>

            <Link href="/client/vehicles">
              <Button size="sm" className="text-xs flex items-center gap-1.5 shadow-xs">
                <Car className="h-3.5 w-3.5" />
                <span>Louer un véhicule</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Content Area défilant indépendamment */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
