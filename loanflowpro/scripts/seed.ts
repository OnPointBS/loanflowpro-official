import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

async function seed() {
  console.log("🌱 Seeding LoanFlowPro development data...");

  try {
    // Create test users
    console.log("Creating test users...");
    
    const user1 = await client.mutation(api.users.create, {
      email: "advisor@demo.com",
      name: "Demo Advisor",
    });
    
    const user2 = await client.mutation(api.users.create, {
      email: "staff@demo.com", 
      name: "Demo Staff",
    });
    
    const user3 = await client.mutation(api.users.create, {
      email: "client@demo.com",
      name: "Demo Client",
    });

    console.log("✅ Users created:", { user1, user2, user3 });

    // Create workspace
    console.log("Creating workspace...");
    
    const workspace = await client.mutation(api.workspaces.create, {
      name: "Demo Financial Advisory",
      ownerUserId: user1,
    });

    console.log("✅ Workspace created:", workspace);

    // Create workspace memberships
    console.log("Creating workspace memberships...");
    
    await client.mutation(api.workspaceMembers.create, {
      workspaceId: workspace,
      userId: user1,
      role: "ADVISOR",
      status: "active",
    });
    
    await client.mutation(api.workspaceMembers.create, {
      workspaceId: workspace,
      userId: user2,
      role: "STAFF", 
      status: "active",
    });
    
    await client.mutation(api.workspaceMembers.create, {
      workspaceId: workspace,
      userId: user3,
      role: "CLIENT",
      status: "active",
    });

    console.log("✅ Memberships created");

    console.log("\n🎉 Basic seeding completed successfully!");
    console.log("\n📋 Development Users Created:");
    console.log("Advisor: advisor@demo.com");
    console.log("Staff: staff@demo.com");
    console.log("Client: client@demo.com");
    console.log("\n🔑 Workspace ID:", workspace);
    console.log("📊 Created:", {
      users: 3,
      workspaces: 1,
      memberships: 3,
    });

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
