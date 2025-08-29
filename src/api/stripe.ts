import { stripeService } from '../services/stripe';

export async function handleCreateCheckoutSession(request: Request): Promise<Response> {
  try {
    const { workspaceId, plan, interval, seats } = await request.json();
    
    if (!workspaceId || !plan || !interval) {
      return new Response('Missing required parameters', { status: 400 });
    }

    const result = await stripeService.createCheckoutSession({
      workspaceId,
      plan,
      interval,
      seats,
    });
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return new Response('Failed to create checkout session', { status: 500 });
  }
}

export async function handleCreatePortalSession(request: Request): Promise<Response> {
  try {
    const { workspaceId } = await request.json();
    
    if (!workspaceId) {
      return new Response('Missing workspace ID', { status: 400 });
    }

    const result = await stripeService.createPortalSession({
      workspaceId,
    });
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Stripe portal session error:', error);
    return new Response('Failed to create portal session', { status: 500 });
  }
}

export async function handleCreateSeatAddon(request: Request): Promise<Response> {
  try {
    const { workspaceId, additionalSeats } = await request.json();
    
    if (!workspaceId || !additionalSeats) {
      return new Response('Missing required parameters', { status: 400 });
    }

    const result = await stripeService.createSeatAddonSession(workspaceId, additionalSeats);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Stripe seat addon error:', error);
    return new Response('Failed to create seat addon session', { status: 500 });
  }
}
