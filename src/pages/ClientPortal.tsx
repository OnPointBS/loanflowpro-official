import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../auth/AuthProvider';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { 
  FileText, 
  Calendar, 
  MessageSquare, 
  Eye, 
  EyeOff,
  Download,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ClientPortal: React.FC = () => {
  const { user, workspace } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Get client permissions and data
  const clientPermissions = useQuery(api.clientInvites.getClientPermissions, {
    workspaceId: workspace?.id || '',
    userId: user?._id || '',
  });

  // Get client's loan files (if they have permission)
  const loanFiles = useQuery(api.loanFiles.listByClient, {
    workspaceId: workspace?.id || '',
    clientId: user?._id || '',
  }) || [];

  // Get client's documents (if they have permission)
  const documents = useQuery(api.documents.listByClient, {
    workspaceId: workspace?.id || '',
    clientId: user?._id || '',
  }) || [];

  // Get client's tasks (if they have permission)
  const tasks = useQuery(api.tasks.listByClient, {
    workspaceId: workspace?.id || '',
    clientId: user?._id || '',
  }) || [];

  if (!user || !workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-orange mx-auto mb-4"></div>
          <p className="text-gunmetal">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!clientPermissions || clientPermissions.role !== 'CLIENT') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gunmetal mb-4">Access Denied</h2>
          <p className="text-gunmetal-light mb-6">
            You don't have permission to access this client portal.
          </p>
        </div>
      </div>
    );
  }

  const canViewLoanFiles = clientPermissions.permissions.includes('view_loan_files');
  const canViewDocuments = clientPermissions.permissions.includes('view_documents');
  const canViewTasks = clientPermissions.permissions.includes('view_tasks');
  const canViewAnalytics = clientPermissions.permissions.includes('view_analytics');

  return (
    <>
      <Helmet>
        <title>Client Portal - {workspace.name} | LoanFlowPro</title>
        <meta name="description" content="Access your loan information, documents, and updates" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-brand-orange/5 to-gunmetal/5">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">LF</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gunmetal">Client Portal</h1>
                  <p className="text-sm text-gunmetal-light">Welcome back, {user.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gunmetal-light">Workspace</p>
                <p className="font-medium text-gunmetal">{workspace.name}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {['overview', 'loan-files', 'documents', 'tasks', 'messages'].map((tab) => {
                const isActive = activeTab === tab;
                const isDisabled = 
                  (tab === 'loan-files' && !canViewLoanFiles) ||
                  (tab === 'documents' && !canViewDocuments) ||
                  (tab === 'tasks' && !canViewTasks);

                return (
                  <button
                    key={tab}
                    onClick={() => !isDisabled && setActiveTab(tab)}
                    disabled={isDisabled}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? 'border-brand-orange text-brand-orange'
                        : isDisabled
                        ? 'border-transparent text-gray-400 cursor-not-allowed'
                        : 'border-transparent text-gunmetal-light hover:text-gunmetal hover:border-gray-300'
                    }`}
                  >
                    {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gunmetal mb-4">Welcome to Your Portal</h2>
                <p className="text-gunmetal-light mb-4">
                  Here you can track your loan progress, access important documents, and stay updated on your application.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-brand-orange/10 rounded-lg">
                    <FileText className="w-8 h-8 text-brand-orange mx-auto mb-2" />
                    <p className="font-medium text-gunmetal">Loan Files</p>
                    <p className="text-sm text-gunmetal-light">{loanFiles.length} active</p>
                  </div>
                  <div className="text-center p-4 bg-brand-orange/10 rounded-lg">
                    <Calendar className="w-8 h-8 text-brand-orange mx-auto mb-2" />
                    <p className="font-medium text-gunmetal">Documents</p>
                    <p className="text-sm text-gunmetal-light">{documents.length} uploaded</p>
                  </div>
                  <div className="text-center p-4 bg-brand-orange/10 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-brand-orange mx-auto mb-2" />
                    <p className="font-medium text-gunmetal">Tasks</p>
                    <p className="text-sm text-gunmetal-light">{tasks.filter(t => t.status === 'completed').length} completed</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gunmetal mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {loanFiles.slice(0, 3).map((file) => (
                    <div key={file._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-brand-orange" />
                      <div className="flex-1">
                        <p className="font-medium text-gunmetal">{file.loanType}</p>
                        <p className="text-sm text-gunmetal-light">Status: {file.status}</p>
                      </div>
                      <span className="text-xs text-gunmetal-light">
                        {new Date(file.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {loanFiles.length === 0 && (
                    <p className="text-gunmetal-light text-center py-4">No recent activity</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loan-files' && canViewLoanFiles && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gunmetal mb-6">Your Loan Files</h2>
              {loanFiles.length > 0 ? (
                <div className="space-y-4">
                  {loanFiles.map((file) => (
                    <div key={file._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gunmetal">{file.loanType}</h3>
                          <p className="text-sm text-gunmetal-light">Amount: ${file.loanAmount?.toLocaleString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          file.status === 'approved' ? 'bg-green-100 text-green-800' :
                          file.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {file.status}
                        </span>
                      </div>
                      <div className="text-sm text-gunmetal-light">
                        <p>Current Stage: {file.currentStage}</p>
                        <p>Last Updated: {new Date(file.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gunmetal-light py-8">No loan files found</p>
              )}
            </div>
          )}

          {activeTab === 'documents' && canViewDocuments && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gunmetal mb-6">Your Documents</h2>
              {documents.length > 0 ? (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-brand-orange" />
                        <div>
                          <p className="font-medium text-gunmetal">{doc.name}</p>
                          <p className="text-sm text-gunmetal-light">{doc.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gunmetal-light">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                        <button className="p-2 text-brand-orange hover:bg-brand-orange/10 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gunmetal-light py-8">No documents found</p>
              )}
            </div>
          )}

          {activeTab === 'tasks' && canViewTasks && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gunmetal mb-6">Your Tasks</h2>
              {tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gunmetal">{task.title}</h3>
                          <p className="text-sm text-gunmetal-light">{task.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gunmetal-light">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>Due: {new Date(task.dueAt).toLocaleDateString()}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gunmetal-light py-8">No tasks found</p>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gunmetal mb-6">Messages</h2>
              <div className="text-center py-8">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gunmetal-light">No messages yet</p>
                <p className="text-sm text-gunmetal-light mt-2">
                  Your advisor will send you important updates here
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ClientPortal;
