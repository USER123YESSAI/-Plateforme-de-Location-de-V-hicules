"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ChevronRight,
} from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Détection du scroll pour adapter le style de la navbar sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu mobile lors du changement de page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isScrolled
          ? "border-b border-border/80 bg-background/95 backdrop-blur-md shadow-sm"
          : "border-b border-border/40 bg-background/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 1. Logo & Marque (Gauche) */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl"
            aria-label="Toumaï Drive - Retour à l'accueil"
          >
            <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-md shadow-primary/20 border border-border/50 bg-white group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300 shrink-0">
              <Image
                src="/toumai-drive-logo.jpg"
                alt="Logo Toumaï Drive"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Toumaï Drive
            </span>
          </Link>
        </div>

        {/* 2. Navigation Desktop (Centrée - équilibre les espacements horizontaux) */}
        <nav
          className="hidden md:flex items-center justify-center gap-1 lg:gap-1.5"
          aria-label="Navigation principale"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  active
                    ? "bg-blue-50 text-blue-600 font-semibold shadow-xs dark:bg-blue-950/50 dark:text-blue-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {user && user.role === "client" && (
            <Link
              href="/client/my-rentals"
              className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                pathname?.startsWith("/client/my-rentals")
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-xs dark:bg-blue-950/50 dark:text-blue-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              Mes Locations
            </Link>
          )}
        </nav>

        {/* 3. Actions Utilisateur / Auth Desktop (Droite) */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Badge Utilisateur connecté */}
              <div className="flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium text-foreground">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <User className="h-3 w-3" />
                </div>
                <span className="truncate max-w-[130px] font-medium">
                  {user.name}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                    user.role === "admin"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {user.role === "admin" ? "Admin" : "Client"}
                </span>
              </div>

              {/* Accès Espace / Dashboard */}
              {user.role === "admin" ? (
                <Link href="/admin/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 flex items-center gap-1.5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground font-medium transition-all duration-150"
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
                    className="h-9 flex items-center gap-1.5 hover:bg-muted font-medium transition-all duration-150"
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
                className="h-9 flex items-center gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline text-xs">Déconnexion</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Action Secondaire : Connexion (texte sobre / bouton discret) */}
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Connexion
              </Link>

              {/* Action Principale : S'inscrire (bouton bleu affirmé avec ombre légère) */}
              <Link href="/register">
                <Button
                  size="sm"
                  className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow hover:shadow-blue-600/20 active:scale-[0.99] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  S&apos;inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* 4. Bouton Menu Hamburger Mobile (SVG - pas d'emoji) */}
        <div className="flex md:hidden items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground hover:bg-muted rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={mobileMenuOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground transition-transform duration-200" />
            ) : (
              <Menu className="h-6 w-6 text-foreground transition-transform duration-200" />
            )}
          </Button>
        </div>
      </div>

      {/* 5. Tiroir / Menu Mobile Déroulant */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl px-4 pt-3 pb-6 shadow-xl transition-all animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1" aria-label="Navigation mobile">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-600 font-semibold dark:bg-blue-950/50 dark:text-blue-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <ChevronRight className="h-4 w-4 text-blue-600" />}
                </Link>
              );
            })}

            {user && user.role === "client" && (
              <Link
                href="/client/my-rentals"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname?.startsWith("/client/my-rentals")
                    ? "bg-blue-50 text-blue-600 font-semibold dark:bg-blue-950/50 dark:text-blue-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span>Mes Locations</span>
                <ChevronRight className="h-4 w-4 text-blue-600" />
              </Link>
            )}
          </nav>

          {/* Actions Auth / Profil Mobile */}
          <div className="mt-4 pt-4 border-t border-border/50">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-2 py-1 bg-muted/40 rounded-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-foreground truncate">
                      {user.name}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {user.role === "admin" ? "Administrateur" : "Client"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  {user.role === "admin" ? (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-1.5 border-primary/30 text-primary h-10"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      href="/client/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-1.5 h-10"
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
                    className="w-full flex items-center justify-center gap-1.5 text-destructive hover:bg-destructive/10 h-10"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full h-10 font-medium hover:bg-muted"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/20">
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
