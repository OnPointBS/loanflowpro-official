import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { ConvexError } from "convex/values";

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
      throw new ConvexError("You don't have permission to invite clients to this workspace");
    }

    // Get workspace and inviter details for email
    const workspace = await ctx.db.get(workspaceId);
    const inviter = await ctx.db.get(invitedBy);
    
    if (!workspace || !inviter) {
      throw new ConvexError("Workspace or inviter not found");
    }

    // Check if client already exists in this workspace
    const existingClient = await ctx.db
      .query("clients")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("email"), clientEmail))
      .first();

    if (existingClient) {
      throw new ConvexError("Client already exists in this workspace");
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

    // Send invitation email using the existing sendMagicLink system
    try {
      await ctx.scheduler.runAfter(0, api.auth.sendMagicLink, {
        email: clientEmail,
        workspaceId: workspaceId,
        inviteType: "client",
        inviteId: inviteId,
        clientName: clientName,
        workspaceName: workspace.name,
        inviterName: inviter.name || inviter.email,
      });
    } catch (error) {
      console.error('Failed to schedule invitation email:', error);
      // Don't fail the invitation creation if email fails
    }

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

// Get all invitations for a workspace (including accepted/declined)
export const getAllInvites = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("clientInvites")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .collect();
  },
});

// Delete a pending invitation
export const deleteInvite = mutation({
  args: { inviteId: v.id("clientInvites") },
  handler: async (ctx, { inviteId }) => {
    const invite = await ctx.db.get(inviteId);
    if (!invite) {
      throw new ConvexError("Invitation not found");
    }

    if (invite.status !== "pending") {
      throw new ConvexError("Can only delete pending invitations");
    }

    // Delete the invitation
    await ctx.db.delete(inviteId);

    // If the client was only created for this invitation, delete them too
    const otherInvites = await ctx.db
      .query("clientInvites")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", invite.workspaceId))
      .filter((q) => q.eq(q.field("clientId"), invite.clientId))
      .collect();

    if (otherInvites.length === 0) {
      // No other invitations for this client, delete the client record
      await ctx.db.delete(invite.clientId);
    }

    return { success: true };
  },
});

// Resend an invitation
export const resendInvite = mutation({
  args: { inviteId: v.id("clientInvites") },
  handler: async (ctx, { inviteId }) => {
    const invite = await ctx.db.get(inviteId);
    if (!invite) {
      throw new ConvexError("Invitation not found");
    }

    if (invite.status !== "pending") {
      throw new ConvexError("Can only resend pending invitations");
    }

    // Get workspace and inviter details
    const workspace = await ctx.db.get(invite.workspaceId);
    const inviter = await ctx.db.get(invite.invitedBy);
    
    if (!workspace || !inviter) {
      throw new ConvexError("Workspace or inviter not found");
    }

    // Get client details
    const client = await ctx.db.get(invite.clientId);
    if (!client) {
      throw new ConvexError("Client not found");
    }

    // Update expiration to extend the invitation
    const newExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days from now
    await ctx.db.patch(inviteId, { 
      expiresAt: newExpiresAt,
    });

    // Send new invitation email using the existing sendMagicLink system
    try {
      await ctx.scheduler.runAfter(0, api.auth.sendMagicLink, {
        email: invite.clientEmail,
        workspaceId: invite.workspaceId,
        inviteType: "client",
        inviteId: inviteId,
        clientName: client.name,
        workspaceName: workspace.name,
        inviterName: inviter.name || inviter.email,
      });
    } catch (error) {
      console.error('Failed to schedule resend invitation email:', error);
      // Don't fail the resend if email fails
    }

    return { success: true, newExpiresAt };
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
