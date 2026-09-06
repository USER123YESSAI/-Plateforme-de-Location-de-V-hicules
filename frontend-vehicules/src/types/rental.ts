import { Vehicle } from './vehicle';
import { User } from './user';

export type RentalStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface Insurance {
  id: number;
  name: string;
  description?: string;
  coverage?: string;
  daily_rate: number;
}

export interface Rental {
  id: number;
  user_id: number;
  vehicle_id: number;
  insurance_id?: number | null;
  start_date: string;
  end_date: string;
  pickup_location: string;
  return_location: string;
  notes?: string | null;
  status: RentalStatus;
  daily_rate: number;
  insurance_rate: number;
  total_days: number;
  subtotal: number;
  insurance_total: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
  user?: User;
  insurance?: Insurance;
}

export interface RentalSummary {
  total_rentals: number;
  total_spent: number;
}
