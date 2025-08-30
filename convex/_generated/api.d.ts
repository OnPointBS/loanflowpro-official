/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as audit from "../audit.js";
import type * as auth from "../auth.js";
import type * as authMutations from "../authMutations.js";
import type * as billing from "../billing.js";
import type * as clientChats from "../clientChats.js";
import type * as clientInvites from "../clientInvites.js";
import type * as clientLoanTypes from "../clientLoanTypes.js";
import type * as clients from "../clients.js";
import type * as dashboard from "../dashboard.js";
import type * as documents from "../documents.js";
import type * as entitlements from "../entitlements.js";
import type * as internal_ from "../internal.js";
import type * as loanFiles from "../loanFiles.js";
import type * as loanTypes from "../loanTypes.js";
import type * as messages from "../messages.js";
import type * as migrations from "../migrations.js";
import type * as ocr from "../ocr.js";
import type * as partners from "../partners.js";
import type * as storageUsage from "../storageUsage.js";
import type * as taskTemplateLoanTypes from "../taskTemplateLoanTypes.js";
import type * as taskTemplates from "../taskTemplates.js";
import type * as tasks from "../tasks.js";
import type * as users_create from "../users/create.js";
import type * as users from "../users.js";
import type * as workspaceMembers_create from "../workspaceMembers/create.js";
import type * as workspaceMembers from "../workspaceMembers.js";
import type * as workspaces_create from "../workspaces/create.js";
import type * as workspaces from "../workspaces.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  audit: typeof audit;
  auth: typeof auth;
  authMutations: typeof authMutations;
  billing: typeof billing;
  clientChats: typeof clientChats;
  clientInvites: typeof clientInvites;
  clientLoanTypes: typeof clientLoanTypes;
  clients: typeof clients;
  dashboard: typeof dashboard;
  documents: typeof documents;
  entitlements: typeof entitlements;
  internal: typeof internal_;
  loanFiles: typeof loanFiles;
  loanTypes: typeof loanTypes;
  messages: typeof messages;
  migrations: typeof migrations;
  ocr: typeof ocr;
  partners: typeof partners;
  storageUsage: typeof storageUsage;
  taskTemplateLoanTypes: typeof taskTemplateLoanTypes;
  taskTemplates: typeof taskTemplates;
  tasks: typeof tasks;
  "users/create": typeof users_create;
  users: typeof users;
  "workspaceMembers/create": typeof workspaceMembers_create;
  workspaceMembers: typeof workspaceMembers;
  "workspaces/create": typeof workspaces_create;
  workspaces: typeof workspaces;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
