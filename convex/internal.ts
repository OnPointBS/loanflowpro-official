// Internal API references for cross-function calls
export const internal = {
  users: {
    create: "users:create",
  },
  workspaceMembers: {
    create: "workspaceMembers:create",
  },
  documents: {
    create: "documents:create",
    get: "documents:get",
    updateStatus: "documents:updateStatus",
    updateOcrSummary: "documents:updateOcrSummary",
  },
  documentPages: {
    create: "documentPages:create",
  },
  ocrJobs: {
    get: "ocrJobs:get",
    updateStatus: "ocrJobs:updateStatus",
  },
  messages: {
    create: "messages:create",
  },
  subscriptions: {
    update: "subscriptions:update",
  },
  entitlements: {
    recompute: "entitlements:recompute",
  },
} as const;
