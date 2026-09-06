"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientVehiclesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/vehicles");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Redirection vers le catalogue complet...</span>
      </div>
    </div>
  );
}
