"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ClientVehicleDetailRedirect() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/vehicles/${params.id}`);
    } else {
      router.replace("/vehicles");
    }
  }, [router, params]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Chargement des détails du véhicule...</span>
      </div>
    </div>
  );
}
