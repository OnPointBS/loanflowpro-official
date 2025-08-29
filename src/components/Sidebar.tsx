import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useAuth } from '../auth/AuthProvider';

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
  onMenuToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, isMobileOpen, onClose, onMenuToggle }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { currentWorkspace: workspace } = useWorkspace();

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: '📊' },
    { name: 'Clients', href: '/app/clients', icon: '👥' },
    { name: 'Loan Types', href: '/app/loan-types', icon: '📋' },
    { name: 'Loan Files', href: '/app/loan-files', icon: '📁' },
    { name: 'Documents', href: '/app/documents', icon: '📄' },
    { name: 'Tasks', href: '/app/tasks', icon: '✅' },
    { name: 'Analytics', href: '/app/analytics', icon: '📈' },
    { name: 'Settings', href: '/app/settings', icon: '⚙️' },
    { name: 'Billing', href: '/app/billing', icon: '💳' },
    { name: 'Sign Out', href: '#', icon: '🚪', action: 'signout' },
  ];

  const handleSignOut = () => {
    if (signOut) {
      signOut();
    }
  };

  if (isMobileOpen) {
    return (
      <>
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden mobile-menu-backdrop" onClick={onClose} />

        {/* Mobile sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden border-r-2 border-[#D4AF37]/30 mobile-sidebar open">
          <div className="flex items-center justify-between h-16 px-4 border-b border-[#D4AF37]/20 bg-[#D4AF37]/5">
            <h2 className="text-lg font-semibold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="relative p-3 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] hover:text-[#B8941F] hover:bg-[#D4AF37]/30 transition-all duration-200 shadow-lg border border-[#D4AF37]/30"
              aria-label="Close mobile menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Workspace Display */}
          <div className="px-4 py-3 border-b border-[#D4AF37]/20 bg-white/5">
            <label className="block text-xs font-medium text-[#D4AF37] mb-2 uppercase tracking-wide">
              Workspace
            </label>
            <div className="text-white text-sm">
              {workspace?.name || 'Demo Workspace'}
            </div>
          </div>

          <nav className="mt-4 px-4 flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                
                // Handle sign out action
                if (item.action === 'signout') {
                  return (
                    <li key={item.name}>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg text-white hover:bg-[#D4AF37]/20 transition-all duration-200"
                      >
                        <span className="mr-3 flex items-center justify-center w-5">{item.icon}</span>
                        {item.name}
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-[#D4AF37] text-white'
                          : 'text-white hover:bg-[#D4AF37]/20'
                      }`}
                    >
                      <span className="mr-3 flex items-center justify-center w-5">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </>
    );
  }

  return (
    <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl border-r-2 border-[#D4AF37]/30 transition-all duration-300 ease-in-out z-30 hidden lg:block ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Desktop sidebar content */}
      <div className="flex flex-col h-full">
        {/* Logo/Brand with Collapse Button */}
        <div className="flex items-center justify-between h-16 border-b border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4">
          {isCollapsed ? (
            <span className="text-2xl">🏦</span>
          ) : (
            <h1 className="text-xl font-bold text-white">LoanFlowPro</h1>
          )}
          
          {/* Collapse/Expand Button - Hidden on mobile, only visible on desktop */}
          <button
            onClick={onMenuToggle}
            className="relative p-3 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] hover:text-[#B8941F] hover:bg-[#D4AF37]/30 transition-all duration-200 shadow-lg border border-[#D4AF37]/30 z-10 hidden lg:block"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg 
              className="h-5 w-5 flex items-center justify-center" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Workspace Display */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-[#D4AF37]/20 bg-white/5">
            <label className="block text-xs font-medium text-[#D4AF37] mb-2 uppercase tracking-wide">
              Workspace
            </label>
            <div className="text-white text-sm">
              {workspace?.name || 'Demo Workspace'}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              
              // Handle sign out action
              if (item.action === 'signout') {
                return (
                  <li key={item.name}>
                    <button
                      onClick={handleSignOut}
                                              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white hover:bg-[#D4AF37]/20 transition-all duration-200"
                    >
                      <span className="mr-3 flex items-center justify-center w-5">{item.icon}</span>
                      {!isCollapsed && item.name}
                    </button>
                  </li>
                );
              }

              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                              isActive
                          ? 'bg-[#D4AF37] text-white'
                          : 'text-white hover:bg-[#D4AF37]/20'
                    }`}
                  >
                    <span className="mr-3 flex items-center justify-center w-5">{item.icon}</span>
                    {!isCollapsed && item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-t border-[#D4AF37]/20 bg-white/5">
            <div className="text-white text-sm">
              <div className="font-medium">{user?.name || 'Demo User'}</div>
              <div className="text-[#D4AF37]/80">{user?.email || 'demo@loanflowpro.com'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
