import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Load environment variables
config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

async function main() {
  console.log("🌱 Creating new demo account...");

  try {
    // Create a new demo user with a different email
    const result = await client.mutation(api.auth.register, {
      email: "demo2@loanflowpro.com",
      password: "demo1234",
      name: "Demo User 2",
      workspaceName: "Demo Financial Advisory",
    });

    console.log("✅ New demo user created:", result);
    console.log("📧 Email: demo2@loanflowpro.com");
    console.log("🔑 Password: demo1234");
    console.log("⚠️  Note: Demo account requires email verification");
    console.log("🔐 Check console for verification code (🔐 emoji)");

  } catch (error) {
    console.error("❌ Error creating new demo user:", error);
    
    // Try another email if the first one fails
    try {
      console.log("🔄 Trying with different email...");
      const result2 = await client.mutation(api.auth.register, {
        email: "demo3@loanflowpro.com",
        password: "demo1234",
        name: "Demo User 3",
        workspaceName: "Demo Financial Advisory",
      });

      console.log("✅ Alternative demo user created:", result2);
      console.log("📧 Email: demo3@loanflowpro.com");
      console.log("🔑 Password: demo1234");
      console.log("⚠️  Note: Demo account requires email verification");
      console.log("🔐 Check console for verification code (🔐 emoji)");
    } catch (error2) {
      console.error("❌ Error creating alternative demo user:", error2);
    }
  }

  console.log("🎉 New demo account creation complete!");
  console.log("💡 To use the new demo account:");
  console.log("   1. Go to /register and create account with the new email");
  console.log("   2. Check console for verification code (🔐 emoji)");
  console.log("   3. Verify email and then login");
}

main().catch(console.error);
