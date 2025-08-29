import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useAuth } from '../auth/AuthProvider';

import Sidebar from './Sidebar';
import WorkspaceSelector from './WorkspaceSelector';

const WorkspaceLayout: React.FC = () => {
  const { workspace, isLoading } = useWorkspace();
  const { user } = useAuth();
  
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('🔍 [DEBUG] WorkspaceLayout - Current state:');
    console.log('🔍 [DEBUG] - isLoading:', isLoading);
    console.log('🔍 [DEBUG] - workspace:', workspace);
    console.log('🔍 [DEBUG] - user:', user);
    console.log('🔍 [DEBUG] - localStorage verifiedUser:', localStorage.getItem('verifiedUser'));
    console.log('🔍 [DEBUG] - localStorage demoUser:', localStorage.getItem('demoUser'));
    
    if (workspace) {
      console.log('🔍 [DEBUG] - Workspace details:');
      console.log('🔍 [DEBUG]   - ID:', workspace.id);
      console.log('🔍 [DEBUG]   - Name:', workspace.name);
      console.log('🔍 [DEBUG]   - Status:', workspace.status);
      console.log('🔍 [DEBUG]   - Type:', typeof workspace.id);
    }
  }, [workspace, isLoading, user]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [workspace?.id]);

  const handleMenuToggle = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleMobileClose = () => {
    setIsMobileOpen(false);
  };

  // Show loading state while workspace context is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
        <p className="text-slate-600 text-lg">Loading workspace...</p>
          <div className="mt-4 p-4 bg-white/50 rounded-lg text-sm text-gray-600">
            <p>Debug Info:</p>
            <p>isLoading: {String(isLoading)}</p>
            <p>Workspace: {workspace ? 'Found' : 'Not Found'}</p>
            <p>User: {user ? 'Found' : 'Not Found'}</p>
          </div>
        </div>
      </div>
    );
  }

  // If no workspace is selected, show workspace selector or appropriate message
  if (!workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8941F]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">No Workspace Available</h2>
            <p className="text-slate-600 mb-8">
              You don't have access to any workspaces yet. Please contact your administrator or create a new workspace.
            </p>
            
            {/* Debug Information */}
            <div className="mb-6 p-4 bg-slate-100 rounded-lg text-left text-sm">
              <h3 className="font-semibold mb-2 text-slate-900">Debug Information:</h3>
              <div className="space-y-1 text-slate-600">
                <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'Not Found'}</p>
                <p><strong>Workspace:</strong> {workspace ? JSON.stringify(workspace, null, 2) : 'Not Found'}</p>
                <p><strong>LocalStorage verifiedUser:</strong> {localStorage.getItem('verifiedUser') || 'Not Found'}</p>
                <p><strong>LocalStorage demoUser:</strong> {localStorage.getItem('demoUser') || 'Not Found'}</p>
                <p><strong>isLoading:</strong> {String(isLoading)}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/signin'}
                className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If workspace is selected, show the main layout
  if (workspace) {
    console.log('🔍 [DEBUG] Rendering main layout with workspace:', workspace);
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Fixed Left Navigation - Fixed position, doesn't scroll */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileOpen}
          onClose={handleMobileClose}
          onMenuToggle={handleMenuToggle}
        />
        
        {/* Main Content Area - With left margin to account for fixed sidebar */}
        <div className={`transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
          {/* Mobile Menu Button - Only visible on mobile, properly positioned */}
          <div className="lg:hidden fixed top-4 z-50 left-4 mobile-menu-toggle">
            <button
              onClick={handleMenuToggle}
              className="bg-[#D4AF37] text-white p-4 rounded-lg shadow-lg hover:bg-[#B8941F] transition-all duration-200 border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Page Content - Full height and width, scrollable */}
          <main className="min-h-screen overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 mobile-content">
            <div className="w-full px-4 py-6 lg:px-0 lg:py-0">

              
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Fallback loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
        <p className="text-slate-600 text-lg">Initializing...</p>
        <div className="mt-4 p-4 bg-white/50 rounded-lg text-sm text-gray-600">
          <p>Debug Info:</p>
          <p>isLoading: {String(isLoading)}</p>
          <p>Workspace: {workspace ? 'Found' : 'Not Found'}</p>
          <p>User: {user ? 'Found' : 'Not Found'}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
