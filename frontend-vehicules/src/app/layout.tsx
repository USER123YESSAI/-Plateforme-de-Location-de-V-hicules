import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { TermsUpdateModal } from "@/components/legal/TermsUpdateModal";

export const metadata: Metadata = {
  title: "Location Express - Plateforme de Location de Véhicules",
  description: "Louez le véhicule parfait pour votre prochain voyage.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <AuthProvider>
          {children}
          <TermsUpdateModal />
        </AuthProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
