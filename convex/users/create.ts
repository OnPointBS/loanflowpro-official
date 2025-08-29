import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const create = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { email, name }) => {
    const userId = await ctx.db.insert("users", {
      email,
      name,
      password: "", // Will be set by auth system
      emailVerified: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return userId;
  },
});
