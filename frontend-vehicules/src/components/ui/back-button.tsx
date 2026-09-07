"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
  variant?: "ghost" | "outline" | "secondary";
}

export function BackButton({
  href,
  label = "Retour",
  className = "",
  variant = "outline",
}: BackButtonProps) {
  const router = useRouter();

  const buttonContent = (
    <>
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      <span>{label}</span>
    </>
  );

  const baseClasses = `group inline-flex items-center gap-2 rounded-xl text-xs font-semibold h-9 px-3.5 transition-all shadow-2xs hover:bg-muted/80 ${className}`;

  if (href) {
    return (
      <Link href={href} className="inline-block">
        <Button variant={variant} size="sm" className={baseClasses} type="button">
          {buttonContent}
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={() => router.back()}
      className={baseClasses}
      type="button"
    >
      {buttonContent}
    </Button>
  );
}
