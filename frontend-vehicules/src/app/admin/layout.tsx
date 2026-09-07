"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Car,
  CalendarCheck,
  LayoutDashboard,
  Users,
  CreditCard,
  Tags,
  TrendingUp,
  LogOut,
  Globe,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "admin") router.push("/vehicles");
    }
  }, [user, loading, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Vérification des droits administrateur...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/admin/vehicles", label: "Véhicules", icon: Car },
    { href: "/admin/rentals", label: "Locations", icon: CalendarCheck },
    { href: "/admin/clients", label: "Clients", icon: Users },
    { href: "/admin/payments", label: "Paiements", icon: CreditCard },
    { href: "/admin/categories", label: "Catégories", icon: Tags },
    { href: "/admin/revenue", label: "Rapports Financiers", icon: TrendingUp },
  ];

  const isNavActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-muted/20">
      {/* TopBar Mobile */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-background border-b z-30 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <span className="font-bold text-base bg-gradient-to-r from-amber-600 to-primary bg-clip-text text-transparent">
            Admin Panel
          </span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5"
          aria-label="Ouvrir le menu administration"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {/* Backdrop Mobile Drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-xs z-40 animate-in fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Admin (Desktop fixe + Mobile Drawer) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-background border-r flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* En-tête Sidebar */}
          <div className="p-6 border-b flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white shadow-md shadow-primary/20">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-foreground block leading-tight">
                  Toumaï Drive
                </span>
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Administration
                </span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const active = isNavActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Pied de Sidebar : Profil Admin & Déconnexion */}
        <div className="p-4 border-t space-y-3">
          <Link
            href="/"
            className="flex items-center px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <span>Voir le site public</span>
          </Link>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 shrink-0">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                  Admin Principal
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 h-full">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
