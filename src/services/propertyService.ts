import api from '@/api/axios';

export interface PropertyFormData {
  propertyName: string;
  description: string;
  propertyType: 'PG' | 'Hostel' | 'Flat';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  amenities: string[];
  images: string[];
  rooms: RoomFormData[];
}

export interface RoomFormData {
  roomNumber: string;
  roomType: 'Single' | 'Double' | 'Triple' | 'Dormitory';
  price: number;
  securityDeposit: number;
  capacity: number;
  availableFrom: string;
  isAvailable: boolean;
  images: string[];
  amenities: string[];
}

export const propertyService = {
  createProperty: async (data: PropertyFormData) => {
    const response = await api.post('/properties', data);
    return response.data;
  },

  uploadImages: async (propertyId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    
    const response = await api.post(`/properties/${propertyId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getOwnerProperties: async (ownerId: string) => {
    const response = await api.get(`/properties/owner/${ownerId}`);
    return response.data;
  },

  getPropertyById: async (id: string) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  updateProperty: async (id: string, data: Partial<PropertyFormData>) => {
    const response = await api.put(`/properties/${id}`, data);
    return response.data;
  },

  deleteProperty: async (id: string) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
};
