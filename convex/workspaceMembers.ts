import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

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

// Update member role
export const updateMemberRole = mutation({
  args: {
    membershipId: v.id("workspaceMembers"),
    newRole: v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT")),
  },
  handler: async (ctx, { membershipId, newRole }) => {
    // Check if user has permission to update member roles
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    if (!identity.email) {
      throw new ConvexError("Email not found in identity");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const membership = await ctx.db.get(membershipId);
    if (!membership) {
      throw new ConvexError("Membership not found");
    }

    // Check if current user is workspace owner or has ADVISOR role
    const currentMembership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", membership.workspaceId))
      .filter((q) => q.eq(q.field("userId"), currentUser._id))
      .first();

    if (!currentMembership || currentMembership.role !== "ADVISOR") {
      throw new ConvexError("Insufficient permissions to update member roles");
    }

    // Update member role
    await ctx.db.patch(membershipId, {
      role: newRole,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Remove member from workspace
export const removeMember = mutation({
  args: {
    membershipId: v.id("workspaceMembers"),
  },
  handler: async (ctx, { membershipId }) => {
    // Check if user has permission to remove members
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const membership = await ctx.db.get(membershipId);
    if (!membership) {
      throw new ConvexError("Membership not found");
    }

    // Check if current user is workspace owner or has ADVISOR role
    const currentMembership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", membership.workspaceId))
      .filter((q) => q.eq(q.field("userId"), currentUser._id))
      .first();

    if (!currentMembership || currentMembership.role !== "ADVISOR") {
      throw new ConvexError("Insufficient permissions to remove members");
    }

    // Mark membership as removed instead of deleting
    await ctx.db.patch(membershipId, {
      status: "removed",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Invite new member to workspace
export const inviteMember = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    email: v.string(),
    role: v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT")),
    message: v.optional(v.string()),
  },
  handler: async (ctx, { workspaceId, email, role, message }) => {
    // Check if user has permission to invite members
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    if (!identity.email) {
      throw new ConvexError("Email not found in identity");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    // Check if current user is workspace owner or has ADVISOR role
    const currentMembership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("userId"), currentUser._id))
      .first();

    if (!currentMembership || currentMembership.role !== "ADVISOR") {
      throw new ConvexError("Insufficient permissions to invite members");
    }

    // Check if user already exists
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      // Create new user
      const userId = await ctx.db.insert("users", {
        email: email,
        name: email.split('@')[0], // Use part before @ as name
        password: "", // No password for magic link users
        emailVerified: false,
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }

    if (!user) {
      throw new ConvexError("Failed to create or find user");
    }

    // Check if user is already a member
    const existingMembership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("userId"), user!._id))
      .first();

    if (existingMembership) {
      throw new ConvexError("User is already a member of this workspace");
    }

    // Create membership with invited status
    const membershipId = await ctx.db.insert("workspaceMembers", {
      workspaceId,
      userId: user._id,
      role,
      status: "invited",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // TODO: Send invitation email using the existing sendMagicLink system
    // This would integrate with the existing auth system

    return { success: true, membershipId };
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
