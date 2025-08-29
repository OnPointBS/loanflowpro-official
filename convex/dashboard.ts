import { v } from "convex/values";
import { query } from "./_generated/server";

// Get dashboard statistics for a workspace
export const getDashboardStats = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    // Get all data for this workspace
    const clients = await ctx.db
      .query("clients")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    const loanFiles = await ctx.db
      .query("loanFiles")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("status"), "in_progress"))
      .collect();

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("status"), "ready"))
      .collect();

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    // Calculate stats
    const stats = {
      activeClients: clients.length,
      activeLoanFiles: loanFiles.length,
      totalDocuments: documents.length,
      pendingTasks: tasks.length,
    };

    return stats;
  },
});

// Get recent activity for dashboard
export const getRecentActivity = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    // Get recent clients
    const recentClients = await ctx.db
      .query("clients")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.gte(q.field("createdAt"), oneDayAgo))
      .order("desc")
      .take(3);

    // Get recent loan file updates
    const recentLoanFiles = await ctx.db
      .query("loanFiles")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.gte(q.field("updatedAt"), oneDayAgo))
      .order("desc")
      .take(3);

    // Get recent documents
    const recentDocuments = await ctx.db
      .query("documents")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.gte(q.field("createdAt"), oneDayAgo))
      .order("desc")
      .take(3);

    // Format activity items
    const activities = [];

    // Add client activities
    for (const client of recentClients) {
      activities.push({
        id: `client-${client._id}`,
        type: 'client' as const,
        message: `New client "${client.name}" added`,
        time: getTimeAgo(client.createdAt),
        priority: 'high' as const,
        timestamp: client.createdAt
      });
    }

    // Add loan file activities
    for (const loanFile of recentLoanFiles) {
      activities.push({
        id: `loan-${loanFile._id}`,
        type: 'loan' as const,
        message: `Loan file updated to ${loanFile.status.replace('_', ' ')}`,
        time: getTimeAgo(loanFile.updatedAt),
        priority: 'medium' as const,
        timestamp: loanFile.updatedAt
      });
    }

    // Add document activities
    for (const doc of recentDocuments) {
      activities.push({
        id: `doc-${doc._id}`,
        type: 'document' as const,
        message: `Document "${doc.fileName}" uploaded`,
        time: getTimeAgo(doc.createdAt),
        priority: 'low' as const,
        timestamp: doc.createdAt
      });
    }

    // Sort by timestamp (most recent first) and take top 5
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  },
});

// Get today's tasks for dashboard
export const getTodaysTasks = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    const now = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    const todayEnd = todayStart + (24 * 60 * 60 * 1000);

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => 
        q.and(
          q.gte(q.field("dueDate"), todayStart),
          q.lt(q.field("dueDate"), todayEnd),
          q.neq(q.field("status"), "completed")
        )
      )
      .order("asc")
      .take(5);

    return tasks.map(task => ({
      id: task._id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assigneeRole: task.assigneeRole,
      progress: task.status === 'completed' ? 100 : 
                task.status === 'in_progress' ? 75 :
                task.status === 'pending' ? 25 : 0
    }));
  },
});

// Helper function to format time ago
function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
}
