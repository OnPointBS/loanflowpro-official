import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Get workspace settings
export const getWorkspaceSettings = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const workspace = await ctx.db.get(workspaceId);
    if (!workspace) {
      throw new ConvexError("Workspace not found");
    }

    return {
      name: workspace.name,
      timezone: workspace.timezone || 'America/New_York',
      dateFormat: workspace.dateFormat || 'MM/DD/YYYY',
      timeFormat: workspace.timeFormat || '12',
      currency: workspace.currency || 'USD',
      language: workspace.language || 'en',
      status: workspace.status,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };
  },
});

// Update workspace settings
export const updateWorkspaceSettings = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    updates: v.object({
      name: v.optional(v.string()),
      timezone: v.optional(v.string()),
      dateFormat: v.optional(v.string()),
      timeFormat: v.optional(v.string()),
      currency: v.optional(v.string()),
      language: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { workspaceId, updates }) => {
    // Check if user has permission to update workspace settings
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Check if user is workspace owner or has ADVISOR role
    const membership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (!membership || (membership.role !== "ADVISOR" && membership.status !== "active")) {
      throw new ConvexError("Insufficient permissions to update workspace settings");
    }

    // Update workspace
    await ctx.db.patch(workspaceId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get workspace integrations
export const getWorkspaceIntegrations = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    // For now, return mock data - this can be expanded later
    return [
      {
        id: 'google-vision',
        name: 'Google Cloud Vision API',
        description: 'OCR processing for documents',
        status: 'connected' as const,
        config: { apiKey: '***', region: 'us-central1' }
      },
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Payment processing and billing',
        status: 'connected' as const,
        config: { publishableKey: 'pk_***', webhookSecret: '***' }
      },
      {
        id: 'resend',
        name: 'Resend',
        description: 'Transactional email service',
        status: 'connected' as const,
        config: { apiKey: 're_***', domain: 'loanflowpro.com' }
      }
    ];
  },
});

// Toggle workspace integration
export const toggleWorkspaceIntegration = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    integrationId: v.string(),
    enabled: v.boolean(),
  },
  handler: async (ctx, { workspaceId, integrationId, enabled }) => {
    // Check if user has permission
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Check if user is workspace owner or has ADVISOR role
    const membership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (!membership || (membership.role !== "ADVISOR" && membership.status !== "active")) {
      throw new ConvexError("Insufficient permissions to manage integrations");
    }

    // For now, just return success - this can be expanded later with actual integration management
    return { success: true, integrationId, enabled };
  },
});
