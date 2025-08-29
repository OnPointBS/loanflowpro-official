import React from 'react';
import { useAuth } from '../auth/AuthProvider';

interface WorkspaceGuardProps {
  children: React.ReactNode;
}

export default function WorkspaceGuard({ children }: WorkspaceGuardProps) {
  const { workspace, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!workspace) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}
