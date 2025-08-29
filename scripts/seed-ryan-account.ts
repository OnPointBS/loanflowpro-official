import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Load environment variables
config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

async function main() {
  console.log("🌱 Seeding Ryan account...");

  try {
    // Check if Ryan user already exists
    console.log("Checking if Ryan user exists...");
    
    // Try to create Ryan user directly (this will fail if it exists)
    const result = await client.mutation(api.auth.register, {
      email: "ryans@onpointbs.com",
      password: "Samari1!",
      name: "Ryan Smith",
      workspaceName: "OnPoint Business Solutions",
    });

    console.log("✅ Ryan user created:", result);
    console.log("📧 Email: ryans@onpointbs.com");
    console.log("🔑 Password: Samari1!");
    console.log("⚠️  Note: Ryan account requires email verification");
    console.log("🔐 Check console for verification code or use the development bypass");

  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      console.log("ℹ️  Ryan user already exists!");
      console.log("📧 Email: ryans@onpointbs.com");
      console.log("🔑 Password: Samari1!");
      console.log("⚠️  Note: Ryan account requires email verification");
      console.log("🔐 Check console for verification code or use the development bypass");
    } else {
      console.error("❌ Error creating Ryan user:", error);
    }
  }

  console.log("🎉 Ryan account seeding complete!");
  console.log("💡 To use Ryan account:");
  console.log("   1. Go to /login and click 'Try Ryan Account' button");
  console.log("   2. The system will automatically bypass email verification");
  console.log("   3. Use verification code: 123456");
  console.log("   4. You'll be logged in and can test the task management system");
}

main().catch(console.error);
