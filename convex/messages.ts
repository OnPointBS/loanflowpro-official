import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new message
export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    loanFileId: v.optional(v.id("loanFiles")),
    senderUserId: v.id("users"),
    senderRole: v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT")),
    body: v.string(),
    attachments: v.optional(v.array(v.id("documents"))),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      ...args,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

// Get a message by ID
export const get = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    return await ctx.db.get(messageId);
  },
});

// List messages by workspace
export const listByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .order("desc")
      .collect();
  },
});

// List messages by loan file
export const listByLoanFile = query({
  args: { loanFileId: v.id("loanFiles") },
  handler: async (ctx, { loanFileId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_loan_file", (q) => q.eq("loanFileId", loanFileId))
      .order("asc")
      .collect();
  },
});

// List messages by sender
export const listBySender = query({
  args: { senderUserId: v.id("users") },
  handler: async (ctx, { senderUserId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderUserId", senderUserId))
      .order("desc")
      .collect();
  },
});

// Delete a message
export const remove = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.db.get(messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    await ctx.db.delete(messageId);
    return messageId;
  },
});
