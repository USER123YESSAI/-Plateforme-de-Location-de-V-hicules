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
  terms_accepted?: boolean;
  terms_accepted_at?: string | null;
  terms_version?: string | null;
  terms_update_required?: boolean;
  created_at?: string;
  updated_at?: string;
}
