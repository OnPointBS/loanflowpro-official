import { loadStripe, Stripe } from '@stripe/stripe-js';
import { env } from '../env';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(env.STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export interface CreateCheckoutSessionParams {
  workspaceId: string;
  plan: 'solo' | 'team';
  interval: 'month' | 'year';
  seats?: number;
}

export interface CreatePortalSessionParams {
  workspaceId: string;
}

export class StripeService {
  async createCheckoutSession(params: CreateCheckoutSessionParams) {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Stripe checkout session error:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  async createPortalSession(params: CreatePortalSessionParams) {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Stripe portal session error:', error);
      throw new Error('Failed to create portal session');
    }
  }

  async createSeatAddonSession(workspaceId: string, additionalSeats: number) {
    try {
      const response = await fetch('/api/stripe/create-seat-addon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId,
          additionalSeats,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create seat addon session');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Stripe seat addon error:', error);
      throw new Error('Failed to create seat addon session');
    }
  }

  async redirectToCheckout(sessionId: string) {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw error;
    }
  }

  async redirectToPortal(portalUrl: string) {
    window.location.href = portalUrl;
  }
}

export const stripeService = new StripeService();
