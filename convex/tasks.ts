import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Create a single task directly
export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    title: v.string(),
    dueDate: v.string(),
    priority: v.optional(v.union(v.literal("low"), v.literal("normal"), v.literal("high"), v.literal("urgent"))),
    status: v.optional(v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("overdue"))),
    assigneeUserId: v.optional(v.id("users")),
    loanFileId: v.id("loanFiles"),
    taskTemplateId: v.optional(v.id("taskTemplates")),
    assigneeRole: v.optional(v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT"))),
    instructions: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const taskId = await ctx.db.insert("tasks", {
      workspaceId: args.workspaceId,
      title: args.title,
      description: args.title, // Use title as description for now
      dueDate: new Date(args.dueDate).getTime(),
      priority: args.priority || "normal",
      status: args.status || "pending",
      assigneeUserId: args.assigneeUserId,
      loanFileId: args.loanFileId,
      taskTemplateId: args.taskTemplateId,
      assigneeRole: args.assigneeRole || "ADVISOR",
      instructions: args.instructions || "",
      order: args.order || 0,
      createdAt: now,
      updatedAt: now,
    });

    return taskId;
  },
});

// Create tasks from templates when a loan type is added to a client
export const createTasksFromTemplate = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    loanFileId: v.id("loanFiles"),
    loanTypeId: v.id("loanTypes"),
    clientId: v.id("clients"),
    advisorId: v.id("users"),
  },
  handler: async (ctx, { workspaceId, loanFileId, loanTypeId, clientId, advisorId }) => {
    // Get the loan type and its task templates
    const loanType = await ctx.db.get(loanTypeId);
    if (!loanType) {
      throw new ConvexError("Loan type not found");
    }

    // Get all task templates for this loan type
    const taskTemplates = await ctx.db
      .query("taskTemplates")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .order("asc")
      .collect();

    if (taskTemplates.length === 0) {
      // If no templates exist, create default tasks for this loan type
      await createDefaultTasksForLoanType(ctx, workspaceId, loanTypeId);
      // Fetch the newly created templates
      const newTemplates = await ctx.db
        .query("taskTemplates")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
        .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
        .order("asc")
        .collect();
      
      return await createTasksFromTemplates(ctx, workspaceId, loanFileId, clientId, advisorId, newTemplates);
    }

    return await createTasksFromTemplates(ctx, workspaceId, loanFileId, clientId, advisorId, taskTemplates);
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
    } else if (template.assigneeRole === "CLIENT") {
      assigneeUserId = clientId; // Note: This might need adjustment based on your user structure
    }

    const taskId = await ctx.db.insert("tasks", {
      workspaceId,
      loanFileId,
      taskTemplateId: template._id,
      title: template.title,
      description: template.title, // Use title as description for now
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

  return {
    success: true,
    message: `Created ${createdTasks.length} tasks from template`,
    tasks: createdTasks,
  };
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

// Get all tasks for a loan file
export const getTasksByLoanFile = query({
  args: { loanFileId: v.id("loanFiles") },
  handler: async (ctx, { loanFileId }) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_loan_file", (q) => q.eq("loanFileId", loanFileId))
      .order("asc")
      .collect();
  },
});

// Get all tasks for a client
export const getTasksByClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, { clientId }) => {
    // First get all loan files for this client
    const loanFiles = await ctx.db
      .query("loanFiles")
      .withIndex("by_client", (q) => q.eq("clientId", clientId))
      .collect();

    // Then get all tasks for these loan files
    const allTasks = [];
    for (const loanFile of loanFiles) {
      const tasks = await ctx.db
        .query("tasks")
        .withIndex("by_loan_file", (q) => q.eq("loanFileId", loanFile._id))
        .collect();
      allTasks.push(...tasks);
    }

    return allTasks.sort((a, b) => a.order - b.order);
  },
});

// Get all tasks for an advisor
export const getTasksByAdvisor = query({
  args: { advisorId: v.id("users") },
  handler: async (ctx, { advisorId }) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_assignee", (q) => q.eq("assigneeUserId", advisorId))
      .order("asc")
      .collect();
  },
});

// Get all tasks in a workspace
export const getTasksByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .order("asc")
      .collect();
  },
});

// Update task status
export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("overdue")),
    completedAt: v.optional(v.number()),
  },
  handler: async (ctx, { taskId, status, completedAt }) => {
    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new ConvexError("Task not found");
    }

    const updates: any = {
      status,
      updatedAt: Date.now(),
    };

    if (status === "completed" && completedAt) {
      updates.completedAt = completedAt;
    } else if (status !== "completed") {
      updates.completedAt = undefined;
    }

    await ctx.db.patch(taskId, updates);
    return { success: true, message: "Task status updated" };
  },
});

// Update task assignee
export const updateTaskAssignee = mutation({
  args: {
    taskId: v.id("tasks"),
    assigneeUserId: v.optional(v.id("users")),
    assigneeRole: v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT")),
  },
  handler: async (ctx, { taskId, assigneeUserId, assigneeRole }) => {
    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new ConvexError("Task not found");
    }

    await ctx.db.patch(taskId, {
      assigneeUserId,
      assigneeRole,
      updatedAt: Date.now(),
    });

    return { success: true, message: "Task assignee updated" };
  },
});

// Update task priority
export const updateTaskPriority = mutation({
  args: {
    taskId: v.id("tasks"),
    priority: v.union(v.literal("low"), v.literal("normal"), v.literal("high"), v.literal("urgent")),
  },
  handler: async (ctx, { taskId, priority }) => {
    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new ConvexError("Task not found");
    }

    await ctx.db.patch(taskId, {
      priority,
      updatedAt: Date.now(),
    });

    return { success: true, message: "Task priority updated" };
  },
});

// Update task due date
export const updateTaskDueDate = mutation({
  args: {
    taskId: v.id("tasks"),
    dueDate: v.number(),
  },
  handler: async (ctx, { taskId, dueDate }) => {
    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new ConvexError("Task not found");
    }

    await ctx.db.patch(taskId, {
      dueDate,
      updatedAt: Date.now(),
    });

    return { success: true, message: "Task due date updated" };
  },
});

// Add comment/note to task
export const addTaskNote = mutation({
  args: {
    taskId: v.id("tasks"),
    note: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, { taskId, note, userId }) => {
    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new ConvexError("Task not found");
    }

    // For now, we'll store notes in the instructions field
    // In a production system, you might want a separate taskNotes table
    const currentInstructions = task.instructions;
    const newInstructions = `${currentInstructions}\n\n--- Note added on ${new Date().toLocaleDateString()} ---\n${note}`;

    await ctx.db.patch(taskId, {
      instructions: newInstructions,
      updatedAt: Date.now(),
    });

    return { success: true, message: "Note added to task" };
  },
});

// Update a task
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    updates: v.object({
      status: v.optional(v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("overdue"))),
      completedAt: v.optional(v.number()),
      clientNote: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    await ctx.db.patch(args.taskId, {
      ...args.updates,
      updatedAt: Date.now(),
    });

    return args.taskId;
  },
});

// Delete a task
export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    const task = await ctx.db.get(taskId);
    if (!task) {
      throw new ConvexError("Task not found");
    }

    await ctx.db.delete(taskId);
    return { success: true, message: "Task deleted" };
  },
});

// Get task statistics for a workspace
export const getTaskStats = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const allTasks = await ctx.db
      .query("tasks")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .collect();

    const stats = {
      total: allTasks.length,
      pending: allTasks.filter(t => t.status === "pending").length,
      inProgress: allTasks.filter(t => t.status === "in_progress").length,
      completed: allTasks.filter(t => t.status === "completed").length,
      overdue: allTasks.filter(t => t.status === "overdue").length,
      byPriority: {
        low: allTasks.filter(t => t.priority === "low").length,
        normal: allTasks.filter(t => t.priority === "normal").length,
        high: allTasks.filter(t => t.priority === "high").length,
        urgent: allTasks.filter(t => t.priority === "urgent").length,
      },
    };

    return stats;
  },
});

// List tasks by client (for client portal)
export const listByClient = query({
  args: { 
    workspaceId: v.id("workspaces"),
    clientId: v.id("users"),
  },
  handler: async (ctx, { workspaceId, clientId }) => {
    // Check if user has permission to view tasks
    const membership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", clientId))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .first();

    if (!membership || membership.role !== "CLIENT") {
      return [];
    }

    // Get the user's email to find their client record
    const user = await ctx.db.get(clientId);
    if (!user) return [];

    // Find the client record by email
    const client = await ctx.db
      .query("clients")
      .withIndex("by_email", (q) => q.eq("email", user.email))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .first();

    if (!client) return [];

    // Get tasks for this client (both from loan files and client-specific tasks)
    const loanFileTasks = await ctx.db
      .query("tasks")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => 
        q.and(
          q.eq(q.field("assigneeRole"), "CLIENT"),
          q.eq(q.field("assigneeUserId"), clientId)
        )
      )
      .collect();

    const clientTasks = await ctx.db
      .query("clientTasks")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => 
        q.and(
          q.eq(q.field("clientId"), client._id),
          q.eq(q.field("assigneeRole"), "CLIENT")
        )
      )
      .collect();

    // Combine and format tasks
    const allTasks = [
      ...loanFileTasks.map(task => ({
        _id: task._id,
        title: task.title,
        description: task.instructions,
        status: task.status,
        priority: task.priority,
        dueAt: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
      ...clientTasks.map(task => ({
        _id: task._id,
        title: task.title,
        description: task.instructions,
        status: task.status,
        priority: task.priority,
        dueAt: task.dueDate || (task.createdAt + (task.dueInDays * 24 * 60 * 60 * 1000)),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      }))
    ];

    return allTasks.sort((a, b) => (b.dueAt || 0) - (a.dueAt || 0));
  },
});

// List all tasks in a workspace
export const listByWorkspace = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();

    return tasks;
  },
});
