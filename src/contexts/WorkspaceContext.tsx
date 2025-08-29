import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';

interface Workspace {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt?: number;
  updatedAt?: number;
}

interface Membership {
  role: 'ADVISOR' | 'STAFF' | 'CLIENT';
  status: 'active' | 'invited' | 'removed';
  joinedAt: number;
  permissions: string[];
}

interface WorkspaceContextType {
  workspace: Workspace | null;
  membership: Membership | null;
  isLoading: boolean;
  error: string | null;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Create a useWorkspace hook that provides the same interface
export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

interface WorkspaceProviderProps {
  children: React.ReactNode;
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({ children }) => {
  const { user, workspace } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [currentMembership, setCurrentMembership] = useState<Membership | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  


  useEffect(() => {
    console.log('🔍 [DEBUG] WorkspaceContext - useEffect triggered');
    console.log('🔍 [DEBUG] - useAuth user:', user);
    console.log('🔍 [DEBUG] - useAuth workspace:', workspace);
    console.log('🔍 [DEBUG] - currentWorkspace state:', currentWorkspace);
    console.log('🔍 [DEBUG] - isLoading state:', isLoading);
    
    // Check if this is a demo user
    const storedDemoUser = localStorage.getItem("demoUser");
    console.log('🔍 [DEBUG] - localStorage demoUser:', storedDemoUser);
    
    if (storedDemoUser) {
      try {
        const parsed = JSON.parse(storedDemoUser);
        console.log('🔍 [DEBUG] - Parsed demoUser:', parsed);
        
        if (parsed.isDemo) {
          console.log('🔍 [DEBUG] - Setting demo workspace');
          
          // Use the real workspace ID from the demo user if available
          const workspaceId = parsed.workspaceId;
          if (!workspaceId) {
            console.log('🔍 [DEBUG] - No workspace ID found in demo user, cannot proceed');
            setIsLoading(false);
            return;
          }
          const workspaceData = {
            id: workspaceId,
            name: 'Demo Workspace',
            status: 'active' as const
          };
          console.log('🔍 [DEBUG] - Demo workspace object:', workspaceData);
          setCurrentWorkspace(workspaceData);
          
          // Set demo membership
          const demoMembership = {
            role: 'ADVISOR' as const,
            status: 'active' as const,
            joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
            permissions: ['Full access']
          };
          console.log('🔍 [DEBUG] - Demo membership object:', demoMembership);
          setCurrentMembership(demoMembership);
          
          setIsLoading(false);
          console.log('🔍 [DEBUG] - Demo workspace context set successfully');
          return;
        }
      } catch (e) {
        console.error('🔍 [DEBUG] - Error parsing demoUser:', e);
        localStorage.removeItem("demoUser");
      }
    }

    // Check if this is a verified user (magic link)
    const storedVerifiedUser = localStorage.getItem("verifiedUser");
    console.log('🔍 [DEBUG] - localStorage verifiedUser:', storedVerifiedUser);
    
    if (storedVerifiedUser) {
      try {
        const parsed = JSON.parse(storedVerifiedUser);
        console.log('🔍 [DEBUG] - Parsed verifiedUser:', parsed);
        
        if (parsed.isAuthenticated && parsed.workspace) {
          console.log('🔍 [DEBUG] - Setting verified user workspace:', parsed.workspace);
          setCurrentWorkspace(parsed.workspace);
          
          // Set verified user membership (default to ADVISOR role)
          const verifiedMembership = {
            role: 'ADVISOR' as const,
            status: 'active' as const,
            joinedAt: Date.now(),
            permissions: ['Full access', 'Manage workspace', 'Invite users', 'View analytics']
          };
          console.log('🔍 [DEBUG] - Verified user membership object:', verifiedMembership);
          setCurrentMembership(verifiedMembership);
          
          setIsLoading(false);
          return;
        } else {
          console.log('🔍 [DEBUG] - Verified user missing workspace data');
          console.log('🔍 [DEBUG] - isAuthenticated:', parsed.isAuthenticated);
          console.log('🔍 [DEBUG] - workspace:', parsed.workspace);
        }
      } catch (e) {
        console.error('🔍 [DEBUG] - Error parsing verifiedUser:', e);
        localStorage.removeItem("verifiedUser");
      }
    }

    // Use real workspace data if available
    console.log('🔍 [DEBUG] - Checking useAuth workspace:', workspace);
    if (workspace) {
      console.log('🔍 [DEBUG] - Setting useAuth workspace:', workspace);
      setCurrentWorkspace(workspace);
      
      // Set default membership for real workspace
      const defaultMembership = {
        role: 'ADVISOR' as const,
        status: 'active' as const,
        joinedAt: Date.now(),
        permissions: ['Full access', 'Manage workspace', 'Invite users', 'View analytics']
      };
      console.log('🔍 [DEBUG] - Default membership object:', defaultMembership);
      setCurrentMembership(defaultMembership);
    } else {
      console.log('🔍 [DEBUG] - No workspace found from any source');
    }
    
    setIsLoading(false);
  }, []); // Run only once on mount

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
              permissions: ['Full access', 'Manage workspace', 'Invite users', 'View analytics']
            };
            setCurrentMembership(verifiedMembership);
            setIsLoading(false);
          }
        } catch (e) {
          console.error('🔍 [DEBUG] - Error parsing verifiedUser from storage change:', e);
        }
      }
      
      // Handle demoUser changes
      if (e.key === 'demoUser' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.isDemo) {
            console.log('🔍 [DEBUG] WorkspaceContext - Storage change detected, updating demo workspace');
            // Try to parse the demo user to get the real workspace ID
            let workspaceId = 'm177784ytkc1n475ztft15enth7pg30s'; // Fallback to development ID
            try {
              const demoUserData = JSON.parse(e.newValue);
              if (demoUserData.workspaceId) {
                workspaceId = demoUserData.workspaceId;
              }
            } catch (parseError) {
              console.warn('Could not parse demo user data for workspace ID');
            }
            
            const demoWorkspace = {
              id: workspaceId,
              name: 'Demo Workspace',
              status: 'active' as const
            };
            setCurrentWorkspace(demoWorkspace);
            
            const demoMembership = {
              role: 'ADVISOR' as const,
              status: 'active' as const,
              joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
              permissions: ['Full access']
            };
            setCurrentMembership(demoMembership);
            setIsLoading(false);
          }
        } catch (e) {
          console.error('🔍 [DEBUG] - Error parsing demoUser from storage change:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Debug logging for state changes
  useEffect(() => {
    console.log('🔍 [DEBUG] WorkspaceContext - State changed:');
    console.log('🔍 [DEBUG] - currentWorkspace:', currentWorkspace);
    console.log('🔍 [DEBUG] - currentMembership:', currentMembership);
    console.log('🔍 [DEBUG] - isLoading:', isLoading);
    console.log('🔍 [DEBUG] - error:', error);
  }, [currentWorkspace, currentMembership, isLoading, error]);

  const value: WorkspaceContextType = {
    workspace: currentWorkspace,
    membership: currentMembership,
    isLoading,
    error,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
