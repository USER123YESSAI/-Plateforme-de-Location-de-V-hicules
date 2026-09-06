export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Vehicle {
  id: number;
  category_id: number;
  brand: string;
  model: string;
  license_plate: string;
  year: number;
  daily_rate: number;
  daily_price?: number; // Pour compatibilité avec l'ancien code
  registration_number?: string; // Pour compatibilité avec l'ancien code
  status: 'available' | 'rented' | 'maintenance' | 'unavailable';
  fuel_type: 'essence' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  seats: number;
  mileage: number;
  image?: string;
  category?: Category;
}
