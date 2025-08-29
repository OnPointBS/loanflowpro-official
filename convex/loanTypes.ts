import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new loan type
export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    description: v.string(),
    category: v.string(),
    stages: v.array(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    minLoanAmount: v.optional(v.number()),
    maxLoanAmount: v.optional(v.number()),
    minInterestRate: v.optional(v.number()),
    maxInterestRate: v.optional(v.number()),
  },
  handler: async (ctx, { workspaceId, name, description, category, stages, status, minLoanAmount, maxLoanAmount, minInterestRate, maxInterestRate }) => {
    const loanTypeId = await ctx.db.insert("loanTypes", {
      workspaceId,
      name,
      description,
      category,
      stages,
      status: status || "active",
      minLoanAmount,
      maxLoanAmount,
      minInterestRate,
      maxInterestRate,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return loanTypeId;
  },
});

// Get a loan type by ID
export const get = query({
  args: { loanTypeId: v.id("loanTypes") },
  handler: async (ctx, { loanTypeId }) => {
    return await ctx.db.get(loanTypeId);
  },
});

// List all loan types in a workspace
export const listByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("loanTypes")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .order("desc")
      .collect();
  },
});

// Update a loan type
export const update = mutation({
  args: {
    loanTypeId: v.id("loanTypes"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    stages: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    minLoanAmount: v.optional(v.number()),
    maxLoanAmount: v.optional(v.number()),
    minInterestRate: v.optional(v.number()),
    maxInterestRate: v.optional(v.number()),
  },
  handler: async (ctx, { loanTypeId, ...updates }) => {
    const loanType = await ctx.db.get(loanTypeId);
    if (!loanType) {
      throw new Error("Loan type not found");
    }

    await ctx.db.patch(loanTypeId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return loanTypeId;
  },
});

// Delete a loan type
export const remove = mutation({
  args: { loanTypeId: v.id("loanTypes") },
  handler: async (ctx, { loanTypeId }) => {
    const loanType = await ctx.db.get(loanTypeId);
    if (!loanType) {
      throw new Error("Loan type not found");
    }

    await ctx.db.delete(loanTypeId);
    return loanTypeId;
  },
});

// Task template management
export const taskTemplates = {
  // Create a task template
  create: mutation({
    args: {
      workspaceId: v.id("workspaces"),
      loanTypeId: v.id("loanTypes"),
      title: v.string(),
      assigneeRole: v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT")),
      instructions: v.string(),
      isRequired: v.boolean(),
      dueInDays: v.number(),
      attachmentsAllowed: v.boolean(),
      priority: v.union(v.literal("low"), v.literal("normal"), v.literal("high"), v.literal("urgent")),
      order: v.number(),
    },
    handler: async (ctx, args) => {
      const templateId = await ctx.db.insert("taskTemplates", {
        ...args,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return templateId;
    },
  }),

  // Get task templates for a loan type
  listByLoanType: query({
    args: { loanTypeId: v.id("loanTypes") },
    handler: async (ctx, { loanTypeId }) => {
      // Since taskTemplates no longer has loanTypeId, we'll return all templates for now
      // In the future, this should use the taskTemplateLoanTypes association table
      return await ctx.db
        .query("taskTemplates")
        .order("asc")
        .collect();
    },
  }),

  // Update a task template
  update: mutation({
    args: {
      templateId: v.id("taskTemplates"),
      title: v.optional(v.string()),
      assigneeRole: v.optional(v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT"))),
      instructions: v.optional(v.string()),
      isRequired: v.optional(v.boolean()),
      dueInDays: v.optional(v.number()),
      attachmentsAllowed: v.optional(v.boolean()),
      priority: v.optional(v.union(v.literal("low"), v.literal("normal"), v.literal("high"), v.literal("urgent"))),
      order: v.optional(v.number()),
    },
    handler: async (ctx, { templateId, ...updates }) => {
      const template = await ctx.db.get(templateId);
      if (!template) {
        throw new Error("Task template not found");
      }

      await ctx.db.patch(templateId, {
        ...updates,
        updatedAt: Date.now(),
      });

      return templateId;
    },
  }),

  // Delete a task template
  remove: mutation({
    args: { templateId: v.id("taskTemplates") },
    handler: async (ctx, { templateId }) => {
      const template = await ctx.db.get(templateId);
      if (!template) {
        throw new Error("Task template not found");
      }

      await ctx.db.delete(templateId);
      return templateId;
    },
  }),
};
