export interface Business {
  id?: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  ownerId: string;

  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };

  location: {
    lat: number;
    lng: number;
    address?: string;
  };

  whatsapp?: string;
  slug?: string;

  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
}
