import { Document } from 'mongoose';

// User Types
export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'seeker' | 'owner' | 'admin';
  profilePicture?: string;
  dateOfBirth?: Date;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  isVerified: boolean;
  stripeAccountId?: string;
  stripeConnected: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Property Types
export interface IProperty extends Document {
  _id: string;
  ownerId: string;
  propertyName: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  propertyType: 'PG' | 'Hostel' | 'Flat';
  amenities: string[];
  images: string[];
  rules: string[];
  isActive: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Room Types
export interface IRoom extends Document {
  _id: string;
  propertyId: string;
  roomNumber: string;
  roomType: 'Single' | 'Double' | 'Triple' | 'Dormitory';
  price: number;
  securityDeposit: number;
  capacity: number;
  currentOccupancy: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  availableFrom: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Booking Types
export interface IBooking extends Document {
  _id: string;
  seekerId: string;
  ownerId: string;
  propertyId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalAmount: number;
  securityDeposit: number;
  platformCommission: number;
  bookingStatus: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentIntentId?: string;
  paymentMethod?: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface IReview extends Document {
  _id: string;
  seekerId: string;
  ownerId: string;
  propertyId: string;
  bookingId: string;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

// Message Types
export interface IMessage extends Document {
  _id: string;
  conversationId: string;
  fromUser: string;
  toUser: string;
  propertyId?: string;
  text: string;
  read: boolean;
  metadata: {
    deliveredAt?: Date;
    seenAt?: Date;
  };
  createdAt: Date;
}

// Payout Types
export interface IPayout extends Document {
  _id: string;
  ownerId: string;
  stripePayoutId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  details: any;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export interface INotification extends Document {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'message' | 'system';
  read: boolean;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Stripe Types
export interface StripeConnectAccount {
  accountId: string;
  onboardingUrl: string;
  connected: boolean;
}

// Socket Events
export interface SocketEvents {
  'join-room': (roomId: string) => void;
  'leave-room': (roomId: string) => void;
  'send-message': (data: { conversationId: string; text: string }) => void;
  'typing': (data: { conversationId: string; isTyping: boolean }) => void;
  'booking-request': (data: { bookingId: string; propertyId: string }) => void;
  'booking-update': (data: { bookingId: string; status: string }) => void;
  'new-message': (data: { message: IMessage }) => void;
  'notification': (data: { notification: INotification }) => void;
}

// Search Filters
export interface SearchFilters {
  city?: string;
  amenities?: string[];
  priceMin?: number;
  priceMax?: number;
  lat?: number;
  lng?: number;
  radius?: number;
  propertyType?: string;
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

// Pagination
export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
