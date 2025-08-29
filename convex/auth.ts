"use node";

import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

// Generate a secure random token
function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Send magic link email - back to the working approach as an action
export const sendMagicLink = action({
  args: { 
    email: v.string(),
    workspaceId: v.optional(v.id("workspaces")),
    inviteType: v.optional(v.union(v.literal("client"), v.literal("partner"))),
    inviteId: v.optional(v.string()),
    clientName: v.optional(v.string()),
    partnerName: v.optional(v.string()),
    partnerRole: v.optional(v.string()),
    workspaceName: v.optional(v.string()),
    inviterName: v.optional(v.string()),
  },
  handler: async (ctx, { 
    email, 
    workspaceId, 
    inviteType, 
    inviteId, 
    clientName, 
    partnerName, 
    partnerRole, 
    workspaceName, 
    inviterName 
  }) => {
    const token = generateToken();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    
    try {
      // Create or get user first
      let user = await ctx.runMutation(api.authMutations.createOrGetUser, { email });
      
      if (!user) {
        throw new Error("Failed to create or retrieve user");
      }
      
      // Create verification token
      await ctx.runMutation(api.authMutations.createVerificationToken, {
        userId: user._id,
        token: token,
        expiresAt: expiresAt,
      });
      
      // Send email via Resend
      console.log("🔐 [DEV] Sending email to:", email);
      console.log("🔐 [DEV] Using SITE_URL:", process.env.SITE_URL);
      
      let subject: string;
      let html: string;
      
      if (inviteType === "client") {
        // Client invitation email
        subject = `You've been invited to join ${workspaceName || 'LoanFlowPro'}`;
        html = `
          <h2>Hello ${clientName || 'there'}!</h2>
          <p>${inviterName || 'Someone'} has invited you to join their workspace on LoanFlowPro.</p>
          <p>As a client, you'll be able to:</p>
          <ul>
            <li>View your loan files and progress</li>
            <li>Upload required documents</li>
            <li>Track your tasks and deadlines</li>
            <li>Send messages to your advisor</li>
          </ul>
          <p>Click the link below to accept the invitation and set up your account:</p>
          <a href="${process.env.SITE_URL}/verify?token=${token}&inviteType=client&inviteId=${inviteId}" style="display: inline-block; background: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Accept Invitation</a>
          <p>This invitation will expire in 15 minutes.</p>
          <p>If you have any questions, please contact your advisor.</p>
        `;
      } else if (inviteType === "partner") {
        // Partner invitation email
        subject = `You've been invited as a ${partnerRole || 'Partner'} to ${workspaceName || 'LoanFlowPro'}`;
        html = `
          <h2>Hello ${partnerName || 'there'}!</h2>
          <p>${inviterName || 'Someone'} has invited you to join their workspace on LoanFlowPro as a ${partnerRole || 'Partner'}.</p>
          <p>As a partner, you'll be able to:</p>
          <ul>
            <li>Monitor loan application progress</li>
            <li>View client status and milestones</li>
            <li>Access relevant documents (read-only)</li>
            <li>Receive updates on important deadlines</li>
          </ul>
          <p>Click the link below to accept the invitation and set up your account:</p>
          <a href="${process.env.SITE_URL}/verify?token=${token}&inviteType=partner&inviteId=${inviteId}" style="display: inline-block; background: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Accept Invitation</a>
          <p>This invitation will expire in 15 minutes.</p>
          <p>If you have any questions, please contact the person who invited you.</p>
        `;
      } else {
        // Regular sign-in email
        subject = "Sign in to LoanFlowPro";
        html = `
          <h2>Sign in to LoanFlowPro</h2>
          <p>Click the link below to sign in to your account:</p>
          <a href="${process.env.SITE_URL}/verify?token=${token}" style="display: inline-block; background: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Sign In</a>
          <p>This link will expire in 15 minutes.</p>
          <p>If you didn't request this email, you can safely ignore it.</p>
        `;
      }
      
      const result = await resend.emails.send({
        from: "noreply@flow.loanflowpro.com",
        to: email,
        subject: subject,
        html: html,
      });
      
      console.log("🔐 [DEV] Magic link sent to:", email, "Token:", token, "Type:", inviteType || "signin");
      console.log("🔐 [DEV] Email result:", result);
      return { success: true, emailId: result.data?.id, token };
      
    } catch (error) {
      console.error("🔐 [DEV] Failed to send email:", error);
      throw new Error(`Failed to send magic link email: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

