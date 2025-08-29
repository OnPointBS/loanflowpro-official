import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { 
  Building, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  EyeOff,
  MessageSquare,
  Upload,
  Download,
  Calendar,
  TrendingUp
} from 'lucide-react';

const PartnerPortal: React.FC = () => {
  const { user } = useAuth();
  const { workspace, membership } = useWorkspace();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Get partner permissions and data
  const partnerPermissions = useQuery(api.partners.getPartnerPermissions, {
    workspaceId: workspace?.id || '',
    userId: user?._id || '',
  });

  // Get loan files that the partner can view
  const loanFiles = useQuery(api.loanFiles.listByWorkspace, {
    workspaceId: workspace?.id || '',
  }) || [];

  // Get documents that the partner can view
  const documents = useQuery(api.documents.listByWorkspace, {
    workspaceId: workspace?.id || '',
  }) || [];

  // Get tasks that the partner can view
  const tasks = useQuery(api.tasks.listByWorkspace, {
    workspaceId: workspace?.id || '',
  }) || [];

  // Check if user is a partner
  const isPartner = partnerPermissions?.role === 'PARTNER';
  const isPreviewModeActive = !isPartner && membership?.role === 'ADVISOR';

  // Sample data for preview mode
  const sampleLoanFiles = isPreviewModeActive ? [
    {
      _id: 'sample-1' as any,
      loanTypeId: 'sample-loan-type-1' as any,
      status: 'in_progress',
      currentStage: 'Document Collection',
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    },
    {
      _id: 'sample-2' as any,
      loanTypeId: 'sample-loan-type-2' as any,
      status: 'under_review',
      currentStage: 'Underwriting Review',
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    },
    {
      _id: 'sample-3' as any,
      loanTypeId: 'sample-loan-type-3' as any,
      status: 'approved',
      currentStage: 'Approved - Closing',
      createdAt: Date.now() - 21 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 21 * 24 * 60 * 60 * 1000,
    }
  ] : loanFiles;

  const sampleDocuments = isPreviewModeActive ? [
    {
      _id: 'doc-1' as any,
      fileName: 'Purchase Agreement.pdf',
      fileType: 'application/pdf',
      status: 'approved',
      uploadedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    },
    {
      _id: 'doc-2' as any,
      fileName: 'Income Verification.pdf',
      fileType: 'application/pdf',
      status: 'pending',
      uploadedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
    {
      _id: 'doc-3' as any,
      fileName: 'Property Appraisal.pdf',
      fileType: 'application/pdf',
      status: 'approved',
      uploadedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    }
  ] : documents;

  const sampleTasks = isPreviewModeActive ? [
    {
      _id: 'task-1' as any,
      title: 'Submit Purchase Agreement',
      status: 'completed',
      dueDate: Date.now() - 2 * 24 * 60 * 60 * 1000,
      priority: 'high',
    },
    {
      _id: 'task-2' as any,
      title: 'Provide Income Documentation',
      status: 'in_progress',
      dueDate: Date.now() + 3 * 24 * 60 * 60 * 1000,
      priority: 'normal',
    },
    {
      _id: 'task-3' as any,
      title: 'Schedule Property Inspection',
      status: 'pending',
      dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
      priority: 'normal',
    }
  ] : tasks;

  // Filter data based on partner permissions
  const filteredLoanFiles = isPartner && partnerPermissions?.permissions 
    ? sampleLoanFiles.filter(file => 
        partnerPermissions.permissions.includes('view_loan_progress')
      )
    : sampleLoanFiles;

  const filteredDocuments = isPartner && partnerPermissions?.permissions
    ? sampleDocuments.filter(doc => 
        partnerPermissions.permissions.includes('view_documents')
      )
    : sampleDocuments;

  const filteredTasks = isPartner && partnerPermissions?.permissions
    ? sampleTasks.filter(task => 
        partnerPermissions.permissions.includes('view_tasks')
      )
    : sampleTasks;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'in_progress': { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      'under_review': { color: 'bg-yellow-100 text-yellow-800', label: 'Under Review' },
      'approved': { color: 'bg-green-100 text-green-800', label: 'Approved' },
      'closed': { color: 'bg-gray-100 text-gray-800', label: 'Closed' },
      'draft': { color: 'bg-purple-100 text-purple-800', label: 'Draft' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['draft'];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTaskStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'in_progress': { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      'completed': { color: 'bg-green-100 text-green-800', label: 'Completed' },
      'overdue': { color: 'bg-red-100 text-red-800', label: 'Overdue' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending'];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'low': { color: 'bg-gray-100 text-gray-800', label: 'Low' },
      'normal': { color: 'bg-blue-100 text-blue-800', label: 'Normal' },
      'high': { color: 'bg-orange-100 text-orange-800', label: 'High' },
      'urgent': { color: 'bg-red-100 text-red-800', label: 'Urgent' },
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['normal'];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (!workspace?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-orange/10 to-gunmetal/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-orange mx-auto mb-4"></div>
          <p className="text-gunmetal-light text-xl font-medium animate-pulse">Loading workspace...</p>
          <p className="text-gunmetal-light text-sm mt-2">Setting up your partner portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gunmetal">Partner Portal</h1>
                <p className="text-gunmetal-light">
                  {isPreviewModeActive ? 'Preview Mode' : 'Monitor loan progress and client status'}
                </p>
              </div>
            </div>
            
            {isPreviewModeActive && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{isPreviewMode ? 'Hide Preview' : 'Show Preview'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Loan Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Progress Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gunmetal">Loan Progress Overview</h2>
                <div className="flex items-center space-x-2 text-sm text-gunmetal-light">
                  <Building className="w-4 h-4" />
                  <span>Partner Access</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredLoanFiles.length > 0 ? (
                  filteredLoanFiles.map((file) => (
                    <div key={file._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gunmetal">
                            {isPreviewModeActive ? 'Sample Loan' : `Loan ${file._id.slice(-4)}`}
                          </p>
                          <p className="text-sm text-gunmetal-light">Stage: {file.currentStage}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(file.status)}
                        <span className="text-xs text-gunmetal-light">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-gunmetal-light mb-2">No loan files available</p>
                    <p className="text-sm text-gray-500">
                      {isPartner ? 'You don\'t have permission to view loan files' : 'No loan files in the system'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Documents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gunmetal">Recent Documents</h2>
                <div className="flex items-center space-x-2 text-sm text-gunmetal-light">
                  <FileText className="w-4 h-4" />
                  <span>Document Access</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <div key={doc._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gunmetal">{doc.fileName}</p>
                          <p className="text-sm text-gunmetal-light">
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(doc.status)}
                        <button className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors duration-200">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-gunmetal-light mb-2">No documents available</p>
                    <p className="text-sm text-gray-500">
                      {isPartner ? 'You don\'t have permission to view documents' : 'No documents in the system'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Tasks and Permissions */}
          <div className="space-y-6">
            {/* Partner Permissions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gunmetal mb-4">Your Permissions</h3>
              
              {isPartner && partnerPermissions?.permissions ? (
                <div className="space-y-3">
                  {partnerPermissions.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-800 font-medium capitalize">
                        {permission.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-2xl mb-2">🔒</div>
                  <p className="text-sm text-gunmetal-light">
                    {isPreviewModeActive ? 'Preview mode - no permissions' : 'No permissions assigned'}
                  </p>
                </div>
              )}
            </div>

            {/* Recent Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gunmetal mb-4">Recent Tasks</h3>
              
              <div className="space-y-3">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div key={task._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-gunmetal text-sm">{task.title}</p>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <div className="flex items-center justify-between">
                        {getTaskStatusBadge(task.status)}
                        <span className="text-xs text-gunmetal-light">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <div className="text-2xl mb-2">✅</div>
                    <p className="text-sm text-gunmetal-light">
                      {isPartner ? 'No tasks available' : 'No tasks in the system'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gunmetal mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact Advisor</span>
                </button>
                
                <button className="w-full flex items-center justify-center space-x-2 p-3 bg-white border border-gray-300 text-gunmetal rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Calendar className="w-4 h-4" />
                  <span>View Calendar</span>
                </button>
                
                <button className="w-full flex items-center justify-center space-x-2 p-3 bg-white border border-gray-300 text-gunmetal rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <TrendingUp className="w-4 h-4" />
                  <span>Progress Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerPortal;
