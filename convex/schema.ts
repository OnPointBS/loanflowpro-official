import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Convex Auth tables
  ...authTables,
  
  // Core user management
  users: defineTable({
    email: v.string(),
    name: v.string(),
    password: v.string(), // Hashed password
    emailVerified: v.boolean(),
    lastLoginAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  // Verification tokens for email verification and password reset
  verificationTokens: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("email_verification"), v.literal("password_reset"), v.literal("two_factor"), v.literal("login_verification")),
    token: v.string(),
    code: v.string(), // 6-digit code for 2FA and verification
    expiresAt: v.number(),
    used: v.boolean(),
    createdAt: v.number(),
  }).index("by_token", ["token"]).index("by_user_type", ["userId", "type"]).index("by_expiry", ["expiresAt"]),

  // Two-factor authentication settings
  twoFactorAuth: defineTable({
    userId: v.id("users"),
    enabled: v.boolean(),
    method: v.union(v.literal("email"), v.literal("sms")),
    backupCodes: v.optional(v.array(v.string())), // Backup codes for account recovery
    lastUsed: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Workspace management
  workspaces: defineTable({
    name: v.string(),
    ownerUserId: v.id("users"),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("suspended")),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_owner", ["ownerUserId"]).index("by_name", ["name"]),

  // Workspace membership
  workspaceMembers: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT")),
    status: v.union(v.literal("active"), v.literal("invited"), v.literal("removed")),
    permissions: v.optional(v.array(v.string())), // What this user can access
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_workspace", ["workspaceId"]).index("by_user", ["userId"]).index("by_role", ["role"]),

  // Client invitations
  clientInvites: defineTable({
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients"),
    clientEmail: v.string(),
    invitedBy: v.id("users"),
    permissions: v.array(v.string()), // What the client can access
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("declined"), v.literal("expired")),
    expiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
    acceptedBy: v.optional(v.id("users")),
    declinedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_workspace", ["workspaceId"]).index("by_email", ["clientEmail"]).index("by_status", ["status"]),

  // Client management
  clients: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("prospect")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]).index("by_email", ["email"]),

  // Loan type templates
  loanTypes: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    description: v.string(),
    category: v.string(),
    stages: v.array(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    minLoanAmount: v.optional(v.number()), // Minimum loan amount in dollars
    maxLoanAmount: v.optional(v.number()), // Maximum loan amount in dollars (null = unlimited)
    minInterestRate: v.optional(v.number()), // Minimum interest rate percentage
    maxInterestRate: v.optional(v.number()), // Maximum interest rate percentage
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  // Task templates for loan types
  taskTemplates: defineTable({
    workspaceId: v.id("workspaces"),
    title: v.string(),
    assigneeRole: v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT")),
    instructions: v.string(),
    isRequired: v.boolean(),
    dueInDays: v.number(),
    attachmentsAllowed: v.boolean(),
    priority: v.union(v.literal("low"), v.literal("normal"), v.literal("high"), v.literal("urgent")),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    // Temporary field for migration - will be removed after data is migrated
    loanTypeId: v.optional(v.id("loanTypes")),
  }).index("by_workspace", ["workspaceId"]),

  // Task template to loan type associations (many-to-many)
  taskTemplateLoanTypes: defineTable({
    workspaceId: v.id("workspaces"),
    taskTemplateId: v.id("taskTemplates"),
    loanTypeId: v.id("loanTypes"),
    createdAt: v.number(),
  }).index("by_workspace", ["workspaceId"]).index("by_task_template", ["taskTemplateId"]).index("by_loan_type", ["loanTypeId"]),

  // Client loan type assignments (with custom ordering)
  clientLoanTypes: defineTable({
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients"),
    loanTypeId: v.id("loanTypes"),
    customOrder: v.number(), // Custom order for this client
    isActive: v.boolean(), // Whether this loan type is active for the client
    assignedAt: v.number(),
    assignedBy: v.id("users"), // Who assigned this loan type
    customName: v.optional(v.string()), // Custom name for this client (e.g., lender-specific naming)
    notes: v.optional(v.string()), // Client-specific notes
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]).index("by_client", ["clientId"]).index("by_loan_type", ["loanTypeId"]).index("by_workspace_client", ["workspaceId", "clientId"]),

  // Client-specific tasks (cloned from task templates)
  clientTasks: defineTable({
    workspaceId: v.id("workspaces"),
    clientId: v.id("clients"),
    clientLoanTypeId: v.id("clientLoanTypes"), // Reference to the client's loan type assignment
    taskTemplateId: v.optional(v.id("taskTemplates")), // Original task template (optional for custom tasks)
    title: v.string(), // Cloned title (can be customized)
    assigneeRole: v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT")),
    instructions: v.string(), // Cloned instructions (can be customized)
    isRequired: v.boolean(),
    dueInDays: v.number(), // Can be customized per client
    attachmentsAllowed: v.boolean(),
    priority: v.union(v.literal("low"), v.literal("normal"), v.literal("high"), v.literal("urgent")),
    order: v.number(), // Custom order for this client
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("overdue"), v.literal("skipped")),
    dueDate: v.optional(v.number()), // Calculated based on assignment date + dueInDays
    completedAt: v.optional(v.number()),
    assignedTo: v.optional(v.id("users")), // Specific user assigned (if applicable)
    clientNotes: v.optional(v.string()), // Client-specific notes
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]).index("by_client", ["clientId"]).index("by_client_loan_type", ["clientLoanTypeId"]).index("by_status", ["status"]).index("by_due_date", ["dueDate"]),

  // Individual loan files
  loanFiles: defineTable({
    workspaceId: v.id("workspaces"),
    loanTypeId: v.id("loanTypes"),
    clientId: v.id("clients"),
    advisorId: v.id("users"),
    status: v.union(v.literal("draft"), v.literal("in_progress"), v.literal("under_review"), v.literal("approved"), v.literal("closed")),
    currentStage: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]).index("by_client", ["clientId"]).index("by_advisor", ["advisorId"]),

  // Tasks within loan files
  tasks: defineTable({
    workspaceId: v.id("workspaces"),
    loanFileId: v.id("loanFiles"),
    taskTemplateId: v.optional(v.id("taskTemplates")),
    title: v.string(),
    assigneeUserId: v.optional(v.id("users")),
    assigneeRole: v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT")),
    instructions: v.string(),
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("overdue")),
    priority: v.union(v.literal("low"), v.literal("normal"), v.literal("high"), v.literal("urgent")),
    dueDate: v.number(),
    completedAt: v.optional(v.number()),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]).index("by_loan_file", ["loanFileId"]).index("by_assignee", ["assigneeUserId"]),

  // Document management
  documents: defineTable({
    workspaceId: v.id("workspaces"),
    loanFileId: v.optional(v.id("loanFiles")),
    clientId: v.optional(v.id("clients")),
    fileName: v.string(),
    mimeType: v.string(),
    fileSize: v.number(),
    storageId: v.id("_storage"),
    status: v.union(v.literal("uploading"), v.literal("processing"), v.literal("ready"), v.literal("error")),
    ocrText: v.optional(v.string()),
    ocrConfidence: v.optional(v.number()),
    pageCount: v.optional(v.number()),
    uploadedBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]).index("by_loan_file", ["loanFileId"]).index("by_client", ["clientId"]),

  // OCR processing jobs
  ocrJobs: defineTable({
    documentId: v.id("documents"),
    status: v.union(v.literal("pending"), v.literal("processing"), v.literal("completed"), v.literal("failed")),
    error: v.optional(v.string()),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_document", ["documentId"]).index("by_status", ["status"]),

  // Communication system
  messages: defineTable({
    workspaceId: v.id("workspaces"),
    loanFileId: v.optional(v.id("loanFiles")),
    senderUserId: v.id("users"),
    senderRole: v.union(v.literal("ADVISOR"), v.literal("STAFF"), v.literal("CLIENT")),
    body: v.string(),
    attachments: v.optional(v.array(v.id("documents"))),
    createdAt: v.number(),
  }).index("by_workspace", ["workspaceId"]).index("by_loan_file", ["loanFileId"]).index("by_sender", ["senderUserId"]),

  // Subscription and billing
  subscriptions: defineTable({
    workspaceId: v.id("workspaces"),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    plan: v.union(v.literal("starter"), v.literal("team")),
    interval: v.union(v.literal("monthly"), v.literal("yearly")),
    status: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    trialEnd: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]).index("by_stripe_customer", ["stripeCustomerId"]),

  // Entitlements based on subscription
  entitlements: defineTable({
    workspaceId: v.id("workspaces"),
    seats: v.number(),
    activeClients: v.number(),
    storageBytes: v.number(),
    documentsHub: v.boolean(),
    lenderExportBranding: v.boolean(),
    customLinks: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  // Storage usage tracking
  storageUsage: defineTable({
    workspaceId: v.id("workspaces"),
    bytes: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  // Audit logging
  audit: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    action: v.string(),
    resourceType: v.string(),
    resourceId: v.optional(v.string()),
    details: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_workspace", ["workspaceId"]).index("by_user", ["userId"]).index("by_action", ["action"]),
});
