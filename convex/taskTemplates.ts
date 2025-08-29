import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new task template
export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
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
    const taskTemplateId = await ctx.db.insert("taskTemplates", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return taskTemplateId;
  },
});

  // List all task templates in a workspace
  export const listByWorkspace = query({
    args: { workspaceId: v.id("workspaces") },
    handler: async (ctx, { workspaceId }) => {
      return await ctx.db
        .query("taskTemplates")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
        .order("asc")
        .collect();
    },
  });

// Get a single task template
export const get = query({
  args: { taskTemplateId: v.id("taskTemplates") },
  handler: async (ctx, { taskTemplateId }) => {
    return await ctx.db.get(taskTemplateId);
  },
});

// Update a task template
export const update = mutation({
  args: {
    taskTemplateId: v.id("taskTemplates"),
    title: v.optional(v.string()),
    assigneeRole: v.optional(v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT"))),
    instructions: v.optional(v.string()),
    isRequired: v.optional(v.boolean()),
    dueInDays: v.optional(v.number()),
    attachmentsAllowed: v.optional(v.boolean()),
    priority: v.optional(v.union(v.literal("low"), v.literal("normal"), v.literal("high"), v.literal("urgent"))),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { taskTemplateId, ...updates }) => {
    const taskTemplate = await ctx.db.get(taskTemplateId);
    if (!taskTemplate) {
      throw new Error("Task template not found");
    }

    await ctx.db.patch(taskTemplateId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return taskTemplateId;
  },
});

// Delete a task template
export const remove = mutation({
  args: { taskTemplateId: v.id("taskTemplates") },
  handler: async (ctx, { taskTemplateId }) => {
    const taskTemplate = await ctx.db.get(taskTemplateId);
    if (!taskTemplate) {
      throw new Error("Task template not found");
    }

    // Check if this template is being used by any client tasks
    const clientTasks = await ctx.db
      .query("clientTasks")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", taskTemplate.workspaceId))
      .filter((q) => q.eq(q.field("taskTemplateId"), taskTemplateId))
      .collect();

    if (clientTasks.length > 0) {
      throw new Error("Cannot delete task template that is being used by client tasks");
    }

    await ctx.db.delete(taskTemplateId);
    return taskTemplateId;
  },
});

// Reorder task templates
export const reorder = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    taskTemplateIds: v.array(v.id("taskTemplates")),
  },
  handler: async (ctx, { workspaceId, taskTemplateIds }) => {
    // Update the order of each task template
    for (let i = 0; i < taskTemplateIds.length; i++) {
      await ctx.db.patch(taskTemplateIds[i], {
        order: i + 1,
        updatedAt: Date.now(),
      });
    }

    return true;
  },
});
