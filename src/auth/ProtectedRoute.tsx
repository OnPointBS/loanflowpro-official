import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Check for demo user or verified user synchronously on first render
  const storedDemoUser = localStorage.getItem("demoUser");
  const storedVerifiedUser = localStorage.getItem("verifiedUser");
  let hasDemoUser = false;
  let hasVerifiedUser = false;
  
  console.log('🔍 [DEBUG] ProtectedRoute - Checking authentication:');
  console.log('🔍 [DEBUG] - isAuthenticated:', isAuthenticated);
  console.log('🔍 [DEBUG] - isLoading:', isLoading);
  console.log('🔍 [DEBUG] - storedDemoUser:', storedDemoUser);
  console.log('🔍 [DEBUG] - storedVerifiedUser:', storedVerifiedUser);
  
  if (storedDemoUser) {
    try {
      const parsed = JSON.parse(storedDemoUser);
      if (parsed.isDemo) {
        hasDemoUser = true;
        console.log('🔍 [DEBUG] ProtectedRoute - Demo user found and valid');
      }
    } catch (e) {
      console.error('🔍 [DEBUG] ProtectedRoute - Error parsing demoUser:', e);
      localStorage.removeItem("demoUser");
    }
  }

  if (storedVerifiedUser) {
    try {
      const parsed = JSON.parse(storedVerifiedUser);
      if (parsed.isAuthenticated) {
        hasVerifiedUser = true;
        console.log('🔍 [DEBUG] ProtectedRoute - Verified user found and valid');
      }
    } catch (e) {
      console.error('🔍 [DEBUG] ProtectedRoute - Error parsing verifiedUser:', e);
      localStorage.removeItem("verifiedUser");
    }
  }

  console.log('🔍 [DEBUG] ProtectedRoute - Final auth state:');
  console.log('🔍 [DEBUG] - hasDemoUser:', hasDemoUser);
  console.log('🔍 [DEBUG] - hasVerifiedUser:', hasVerifiedUser);
  console.log('🔍 [DEBUG] - Will allow access:', isAuthenticated || hasDemoUser || hasVerifiedUser);

  // Show loading state while checking authentication
  if (isLoading && !hasDemoUser && !hasVerifiedUser) {
    console.log('🔍 [DEBUG] ProtectedRoute - Showing loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow access if authenticated OR has demo user OR has verified user
  if (isAuthenticated || hasDemoUser || hasVerifiedUser) {
    console.log('🔍 [DEBUG] ProtectedRoute - Allowing access to protected route');
    return <>{children}</>;
  }

  // Redirect to sign-in if not authenticated and no demo user and no verified user
  console.log('🔍 [DEBUG] ProtectedRoute - Redirecting to signin');
  return <Navigate to="/signin" replace />;
};
