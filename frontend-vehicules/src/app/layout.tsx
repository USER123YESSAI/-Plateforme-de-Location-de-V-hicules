import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { TermsUpdateModal } from "@/components/legal/TermsUpdateModal";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Toumaï Drive - Plateforme de Location de Véhicules",
  description: "Louez le véhicule parfait pour votre prochain voyage avec Toumaï Drive au Tchad.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Toumaï Drive",
  },
  icons: {
    icon: "/toumai-drive-logo.jpg",
    apple: "/toumai-drive-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground pb-16 md:pb-0">
        <AuthProvider>
          {children}
          <MobileBottomNav />
          <TermsUpdateModal />
        </AuthProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
