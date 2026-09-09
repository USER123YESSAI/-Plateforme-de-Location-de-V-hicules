"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Car, Search, CalendarCheck, User, Shield } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // On masque la barre sur les écrans d'authentification pleine page si désiré, ou on la garde pour naviguer
  const isAdmin = user?.role === "admin";

  const tabs = [
    {
      label: "Explorer",
      href: "/",
      icon: Car,
      isActive: pathname === "/" || (pathname?.startsWith("/vehicles") && pathname !== "/vehicles"),
    },
    {
      label: "Recherche",
      href: "/vehicles",
      icon: Search,
      isActive: pathname === "/vehicles",
    },
    {
      label: "Réservations",
      href: user ? "/client/my-rentals" : "/login",
      icon: CalendarCheck,
      isActive: pathname?.startsWith("/client/my-rentals"),
    },
    ...(isAdmin
      ? [
          {
            label: "Admin",
            href: "/admin/dashboard",
            icon: Shield,
            isActive: pathname?.startsWith("/admin"),
          },
        ]
      : [
          {
            label: user ? (user.name ? user.name.split(" ")[0] : "Profil") : "Profil",
            href: user ? "/client/profile" : "/login",
            icon: User,
            isActive:
              pathname?.startsWith("/client/profile") ||
              pathname === "/login" ||
              pathname === "/register",
          },
        ]),
  ];

  return (
    <nav
      aria-label="Navigation mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 transition-all"
    >
      <div className="flex items-center justify-around px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.isActive;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                active
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-colors ${
                  active ? "bg-primary/10" : ""
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    active ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"
                  }`}
                />
              </div>
              <span
                className={`text-[10.5px] mt-0.5 tracking-tight ${
                  active ? "font-bold text-primary" : "font-medium"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
