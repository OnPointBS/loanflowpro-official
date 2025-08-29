import { v } from "convex/values";
import { mutation } from "../_generated/server";

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
