import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get entitlements for a workspace
export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("entitlements")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .first();
  },
});

// Create default entitlements for a workspace
export const createDefault = mutation({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const entitlementsId = await ctx.db.insert("entitlements", {
      workspaceId,
      seats: 1,
      activeClients: 10,
      storageBytes: 1024 * 1024 * 100, // 100MB
      documentsHub: true,
      lenderExportBranding: false,
      customLinks: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return entitlementsId;
  },
});

// Update entitlements
export const update = mutation({
  args: {
    entitlementsId: v.id("entitlements"),
    seats: v.optional(v.number()),
    activeClients: v.optional(v.number()),
    storageBytes: v.optional(v.number()),
    documentsHub: v.optional(v.boolean()),
    lenderExportBranding: v.optional(v.boolean()),
    customLinks: v.optional(v.boolean()),
  },
  handler: async (ctx, { entitlementsId, ...updates }) => {
    const entitlements = await ctx.db.get(entitlementsId);
    if (!entitlements) {
      throw new Error("Entitlements not found");
    }

    await ctx.db.patch(entitlementsId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return entitlementsId;
  },
});

// Recompute entitlements based on subscription
export const recompute = mutation({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    // Get current subscription
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .first();

    if (!subscription) {
      return null;
    }

    // Get current entitlements
    const entitlements = await ctx.db
      .query("entitlements")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .first();

    if (!entitlements) {
      return null;
    }

    // Update based on plan
    const updates: any = {};
    
    if (subscription.plan === "starter") {
      updates.seats = 1;
      updates.activeClients = 10;
      updates.storageBytes = 1024 * 1024 * 100; // 100MB
      updates.documentsHub = true;
      updates.lenderExportBranding = false;
      updates.customLinks = false;
    } else if (subscription.plan === "team") {
      updates.seats = 5;
      updates.activeClients = 50;
      updates.storageBytes = 1024 * 1024 * 1024; // 1GB
      updates.documentsHub = true;
      updates.lenderExportBranding = true;
      updates.customLinks = true;
    }

    await ctx.db.patch(entitlements._id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return entitlements._id;
  },
});
