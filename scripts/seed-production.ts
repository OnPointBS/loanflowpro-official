import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { config } from "dotenv";

// Load production environment variables
config({ path: "env.production" });

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

async function seedProduction() {
  console.log("🌱 Seeding production database...");
  console.log("🔗 Convex URL:", process.env.VITE_CONVEX_URL);

  try {
    // Create demo user first
    console.log("Creating demo user...");
    const userId = await client.mutation(api.users.create, {
      email: "demo@loanflowpro.com",
      name: "Demo User",
    });
    console.log("✅ Created demo user:", userId);
    
    // Create demo workspace
    console.log("Creating demo workspace...");
    const workspaceId = await client.mutation(api.workspaces.create, {
      name: "Demo Financial Advisory",
      ownerUserId: userId,
    });
    console.log("✅ Created workspace:", workspaceId);

    // Create demo clients
    console.log("Creating demo clients...");
    const client1Id = await client.mutation(api.clients.create, {
      workspaceId,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0123",
      notes: "First-time homebuyer, excellent credit score",
    });
    console.log("✅ Created client 1:", client1Id);

    const client2Id = await client.mutation(api.clients.create, {
      workspaceId,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1-555-0456",
      notes: "Refinancing existing mortgage, stable income",
    });
    console.log("✅ Created client 2:", client2Id);

    const client3Id = await client.mutation(api.clients.create, {
      workspaceId,
      name: "Mike Davis",
      email: "mike.davis@email.com",
      phone: "+1-555-0789",
      notes: "Commercial property investor, multiple properties",
    });
    console.log("✅ Created client 3:", client3Id);

    // Create demo loan types
    console.log("Creating demo loan types...");
    const loanType1Id = await client.mutation(api.loanTypes.create, {
      workspaceId,
      name: "FHA Loan (Residential)",
      description: "Federal Housing Administration backed loan with lower down payment requirements",
      category: "Residential",
      stages: ["Application", "Documentation", "Underwriting", "Approval", "Closing"],
      minLoanAmount: 50000,
      maxLoanAmount: 1000000,
      minInterestRate: 2.5,
      maxInterestRate: 5.0,
    });
    console.log("✅ Created loan type 1:", loanType1Id);

    const loanType2Id = await client.mutation(api.loanTypes.create, {
      workspaceId,
      name: "Conventional Loan",
      description: "Traditional mortgage loan with competitive interest rates",
      category: "Residential",
      stages: ["Application", "Documentation", "Underwriting", "Approval", "Closing"],
      minLoanAmount: 100000,
      maxLoanAmount: 2000000,
      minInterestRate: 2.0,
      maxInterestRate: 4.5,
    });
    console.log("✅ Created loan type 2:", loanType2Id);

    const loanType3Id = await client.mutation(api.loanTypes.create, {
      workspaceId,
      name: "Commercial Loan",
      description: "Business property financing with flexible terms",
      category: "Commercial",
      stages: ["Application", "Business Plan", "Financial Review", "Property Appraisal", "Underwriting", "Approval", "Closing"],
      minLoanAmount: 250000,
      maxLoanAmount: 10000000,
      minInterestRate: 3.0,
      maxInterestRate: 6.0,
    });
    console.log("✅ Created loan type 3:", loanType3Id);

    // Create demo loan files
    console.log("Creating demo loan files...");
    const loanFile1Id = await client.mutation(api.loanFiles.create, {
      workspaceId,
      clientId: client1Id,
      loanTypeId: loanType1Id,
      advisorId: userId,
      status: "in_progress",
      currentStage: "Documentation",
    });
    console.log("✅ Created loan file 1:", loanFile1Id);

    const loanFile2Id = await client.mutation(api.loanFiles.create, {
      workspaceId,
      clientId: client2Id,
      loanTypeId: loanType2Id,
      advisorId: userId,
      status: "draft",
      currentStage: "Application",
    });
    console.log("✅ Created loan file 2:", loanFile2Id);

    // Create demo tasks
    console.log("Creating demo tasks...");
    const task1Id = await client.mutation(api.tasks.create, {
      workspaceId,
      title: "Review John Smith's loan application",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "high",
      status: "in_progress",
      assigneeUserId: userId,
      loanFileId: loanFile1Id,
      assigneeRole: "ADVISOR",
      instructions: "Complete review of FHA loan application documents",
    });
    console.log("✅ Created task 1:", task1Id);

    const task2Id = await client.mutation(api.tasks.create, {
      workspaceId,
      title: "Follow up with Sarah Johnson",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "normal",
      status: "pending",
      assigneeUserId: userId,
      loanFileId: loanFile2Id,
      assigneeRole: "ADVISOR",
      instructions: "Call to discuss refinancing options and timeline",
    });
    console.log("✅ Created task 2:", task2Id);

    console.log("\n🎉 Production seeding completed successfully!");
    console.log("\n📋 Production Data Created:");
    console.log("Workspace:", workspaceId);
    console.log("Clients: 3");
    console.log("Loan Types: 3");
    console.log("Loan Files: 2");
    console.log("Tasks: 2");
    console.log("\n🔗 Production URL:", process.env.VITE_CONVEX_URL);

  } catch (error) {
    console.error("❌ Error seeding production:", error);
    
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
  }
}

seedProduction().catch(console.error);
