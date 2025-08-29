import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    ownerUserId: v.id("users"),
  },
  handler: async (ctx, { name, ownerUserId }) => {
    // Create new workspace
    const workspaceId = await ctx.db.insert("workspaces", {
      name,
      ownerUserId,
      status: "active",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return workspaceId;
  },
});

// Get workspace by ID
export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db.get(workspaceId);
  },
});

// Get workspace by name
export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    return await ctx.db
      .query("workspaces")
      .withIndex("by_name", (q) => q.eq("name", name))
      .first();
  },
});

// Get workspaces by user ID (owner or member)
export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    // First get workspaces where user is the owner
    const ownedWorkspaces = await ctx.db
      .query("workspaces")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", userId))
      .collect();

    // Then get workspaces where user is a member
    const memberWorkspaces = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // Get the actual workspace data for member workspaces
    const memberWorkspaceIds = memberWorkspaces.map(m => m.workspaceId);
    const memberWorkspaceData = await Promise.all(
      memberWorkspaceIds.map(id => ctx.db.get(id))
    );

    // Combine and deduplicate
    const allWorkspaces = [...ownedWorkspaces, ...memberWorkspaceData.filter(Boolean)];
    return allWorkspaces;
  },
});
