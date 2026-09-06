import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
  const cleanPath = path.replace(/^\/?storage\//, "").replace(/^\//, "");
  return `${baseUrl}/storage/${cleanPath}`;
}

export function formatPrice(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "0 FCFA";
  const num = typeof amount === "number" ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, ""));
  if (isNaN(num)) return `${amount} FCFA`;
  return `${new Intl.NumberFormat('fr-FR').format(num)} FCFA`;
}

