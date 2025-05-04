export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'owner' | 'admin' | 'customer';
  createdAt?: Date;
}

export interface Business {
  id?: string;
  ownerId: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  createdAt?: Date;
}

export interface AuthState {
  user: User | null;
  business: Business | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
