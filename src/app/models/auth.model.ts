import { Business } from "./business.model";

export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'owner' | 'admin' | 'customer';
  createdAt?: Date;
}

export interface AuthState {
  user: User | null;
  business: Business | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
