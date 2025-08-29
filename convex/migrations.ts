import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Migration to clean up old taskTemplates with loanTypeId
export const migrateTaskTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all taskTemplates and check which ones need migration
    const allTaskTemplates = await ctx.db
      .query("taskTemplates")
      .collect();

    let migratedCount = 0;

    for (const template of allTaskTemplates) {
      try {
        // Check if this task template already has associations
        const existingAssociations = await ctx.db
          .query("taskTemplateLoanTypes")
          .withIndex("by_task_template", (q) => q.eq("taskTemplateId", template._id))
          .collect();

        // If no associations exist, create a default one
        if (existingAssociations.length === 0) {
          // Find any loan type in the workspace to associate with
          const anyLoanType = await ctx.db
            .query("loanTypes")
            .withIndex("by_workspace", (q) => q.eq("workspaceId", template.workspaceId))
            .first();

          if (anyLoanType) {
            await ctx.db.insert("taskTemplateLoanTypes", {
              workspaceId: template.workspaceId,
              taskTemplateId: template._id,
              loanTypeId: anyLoanType._id,
              createdAt: Date.now(),
            });
            migratedCount++;
            console.log(`Migrated task template: ${template.title}`);
          }
        }
      } catch (error) {
        console.error(`Error migrating task template ${template._id}:`, error);
      }
    }

    return { migrated: migratedCount };
  },
});

// Get migration status
export const getMigrationStatus = query({
  args: {},
  handler: async (ctx) => {
    const allTaskTemplates = await ctx.db
      .query("taskTemplates")
      .collect();

    const taskTemplatesWithAssociations = await Promise.all(
      allTaskTemplates.map(async (taskTemplate) => {
        const associations = await ctx.db
          .query("taskTemplateLoanTypes")
          .withIndex("by_task_template", (q) => q.eq("taskTemplateId", taskTemplate._id))
          .collect();

        return {
          taskTemplateId: taskTemplate._id,
          title: taskTemplate.title,
          hasAssociations: associations.length > 0,
          associationCount: associations.length,
        };
      })
    );

    return {
      totalTaskTemplates: allTaskTemplates.length,
      taskTemplatesWithAssociations,
    };
  },
});
