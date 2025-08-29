import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Create a new loan file from a loan type template
export const createFromLoanType = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    loanTypeId: v.id("loanTypes"),
    clientId: v.id("clients"),
    advisorId: v.id("users"),
  },
  handler: async (ctx, { workspaceId, loanTypeId, clientId, advisorId }) => {
    // Get the loan type to access its stages
    const loanType = await ctx.db.get(loanTypeId);
    if (!loanType) {
      throw new ConvexError("Loan type not found");
    }

    // Create the loan file
    const loanFileId = await ctx.db.insert("loanFiles", {
      workspaceId,
      loanTypeId,
      clientId,
      advisorId,
      status: "draft",
      currentStage: loanType.stages[0] || "Application",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create tasks from templates for this loan type
    const taskTemplates = await ctx.db
      .query("taskTemplates")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .order("asc")
      .collect();

    let tasksCreated = 0;
    if (taskTemplates.length === 0) {
      // Create default task templates for this loan type
      await createDefaultTasksForLoanType(ctx, workspaceId, loanTypeId);
      // Fetch the newly created templates
      const newTemplates = await ctx.db
        .query("taskTemplates")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
        .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
        .order("asc")
        .collect();
      
      tasksCreated = await createTasksFromTemplates(ctx, workspaceId, loanFileId, clientId, advisorId, newTemplates);
    } else {
      tasksCreated = await createTasksFromTemplates(ctx, workspaceId, loanFileId, clientId, advisorId, taskTemplates);
    }

    return { 
      loanFileId,
      tasksCreated,
      message: `Loan file created with ${tasksCreated} tasks`
    };
  },
});

// Create a loan file
export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    loanTypeId: v.id("loanTypes"),
    clientId: v.id("clients"),
    advisorId: v.id("users"),
    status: v.optional(v.union(v.literal("draft"), v.literal("in_progress"), v.literal("under_review"), v.literal("approved"), v.literal("closed"))),
    currentStage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const loanFileId = await ctx.db.insert("loanFiles", {
      workspaceId: args.workspaceId,
      loanTypeId: args.loanTypeId,
      clientId: args.clientId,
      advisorId: args.advisorId,
      status: args.status || "draft",
      currentStage: args.currentStage || "initial",
      createdAt: now,
      updatedAt: now,
    });

    return loanFileId;
  },
});

// Get a loan file by ID
export const get = query({
  args: { loanFileId: v.id("loanFiles") },
  handler: async (ctx, { loanFileId }) => {
    return await ctx.db.get(loanFileId);
  },
});

// List all loan files in a workspace
export const listByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("loanFiles")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .order("desc")
      .collect();
  },
});

// Update a loan file
export const update = mutation({
  args: {
    loanFileId: v.id("loanFiles"),
    status: v.optional(v.union(v.literal("draft"), v.literal("in_progress"), v.literal("under_review"), v.literal("approved"), v.literal("closed"))),
    currentStage: v.optional(v.string()),
  },
  handler: async (ctx, { loanFileId, ...updates }) => {
    const loanFile = await ctx.db.get(loanFileId);
    if (!loanFile) {
      throw new ConvexError("Loan file not found");
    }

    await ctx.db.patch(loanFileId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return loanFileId;
  },
});

// Delete a loan file
export const remove = mutation({
  args: { loanFileId: v.id("loanFiles") },
  handler: async (ctx, { loanFileId }) => {
    const loanFile = await ctx.db.get(loanFileId);
    if (!loanFile) {
      throw new ConvexError("Loan file not found");
    }

    await ctx.db.delete(loanFileId);
    return loanFileId;
  },
});

// Helper function to create tasks from templates
async function createTasksFromTemplates(
  ctx: any,
  workspaceId: string,
  loanFileId: string,
  clientId: string,
  advisorId: string,
  taskTemplates: any[]
) {
  const createdTasks = [];
  const now = Date.now();

  for (const template of taskTemplates) {
    // Calculate due date based on template
    const dueDate = now + (template.dueInDays * 24 * 60 * 60 * 1000);
    
    // Determine assignee based on role
    let assigneeUserId = undefined;
    if (template.assigneeRole === "ADVISOR") {
      assigneeUserId = advisorId;
    } else if (template.assigneeRole === "STAFF") {
      // For staff tasks, we could assign to a specific staff member
      // For now, leave unassigned
      assigneeUserId = undefined;
    }
    // For CLIENT tasks, leave assigneeUserId undefined since clients are not users

    const taskId = await ctx.db.insert("tasks", {
      workspaceId,
      loanFileId,
      taskTemplateId: template._id,
      title: template.title,
      assigneeUserId,
      assigneeRole: template.assigneeRole,
      instructions: template.instructions,
      status: "pending",
      priority: template.priority,
      dueDate,
      order: template.order,
      createdAt: now,
      updatedAt: now,
    });

    createdTasks.push({
      id: taskId,
      title: template.title,
      assigneeRole: template.assigneeRole,
      priority: template.priority,
      dueDate,
    });
  }

  return createdTasks.length;
}

// Helper function to create default tasks for a loan type if none exist
async function createDefaultTasksForLoanType(ctx: any, workspaceId: string, loanTypeId: string) {
  const now = Date.now();
  
  // Default task templates for common loan types
  const defaultTemplates = [
    {
      title: "Initial Client Consultation",
      assigneeRole: "ADVISOR",
      instructions: "Schedule and conduct initial consultation with client to discuss loan needs and requirements",
      isRequired: true,
      dueInDays: 1,
      attachmentsAllowed: false,
      priority: "high",
      order: 1,
    },
    {
      title: "Document Collection",
      assigneeRole: "CLIENT",
      instructions: "Collect and submit required documents: ID, income verification, bank statements, etc.",
      isRequired: true,
      dueInDays: 3,
      attachmentsAllowed: true,
      priority: "high",
      order: 2,
    },
    {
      title: "Credit Check",
      assigneeRole: "ADVISOR",
      instructions: "Pull and review client credit report, identify any issues or opportunities",
      isRequired: true,
      dueInDays: 2,
      attachmentsAllowed: false,
      priority: "high",
      order: 3,
    },
    {
      title: "Income Verification",
      assigneeRole: "STAFF",
      instructions: "Verify client income through pay stubs, tax returns, and employment verification",
      isRequired: true,
      dueInDays: 5,
      attachmentsAllowed: true,
      priority: "normal",
      order: 4,
    },
    {
      title: "Property Appraisal",
      assigneeRole: "ADVISOR",
      instructions: "Order and review property appraisal, ensure it meets loan requirements",
      isRequired: true,
      dueInDays: 7,
      attachmentsAllowed: true,
      priority: "normal",
      order: 5,
    },
    {
      title: "Title Search",
      assigneeRole: "STAFF",
      instructions: "Conduct title search, resolve any liens or encumbrances",
      isRequired: true,
      dueInDays: 10,
      attachmentsAllowed: false,
      priority: "normal",
      order: 6,
    },
    {
      title: "Insurance Verification",
      assigneeRole: "STAFF",
      instructions: "Verify homeowner insurance coverage and requirements",
      isRequired: true,
      dueInDays: 12,
      attachmentsAllowed: false,
      priority: "low",
      order: 7,
    },
    {
      title: "Final Review",
      assigneeRole: "ADVISOR",
      instructions: "Conduct final review of all documentation and prepare for submission",
      isRequired: true,
      dueInDays: 14,
      attachmentsAllowed: false,
      priority: "high",
      order: 8,
    },
  ];

  // Create task templates
  for (const template of defaultTemplates) {
    await ctx.db.insert("taskTemplates", {
      workspaceId,
      loanTypeId,
      ...template,
      createdAt: now,
      updatedAt: now,
    });
  }
}
