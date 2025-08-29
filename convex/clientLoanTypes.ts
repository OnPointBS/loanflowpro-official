import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

// Assign a loan type to a client (this will clone all tasks)
export const assignLoanTypeToClient = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients"),
    loanTypeId: v.id("loanTypes"),
    customOrder: v.optional(v.number()),
    customName: v.optional(v.string()),
    notes: v.optional(v.string()),
    assignedBy: v.id("users"),
  },
  handler: async (ctx, { workspaceId, clientId, loanTypeId, customOrder, customName, notes, assignedBy }) => {
    // Check if this loan type is already assigned to this client
    const existingAssignments = await ctx.db
      .query("clientLoanTypes")
      .withIndex("by_workspace_client", (q) => 
        q.eq("workspaceId", workspaceId).eq("clientId", clientId)
      )
      .filter((q) => q.eq(q.field("loanTypeId"), loanTypeId))
      .collect();

    // If this is a duplicate, suggest a better custom name
    if (existingAssignments.length > 0 && !customName) {
      const baseName = (await ctx.db.get(loanTypeId))?.name || "Loan";
      const duplicateCount = existingAssignments.length + 1;
      const suggestedName = `${baseName} #${duplicateCount}`;
      
      // Update the custom name to avoid conflicts
      customName = suggestedName;
    }

    // Get the next custom order if not provided
    let finalCustomOrder = customOrder;
    if (finalCustomOrder === undefined) {
      const lastAssignment = await ctx.db
        .query("clientLoanTypes")
        .withIndex("by_workspace_client", (q) => 
          q.eq("workspaceId", workspaceId).eq("clientId", clientId)
        )
        .order("desc")
        .first();
      
      finalCustomOrder = (lastAssignment?.customOrder || 0) + 1;
    }

    // Create the client loan type assignment
    const clientLoanTypeId = await ctx.db.insert("clientLoanTypes", {
      workspaceId,
      clientId,
      loanTypeId,
      customOrder: finalCustomOrder,
      isActive: true,
      assignedAt: Date.now(),
      assignedBy,
      customName: customName || undefined,
      notes: notes || "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Get task templates associated with this loan type
    const taskTemplateLoanTypes = await ctx.db
      .query("taskTemplateLoanTypes")
      .withIndex("by_loan_type", (q) => q.eq("loanTypeId", loanTypeId))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();

    console.log(`Found ${taskTemplateLoanTypes.length} task template associations for loan type ${loanTypeId}`);

    // Get the actual task templates
    const taskTemplates = await Promise.all(
      taskTemplateLoanTypes.map(async (ttlt) => {
        return await ctx.db.get(ttlt.taskTemplateId);
      })
    );

    // Filter out any null templates and ensure they're from the same workspace
    const validTaskTemplates = taskTemplates
      .filter((template): template is NonNullable<typeof template> => 
        template !== null && template.workspaceId === workspaceId
      );

    console.log(`Found ${validTaskTemplates.length} valid task templates to clone`);

    // Clone all tasks for this client
    const now = Date.now();
    const clonedTasks = [];

    try {
      for (const template of validTaskTemplates) {
        // Calculate due date based on template's dueInDays
        const dueDate = now + (template.dueInDays * 24 * 60 * 60 * 1000);
        
        const taskId = await ctx.db.insert("clientTasks", {
          workspaceId,
          clientId,
          clientLoanTypeId,
          taskTemplateId: template._id,
          title: template.title,
          assigneeRole: template.assigneeRole,
          instructions: template.instructions,
          isRequired: template.isRequired,
          dueInDays: template.dueInDays,
          attachmentsAllowed: template.attachmentsAllowed,
          priority: template.priority,
          order: template.order,
          status: "pending",
          dueDate,
          createdAt: now,
          updatedAt: now,
        });

        clonedTasks.push({
          id: taskId,
          title: template.title,
          assigneeRole: template.assigneeRole,
          priority: template.priority,
          dueDate,
        });
      }
    } catch (error) {
      console.error('Error cloning tasks:', error);
      throw new ConvexError(`Failed to clone tasks: ${error}`);
    }

    return {
      clientLoanTypeId,
      tasksCloned: clonedTasks.length,
      message: `Loan type assigned successfully with ${clonedTasks.length} tasks cloned`
    };
  },
});

// Get all loan types assigned to a client
export const getClientLoanTypes = query({
  args: { 
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients")
  },
  handler: async (ctx, { workspaceId, clientId }) => {
    const assignments = await ctx.db
      .query("clientLoanTypes")
      .withIndex("by_workspace_client", (q) => 
        q.eq("workspaceId", workspaceId).eq("clientId", clientId)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();

    // Get the loan type details for each assignment
    const assignmentsWithDetails = await Promise.all(
      assignments.map(async (assignment) => {
        const loanType = await ctx.db.get(assignment.loanTypeId);
        return {
          ...assignment,
          loanType,
        };
      })
    );

    return assignmentsWithDetails;
  },
});

// Get all client loan type assignments for a workspace
export const listByWorkspace = query({
  args: { 
    workspaceId: v.id("workspaces")
  },
  handler: async (ctx, { workspaceId }) => {
    const assignments = await ctx.db
      .query("clientLoanTypes")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();

    // Get the loan type and client details for each assignment
    const assignmentsWithDetails = await Promise.all(
      assignments.map(async (assignment) => {
        const loanType = await ctx.db.get(assignment.loanTypeId);
        const client = await ctx.db.get(assignment.clientId);
        const assignedBy = await ctx.db.get(assignment.assignedBy);
        return {
          ...assignment,
          loanType,
          client,
          assignedBy,
        };
      })
    );

    return assignmentsWithDetails;
  },
});

// Get all tasks for a specific client
export const getClientTasks = query({
  args: { 
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients")
  },
  handler: async (ctx, { workspaceId, clientId }) => {
    const tasks = await ctx.db
      .query("clientTasks")
      .withIndex("by_client", (q) => q.eq("clientId", clientId))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .order("asc")
      .collect();

    // Group tasks by loan type assignment
    const tasksByLoanType: Record<string, any> = {};
    
    for (const task of tasks) {
      const clientLoanType = await ctx.db.get(task.clientLoanTypeId);
      if (clientLoanType) {
        const loanType = await ctx.db.get(clientLoanType.loanTypeId);
        const key = clientLoanType._id;
        
        if (!tasksByLoanType[key]) {
          tasksByLoanType[key] = {
            clientLoanType,
            loanType,
            tasks: []
          };
        }
        
        tasksByLoanType[key].tasks.push(task);
      }
    }

    return Object.values(tasksByLoanType);
  },
});

// Get all client tasks for a workspace
export const listClientTasksByWorkspace = query({
  args: { 
    workspaceId: v.id("workspaces")
  },
  handler: async (ctx, { workspaceId }) => {
    const tasks = await ctx.db
      .query("clientTasks")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .order("asc")
      .collect();

    // Get additional details for each task
    const tasksWithDetails = await Promise.all(
      tasks.map(async (task) => {
        const client = await ctx.db.get(task.clientId);
        const clientLoanType = await ctx.db.get(task.clientLoanTypeId);
        const loanType = clientLoanType ? await ctx.db.get(clientLoanType.loanTypeId) : null;
        return {
          ...task,
          client,
          clientLoanType,
          loanType,
        };
      })
    );

    return tasksWithDetails;
  },
});

// Update task order for a client
export const updateClientTaskOrder = mutation({
  args: {
    taskId: v.id("clientTasks"),
    newOrder: v.number(),
  },
  handler: async (ctx, { taskId, newOrder }) => {
    await ctx.db.patch(taskId, {
      order: newOrder,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Update client task status
export const updateClientTaskStatus = mutation({
  args: {
    taskId: v.id("clientTasks"),
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("overdue"), v.literal("skipped")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { taskId, status, notes }) => {
    const updates: any = {
      status,
      updatedAt: Date.now(),
    };

    if (status === "completed") {
      updates.completedAt = Date.now();
    }

    if (notes) {
      updates.clientNotes = notes;
    }

    await ctx.db.patch(taskId, updates);

    return { success: true };
  },
});

// Remove a loan type assignment from a client (and all associated tasks)
export const removeLoanTypeFromClient = mutation({
  args: {
    clientLoanTypeId: v.id("clientLoanTypes"),
  },
  handler: async (ctx, { clientLoanTypeId }) => {
    // Get the assignment to check if it exists
    const assignment = await ctx.db.get(clientLoanTypeId);
    if (!assignment) {
      throw new ConvexError("Loan type assignment not found");
    }

    // Delete all associated tasks
    const tasks = await ctx.db
      .query("clientTasks")
      .withIndex("by_client_loan_type", (q) => q.eq("clientLoanTypeId", clientLoanTypeId))
      .collect();

    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    // Delete the assignment
    await ctx.db.delete(clientLoanTypeId);

    return {
      success: true,
      tasksDeleted: tasks.length,
      message: `Removed loan type and ${tasks.length} associated tasks`
    };
  },
});

// Update custom name for a client loan type assignment
export const updateClientLoanTypeCustomName = mutation({
  args: {
    clientLoanTypeId: v.id("clientLoanTypes"),
    customName: v.optional(v.string()),
  },
  handler: async (ctx, { clientLoanTypeId, customName }) => {
    await ctx.db.patch(clientLoanTypeId, {
      customName: customName || undefined,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Update loan type assignment details
export const updateClientLoanTypeAssignment = mutation({
  args: {
    clientLoanTypeId: v.id("clientLoanTypes"),
    updates: v.object({
      customName: v.optional(v.string()),
      notes: v.optional(v.string()),
      customOrder: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, { clientLoanTypeId, updates }) => {
    await ctx.db.patch(clientLoanTypeId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Reorder loan type assignments for a client
export const reorderClientLoanTypes = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients"),
    newOrder: v.array(v.object({
      clientLoanTypeId: v.id("clientLoanTypes"),
      newOrder: v.number(),
    })),
  },
  handler: async (ctx, { workspaceId, clientId, newOrder }) => {
    // Update each assignment with its new order
    for (const item of newOrder) {
      await ctx.db.patch(item.clientLoanTypeId, {
        customOrder: item.newOrder,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Get task statistics for a client
export const getClientTaskStats = query({
  args: { 
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients")
  },
  handler: async (ctx, { workspaceId, clientId }) => {
    const tasks = await ctx.db
      .query("clientTasks")
      .withIndex("by_client", (q) => q.eq("clientId", clientId))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();

    const stats = {
      total: tasks.length,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
      skipped: 0,
      ready_for_review: 0,
      highPriority: 0,
      urgent: 0,
    };

    const now = Date.now();

    for (const task of tasks) {
      // Count by status
      if (task.status === "in_progress") {
        stats.inProgress++;
      } else {
        stats[task.status]++;
      }
      
      // Count by priority
      if (task.priority === "high") stats.highPriority++;
      if (task.priority === "urgent") stats.urgent++;
      
      // Check if overdue
      if (task.status === "pending" && task.dueDate && task.dueDate < now) {
        stats.overdue++;
      }
    }

    return stats;
  },
});

// Get tasks for a specific client loan type assignment
export const getTasksByClientLoanType = query({
  args: { 
    workspaceId: v.id("workspaces"),
    clientLoanTypeId: v.id("clientLoanTypes")
  },
  handler: async (ctx, { workspaceId, clientLoanTypeId }) => {
    const tasks = await ctx.db
      .query("clientTasks")
      .withIndex("by_client_loan_type", (q) => q.eq("clientLoanTypeId", clientLoanTypeId))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .order("asc")
      .collect();

    // Get additional details for each task
    const tasksWithDetails = await Promise.all(
      tasks.map(async (task) => {
        const taskTemplate = task.taskTemplateId ? await ctx.db.get(task.taskTemplateId) : null;
        return {
          ...task,
          taskTemplate,
        };
      })
    );

    return tasksWithDetails;
  },
});

// Create a new custom task for a client loan type
export const createCustomClientTask = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients"),
    clientLoanTypeId: v.id("clientLoanTypes"),
    title: v.string(),
    instructions: v.string(),
    assigneeRole: v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT")),
    priority: v.union(v.literal("low"), v.literal("normal"), v.literal("high"), v.literal("urgent")),
    dueInDays: v.number(),
    attachmentsAllowed: v.boolean(),
    isRequired: v.boolean(),
  },
  handler: async (ctx, { 
    workspaceId, 
    clientId, 
    clientLoanTypeId, 
    title, 
    instructions, 
    assigneeRole, 
    priority, 
    dueInDays, 
    attachmentsAllowed, 
    isRequired 
  }) => {
    const now = Date.now();
    const dueDate = now + (dueInDays * 24 * 60 * 60 * 1000);

    // Get the current highest order for this client loan type
    const existingTasks = await ctx.db
      .query("clientTasks")
      .withIndex("by_client_loan_type", (q) => q.eq("clientLoanTypeId", clientLoanTypeId))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .order("desc")
      .first();

    const newOrder = existingTasks ? existingTasks.order + 1 : 1;

    const taskId = await ctx.db.insert("clientTasks", {
      workspaceId,
      clientId,
      clientLoanTypeId,
      title,
      assigneeRole,
      instructions,
      isRequired,
      dueInDays,
      attachmentsAllowed,
      priority,
      order: newOrder,
      status: "pending",
      dueDate,
      createdAt: now,
      updatedAt: now,
    });

    return {
      success: true,
      taskId,
      message: "Custom task created successfully"
    };
  },
});

// Update a client task
export const updateClientTask = mutation({
  args: {
    taskId: v.id("clientTasks"),
    updates: v.object({
      title: v.optional(v.string()),
      instructions: v.optional(v.string()),
      assigneeRole: v.optional(v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT"))),
      priority: v.optional(v.union(v.literal("low"), v.literal("normal"), v.literal("high"), v.literal("urgent"))),
      dueInDays: v.optional(v.number()),
      attachmentsAllowed: v.optional(v.boolean()),
      isRequired: v.optional(v.boolean()),
      status: v.optional(v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("overdue"), v.literal("skipped"), v.literal("ready_for_review"))),
      clientNotes: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { taskId, updates }) => {
    const updateData: any = {
      ...updates,
      updatedAt: Date.now(),
    };

    // If dueInDays is updated, recalculate dueDate
    if (updates.dueInDays !== undefined) {
      const task = await ctx.db.get(taskId);
      if (task) {
        const dueDate = task.createdAt + (updates.dueInDays * 24 * 60 * 60 * 1000);
        updateData.dueDate = dueDate;
      }
    }

    await ctx.db.patch(taskId, updateData);

    return {
      success: true,
      message: "Task updated successfully"
    };
  },
});

// Delete a client task
export const deleteClientTask = mutation({
  args: {
    taskId: v.id("clientTasks"),
  },
  handler: async (ctx, { taskId }) => {
    await ctx.db.delete(taskId);

    return {
      success: true,
      message: "Task deleted successfully"
    };
  },
});
