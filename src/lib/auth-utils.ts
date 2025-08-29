import { api } from "../../convex/_generated/api";

// Helper function to check if user is authenticated
export const isAuthenticated = (user: any): boolean => {
  return user !== null && user !== undefined;
};

// Helper function to get user display name
export const getUserDisplayName = (user: any): string => {
  if (!user) return "Unknown User";
  return user.name || user.email?.split("@")[0] || "Unknown User";
};

// Helper function to check if user has verified email
export const isEmailVerified = (user: any): boolean => {
  return user?.emailVerified === true;
};
