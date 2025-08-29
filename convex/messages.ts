import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    senderId: v.id("users"),
    recipientId: v.id("users"),
    content: v.string(),
    type: v.union(v.literal("client_to_advisor"), v.literal("advisor_to_client"), v.literal("partner_to_advisor"), v.literal("advisor_to_partner")),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      workspaceId: args.workspaceId,
      senderId: args.senderId,
      recipientId: args.recipientId,
      content: args.content,
      type: args.type,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

export const getMessages = query({
  args: {
    workspaceId: v.id("workspaces"),
    userId1: v.id("users"),
    userId2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => 
        q.or(
          q.and(q.eq(q.field("senderId"), args.userId1), q.eq(q.field("recipientId"), args.userId2)),
          q.and(q.eq(q.field("senderId"), args.userId2), q.eq(q.field("recipientId"), args.userId1))
        )
      )
      .order("asc")
      .collect();

    return messages;
  },
});

export const markAsRead = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      readAt: Date.now(),
    });
  },
});
