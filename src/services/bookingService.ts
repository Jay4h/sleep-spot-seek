import api from '@/api/axios';

export interface BookingData {
  seekerId: string;
  propertyId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
}

export const bookingService = {
  createPaymentIntent: async (booking: BookingData) => {
    const response = await api.post('/payments/create-intent', { booking });
    return response.data;
  },

  confirmBooking: async (bookingId: string) => {
    const response = await api.post(`/bookings/${bookingId}/confirm`);
    return response.data;
  },

  getUserBookings: async (userId: string) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },

  getOwnerBookings: async (ownerId: string) => {
    const response = await api.get(`/bookings/owner/${ownerId}`);
    return response.data;
  },

  cancelBooking: async (bookingId: string) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  },
};
