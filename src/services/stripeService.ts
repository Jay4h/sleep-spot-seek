import api from '@/api/axios';

export const stripeService = {
  getConnectLink: async () => {
    const response = await api.get('/payments/connect-link');
    return response.data;
  },

  getPayouts: async (ownerId: string) => {
    const response = await api.get(`/payments/payouts?ownerId=${ownerId}`);
    return response.data;
  },

  getAnalytics: async (ownerId: string, from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    
    const response = await api.get(`/owner/${ownerId}/analytics?${params.toString()}`);
    return response.data;
  },

  exportAnalytics: async (ownerId: string, from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    
    const response = await api.get(`/owner/${ownerId}/analytics/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
