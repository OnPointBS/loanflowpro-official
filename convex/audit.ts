import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Log an audit event
export const log = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    action: v.string(),
    resourceType: v.string(),
    resourceId: v.optional(v.string()),
    details: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const auditId = await ctx.db.insert("audit", {
      ...args,
      createdAt: Date.now(),
    });

    return auditId;
  },
});

// Get audit logs for a workspace
export const listByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("audit")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .order("desc")
      .collect();
  },
});

// Get audit logs by user
export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("audit")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Get audit logs by action type
export const listByAction = query({
  args: { action: v.string() },
  handler: async (ctx, { action }) => {
    return await ctx.db
      .query("audit")
      .withIndex("by_action", (q) => q.eq("action", action))
      .order("desc")
      .collect();
  },
});

// Helper function to log common actions
export const logAction = {
  // Log user creation
  userCreated: (ctx: any, workspaceId: any, userId: any, userEmail: string) => {
    return ctx.db.insert("audit", {
      workspaceId,
      userId,
      action: "user_created",
      resourceType: "user",
      resourceId: userId,
      details: { email: userEmail },
      createdAt: Date.now(),
    });
  },

  // Log client creation
  clientCreated: (ctx: any, workspaceId: any, userId: any, clientId: any, clientName: string) => {
    return ctx.db.insert("audit", {
      workspaceId,
      userId,
      action: "client_created",
      resourceType: "client",
      resourceId: clientId,
      details: { name: clientName },
      createdAt: Date.now(),
    });
  },

  // Log document upload
  documentUploaded: (ctx: any, workspaceId: any, userId: any, documentId: any, fileName: string) => {
    return ctx.db.insert("audit", {
      workspaceId,
      userId,
      action: "document_uploaded",
      resourceType: "document",
      resourceId: documentId,
      details: { fileName },
      createdAt: Date.now(),
    });
  },

  // Log task completion
  taskCompleted: (ctx: any, workspaceId: any, userId: any, taskId: any, taskTitle: string) => {
    return ctx.db.insert("audit", {
      workspaceId,
      userId,
      action: "task_completed",
      resourceType: "task",
      resourceId: taskId,
      details: { title: taskTitle },
      createdAt: Date.now(),
    });
  },
};
