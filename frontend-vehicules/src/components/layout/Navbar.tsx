"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Car,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/vehicles", label: "Véhicules" },
    { href: "/#features", label: "Avantages" },
    { href: "/#how-it-works", label: "Comment ça marche" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/#")) {
      return false;
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-blue-600 to-indigo-600 text-white shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
              <Car className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Location Express
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary/10 text-primary font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {user && user.role === "client" && (
              <Link
                href="/client/my-rentals"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname?.startsWith("/client/my-rentals")
                    ? "bg-primary/10 text-primary font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                Mes Locations
              </Link>
            )}
          </nav>
        </div>

        {/* User / Auth Actions Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Badge Utilisateur */}
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-2xs">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <User className="h-3 w-3" />
                </div>
                <span>Bonjour, <strong className="font-semibold">{user.name}</strong></span>
                <span className={`ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  user.role === "admin"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                }`}>
                  {user.role === "admin" ? "Admin" : "Client"}
                </span>
              </div>

              {/* Bouton Admin Dashboard */}
              {user.role === "admin" ? (
                <Link href="/admin/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground font-medium transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/client/profile">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 hover:bg-muted font-medium transition-all"
                  >
                    <User className="h-4 w-4" />
                    Mon Profil
                  </Button>
                </Link>
              )}

              {/* Bouton Déconnexion */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Déconnexion</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium hover:bg-primary/10 hover:text-primary transition-all"
                >
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-blue-600 text-white font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:opacity-95 transition-all duration-200"
                >
                  S&apos;inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground hover:bg-muted rounded-lg"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Navigation Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-lg px-4 pt-3 pb-6 shadow-lg transition-all animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {user && user.role === "client" && (
              <Link
                href="/client/my-rentals"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname?.startsWith("/client/my-rentals")
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                Mes Locations
              </Link>
            )}
          </nav>

          {/* Section Utilisateur / Auth Mobile */}
          <div className="mt-4 pt-4 border-t border-border/40">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  {user.role === "admin" ? (
                    <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-1.5 border-primary/30 text-primary"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/client/profile" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-1.5"
                      >
                        <User className="h-4 w-4" />
                        Mon Profil
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-md">
                    S&apos;inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
