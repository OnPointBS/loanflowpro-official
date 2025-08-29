import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT")),
    status: v.union(v.literal("active"), v.literal("invited"), v.literal("removed")),
  },
  handler: async (ctx, { workspaceId, userId, role, status }) => {
    // Check if user is already a member
    const existingMember = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (existingMember) {
      return existingMember._id;
    }

    // Create new membership
    const membershipId = await ctx.db.insert("workspaceMembers", {
      workspaceId,
      userId,
      role,
      status,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return membershipId;
  },
});

// Get all memberships for a user
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const memberships = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // Get workspace details for each membership
    const membershipsWithWorkspace = await Promise.all(
      memberships.map(async (membership) => {
        const workspace = await ctx.db.get(membership.workspaceId);
        return {
          ...membership,
          workspace,
        };
      })
    );

    return membershipsWithWorkspace;
  },
});

// Get all members for a workspace
export const getByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const memberships = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // Get user details for each membership
    const membershipsWithUser = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db.get(membership.userId);
        return {
          ...membership,
          user,
        };
      })
    );

    return membershipsWithUser;
  },
});

// Get a specific membership
export const get = query({
  args: { 
    workspaceId: v.id("workspaces"), 
    userId: v.id("users") 
  },
  handler: async (ctx, { workspaceId, userId }) => {
    return await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
  },
});

// Get all workspaces for a user
export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const memberships = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // Get workspace details for each membership
    const workspaces = await Promise.all(
      memberships.map(async (membership) => {
        const workspace = await ctx.db.get(membership.workspaceId);
        return workspace;
      })
    );

    return workspaces.filter(Boolean); // Remove any undefined workspaces
  },
});
