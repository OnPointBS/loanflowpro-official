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
      readAt: undefined, // Mark as unread initially
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

// Get unread message count for a specific user
export const getUnreadMessageCount = query({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => 
        q.and(
          q.eq(q.field("recipientId"), args.userId),
          q.eq(q.field("readAt"), undefined)
        )
      )
      .collect();

    return unreadMessages.length;
  },
});

// Get unread message count between two specific users
export const getUnreadMessageCountBetweenUsers = query({
  args: {
    workspaceId: v.id("workspaces"),
    userId1: v.id("users"),
    userId2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => 
        q.and(
          q.eq(q.field("recipientId"), args.userId1),
          q.eq(q.field("senderId"), args.userId2),
          q.eq(q.field("readAt"), undefined)
        )
      )
      .collect();

    return unreadMessages.length;
  },
});

// Get all unread message counts for a workspace (for advisors to see client notifications)
export const getAllUnreadMessageCountsForWorkspace = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("readAt"), undefined))
      .collect();

    // Group by sender to get counts per client
    const countsBySender: Record<string, number> = {};
    unreadMessages.forEach(message => {
      const senderId = message.senderId;
      countsBySender[senderId] = (countsBySender[senderId] || 0) + 1;
    });

    return countsBySender;
  },
});

// Mark all messages as read between two users
export const markAllMessagesAsRead = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId1: v.id("users"),
    userId2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => 
        q.and(
          q.eq(q.field("recipientId"), args.userId1),
          q.eq(q.field("senderId"), args.userId2),
          q.eq(q.field("readAt"), undefined)
        )
      )
      .collect();

    // Mark all unread messages as read
    for (const message of unreadMessages) {
      await ctx.db.patch(message._id, {
        readAt: Date.now(),
      });
    }

    return unreadMessages.length;
  },
});

// Get recent conversations for a user
export const getRecentConversations = query({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all messages where the user is either sender or recipient
    const allMessages = await ctx.db
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

    // Group messages by conversation partner and get the latest message
    const conversations = new Map();
    
    for (const message of allMessages) {
      const partnerId = message.senderId === args.userId ? message.recipientId : message.senderId;
      
      if (!conversations.has(partnerId)) {
        conversations.set(partnerId, {
          partnerId,
          lastMessage: message,
          unreadCount: 0,
        });
      }
    }

    // Calculate unread counts for each conversation
    for (const [partnerId, conversation] of conversations) {
      const unreadCount = await ctx.db
        .query("messages")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
        .filter((q) => 
          q.and(
            q.eq(q.field("recipientId"), args.userId),
            q.eq(q.field("senderId"), partnerId),
            q.eq(q.field("readAt"), undefined)
          )
        )
        .collect();
      
      conversation.unreadCount = unreadCount.length;
    }

    return Array.from(conversations.values()).sort((a, b) => 
      b.lastMessage.createdAt - a.lastMessage.createdAt
    );
  },
});
