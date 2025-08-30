import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// Get chat conversation for a specific client
export const getClientChat = query({
  args: { 
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients")
  },
  handler: async (ctx, { workspaceId, clientId }) => {
    return await ctx.db
      .query("clientChats")
      .withIndex("by_workspace_client", (q) => 
        q.eq("workspaceId", workspaceId).eq("clientId", clientId)
      )
      .first();
  },
});

// Get all chat conversations for a workspace
export const getWorkspaceChats = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const chats = await ctx.db
      .query("clientChats")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .collect();

    // Get client details for each chat
    const chatsWithClientDetails = await Promise.all(
      chats.map(async (chat) => {
        const client = await ctx.db.get(chat.clientId);
        return {
          ...chat,
          clientName: client?.name || "Unknown Client",
          clientEmail: client?.email || "",
        };
      })
    );

    return chatsWithClientDetails;
  },
});

// Get messages for a specific client chat
export const getClientChatMessages = query({
  args: { 
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients"),
    limit: v.optional(v.number())
  },
  handler: async (ctx, { workspaceId, clientId, limit = 50 }) => {
    const messages = await ctx.db
      .query("clientChatMessages")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("clientId"), clientId))
      .order("desc")
      .take(limit);

    return messages.reverse(); // Return in chronological order
  },
});

// Send a message from advisor to client
export const sendAdvisorMessage = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients"),
    advisorId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, { workspaceId, clientId, advisorId, content }) => {
    // Create or update the chat conversation
    let chat = await ctx.db
      .query("clientChats")
      .withIndex("by_workspace_client", (q) => 
        q.eq("workspaceId", workspaceId).eq("clientId", clientId)
      )
      .first();

    if (!chat) {
      // Create new chat conversation
      const chatId = await ctx.db.insert("clientChats", {
        workspaceId,
        clientId,
        advisorId,
        lastMessageAt: Date.now(),
        lastMessageContent: content,
        unreadCount: 0, // Advisor just sent, so no unread for them
        clientUnreadCount: 1, // Client has 1 unread message
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      chat = await ctx.db.get(chatId);
    } else {
      // Update existing chat conversation
      await ctx.db.patch(chat._id, {
        lastMessageAt: Date.now(),
        lastMessageContent: content,
        clientUnreadCount: chat.clientUnreadCount + 1, // Increment client unread count
        updatedAt: Date.now(),
      });
    }

    // Insert the message
    const messageId = await ctx.db.insert("clientChatMessages", {
      workspaceId,
      clientId,
      senderType: "advisor",
      senderId: advisorId,
      content,
      readByAdvisor: true, // Advisor just sent it
      readByClient: false, // Client hasn't read it yet
      createdAt: Date.now(),
    });

    return { messageId, chatId: chat?._id };
  },
});

// Send a message from client to advisor
export const sendClientMessage = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients"),
    content: v.string(),
  },
  handler: async (ctx, { workspaceId, clientId, content }) => {
    // Get the chat conversation
    let chat = await ctx.db
      .query("clientChats")
      .withIndex("by_workspace_client", (q) => 
        q.eq("workspaceId", workspaceId).eq("clientId", clientId)
      )
      .first();

    if (!chat) {
      throw new Error("Chat conversation not found. Please contact your advisor.");
    }

    // Update the chat conversation
    await ctx.db.patch(chat._id, {
      lastMessageAt: Date.now(),
      lastMessageContent: content,
      unreadCount: chat.unreadCount + 1, // Increment advisor unread count
      updatedAt: Date.now(),
    });

    // Insert the message
    const messageId = await ctx.db.insert("clientChatMessages", {
      workspaceId,
      clientId,
      senderType: "client",
      senderId: undefined, // No sender ID for client messages
      content,
      readByAdvisor: false, // Advisor hasn't read it yet
      readByClient: true, // Client just sent it
      createdAt: Date.now(),
    });

    return { messageId };
  },
});

// Mark messages as read by advisor
export const markAsReadByAdvisor = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients"),
  },
  handler: async (ctx, { workspaceId, clientId }) => {
    // Get the chat conversation
    const chat = await ctx.db
      .query("clientChats")
      .withIndex("by_workspace_client", (q) => 
        q.eq("workspaceId", workspaceId).eq("clientId", clientId)
      )
      .first();

    if (!chat) {
      throw new Error("Chat conversation not found");
    }

    // Mark all unread messages as read
    const unreadMessages = await ctx.db
      .query("clientChatMessages")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => 
        q.and(
          q.eq(q.field("clientId"), clientId),
          q.eq(q.field("readByAdvisor"), false)
        )
      )
      .collect();

    // Update each message
    for (const message of unreadMessages) {
      await ctx.db.patch(message._id, { readByAdvisor: true });
    }

    // Update the chat conversation
    await ctx.db.patch(chat._id, {
      unreadCount: 0,
      updatedAt: Date.now(),
    });

    return { success: true, messagesUpdated: unreadMessages.length };
  },
});

// Mark messages as read by client
export const markAsReadByClient = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients"),
  },
  handler: async (ctx, { workspaceId, clientId }) => {
    // Get the chat conversation
    const chat = await ctx.db
      .query("clientChats")
      .withIndex("by_workspace_client", (q) => 
        q.eq("workspaceId", workspaceId).eq("clientId", clientId)
      )
      .first();

    if (!chat) {
      throw new Error("Chat conversation not found");
    }

    // Mark all unread messages as read
    const unreadMessages = await ctx.db
      .query("clientChatMessages")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => 
        q.and(
          q.eq(q.field("clientId"), clientId),
          q.eq(q.field("readByClient"), false)
        )
      )
      .collect();

    // Update each message
    for (const message of unreadMessages) {
      await ctx.db.patch(message._id, { readByClient: true });
    }

    // Update the chat conversation
    await ctx.db.patch(chat._id, {
      clientUnreadCount: 0,
      updatedAt: Date.now(),
    });

    return { success: true, messagesUpdated: unreadMessages.length };
  },
});

// Get unread message counts for all clients in a workspace
export const getUnreadCountsForWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const chats = await ctx.db
      .query("clientChats")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .collect();

    // Create a map of clientId to unread count
    const unreadCounts: Record<string, number> = {};
    for (const chat of chats) {
      unreadCounts[chat.clientId] = chat.unreadCount;
    }

    return unreadCounts;
  },
});

// Get unread count for a specific client
export const getUnreadCountForClient = query({
  args: { 
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients")
  },
  handler: async (ctx, { workspaceId, clientId }) => {
    const chat = await ctx.db
      .query("clientChats")
      .withIndex("by_workspace_client", (q) => 
        q.eq("workspaceId", workspaceId).eq("clientId", clientId)
      )
      .first();

    return chat?.unreadCount || 0;
  },
});
