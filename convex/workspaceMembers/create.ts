import { v } from "convex/values";
import { mutation } from "../_generated/server";

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
