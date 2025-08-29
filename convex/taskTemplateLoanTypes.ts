import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Associate a task template with multiple loan types
export const associateWithLoanTypes = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    taskTemplateId: v.id("taskTemplates"),
    loanTypeIds: v.array(v.id("loanTypes")),
  },
  handler: async (ctx, { workspaceId, taskTemplateId, loanTypeIds }) => {
    // Remove existing associations
    const existingAssociations = await ctx.db
      .query("taskTemplateLoanTypes")
      .withIndex("by_task_template", (q) => q.eq("taskTemplateId", taskTemplateId))
      .collect();

    for (const association of existingAssociations) {
      await ctx.db.delete(association._id);
    }

    // Create new associations
    const now = Date.now();
    const associations = [];
    
    for (const loanTypeId of loanTypeIds) {
      const associationId = await ctx.db.insert("taskTemplateLoanTypes", {
        workspaceId,
        taskTemplateId,
        loanTypeId,
        createdAt: now,
      });
      associations.push(associationId);
    }

    return associations;
  },
});

// Get all loan types associated with a task template
export const getLoanTypesForTaskTemplate = query({
  args: { taskTemplateId: v.id("taskTemplates") },
  handler: async (ctx, { taskTemplateId }) => {
    const associations = await ctx.db
      .query("taskTemplateLoanTypes")
      .withIndex("by_task_template", (q) => q.eq("taskTemplateId", taskTemplateId))
      .collect();

    const loanTypes = await Promise.all(
      associations.map(async (association) => {
        const loanType = await ctx.db.get(association.loanTypeId);
        return loanType;
      })
    );

    return loanTypes.filter(Boolean);
  },
});

// Get all task templates associated with a loan type
export const getTaskTemplatesForLoanType = query({
  args: { loanTypeId: v.id("loanTypes") },
  handler: async (ctx, { loanTypeId }) => {
    const associations = await ctx.db
      .query("taskTemplateLoanTypes")
      .withIndex("by_loan_type", (q) => q.eq("loanTypeId", loanTypeId))
      .collect();

    const taskTemplates = await Promise.all(
      associations.map(async (association) => {
        const taskTemplate = await ctx.db.get(association.taskTemplateId);
        return taskTemplate;
      })
    );

    return taskTemplates.filter(Boolean);
  },
});

// Get all task templates with their associated loan types for a workspace
export const getTaskTemplatesWithLoanTypes = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const taskTemplates = await ctx.db
      .query("taskTemplates")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .order("asc")
      .collect();

    const taskTemplatesWithLoanTypes = await Promise.all(
      taskTemplates.map(async (taskTemplate) => {
        const associations = await ctx.db
          .query("taskTemplateLoanTypes")
          .withIndex("by_task_template", (q) => q.eq("taskTemplateId", taskTemplate._id))
          .collect();

        const loanTypes = await Promise.all(
          associations.map(async (association) => {
            const loanType = await ctx.db.get(association.loanTypeId);
            return loanType;
          })
        );

        return {
          ...taskTemplate,
          loanTypes: loanTypes.filter(Boolean),
        };
      })
    );

    return taskTemplatesWithLoanTypes;
  },
});
