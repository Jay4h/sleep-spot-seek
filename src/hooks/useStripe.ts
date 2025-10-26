import { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useAuthStore } from '@/store/authStore';

const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...';

export const useStripe = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(STRIPE_PUBLISHABLE_KEY);
        setStripe(stripeInstance);
      } catch (err) {
        setError('Failed to load Stripe');
        console.error('Stripe initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  const createPaymentIntent = async (amount: number, currency: string = 'inr') => {
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency,
          userId: user?.id,
        }),
      });

      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (err) {
      console.error('Error creating payment intent:', err);
      throw err;
    }
  };

  const confirmPayment = async (clientSecret: string, paymentMethodId: string) => {
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId,
    });

    if (error) {
      throw error;
    }

    return paymentIntent;
  };

  const createSetupIntent = async () => {
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const response = await fetch('/api/payments/create-setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      });

      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (err) {
      console.error('Error creating setup intent:', err);
      throw err;
    }
  };

  const confirmSetupIntent = async (clientSecret: string, paymentMethodId: string) => {
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: paymentMethodId,
    });

    if (error) {
      throw error;
    }

    return setupIntent;
  };

  const createConnectAccount = async () => {
    try {
      const response = await fetch('/api/payments/create-connect-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
        }),
      });

      const { accountId, accountLink } = await response.json();
      return { accountId, accountLink };
    } catch (err) {
      console.error('Error creating connect account:', err);
      throw err;
    }
  };

  const getConnectAccountStatus = async () => {
    try {
      const response = await fetch('/api/payments/connect-account-status', {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error getting connect account status:', err);
      throw err;
    }
  };

  const getPayouts = async () => {
    try {
      const response = await fetch('/api/payments/payouts', {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error getting payouts:', err);
      throw err;
    }
  };

  return {
    stripe,
    loading,
    error,
    createPaymentIntent,
    confirmPayment,
    createSetupIntent,
    confirmSetupIntent,
    createConnectAccount,
    getConnectAccountStatus,
    getPayouts,
  };
};
