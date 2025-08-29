import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

// Create a client invitation
export const createInvite = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    clientEmail: v.string(),
    clientName: v.string(),
    invitedBy: v.id("users"),
    permissions: v.array(v.string()), // What the client can access
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, { workspaceId, clientEmail, clientName, invitedBy, permissions, expiresAt }) => {
    // Check if user has permission to invite (must be ADVISOR or STAFF)
    const inviterMembership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", invitedBy))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .first();

    if (!inviterMembership || (inviterMembership.role !== "ADVISOR" && inviterMembership.role !== "STAFF")) {
      throw new Error("You don't have permission to invite clients to this workspace");
    }

    // Check if client already exists in this workspace
    const existingClient = await ctx.db
      .query("clients")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("email"), clientEmail))
      .first();

    if (existingClient) {
      throw new Error("Client already exists in this workspace");
    }

    // Create the client record
    const clientId = await ctx.db.insert("clients", {
      workspaceId,
      name: clientName,
      email: clientEmail,
      status: "invited",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create invitation record
    const inviteId = await ctx.db.insert("clientInvites", {
      workspaceId,
      clientId,
      clientEmail,
      invitedBy,
      permissions,
      status: "pending",
      expiresAt: expiresAt || (Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
      createdAt: Date.now(),
    });

    return { inviteId, clientId };
  },
});

// Get pending invitations for a workspace
export const getPendingInvites = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("clientInvites")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
  },
});

// Accept client invitation
export const acceptInvite = mutation({
  args: { 
    inviteId: v.id("clientInvites"),
    userId: v.id("users"),
  },
  handler: async (ctx, { inviteId, userId }) => {
    const invite = await ctx.db.get(inviteId);
    if (!invite) {
      throw new Error("Invitation not found");
    }

    if (invite.status !== "pending") {
      throw new Error("Invitation has already been processed");
    }

    if (invite.expiresAt < Date.now()) {
      throw new Error("Invitation has expired");
    }

    // Update invitation status
    await ctx.db.patch(inviteId, { 
      status: "accepted",
      acceptedAt: Date.now(),
      acceptedBy: userId,
    });

    // Update client status
    await ctx.db.patch(invite.clientId, { 
      status: "active",
      updatedAt: Date.now(),
    });

    // Create workspace membership for the client
    const membershipId = await ctx.db.insert("workspaceMembers", {
      workspaceId: invite.workspaceId,
      userId,
      role: "CLIENT",
      status: "active",
      permissions: invite.permissions,
      createdAt: Date.now(),
    });

    return { membershipId };
  },
});

// Decline client invitation
export const declineInvite = mutation({
  args: { inviteId: v.id("clientInvites") },
  handler: async (ctx, { inviteId }) => {
    const invite = await ctx.db.get(inviteId);
    if (!invite) {
      throw new Error("Invitation not found");
    }

    await ctx.db.patch(inviteId, { 
      status: "declined",
      declinedAt: Date.now(),
    });

    // Update client status
    await ctx.db.patch(invite.clientId, { 
      status: "declined",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get client permissions
export const getClientPermissions = query({
  args: { 
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
  },
  handler: async (ctx, { workspaceId, userId }) => {
    const membership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .first();

    if (!membership || membership.role !== "CLIENT") {
      return null;
    }

    return {
      role: membership.role,
      permissions: membership.permissions || [],
      status: membership.status,
    };
  },
});
