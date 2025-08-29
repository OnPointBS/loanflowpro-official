import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../auth/AuthProvider';

interface Workspace {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt?: number;
}

interface WorkspaceMembership {
  role: 'ADVISOR' | 'STAFF' | 'CLIENT' | 'PARTNER';
  status: 'active' | 'inactive';
  joinedAt: number;
  permissions: string[];
  workspaceId: string;
  userId: string;
}

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  currentMembership: WorkspaceMembership | null;
  isLoading: boolean;
  error: string | null;
  hasMultipleRoles: boolean;
  multipleRolesMessage: string | null;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

interface WorkspaceProviderProps {
  children: ReactNode;
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({ children }) => {
  const { user, workspace } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [currentMembership, setCurrentMembership] = useState<WorkspaceMembership | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMultipleRoles, setHasMultipleRoles] = useState(false);
  const [multipleRolesMessage, setMultipleRolesMessage] = useState<string | null>(null);

  // Main useEffect for workspace management
  useEffect(() => {
    console.log('🔍 [DEBUG] WorkspaceContext - useEffect triggered');
    console.log('🔍 [DEBUG] - useAuth user:', user);
    console.log('🔍 [DEBUG] - useAuth workspace:', workspace);
    console.log('🔍 [DEBUG] - currentWorkspace state:', currentWorkspace);
    console.log('🔍 [DEBUG] - isLoading state:', isLoading);
    console.log('🔍 [DEBUG] - localStorage verifiedUser:', localStorage.getItem('verifiedUser'));
    console.log('🔍 [DEBUG] - localStorage demoUser:', localStorage.getItem('demoUser'));

    // Don't proceed if we're already loading
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    // Priority 1: Check for verified user in localStorage first (highest priority)
    const storedVerifiedUser = localStorage.getItem('verifiedUser');
    if (storedVerifiedUser) {
      try {
        const parsed = JSON.parse(storedVerifiedUser);
        if (parsed.isAuthenticated && parsed.workspace && parsed.user) {
          console.log('🔍 [DEBUG] - Parsed verifiedUser:', parsed);
          console.log('🔍 [DEBUG] - Setting verified user workspace:', parsed.workspace);
          
          setCurrentWorkspace(parsed.workspace);
          
          const verifiedMembership = {
            role: 'ADVISOR' as const,
            status: 'active' as const,
            joinedAt: Date.now(),
            permissions: ['Full Access'],
            workspaceId: parsed.workspace.id,
            userId: parsed.user._id,
          };
          
          setCurrentMembership(verifiedMembership);
          setIsLoading(false);
          console.log('🔍 [DEBUG] - Verified user workspace context set successfully');
          
          // Check if user might have multiple roles
          checkForMultipleRoles(parsed.user.email);
          return; // Exit early, don't check other sources
        }
      } catch (error) {
        console.error('Error parsing verifiedUser from localStorage:', error);
      }
    }

    // Priority 2: Check for demo user in localStorage (can work without useAuth workspace)
    const storedDemoUser = localStorage.getItem('demoUser');
    if (storedDemoUser) {
      try {
        const parsed = JSON.parse(storedDemoUser);
        if (parsed.isAuthenticated && parsed.isDemo && parsed.workspaceId) {
          console.log('🔍 [DEBUG] - Setting demo user workspace from localStorage:', parsed.workspaceId);
          
          // Create demo workspace from stored workspaceId
          const demoWorkspace = {
            id: parsed.workspaceId,
            name: 'Demo Workspace',
            status: 'active' as const,
            createdAt: Date.now(),
          };
          
          setCurrentWorkspace(demoWorkspace);
          
          const demoMembership = {
            role: 'ADVISOR' as const,
            status: 'active' as const,
            joinedAt: Date.now(),
            permissions: ['Full Access'],
            workspaceId: parsed.workspaceId,
            userId: parsed._id,
          };
          
          setCurrentMembership(demoMembership);
          setIsLoading(false);
          console.log('🔍 [DEBUG] - Demo user workspace context set successfully');
          return; // Exit early, don't check other sources
        }
      } catch (error) {
        console.error('Error parsing demoUser from localStorage:', error);
      }
    }

    // Priority 3: Check useAuth workspace (fallback)
    if (user && workspace) {
      console.log('🔍 [DEBUG] - Checking useAuth workspace:', workspace);
      setCurrentWorkspace(workspace);
      
      // For now, assume ADVISOR role for useAuth users
      const authMembership = {
        role: 'ADVISOR' as const,
        status: 'active' as const,
        joinedAt: Date.now(),
        permissions: ['Full Access'],
        workspaceId: workspace.id,
        userId: user._id,
      };
      
      setCurrentMembership(authMembership);
      setIsLoading(false);
      console.log('🔍 [DEBUG] - useAuth workspace context set successfully');
      
      // Check if user might have multiple roles
      checkForMultipleRoles(user.email);
      return;
    }

    // No workspace found from any source
    console.log('🔍 [DEBUG] - No workspace found from any source');
    setCurrentWorkspace(null);
    setCurrentMembership(null);
    setIsLoading(false);
  }, [user, workspace]); // Keep these dependencies but prioritize localStorage

  // Simple function to check if user might have multiple roles
  const checkForMultipleRoles = async (email: string) => {
    try {
      // This is a simple check - in a real app, you might want to query the database
      // For now, we'll just show a generic message if the user has a verified account
      const storedVerifiedUser = localStorage.getItem('verifiedUser');
      if (storedVerifiedUser) {
        const parsed = JSON.parse(storedVerifiedUser);
        if (parsed.isAuthenticated && parsed.user.email === email) {
          // User has a verified account, they might have multiple roles
          setHasMultipleRoles(true);
          setMultipleRolesMessage(
            `Welcome back! You're currently accessing your ${parsed.workspace.name} workspace. ` +
            `If you need to access a different role or workspace, please contact support.`
          );
        }
      }
    } catch (error) {
      console.error('Error checking for multiple roles:', error);
    }
  };

  // Add a listener for storage changes to keep workspace state in sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Handle verifiedUser changes (magic link users)
      if (e.key === 'verifiedUser' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.isAuthenticated && parsed.workspace) {
            console.log('🔍 [DEBUG] WorkspaceContext - Storage change detected, updating verified user workspace');
            setCurrentWorkspace(parsed.workspace);
            
            const verifiedMembership = {
              role: 'ADVISOR' as const,
              status: 'active' as const,
              joinedAt: Date.now(),
              permissions: ['Full Access'],
              workspaceId: parsed.workspace.id,
              userId: parsed.user._id,
            };
            
            setCurrentMembership(verifiedMembership);
            setIsLoading(false);
            
            // Check for multiple roles
            checkForMultipleRoles(parsed.user.email);
          }
        } catch (error) {
          console.error('Error parsing verifiedUser from storage change:', error);
        }
      }
      
      // Handle demoUser changes
      if (e.key === 'demoUser' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.isAuthenticated && parsed.workspace) {
            console.log('🔍 [DEBUG] WorkspaceContext - Storage change detected, updating demo user workspace');
            setCurrentWorkspace(parsed.workspace);
            
            const demoMembership = {
              role: 'ADVISOR' as const,
              status: 'active' as const,
              joinedAt: Date.now(),
              permissions: ['Full Access'],
              workspaceId: parsed.workspace.id,
              userId: parsed.user._id,
            };
            
            setCurrentMembership(demoMembership);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error parsing demoUser from storage change:', error);
        }
      }
      
      // Handle clearing of users
      if (e.key === 'verifiedUser' && !e.newValue) {
        console.log('🔍 [DEBUG] WorkspaceContext - verifiedUser cleared, resetting workspace');
        setCurrentWorkspace(null);
        setCurrentMembership(null);
        setIsLoading(false);
        setHasMultipleRoles(false);
        setMultipleRolesMessage(null);
      }
      
      if (e.key === 'demoUser' && !e.newValue) {
        console.log('🔍 [DEBUG] WorkspaceContext - demoUser cleared, resetting workspace');
        setCurrentWorkspace(null);
        setCurrentMembership(null);
        setIsLoading(false);
        setHasMultipleRoles(false);
        setMultipleRolesMessage(null);
      }
    };

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom events from the same tab
    const handleCustomStorageChange = (e: CustomEvent) => {
      const { key, newValue } = e.detail;
      
      if (key === 'verifiedUser' && newValue) {
        try {
          const parsed = JSON.parse(newValue);
          if (parsed.isAuthenticated && parsed.workspace) {
            console.log('🔍 [DEBUG] WorkspaceContext - Custom storage change detected, updating verified user workspace');
            setCurrentWorkspace(parsed.workspace);
            
            const verifiedMembership = {
              role: 'ADVISOR' as const,
              status: 'active' as const,
              joinedAt: Date.now(),
              permissions: ['Full Access'],
              workspaceId: parsed.workspace.id,
              userId: parsed.user._id,
            };
            
            setCurrentMembership(verifiedMembership);
            setIsLoading(false);
            
            // Check for multiple roles
            checkForMultipleRoles(parsed.user.email);
          }
        } catch (error) {
          console.error('Error parsing verifiedUser from custom storage change:', error);
        }
      }
      
      if (key === 'demoUser' && newValue) {
        try {
          const parsed = JSON.parse(newValue);
          if (parsed.isAuthenticated && parsed.workspace) {
            console.log('🔍 [DEBUG] WorkspaceContext - Custom storage change detected, updating demo user workspace');
            setCurrentWorkspace(parsed.workspace);
            
            const demoMembership = {
              role: 'ADVISOR' as const,
              status: 'active' as const,
              joinedAt: Date.now(),
              permissions: ['Full Access'],
              workspaceId: parsed.workspace.id,
              userId: parsed.user._id,
            };
            
            setCurrentMembership(demoMembership);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error parsing demoUser from custom storage change:', error);
        }
      }
    };

    window.addEventListener('localStorageChange', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange as EventListener);
    };
  }, []);

  const value: WorkspaceContextType = {
    currentWorkspace,
    currentMembership,
    isLoading,
    error,
    hasMultipleRoles,
    multipleRolesMessage,
  };

  console.log('🔍 [DEBUG] WorkspaceContext - State changed:', {
    currentWorkspace,
    currentMembership,
    isLoading,
    error,
    hasMultipleRoles,
    multipleRolesMessage,
  });

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
