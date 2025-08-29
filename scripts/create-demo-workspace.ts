import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { config } from "dotenv";

// Load environment variables
config({ path: '.env.local' });

// Create a demo workspace with real Convex IDs
async function createDemoWorkspace() {
  const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);
  
  try {
    console.log("🚀 Creating demo workspace with real Convex IDs...");
    
    // Check if demo workspace already exists to avoid duplicates
    // For now, we'll just create a new one since we don't have a user ID yet
    console.log("ℹ️  Creating new demo workspace...");
    
    // Create a demo user first (required for workspace ownership)
    const demoUserId = await client.mutation(api.users.create, {
      email: "demo@loanflowpro.com",
      name: "Demo User"
    });
    
    console.log("✅ Created demo user:", demoUserId);
    
    // Create a demo workspace
    const workspaceId = await client.mutation(api.workspaces.create, {
      name: "Demo Workspace",
      ownerUserId: demoUserId
    });
    
    console.log("✅ Created demo workspace:", workspaceId);
    
    // Create demo loan types
    const loanType1 = await client.mutation(api.loanTypes.create, {
      workspaceId,
      name: "Conventional Mortgage",
      description: "Standard 30-year fixed rate mortgage",
      category: "Residential",
      stages: ["Application", "Processing", "Underwriting", "Approval", "Closing"],
      status: "active"
    });
    
    const loanType2 = await client.mutation(api.loanTypes.create, {
      workspaceId,
      name: "FHA Loan",
      description: "Federal Housing Administration loan",
      category: "Residential",
      stages: ["Application", "Processing", "Underwriting", "Approval", "Closing"],
      status: "active"
    });
    
    const loanType3 = await client.mutation(api.loanTypes.create, {
      workspaceId,
      name: "VA Loan",
      description: "Veterans Affairs loan",
      category: "Residential",
      stages: ["Application", "Processing", "Underwriting", "Approval", "Closing"],
      status: "active"
    });
    
    console.log("✅ Created demo loan types:", { loanType1, loanType2, loanType3 });
    
    // Create demo clients
    const client1 = await client.mutation(api.clients.create, {
      workspaceId,
      name: "John Smith",
      email: "john.smith@demo.com",
      phone: "+1-555-0101"
    });
    
    const client2 = await client.mutation(api.clients.create, {
      workspaceId,
      name: "Sarah Johnson",
      email: "sarah.johnson@demo.com",
      phone: "+1-555-0102"
    });
    
    const client3 = await client.mutation(api.clients.create, {
      workspaceId,
      name: "Mike Davis",
      email: "mike.davis@demo.com",
      phone: "+1-555-0103"
    });
    
    console.log("✅ Created demo clients:", { client1, client2, client3 });
    
    // Create demo task templates
    const taskTemplate1 = await client.mutation(api.taskTemplates.create, {
      workspaceId,
      title: "Initial Consultation",
      instructions: "First meeting with client",
      dueInDays: 1,
      assigneeRole: "ADVISOR",
      isRequired: true,
      attachmentsAllowed: true,
      priority: "normal",
      order: 1
    });
    
    const taskTemplate2 = await client.mutation(api.taskTemplates.create, {
      workspaceId,
      title: "Document Review",
      instructions: "Review client documents",
      dueInDays: 2,
      assigneeRole: "ADVISOR",
      isRequired: true,
      attachmentsAllowed: true,
      priority: "high",
      order: 2
    });
    
    console.log("✅ Created demo task templates:", { taskTemplate1, taskTemplate2 });
    
    // Create a demo loan file for tasks
    const demoLoanFile = await client.mutation(api.loanFiles.create, {
      workspaceId,
      clientId: client1,
      loanTypeId: loanType1,
      status: "draft",
      currentStage: "initial",
      advisorId: demoUserId
    });
    
    console.log("✅ Created demo loan file:", demoLoanFile);
    
    // Create demo tasks
    const task1 = await client.mutation(api.tasks.create, {
      workspaceId,
      title: "Follow up with John Smith",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      priority: "normal",
      status: "pending",
      assigneeUserId: demoUserId,
      loanFileId: demoLoanFile,
      instructions: "Call to discuss loan options"
    });
    
    const task2 = await client.mutation(api.tasks.create, {
      workspaceId,
      title: "Review Sarah's documents",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "high",
      status: "pending",
      assigneeUserId: demoUserId,
      loanFileId: demoLoanFile,
      instructions: "Check income verification and credit report"
    });
    
    console.log("✅ Created demo tasks:", { task1, task2 });
    
    // Create client-loan type assignments
    await client.mutation(api.clientLoanTypes.assignLoanTypeToClient, {
      workspaceId,
      clientId: client1,
      loanTypeId: loanType1,
      assignedBy: demoUserId
    });
    
    await client.mutation(api.clientLoanTypes.assignLoanTypeToClient, {
      workspaceId,
      clientId: client1,
      loanTypeId: loanType2,
      assignedBy: demoUserId
    });
    
    await client.mutation(api.clientLoanTypes.assignLoanTypeToClient, {
      workspaceId,
      clientId: client2,
      loanTypeId: loanType1,
      assignedBy: demoUserId
    });
    
    console.log("✅ Created client-loan type assignments");
    
    // Create task template loan type associations
    await client.mutation(api.taskTemplateLoanTypes.associateWithLoanTypes, {
      workspaceId,
      taskTemplateId: taskTemplate1,
      loanTypeIds: [loanType1]
    });
    
    await client.mutation(api.taskTemplateLoanTypes.associateWithLoanTypes, {
      workspaceId,
      taskTemplateId: taskTemplate2,
      loanTypeIds: [loanType2]
    });
    
    console.log("✅ Created task template loan type associations");
    
    console.log("\n🎉 Demo workspace created successfully!");
    console.log("📋 Workspace ID:", workspaceId);
    console.log("🏠 Loan Types:", [loanType1, loanType2, loanType3].length);
    console.log("👥 Clients:", [client1, client2, client3].length);
    console.log("📝 Task Templates:", [taskTemplate1, taskTemplate2].length);
    console.log("✅ Tasks:", [task1, task2].length);
    
    // Save the demo workspace ID to a file for the frontend to use
    const fs = await import('fs');
    const demoData = {
      workspaceId,
      loanTypeIds: [loanType1, loanType2, loanType3],
      clientIds: [client1, client2, client3],
      taskTemplateIds: [taskTemplate1, taskTemplate2],
      taskIds: [task1, task2]
    };
    
    fs.writeFileSync('./demo-workspace-data.json', JSON.stringify(demoData, null, 2));
    console.log("💾 Demo data saved to demo-workspace-data.json");
    
    return demoData;
    
  } catch (error) {
    console.error("❌ Error creating demo workspace:", error);
    throw error;
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  createDemoWorkspace()
    .then(() => {
      console.log("✅ Demo workspace creation completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Demo workspace creation failed:", error);
      process.exit(1);
    });
}

export { createDemoWorkspace };
