import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Send a message
export const sendMessage = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    senderId: v.id("users"),
    recipientId: v.string(), // "advisor" or specific user ID
    content: v.string(),
    type: v.union(v.literal("client_to_advisor"), v.literal("advisor_to_client")),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      workspaceId: args.workspaceId,
      senderId: args.senderId,
      recipientId: args.recipientId,
      content: args.content,
      type: args.type,
      status: "sent",
      createdAt: Date.now(),
      readAt: null,
    });

    return messageId;
  },
});

// Get messages for a user
export const getMessages = query({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => 
        q.or(
          q.eq(q.field("senderId"), args.userId),
          q.eq(q.field("recipientId"), args.userId)
        )
      )
      .order("desc")
      .collect();

    return messages;
  },
});

// Mark message as read
export const markAsRead = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      readAt: Date.now(),
      status: "read",
    });
  },
});
