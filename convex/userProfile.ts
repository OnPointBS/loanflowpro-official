import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Get user profile
export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      title: user.title || '',
      bio: user.bio || '',
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    updates: v.object({
      name: v.optional(v.string()),
      phone: v.optional(v.string()),
      title: v.optional(v.string()),
      bio: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { userId, updates }) => {
    // Check if user has permission to update this profile
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

    // Users can only update their own profile
    if (currentUser._id !== userId) {
      throw new ConvexError("Can only update your own profile");
    }

    // Update user profile
    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Change user password (for future implementation)
export const changeUserPassword = mutation({
  args: {
    userId: v.id("users"),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, { userId, currentPassword, newPassword }) => {
    // Check if user has permission
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

    // Users can only change their own password
    if (currentUser._id !== userId) {
      throw new ConvexError("Can only change your own password");
    }

    // For now, just return success - password change will be implemented later
    // This would typically involve hashing the new password and updating the user record
    return { success: true };
  },
});

// Get user workspace memberships
export const getUserWorkspaceMemberships = query({
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
