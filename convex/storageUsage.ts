import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get storage usage for a workspace
export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("storageUsage")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .first();
  },
});

// Create initial storage usage record
export const createInitial = mutation({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const usageId = await ctx.db.insert("storageUsage", {
      workspaceId,
      bytes: 0,
      updatedAt: Date.now(),
    });

    return usageId;
  },
});

// Update storage usage
export const updateUsage = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    bytes: v.number(),
  },
  handler: async (ctx, { workspaceId, bytes }) => {
    // Get current usage record
    const usage = await ctx.db
      .query("storageUsage")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .first();

    if (usage) {
      // Update existing record
      await ctx.db.patch(usage._id, {
        bytes,
        updatedAt: Date.now(),
      });
      return usage._id;
    } else {
      // Create new record
      const usageId = await ctx.db.insert("storageUsage", {
        workspaceId,
        bytes,
        updatedAt: Date.now(),
      });
      return usageId;
    }
  },
});

// Calculate storage usage from documents
export const calculateFromDocuments = mutation({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    // Get all documents for the workspace
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .collect();

    // Calculate total bytes
    const totalBytes = documents.reduce((sum, doc) => sum + doc.fileSize, 0);

    // Update storage usage
    await ctx.db.patch(
      (await ctx.db
        .query("storageUsage")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
        .first())?._id!,
      {
        bytes: totalBytes,
        updatedAt: Date.now(),
      }
    );

    return totalBytes;
  },
});
