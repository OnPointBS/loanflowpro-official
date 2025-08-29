import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Load environment variables
config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

async function main() {
  console.log("🌱 Seeding demo account...");

  try {
    // Check if demo user already exists
    console.log("Checking if demo user exists...");
    
    // Try to create demo user directly (this will fail if it exists)
    const result = await client.mutation(api.auth.register, {
      email: "demo@loanflowpro.com",
      password: "demo1234",
      name: "Demo User",
      workspaceName: "Demo Financial Advisory",
    });

    console.log("✅ Demo user created:", result);
    console.log("📧 Email: demo@loanflowpro.com");
    console.log("🔑 Password: demo1234");
    console.log("⚠️  Note: Demo account requires email verification");
    console.log("🔐 Check console for verification code or use the temporary workaround");

  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      console.log("ℹ️  Demo user already exists!");
      console.log("📧 Email: demo@loanflowpro.com");
      console.log("🔑 Password: demo1234");
      console.log("⚠️  Note: Demo account requires email verification");
      console.log("🔐 Check console for verification code or use the temporary workaround");
    } else {
      console.error("❌ Error creating demo user:", error);
    }
  }

  console.log("🎉 Demo seeding complete!");
  console.log("💡 To use demo account:");
  console.log("   1. Go to /register and create account with demo@loanflowpro.com");
  console.log("   2. Check console for verification code (🔐 emoji)");
  console.log("   3. Verify email and then login");
}

main().catch(console.error);
