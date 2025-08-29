import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useAuth } from '../auth/AuthProvider';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

const Dashboard: React.FC = () => {
  const { currentWorkspace: workspace } = useWorkspace();
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [animateIn, setAnimateIn] = useState(false);
  
  const hasValidWorkspace = !!workspace?.id;

  // Real Convex queries for dashboard data
  const dashboardStats = useQuery(
    api.dashboard.getDashboardStats, 
    hasValidWorkspace ? { workspaceId: workspace.id as Id<"workspaces"> } : "skip"
  );
  
  const recentActivity = useQuery(
    api.dashboard.getRecentActivity, 
    hasValidWorkspace ? { workspaceId: workspace.id as Id<"workspaces"> } : "skip"
  );
  
  const todaysTasks = useQuery(
    api.dashboard.getTodaysTasks, 
    hasValidWorkspace ? { workspaceId: workspace.id as Id<"workspaces"> } : "skip"
  );

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Don't render until workspace is loaded
  if (!workspace?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-orange/10 to-gunmetal/10">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-brand-orange-dark rounded-full animate-spin mx-auto" style={{ animationDelay: '-0.5s' }}></div>
          </div>
          <p className="text-gunmetal-light text-xl font-medium animate-pulse">Loading workspace...</p>
          <p className="text-gunmetal-light text-sm mt-2">Setting up your dashboard...</p>
        </div>
      </div>
    );
  }

  // Loading state while data is being fetched
  if (!dashboardStats || !recentActivity || !todaysTasks) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-orange/10 to-gunmetal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin mx-auto mb-6"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-brand-orange-dark rounded-full animate-spin mx-auto" style={{ animationDelay: '-0.5s' }}></div>
                </div>
                <p className="text-gunmetal-light text-xl font-medium animate-pulse">Loading dashboard data...</p>
                <p className="text-gunmetal-light text-sm mt-2">Fetching your latest information...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard stats cards data
  const statsCards = [
    {
      name: 'Active Clients',
      value: dashboardStats.activeClients.toString(),
      change: '0', // TODO: Implement change calculation
      changeType: 'neutral' as const,
      icon: '👥',
      gradient: 'from-[#D4AF37] to-[#B8941F]',
      bgGradient: 'from-[#D4AF37]/10 to-[#B8941F]/10',
      delay: '100ms'
    },
    {
      name: 'Active Loan Files',
      value: dashboardStats.activeLoanFiles.toString(),
      change: '0', // TODO: Implement change calculation
      changeType: 'neutral' as const,
      icon: '📁',
      gradient: 'from-slate-600 to-slate-700',
      bgGradient: 'from-slate-100 to-slate-200',
      delay: '200ms'
    },
    {
      name: 'Pending Tasks',
      value: dashboardStats.pendingTasks.toString(),
      change: '0', // TODO: Implement change calculation
      changeType: 'neutral' as const,
      icon: '✅',
      gradient: 'from-[#D4AF37] to-[#B8941F]',
      bgGradient: 'from-[#D4AF37]/10 to-[#B8941F]/10',
      delay: '300ms'
    },
    {
      name: 'Documents',
      value: dashboardStats.totalDocuments.toString(),
      change: '0', // TODO: Implement change calculation
      changeType: 'neutral' as const,
      icon: '📄',
      gradient: 'from-slate-600 to-slate-700',
      bgGradient: 'from-slate-100 to-slate-200',
      delay: '400ms'
    },
  ];

  // Helper function to get priority color and styling
  const getPriorityStyling = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          color: 'from-red-500 to-red-600',
          bgColor: 'from-red-50 to-red-100',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        };
      case 'high':
        return {
          color: 'from-[#D4AF37] to-[#B8941F]',
          bgColor: 'from-[#D4AF37]/10 to-[#B8941F]/10',
          borderColor: 'border-[#D4AF37]/20',
          textColor: 'text-[#B8941F]'
        };
      case 'medium':
        return {
          color: 'from-slate-500 to-slate-600',
          bgColor: 'from-slate-100 to-slate-200',
          borderColor: 'border-slate-200',
          textColor: 'text-slate-700'
        };
      case 'low':
        return {
          color: 'from-slate-400 to-slate-500',
          bgColor: 'from-slate-50 to-slate-100',
          borderColor: 'border-slate-200',
          textColor: 'text-slate-600'
        };
      default:
        return {
          color: 'from-slate-400 to-slate-500',
          bgColor: 'from-slate-50 to-slate-100',
          borderColor: 'border-slate-200',
          textColor: 'text-slate-700'
        };
    }
  };

  // Helper function to get task icon
  const getTaskIcon = (assigneeRole: string) => {
    switch (assigneeRole) {
      case 'ADVISOR':
        return '📋';
      case 'CLIENT':
        return '📄';
      case 'STAFF':
        return '📞';
      default:
        return '✅';
    }
  };

  // Helper function to format due date
  const formatDueDate = (dueDate: number) => {
    const now = Date.now();
    const diff = dueDate - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 0) {
      return 'Overdue';
    } else if (hours < 24) {
      return `Due in ${hours} hour${hours === 1 ? '' : 's'}`;
    } else {
      const days = Math.floor(hours / 24);
      return `Due in ${days} day${days === 1 ? '' : 's'}`;
    }
  };

  return (
    <div className={`w-full px-4 md:px-6 lg:px-8 py-6 space-y-6 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

      {/* Premium Header */}
      <div className="relative animate-fade-in-down px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-[#B8941F]/10 rounded-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl mb-2 font-bold text-slate-900">Dashboard</h1>
              <p className="text-lg text-slate-600">Welcome back! Here's what's happening with your loan portfolio.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Timeframe:</span>
              <select 
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
        {statsCards.map((stat, index) => (
          <div key={index} className={`group relative animate-fade-in-up`} style={{ animationDelay: stat.delay }}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 group-hover:shadow-3xl group-hover:scale-105"></div>
            <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:shadow-glow transition-all duration-300`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-slate-600">
                    {stat.change}
                  </span>
                  <p className="text-xs text-slate-500">vs last period</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">{stat.name}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
              <button className="text-[#D4AF37] hover:text-[#B8941F] font-semibold transition-colors duration-200">
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 border border-white/30">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.priority === 'high' ? 'bg-red-500' : 
                      activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  action: 'add-client',
                  title: 'Add New Client',
                  description: 'Create a new client profile',
                  icon: '👥',
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  action: 'create-loan',
                  title: 'Create Loan File',
                  description: 'Start a new loan application',
                  icon: '📁',
                  color: 'from-green-500 to-green-600'
                },
                {
                  action: 'upload-doc',
                  title: 'Upload Document',
                  description: 'Add files to loan files',
                  icon: '📄',
                  color: 'from-purple-500 to-purple-600'
                },
                {
                  action: 'view-analytics',
                  title: 'View Analytics',
                  description: 'See performance metrics',
                  icon: '📊',
                  color: 'from-[#D4AF37] to-[#B8941F]'
                }
              ].map((action, index) => (
                <button
                  key={action.action}
                  className="group relative animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl border border-white/20 shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"></div>
                  <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-md hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                        {action.icon}
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-800 text-sm">{action.title}</h4>
                        <p className="text-xs text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="px-6">
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-bold text-slate-900">Today's Tasks</h3>
              <select className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange">
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {todaysTasks.length > 0 ? (
              todaysTasks.map((task, index) => {
                const priorityStyling = getPriorityStyling(task.priority);
                const taskIcon = getTaskIcon(task.assigneeRole);
                const dueDateText = formatDueDate(task.dueDate);
                
                return (
                  <div key={index} className={`animate-fade-in-up group/task`} style={{ animationDelay: `${index * 150}ms` }}>
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${priorityStyling.bgColor} backdrop-blur-sm rounded-xl border ${priorityStyling.borderColor} shadow-md transition-all duration-300 group-hover/task:shadow-lg group-hover/task:scale-[1.02]`}></div>
                      <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-md hover:shadow-lg transition-all duration-200">
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${priorityStyling.color} flex items-center justify-center text-white text-lg shadow-md`}>
                            {taskIcon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-base font-semibold text-gunmetal truncate">{task.title}</h4>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${priorityStyling.bgColor} ${priorityStyling.textColor} border ${priorityStyling.borderColor}`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gunmetal-light mb-2">Assigned to {task.assigneeRole}</p>
                            <p className="text-xs text-gunmetal-light mb-3">{dueDateText}</p>
                            
                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs text-gunmetal-light mb-1">
                                <span>Progress</span>
                                <span>{task.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 bg-gradient-to-r ${priorityStyling.color} rounded-full transition-all duration-300`}
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                              <button className="text-xs bg-white/80 hover:bg-white text-gunmetal px-3 py-1.5 rounded-lg border border-gray-200 transition-colors">
                                View Details
                              </button>
                              <button className="text-xs bg-white/80 hover:bg-white text-gunmetal px-3 py-1.5 rounded-lg border border-gray-200 transition-colors">
                                Update Status
                              </button>
                            </div>
                            
                            {/* Quick Action Icons */}
                            <div className="flex items-center space-x-2 mt-3">
                              <button className="w-8 h-8 rounded-lg bg-gradient-to-r from-brand-orange/20 to-brand-orange/30 text-brand-orange hover:from-brand-orange/30 hover:to-brand-orange/40 transition-all duration-200 flex items-center justify-center">
                                📝
                              </button>
                              <button className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500/20 to-green-500/30 text-green-600 hover:from-green-500/30 hover:to-green-500/40 transition-all duration-200 flex items-center justify-center">
                                ✅
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No tasks due today</p>
              </div>
            )}
          </div>
          
          {/* View All Tasks Button */}
          <div className="mt-6 pt-4 border-t border-white/30">
            <button className="w-full text-center text-[#D4AF37] hover:text-[#B8941F] text-base font-semibold transition-all duration-200 hover:scale-105 group">
              <span className="inline-flex items-center space-x-2">
                <span>View All Tasks</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
