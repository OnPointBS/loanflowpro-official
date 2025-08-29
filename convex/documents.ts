import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { ConvexError } from "convex/values";

// Upload a document
export const upload = action({
  args: {
    workspaceId: v.id("workspaces"),
    loanFileId: v.optional(v.id("loanFiles")),
    clientId: v.optional(v.id("clients")),
    fileName: v.string(),
    mimeType: v.string(),
    fileSize: v.number(),
    uploadedBy: v.id("users"),
  },
  handler: async (ctx, { workspaceId, loanFileId, clientId, fileName, mimeType, fileSize, uploadedBy }): Promise<string> => {
    // Upload file to storage
    const storageId = await ctx.storage.generateUploadUrl();
    
    // Create document record
    const documentId = await ctx.runMutation(api.documents.create, {
      workspaceId,
      loanFileId,
      clientId,
      fileName,
      mimeType,
      fileSize,
      storageId: storageId as any, // Type assertion for MVP
      uploadedBy,
    });

    return documentId;
  },
});

// Create document record
export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    loanFileId: v.optional(v.id("loanFiles")),
    clientId: v.optional(v.id("clients")),
    fileName: v.string(),
    mimeType: v.string(),
    fileSize: v.number(),
    storageId: v.id("_storage"),
    uploadedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const documentId = await ctx.db.insert("documents", {
      ...args,
      status: "uploading",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return documentId;
  },
});

// Mark document as ready after upload
export const markAsReady = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const document = await ctx.db.get(documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    await ctx.db.patch(documentId, {
      status: "ready",
      updatedAt: Date.now(),
    });

    // Start OCR processing
    await ctx.db.insert("ocrJobs", {
      documentId,
      status: "pending",
      createdAt: Date.now(),
    });

    return documentId;
  },
});

// Get document by ID
export const get = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    return await ctx.db.get(documentId);
  },
});

// List documents by workspace
export const listByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .order("desc")
      .collect();
  },
});

// List documents by loan file
export const listByLoanFile = query({
  args: { loanFileId: v.id("loanFiles") },
  handler: async (ctx, { loanFileId }) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_loan_file", (q) => q.eq("loanFileId", loanFileId))
      .order("desc")
      .collect();
  },
});

// List documents by client (for client portal)
export const listByClient = query({
  args: { 
    workspaceId: v.id("workspaces"),
    clientId: v.id("users"),
  },
  handler: async (ctx, { workspaceId, clientId }) => {
    // Check if user has permission to view documents
    const membership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", clientId))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .first();

    if (!membership || membership.role !== "CLIENT") {
      return [];
    }

    // Get the user's email to find their client record
    const user = await ctx.db.get(clientId);
    if (!user) return [];

    // Find the client record by email
    const client = await ctx.db
      .query("clients")
      .withIndex("by_email", (q) => q.eq("email", user.email))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .first();

    if (!client) return [];

    // Get documents for this client
    return await ctx.db
      .query("documents")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .filter((q) => q.eq(q.field("clientId"), client._id))
      .collect();
  },
});

// Update document status
export const updateStatus = mutation({
  args: {
    documentId: v.id("documents"),
    status: v.union(v.literal("uploading"), v.literal("processing"), v.literal("ready"), v.literal("error")),
  },
  handler: async (ctx, { documentId, status }) => {
    const document = await ctx.db.get(documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    await ctx.db.patch(documentId, {
      status,
      updatedAt: Date.now(),
    });

    return documentId;
  },
});

// Update OCR results
export const updateOcrSummary = mutation({
  args: {
    documentId: v.id("documents"),
    ocrText: v.string(),
    ocrConfidence: v.number(),
    pageCount: v.number(),
  },
  handler: async (ctx, { documentId, ocrText, ocrConfidence, pageCount }) => {
    const document = await ctx.db.get(documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    await ctx.db.patch(documentId, {
      ocrText,
      ocrConfidence,
      pageCount,
      updatedAt: Date.now(),
    });

    return documentId;
  },
});

// Delete document
export const remove = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const document = await ctx.db.get(documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    // Delete from storage
    await ctx.storage.delete(document.storageId);
    
    // Delete document record
    await ctx.db.delete(documentId);
    
    return documentId;
  },
});

// Get download URL
export const getDownloadUrl = action({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }): Promise<string> => {
    // Get document to find storage ID
    const document = await ctx.runQuery(api.documents.get, { documentId });
    
    if (!document) {
      throw new ConvexError("Document not found");
    }

    // Generate download URL
    const url = await ctx.storage.getUrl(document.storageId);
    
    if (!url) {
      throw new ConvexError("Download URL could not be generated");
    }
    
    return url;
  },
});
