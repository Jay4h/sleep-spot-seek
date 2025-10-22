export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'seeker' | 'owner' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  amenities: string[];
  rules: string[];
  verified: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Room {
  id: string;
  propertyId: string;
  type: 'single' | 'double' | 'triple' | 'dormitory';
  rent: number;
  deposit: number;
  available: boolean;
  capacity: number;
  occupied: number;
  amenities: string[];
  images: string[];
}

export interface Booking {
  id: string;
  seekerId: string;
  roomId: string;
  propertyId: string;
  startDate: string;
  endDate?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  rent: number;
  deposit: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SearchFilters {
  city?: string;
  minRent?: number;
  maxRent?: number;
  roomType?: string;
  amenities?: string[];
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'newest';
}
