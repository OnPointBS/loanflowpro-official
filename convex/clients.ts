import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new client
export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { workspaceId, name, email, phone, notes }) => {
    // Check if client already exists in this workspace
    const existingClient = await ctx.db
      .query("clients")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("email"), email))
      .first();

    if (existingClient) {
      throw new Error("Client with this email already exists in this workspace");
    }

    const clientId = await ctx.db.insert("clients", {
      workspaceId,
      name,
      email,
      phone,
      notes,
      status: "active",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return clientId;
  },
});

// Get a client by ID
export const get = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, { clientId }) => {
    return await ctx.db.get(clientId);
  },
});

// List all clients in a workspace
export const listByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("clients")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .order("desc")
      .collect();
  },
});

// Update a client
export const update = mutation({
  args: {
    clientId: v.id("clients"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("prospect"))),
  },
  handler: async (ctx, { clientId, ...updates }) => {
    const client = await ctx.db.get(clientId);
    if (!client) {
      throw new Error("Client not found");
    }

    await ctx.db.patch(clientId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return clientId;
  },
});

// Delete a client
export const remove = mutation({
  args: { clientId: v.id("clients") },
  handler: async (ctx, { clientId }) => {
    const client = await ctx.db.get(clientId);
    if (!client) {
      throw new Error("Client not found");
    }

    // Delete all associated client loan types and tasks
    const clientLoanTypes = await ctx.db
      .query("clientLoanTypes")
      .withIndex("by_client", (q) => q.eq("clientId", clientId))
      .collect();

    for (const assignment of clientLoanTypes) {
      // Delete all tasks for this assignment
      const tasks = await ctx.db
        .query("clientTasks")
        .withIndex("by_client_loan_type", (q) => q.eq("clientLoanTypeId", assignment._id))
        .collect();

      for (const task of tasks) {
        await ctx.db.delete(task._id);
      }

      // Delete the assignment
      await ctx.db.delete(assignment._id);
    }

    await ctx.db.delete(clientId);
    return clientId;
  },
});

// Get client with loan types and tasks
export const getClientWithDetails = query({
  args: { 
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients")
  },
  handler: async (ctx, { workspaceId, clientId }) => {
    const client = await ctx.db.get(clientId);
    if (!client) return null;

    // Get loan type assignments
    const loanTypeAssignments = await ctx.db
      .query("clientLoanTypes")
      .withIndex("by_workspace_client", (q) => 
        q.eq("workspaceId", workspaceId).eq("clientId", clientId)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();

    // Get loan type details and task counts
    const assignmentsWithDetails = await Promise.all(
      loanTypeAssignments.map(async (assignment) => {
        const loanType = await ctx.db.get(assignment.loanTypeId);
        const taskCount = await ctx.db
          .query("clientTasks")
          .withIndex("by_client_loan_type", (q) => q.eq("clientLoanTypeId", assignment._id))
          .collect();
        
        return {
          ...assignment,
          loanType,
          taskCount: taskCount.length,
        };
      })
    );

    return {
      ...client,
      loanTypes: assignmentsWithDetails,
    };
  },
});

// Get clients with their loan type counts
export const getClientsWithLoanTypeCounts = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const clients = await ctx.db
      .query("clients")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .order("desc")
      .collect();

    // Get loan type counts for each client
    const clientsWithCounts = await Promise.all(
      clients.map(async (client) => {
        const loanTypeCount = await ctx.db
          .query("clientLoanTypes")
          .withIndex("by_workspace_client", (q) => 
            q.eq("workspaceId", workspaceId).eq("clientId", client._id)
          )
          .filter((q) => q.eq(q.field("isActive"), true))
          .collect();

        const taskCount = await ctx.db
          .query("clientTasks")
          .withIndex("by_client", (q) => q.eq("clientId", client._id))
          .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
          .collect();

        return {
          ...client,
          loanTypeCount: loanTypeCount.length,
          taskCount: taskCount.length,
        };
      })
    );

    return clientsWithCounts;
  },
});
