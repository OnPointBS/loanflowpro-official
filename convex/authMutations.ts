import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Helper mutation to create or get user
export const createOrGetUser = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    // Check if user exists, if not create them
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    
    if (!user) {
      // Create new user
      const userId = await ctx.db.insert("users", {
        email: email,
        name: email.split('@')[0], // Use part before @ as name
        password: "", // No password for magic link users
        emailVerified: false,
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }
    
    return user;
  },
});

export const createVerificationToken = mutation({
  args: { 
    userId: v.id("users"), 
    token: v.string(),
    expiresAt: v.number()
  },
  handler: async (ctx, { userId, token, expiresAt }) => {
    await ctx.db.insert("verificationTokens", {
      userId: userId,
      type: "login_verification",
      token: token,
      code: "", // Not used for magic links
      expiresAt: expiresAt,
      used: false,
      createdAt: Date.now(),
    });
    return { success: true };
  },
});

// Verify magic link token
export const verifyMagicLink = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    // Find the token
    const tokenDoc = await ctx.db
      .query("verificationTokens")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!tokenDoc) {
      throw new Error("Invalid or expired token");
    }

    if (tokenDoc.used) {
      throw new Error("Token already used");
    }

    if (tokenDoc.expiresAt < Date.now()) {
      throw new Error("Token expired");
    }

    // Mark token as used
    await ctx.db.patch(tokenDoc._id, { used: true });

    // Get the user associated with this token
    const existingUser = await ctx.db.get(tokenDoc.userId);
    if (!existingUser) {
      throw new Error("User not found for this token");
    }

    // Update user to verified
    await ctx.db.patch(existingUser._id, { emailVerified: true });

    // Check if user already has a workspace
    let workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", existingUser._id))
      .first();

    console.log("🔐 [DEV] Checking workspace ownership for user:", existingUser._id);
    console.log("🔐 [DEV] Workspace as owner:", workspace);

    // If no workspace as owner, check if user is a member of any workspace
    if (!workspace) {
      console.log("🔐 [DEV] User not workspace owner, checking membership for:", existingUser._id);
      try {
        const membership = await ctx.db
          .query("workspaceMembers")
          .withIndex("by_user", (q) => q.eq("userId", existingUser._id))
          .filter((q) => q.eq(q.field("status"), "active"))
          .first();
        
        console.log("🔐 [DEV] Membership query result:", membership);
        
        if (membership) {
          console.log("🔐 [DEV] Found workspace membership:", membership);
          workspace = await ctx.db.get(membership.workspaceId);
          console.log("🔐 [DEV] Retrieved workspace from membership:", workspace);
        }
      } catch (membershipError) {
        console.error("🔐 [DEV] Error checking workspace membership:", membershipError);
        // Continue with workspace creation if membership check fails
      }
    }

    if (!workspace) {
      try {
        console.log("🔐 [DEV] Creating workspace for user:", existingUser._id);
        // Create a default workspace for the user
        const workspaceId = await ctx.db.insert("workspaces", {
          name: `${existingUser.name}'s Workspace`,
          ownerUserId: existingUser._id,
          status: "active",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        console.log("🔐 [DEV] Workspace created with ID:", workspaceId);
        workspace = await ctx.db.get(workspaceId);
        console.log("🔐 [DEV] Workspace retrieved:", workspace);
      } catch (workspaceError) {
        console.error("🔐 [DEV] Failed to create workspace:", workspaceError);
        throw new Error(`Failed to create workspace: ${workspaceError}`);
      }
    }

    if (!workspace) {
      throw new Error("Failed to create or retrieve workspace");
    }

    // Generate a session token
    const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    return {
      success: true,
      user: { 
        _id: existingUser._id, 
        email: existingUser.email, 
        name: existingUser.name,
        emailVerified: true
      },
      workspace: { 
        id: workspace._id, 
        name: workspace.name, 
        status: workspace.status,
        createdAt: workspace.createdAt,
        updatedAt: workspace.updatedAt
      },
      sessionToken
    };
  },
});

// Create demo account with proper workspace association
export const createDemoAccount = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      console.log("🚀 Creating demo account...");
      
      // Check if demo user already exists
      let demoUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", "demo@loanflowpro.com"))
        .first();
      
      if (!demoUser) {
        console.log("📝 Creating new demo user...");
        // Create demo user
        const userId = await ctx.db.insert("users", {
          email: "demo@loanflowpro.com",
          name: "Demo User",
          password: "", // No password for demo users
          emailVerified: true, // Demo users are pre-verified
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        demoUser = await ctx.db.get(userId);
        console.log("✅ Demo user created:", userId);
      } else {
        console.log("ℹ️ Demo user already exists:", demoUser._id);
      }
      
      // Check if demo workspace already exists
      let demoWorkspace = await ctx.db
        .query("workspaces")
        .withIndex("by_name", (q) => q.eq("name", "Demo Financial Advisory"))
        .first();
      
      if (!demoWorkspace) {
        console.log("🏢 Creating new demo workspace...");
        // Create demo workspace
        const workspaceId = await ctx.db.insert("workspaces", {
          name: "Demo Financial Advisory",
          ownerUserId: demoUser!._id,
          status: "active",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        demoWorkspace = await ctx.db.get(workspaceId);
        console.log("✅ Demo workspace created:", workspaceId);
      } else {
        console.log("ℹ️ Demo workspace already exists:", demoWorkspace._id);
      }
      
      // Check if workspace membership exists
      let membership = await ctx.db
        .query("workspaceMembers")
        .withIndex("by_user", (q) => q.eq("userId", demoUser!._id))
        .filter((q) => q.eq(q.field("workspaceId"), demoWorkspace!._id))
        .first();
      
      if (!membership) {
        console.log("👥 Creating workspace membership...");
        // Create workspace membership
        const membershipId = await ctx.db.insert("workspaceMembers", {
          workspaceId: demoWorkspace!._id,
          userId: demoUser!._id,
          role: "ADVISOR",
          status: "active",
          createdAt: Date.now(),
        });
        membership = await ctx.db.get(membershipId);
        console.log("✅ Workspace membership created:", membershipId);
      } else {
        console.log("ℹ️ Workspace membership already exists:", membership._id);
      }
      
      console.log("🎉 Demo account setup complete!");
      
      return {
        success: true,
        user: {
          _id: demoUser!._id,
          email: demoUser!.email,
          name: demoUser!.name,
          emailVerified: true,
          isDemo: true
        },
        workspace: {
          id: demoWorkspace!._id,
          name: demoWorkspace!.name,
          status: demoWorkspace!.status
        },
        membership: {
          role: membership!.role,
          status: membership!.status
        }
      };
      
    } catch (error) {
      console.error("❌ Error creating demo account:", error);
      throw new Error(`Failed to create demo account: ${error}`);
    }
  },
});

// Get current user (for demo/testing purposes)
export const getCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    // For now, return a demo user
    // In production, this would check the session token
    return {
      _id: "demo_user_id" as any,
      email: "demo@loanflowpro.com",
      name: "Demo User",
      emailVerified: true,
      workspace: {
        id: "demo_workspace_id" as any,
        name: "Demo Workspace",
        status: "active"
      }
    };
  },
});
