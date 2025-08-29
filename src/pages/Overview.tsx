import { Link } from 'react-router-dom';
import { Users, FileText, Clock, AlertTriangle, Upload, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { useWorkspaceData } from '../hooks/useWorkspaceData';
import { formatBytes } from '../utils/formatters';

export default function Overview() {
  const { entitlements, storageUsage, activeClients, openTasks, overdueTasks, isLoading } = useWorkspaceData();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const storagePercentage = entitlements && storageUsage 
    ? Math.round((storageUsage.bytes / (entitlements.storageBytes * 1024 * 1024 * 1024)) * 100)
    : 0;

  const clientPercentage = entitlements && activeClients
    ? Math.round((activeClients.length / entitlements.activeClients) * 100)
    : 0;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeClients?.length || 0}
                {entitlements && (
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    / {entitlements.activeClients}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Usage</span>
              <span className="text-gray-900 font-medium">{clientPercentage}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${clientPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{openTasks?.length || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>Requires attention</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{overdueTasks?.length || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span>Needs immediate action</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">
                {storageUsage ? formatBytes(storageUsage.bytes) : '0 B'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Usage</span>
              <span className="text-gray-900 font-medium">{storagePercentage}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${storagePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Link to="/app/loan-files" className="text-sm text-brand-orange hover:text-brand-orange-dark">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {openTasks && openTasks.slice(0, 5).map((task) => (
              <div key={task._id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Due {task.dueAt ? new Date(task.dueAt).toLocaleDateString() : 'No due date'}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
            {(!openTasks || openTasks.length === 0) && (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {overdueTasks && overdueTasks.slice(0, 5).map((task) => (
              <div key={task._id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-red-500">
                    Overdue by {task.dueAt ? Math.ceil((Date.now() - task.dueAt) / (1000 * 60 * 60 * 24)) : 0} days
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  Overdue
                </span>
              </div>
            ))}
            {(!overdueTasks || overdueTasks.length === 0) && (
              <p className="text-gray-500 text-center py-4">No overdue tasks</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/app/clients"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brand-orange hover:bg-brand-orange/5 transition-colors"
          >
            <Users className="w-6 h-6 text-brand-orange mr-3" />
            <div>
              <p className="font-medium text-gray-900">Add Client</p>
              <p className="text-sm text-gray-500">Create a new client profile</p>
            </div>
          </Link>

          <Link
            to="/app/loan-types"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brand-orange hover:bg-brand-orange/5 transition-colors"
          >
            <FileText className="w-6 h-6 text-brand-orange mr-3" />
            <div>
              <p className="font-medium text-gray-900">Create Loan Type</p>
              <p className="text-sm text-gray-500">Set up a new loan workflow</p>
            </div>
          </Link>

          <Link
            to="/app/billing"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brand-orange hover:bg-brand-orange/5 transition-colors"
          >
            <BarChart3 className="w-6 h-6 text-brand-orange mr-3" />
            <div>
              <p className="font-medium text-gray-900">View Billing</p>
              <p className="text-sm text-gray-500">Check usage and billing</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
