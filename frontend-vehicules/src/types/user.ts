export type UserRole = 'admin' | 'client';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  license_number?: string;
  license_expiry?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}
