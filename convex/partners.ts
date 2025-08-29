import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { ConvexError } from "convex/values";

// Create a partner invitation
export const createPartnerInvite = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    partnerEmail: v.string(),
    partnerName: v.string(),
    partnerRole: v.string(), // e.g., "Real Estate Agent", "Title Company"
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    invitedBy: v.id("users"),
    permissions: v.array(v.string()), // What the partner can access
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, { workspaceId, partnerEmail, partnerName, partnerRole, company, phone, invitedBy, permissions, expiresAt }) => {
    // Check if user has permission to invite (must be ADVISOR or STAFF)
    const inviterMembership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", invitedBy))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .first();

    if (!inviterMembership || (inviterMembership.role !== "ADVISOR" && inviterMembership.role !== "STAFF")) {
      throw new ConvexError("You don't have permission to invite partners to this workspace");
    }

    // Get workspace and inviter details for email
    const workspace = await ctx.db.get(workspaceId);
    const inviter = await ctx.db.get(invitedBy);
    
    if (!workspace || !inviter) {
      throw new ConvexError("Workspace or inviter not found");
    }

    // Check if partner already exists in this workspace
    const existingPartner = await ctx.db
      .query("partners")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("email"), partnerEmail))
      .first();

    if (existingPartner) {
      throw new ConvexError("Partner already exists in this workspace");
    }

    // Create the partner record
    const partnerId = await ctx.db.insert("partners", {
      workspaceId,
      name: partnerName,
      email: partnerEmail,
      phone,
      company,
      role: partnerRole,
      status: "invited",
      permissions: permissions, // Add permissions field
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create invitation record
    const inviteId = await ctx.db.insert("partnerInvites", {
      workspaceId,
      partnerId,
      partnerEmail,
      invitedBy,
      permissions,
      status: "pending",
      expiresAt: expiresAt || (Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
      createdAt: Date.now(),
    });

    // Send invitation email using the existing sendMagicLink system
    try {
      await ctx.scheduler.runAfter(0, api.auth.sendMagicLink, {
        email: partnerEmail,
        workspaceId: workspaceId,
        inviteType: "partner",
        inviteId: inviteId,
        partnerName: partnerName,
        partnerRole: partnerRole,
        workspaceName: workspace.name,
        inviterName: inviter.name || inviter.email,
      });
    } catch (error) {
      console.error('Failed to schedule partner invitation email:', error);
      // Don't fail the invitation creation if email fails
    }

    return { inviteId, partnerId };
  },
});

// Get pending partner invitations for a workspace
export const getPendingPartnerInvites = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("partnerInvites")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
  },
});

// Get all partner invitations for a workspace (including accepted/declined)
export const getAllPartnerInvites = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("partnerInvites")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .collect();
  },
});

// Delete a pending partner invitation
export const deletePartnerInvite = mutation({
  args: { inviteId: v.id("partnerInvites") },
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

    // If the partner was only created for this invitation, delete them too
    const otherInvites = await ctx.db
      .query("partnerInvites")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", invite.workspaceId))
      .filter((q) => q.eq(q.field("partnerId"), invite.partnerId))
      .collect();

    if (otherInvites.length === 0) {
      // No other invitations for this partner, delete the partner record
      await ctx.db.delete(invite.partnerId);
    }

    return { success: true };
  },
});

// Resend a partner invitation
export const resendPartnerInvite = mutation({
  args: { inviteId: v.id("partnerInvites") },
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

    // Get partner details
    const partner = await ctx.db.get(invite.partnerId);
    if (!partner) {
      throw new ConvexError("Partner not found");
    }

    // Update expiration to extend the invitation
    const newExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days from now
    await ctx.db.patch(inviteId, { 
      expiresAt: newExpiresAt,
    });

    // Send new invitation email using the existing sendMagicLink system
    try {
      await ctx.scheduler.runAfter(0, api.auth.sendMagicLink, {
        email: invite.partnerEmail,
        workspaceId: invite.workspaceId,
        inviteType: "partner",
        inviteId: inviteId,
        partnerName: partner.name,
        partnerRole: partner.role,
        workspaceName: workspace.name,
        inviterName: inviter.name || inviter.email,
      });
    } catch (error) {
      console.error('Failed to schedule resend partner invitation email:', error);
      // Don't fail the resend if email fails
    }

    return { success: true, newExpiresAt };
  },
});

// Accept partner invitation
export const acceptPartnerInvite = mutation({
  args: { 
    inviteId: v.id("partnerInvites"),
    userId: v.id("users"),
  },
  handler: async (ctx, { inviteId, userId }) => {
    const invite = await ctx.db.get(inviteId);
    if (!invite) {
      throw new ConvexError("Invitation not found");
    }

    if (invite.status !== "pending") {
      throw new ConvexError("Invitation has already been processed");
    }

    if (invite.expiresAt < Date.now()) {
      throw new ConvexError("Invitation has expired");
    }

    // Update invitation and partner status
    await ctx.db.patch(inviteId, { status: "accepted", acceptedAt: Date.now(), acceptedBy: userId });
    await ctx.db.patch(invite.partnerId, { 
      status: "active", 
      updatedAt: Date.now(),
      permissions: invite.permissions, // Copy permissions from invitation
    });

    // Create workspace membership for the partner
    const membershipId = await ctx.db.insert("workspaceMembers", {
      workspaceId: invite.workspaceId,
      userId,
      role: "PARTNER",
      status: "active",
      permissions: invite.permissions,
      createdAt: Date.now(),
    });

    return { membershipId };
  },
});

// Decline partner invitation
export const declinePartnerInvite = mutation({
  args: { inviteId: v.id("partnerInvites") },
  handler: async (ctx, { inviteId }) => {
    const invite = await ctx.db.get(inviteId);
    if (!invite) {
      throw new ConvexError("Invitation not found");
    }

    await ctx.db.patch(inviteId, { 
      status: "declined",
      declinedAt: Date.now(),
    });

    // Update partner status
    await ctx.db.patch(invite.partnerId, { 
      status: "declined",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get partner by email
export const getPartnerByEmail = query({
  args: { 
    workspaceId: v.id("workspaces"),
    email: v.string()
  },
  handler: async (ctx, { workspaceId, email }) => {
    const partner = await ctx.db
      .query("partners")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("email"), email))
      .first();

    return partner;
  },
});

// Get partner permissions
export const getPartnerPermissions = query({
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

    if (!membership || membership.role !== "PARTNER") {
      return null;
    }

    return {
      role: membership.role,
      permissions: membership.permissions || [],
      status: membership.status,
    };
  },
});

// List all partners in a workspace
export const listPartners = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("partners")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .collect();
  },
});

// Delete a partner
export const deletePartner = mutation({
  args: { partnerId: v.id("partners") },
  handler: async (ctx, { partnerId }) => {
    const partner = await ctx.db.get(partnerId);
    if (!partner) {
      throw new Error("Partner not found");
    }

    // Delete all associated partner invites
    const partnerInvites = await ctx.db
      .query("partnerInvites")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", partner.workspaceId))
      .filter((q) => q.eq(q.field("partnerId"), partnerId))
      .collect();

    for (const invite of partnerInvites) {
      await ctx.db.delete(invite._id);
    }

    // Delete the partner
    await ctx.db.delete(partnerId);

    return { success: true };
  },
});

// Update partner permissions
export const updatePartnerPermissions = mutation({
  args: { 
    partnerId: v.id("partners"),
    permissions: v.array(v.string()),
  },
  handler: async (ctx, { partnerId, permissions }) => {
    const partner = await ctx.db.get(partnerId);
    if (!partner) {
      throw new ConvexError("Partner not found");
    }

    // Update the partner's permissions
    await ctx.db.patch(partnerId, { 
      permissions: permissions,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
