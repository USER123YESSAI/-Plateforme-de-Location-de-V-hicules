"use client";

import { useState } from "react";
import { getImageUrl } from "@/lib/utils";
import { Car } from "lucide-react";

interface VehicleImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
}

export function VehicleImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  containerClassName = "aspect-video bg-muted relative overflow-hidden",
}: VehicleImageProps) {
  const [error, setError] = useState(false);
  const imageUrl = !error && src ? getImageUrl(src) : null;

  return (
    <div className={containerClassName}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className={className}
          onError={() => setError(true)}
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-muted via-muted/80 to-muted/50 text-muted-foreground p-4 text-center">
          <Car className="h-10 w-10 opacity-35 mb-1.5" />
          <span className="text-xs font-semibold tracking-wide line-clamp-1">{alt}</span>
        </div>
      )}
    </div>
  );
}
