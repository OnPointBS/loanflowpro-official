import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  workspace?: any;
  logout?: () => void;
  signOut?: () => void;
  updateProfile?: (data: any) => void;
  changePassword?: (data: any) => void;
  login?: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a useAuth hook that provides the same interface as the old one
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [demoUser, setDemoUser] = useState<any>(null);
  const [verifiedUser, setVerifiedUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('🔍 [DEBUG] AuthProvider - useEffect triggered');
    
    // Check for demo user in localStorage
    const storedDemoUser = localStorage.getItem("demoUser");
    console.log('🔍 [DEBUG] - localStorage demoUser:', storedDemoUser);
    
    if (storedDemoUser) {
      try {
        const parsed = JSON.parse(storedDemoUser);
        console.log('🔍 [DEBUG] - Parsed demoUser:', parsed);
        
        if (parsed.isDemo) {
          console.log('🔍 [DEBUG] - Setting demo user');
          setDemoUser(parsed);
        }
      } catch (e) {
        console.error('🔍 [DEBUG] - Error parsing demoUser:', e);
        localStorage.removeItem("demoUser");
      }
    }

    // Check for verified user in localStorage
    const storedVerifiedUser = localStorage.getItem("verifiedUser");
    console.log('🔍 [DEBUG] - localStorage verifiedUser:', storedVerifiedUser);
    
    if (storedVerifiedUser) {
      try {
        const parsed = JSON.parse(storedVerifiedUser);
        console.log('🔍 [DEBUG] - Parsed verifiedUser:', parsed);
        
        if (parsed.isAuthenticated) {
          console.log('🔍 [DEBUG] - Setting verified user');
          setVerifiedUser(parsed);
        }
      } catch (e) {
        console.error('🔍 [DEBUG] - Error parsing verifiedUser:', e);
        localStorage.removeItem("verifiedUser");
      }
    }
  }, []);

  // Add a listener for storage changes to keep demo user state in sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'demoUser' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.isDemo) {
            console.log('🔍 [DEBUG] AuthProvider - Storage change detected, updating demo user');
            setDemoUser(parsed);
          }
        } catch (e) {
          console.error('🔍 [DEBUG] - Error parsing demoUser from storage change:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // If we have a verified user, use that (highest priority)
  if (verifiedUser) {
    console.log('🔍 [DEBUG] AuthProvider - Rendering with verified user:', verifiedUser);
    
    const value: AuthContextType = {
      isAuthenticated: true,
      isLoading: false,
      user: verifiedUser.user,
      workspace: verifiedUser.workspace,
      logout: () => {
        console.log('🔍 [DEBUG] AuthProvider - Logout called for verified user');
        localStorage.removeItem("verifiedUser");
        setVerifiedUser(null);
        navigate("/");
      },
      signOut: () => {
        console.log('🔍 [DEBUG] AuthProvider - SignOut called for verified user');
        localStorage.removeItem("verifiedUser");
        setVerifiedUser(null);
        navigate("/");
      },
      updateProfile: () => {},
      changePassword: () => {},
      login: () => {},
    };

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  }
  
  // If we have a demo user, use that instead of Convex Auth
  if (demoUser) {
    console.log('🔍 [DEBUG] AuthProvider - Rendering with demo user:', demoUser);
    
    // Get the real demo workspace ID from the demo data (current development workspace ID)
    const demoWorkspaceId = 'm177784ytkc1n475ztft15enth7pg30s';
    
    const value: AuthContextType = {
      isAuthenticated: true,
      isLoading: false,
      user: demoUser,
      workspace: { id: demoWorkspaceId, name: 'Demo Workspace', status: 'active' },
      logout: () => {
        console.log('🔍 [DEBUG] AuthProvider - Logout called for demo user');
        localStorage.removeItem("demoUser");
        setDemoUser(null);
        navigate("/");
      },
      signOut: () => {
        console.log('🔍 [DEBUG] AuthProvider - SignOut called for demo user');
        localStorage.removeItem("demoUser");
        setDemoUser(null);
        navigate("/");
      },
      updateProfile: () => {},
      changePassword: () => {},
      login: () => {},
    };

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  }
  
  // Use Convex Auth if no demo user or verified user
  console.log('🔍 [DEBUG] AuthProvider - Rendering with no authentication');
  
  const value: AuthContextType = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    workspace: null,
    logout: () => {},
    signOut: () => {},
    updateProfile: () => {},
    changePassword: () => {},
    login: () => {},
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
