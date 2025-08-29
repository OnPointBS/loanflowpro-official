import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { ConvexError } from "convex/values";

// Send partner invitation email action
export const sendPartnerInvitationEmail = action({
  args: {
    partnerEmail: v.string(),
    partnerName: v.string(),
    workspaceName: v.string(),
    inviterName: v.string(),
    inviteUrl: v.string(),
    partnerRole: v.string(),
  },
  handler: async (ctx, args) => {
    // In a real implementation, you would use Resend or another email service
    // For now, we'll log the email details
    console.log('📧 Sending partner invitation email:', {
      to: args.partnerEmail,
      partnerName: args.partnerName,
      workspaceName: args.workspaceName,
      inviterName: args.inviterName,
      inviteUrl: args.inviteUrl,
      partnerRole: args.partnerRole,
    });

    // TODO: Integrate with Resend email service
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@loanflowpro.com',
    //   to: args.partnerEmail,
    //   subject: `You've been invited as a ${args.partnerRole} to ${args.workspaceName}`,
    //   html: `
    //     <h2>Hello ${args.partnerName},</h2>
    //     <p>${args.inviterName} has invited you to join their workspace on LoanFlowPro as a ${args.partnerRole}.</p>
    //     <p>As a partner, you'll be able to monitor loan progress and stay updated on important milestones.</p>
    //     <p>Click the link below to accept the invitation:</p>
    //     <a href="${args.inviteUrl}">Accept Invitation</a>
    //     <p>This invitation will expire in 7 days.</p>
    //   `
    // });

    return { success: true };
  },
});

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

    // Send invitation email
    const inviteUrl = `${process.env.SITE_URL || 'https://loanflowpro.com'}/partner/accept?inviteId=${inviteId}`;
    
    try {
      await ctx.scheduler.runAfter(0, api.partners.sendPartnerInvitationEmail, {
        partnerEmail,
        partnerName,
        workspaceName: workspace.name,
        inviterName: inviter.name || inviter.email,
        inviteUrl,
        partnerRole,
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

    // Update invitation status
    await ctx.db.patch(inviteId, { 
      status: "accepted",
      acceptedAt: Date.now(),
      acceptedBy: userId,
    });

    // Update partner status
    await ctx.db.patch(invite.partnerId, { 
      status: "active",
      updatedAt: Date.now(),
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
