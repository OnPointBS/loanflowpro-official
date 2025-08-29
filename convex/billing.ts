import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";

// Create a Stripe checkout session
export const createCheckoutSession = action({
  args: {
    workspaceId: v.id("workspaces"),
    priceId: v.string(),
    successUrl: v.string(),
    cancelUrl: v.string(),
  },
  handler: async (ctx, { workspaceId, priceId, successUrl, cancelUrl }) => {
    // Get workspace details
    const workspace = await ctx.runQuery(api.workspaces.get, { workspaceId });
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // For now, return a mock checkout session
    // In production, this would integrate with Stripe
    const mockSessionId = `cs_mock_${Date.now()}`;
    
    return {
      sessionId: mockSessionId,
      url: `${successUrl}?session_id=${mockSessionId}`,
    };
  },
});

// Handle Stripe webhook
export const webhookHandler = action({
  args: {
    signature: v.string(),
    payload: v.string(),
  },
  handler: async (ctx, { signature, payload }) => {
    // For now, this is a placeholder
    // In production, this would verify the webhook signature and process events
    
    console.log("Webhook received:", { signature, payload });
    
    return { success: true };
  },
});

// Create subscription record
export const createSubscription = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    plan: v.union(v.literal("starter"), v.literal("team")),
    interval: v.union(v.literal("monthly"), v.literal("yearly")),
    status: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    trialEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const subscriptionId = await ctx.db.insert("subscriptions", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return subscriptionId;
  },
});

// Get subscription by workspace
export const getByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .first();
  },
});

// Update subscription
export const updateSubscription = mutation({
  args: {
    subscriptionId: v.id("subscriptions"),
    status: v.optional(v.string()),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, { subscriptionId, ...updates }) => {
    const subscription = await ctx.db.get(subscriptionId);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    await ctx.db.patch(subscriptionId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return subscriptionId;
  },
});
