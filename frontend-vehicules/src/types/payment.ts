import { Rental } from './rental';

export type PaymentMethod = 'card' | 'cash' | 'mobile_money' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: number;
  rental_id: number;
  amount: number;
  payment_method: PaymentMethod;
  transaction_id: string;
  status: PaymentStatus;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  rental?: Rental;
}
