import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL || "https://marvelous-cheetah-331.convex.cloud");

async function seedDemoWorkspace() {
  try {
    console.log("🌱 Seeding demo workspace...");

    // Create a demo user
    console.log("Creating demo user...");
    const userId = await client.mutation(api.users.create, {
      email: "demo@loanflowpro.com",
      name: "Demo User",
    });
    console.log("✅ Created demo user:", userId);

    // Create a demo workspace
    console.log("Creating demo workspace...");
    const workspaceId = await client.mutation(api.workspaces.create, {
      name: "Demo Financial Advisory",
      ownerUserId: userId,
    });
    console.log("✅ Created demo workspace:", workspaceId);

    // Create workspace membership
    console.log("Creating workspace membership...");
    const membershipId = await client.mutation(api.workspaceMembers.create, {
      workspaceId,
      userId,
      role: "ADVISOR",
      status: "active",
    });
    console.log("✅ Created workspace membership:", membershipId);

    // Create some demo clients
    console.log("Creating demo clients...");
    const client1Id = await client.mutation(api.clients.create, {
      workspaceId,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0123",
      notes: "First-time homebuyer, excellent credit score",
    });
    console.log("✅ Created demo client 1:", client1Id);

    const client2Id = await client.mutation(api.clients.create, {
      workspaceId,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1-555-0456",
      notes: "Refinancing existing mortgage, stable income",
    });
    console.log("✅ Created demo client 2:", client2Id);

    // Create some demo loan types
    console.log("Creating demo loan types...");
    const loanType1Id = await client.mutation(api.loanTypes.create, {
      workspaceId,
      name: "Conventional Mortgage",
      description: "Standard 30-year fixed-rate mortgage",
      category: "Residential",
      stages: ["Application", "Underwriting", "Approval", "Closing"],
    });
    console.log("✅ Created demo loan type 1:", loanType1Id);

    const loanType2Id = await client.mutation(api.loanTypes.create, {
      workspaceId,
      name: "FHA Loan",
      description: "Federal Housing Administration loan for first-time buyers",
      category: "Residential",
      stages: ["Application", "Underwriting", "Approval", "Closing"],
    });
    console.log("✅ Created demo loan type 2:", loanType2Id);

    // Create some demo loan files
    console.log("Creating demo loan files...");
    const loanFile1Id = await client.mutation(api.loanFiles.createFromLoanType, {
      workspaceId,
      loanTypeId: loanType1Id,
      clientId: client1Id,
      advisorId: userId,
    });
    console.log("✅ Created demo loan file 1:", loanFile1Id);

    const loanFile2Id = await client.mutation(api.loanFiles.createFromLoanType, {
      workspaceId,
      loanTypeId: loanType2Id,
      clientId: client2Id,
      advisorId: userId,
    });
    console.log("✅ Created demo loan file 2:", loanFile2Id);

    console.log("\n🎉 Demo workspace seeded successfully!");
    console.log("📊 Summary:");
    console.log(`   - User: ${userId}`);
    console.log(`   - Workspace: ${workspaceId}`);
    console.log(`   - Membership: ${membershipId}`);
    console.log(`   - Clients: ${client1Id}, ${client2Id}`);
    console.log(`   - Loan Types: ${loanType1Id}, ${loanType2Id}`);
    console.log(`   - Loan Files: ${loanFile1Id}, ${loanFile2Id}`);

    // Save the IDs to a file for reference
    const demoData = {
      userId,
      workspaceId,
      membershipId,
      clientIds: [client1Id, client2Id],
      loanTypeIds: [loanType1Id, loanType2Id],
      loanFileIds: [loanFile1Id, loanFile2Id],
    };

    console.log("\n💾 Demo data saved for reference:", JSON.stringify(demoData, null, 2));

  } catch (error) {
    console.error("❌ Error seeding demo workspace:", error);
    process.exit(1);
  }
}

seedDemoWorkspace();
