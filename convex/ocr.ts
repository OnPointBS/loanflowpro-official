import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { ConvexError } from "convex/values";

// Process OCR for a document
export const processDocument = action({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }): Promise<void> => {
    // Get document details
    const document = await ctx.runQuery(api.documents.get, { documentId });
    
    if (!document) {
      throw new ConvexError("Document not found");
    }

    // Update document status to processing
    await ctx.runMutation(api.documents.updateStatus, {
      documentId,
      status: "processing",
    });

    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For MVP, generate mock OCR text
    const mockOcrText = `Sample OCR text extracted from ${document.fileName}

This is a simulated OCR result for demonstration purposes. In production, this would contain the actual extracted text from the document.

Key information found:
- Document type: ${document.fileType}
- File size: ${document.fileSize} bytes
- Uploaded by: User ID ${document.uploadedBy}
- Processing timestamp: ${new Date().toISOString()}

The OCR system would analyze the document content and extract relevant text, tables, and form fields for further processing.`;

    // Update document with OCR results
    await ctx.runMutation(api.documents.updateOcrSummary, {
      documentId,
      ocrText: mockOcrText,
      ocrConfidence: 0.95,
      pageCount: 1,
    });

    // Mark document as ready
    await ctx.runMutation(api.documents.updateStatus, {
      documentId,
      status: "ready",
    });
  },
});

// Get OCR job by document ID
export const getByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    return await ctx.db
      .query("ocrJobs")
      .withIndex("by_document", (q) => q.eq("documentId", documentId))
      .first();
  },
});

// Update OCR job status
export const updateStatus = mutation({
  args: {
    jobId: v.id("ocrJobs"),
    status: v.union(v.literal("pending"), v.literal("processing"), v.literal("completed"), v.literal("failed")),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, { jobId, ...updates }) => {
    const job = await ctx.db.get(jobId);
    if (!job) {
      throw new Error("OCR job not found");
    }

    await ctx.db.patch(jobId, updates);
    return jobId;
  },
});

// List all OCR jobs by status
export const listByStatus = query({
  args: { status: v.union(v.literal("pending"), v.literal("processing"), v.literal("completed"), v.literal("failed")) },
  handler: async (ctx, { status }) => {
    return await ctx.db
      .query("ocrJobs")
      .withIndex("by_status", (q) => q.eq("status", status))
      .order("asc")
      .collect();
  },
});
