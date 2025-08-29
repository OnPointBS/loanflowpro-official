import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Load environment variables
config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

async function main() {
  console.log("🌱 Seeding database...");

  try {
    // Create demo user with fresh email
    console.log("Creating demo user...");
    const result = await client.mutation(api.auth.register, {
      email: "demo@loanflowpro.com",
      password: "demo1234",
      name: "Demo User",
      workspaceName: "Demo Workspace",
    });

    console.log("✅ Demo user created:", result);
    console.log("📧 Email: demo@loanflowpro.com");
    console.log("🔑 Password: demo1234");

  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      console.log("ℹ️  Demo user already exists - trying to create with different email...");
      
      // Try to create with a different email
      try {
        const result = await client.mutation(api.auth.register, {
          email: "demo2@loanflowpro.com",
          password: "demo1234",
          name: "Demo User 2",
          workspaceName: "Demo Workspace 2",
        });
        
        console.log("✅ Demo user 2 created:", result);
        console.log("📧 Email: demo2@loanflowpro.com");
        console.log("🔑 Password: demo1234");
      } catch (error2) {
        console.error("❌ Error creating demo user 2:", error2);
      }
    } else {
      console.error("❌ Error creating demo user:", error);
    }
  }

  console.log("🎉 Seeding complete!");
}

main().catch(console.error);
