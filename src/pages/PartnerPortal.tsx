import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../auth/AuthProvider';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useQuery, useMutation } from 'convex/react';
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
  AlertCircle,
  Upload,
  Send,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Building,
  Users,
  TrendingUp
} from 'lucide-react';

const PartnerPortal: React.FC = () => {
  const { user, workspace } = useAuth();
  const { workspace: currentWorkspace, membership: currentMembership } = useWorkspace();
  const [activeTab, setActiveTab] = useState('overview');
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [taskNote, setTaskNote] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);

  // Get partner permissions and data (only for partners)
  const partnerPermissions = user?.role === 'PARTNER' ? useQuery(api.partners.getPartnerPermissions, {
    workspaceId: workspace?.id || '',
    userId: user?._id || '',
  }) : null;

  // Get partner's accessible loan files (if they have permission)
  const loanFiles = useQuery(api.loanFiles.listByWorkspace, {
    workspaceId: workspace?.id || '',
  }) || [];

  // Get partner's accessible documents (if they have permission)
  const documents = useQuery(api.documents.listByWorkspace, {
    workspaceId: workspace?.id || '',
  }) || [];

  // Get partner's accessible tasks (if they have permission)
  const tasks = useQuery(api.tasks.listByWorkspace, {
    workspaceId: workspace?.id || '',
  }) || [];

  // Mutations
  const sendMessage = useMutation(api.messages.sendMessage);
  const updateTask = useMutation(api.tasks.updateTask);

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

  // Check if user is a partner or if we're in preview mode
  const isPartner = partnerPermissions?.role === 'PARTNER';
  const isPreviewMode = !isPartner && currentMembership?.role === 'ADVISOR';

  if (!isPartner && !isPreviewMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gunmetal mb-4">Access Denied</h2>
          <p className="text-gunmetal-light mb-6">
            You don't have permission to access this partner portal.
          </p>
          {currentMembership?.role === 'ADVISOR' && (
            <p className="text-sm text-brand-orange">
              Use "View as Partner" from the Clients page to preview the partner portal.
            </p>
          )}
        </div>
      </div>
    );
  }

  // For preview mode, show sample data
  const canViewLoanFiles = partnerPermissions?.permissions?.includes('view_loan_progress') || isPreviewMode;
  const canViewDocuments = partnerPermissions?.permissions?.includes('view_documents') || isPreviewMode;
  const canViewTasks = partnerPermissions?.permissions?.includes('view_tasks') || isPreviewMode;
  const canViewAnalytics = partnerPermissions?.permissions?.includes('view_analytics') || isPreviewMode;
  const canViewClientStatus = partnerPermissions?.permissions?.includes('view_client_status') || isPreviewMode;
  const canSendMessages = partnerPermissions?.permissions?.includes('send_messages') || isPreviewMode;

  // Sample data for preview mode
  const sampleLoanFiles = isPreviewMode ? [
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
      currentStage: 'Underwriting',
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    }
  ] : loanFiles;

  const sampleDocuments = isPreviewMode ? [
    {
      _id: 'sample-doc-1' as any,
      fileName: 'Purchase Agreement.pdf',
      fileType: 'application/pdf',
      status: 'approved',
      uploadedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
    {
      _id: 'sample-doc-2' as any,
      fileName: 'Property Appraisal.pdf',
      fileType: 'application/pdf',
      status: 'pending_review',
      uploadedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    }
  ] : documents;

  const sampleTasks = isPreviewMode ? [
    {
      _id: 'sample-task-1' as any,
      title: 'Review Purchase Agreement',
      status: 'completed',
      dueDate: Date.now() - 2 * 24 * 60 * 60 * 1000,
      completedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      _id: 'sample-task-2' as any,
      title: 'Schedule Property Inspection',
      status: 'in_progress',
      dueDate: Date.now() + 3 * 24 * 60 * 60 * 1000,
    }
  ] : tasks;

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      // For now, we'll use a placeholder advisor ID since we don't have the actual advisor ID
      // In a real implementation, you'd get this from the workspace or user context
      const advisorId = 'placeholder-advisor-id' as any;
      
      await sendMessage({
        workspaceId: workspace.id,
        senderId: user._id,
        recipientId: advisorId,
        content: newMessage,
        type: 'partner_to_advisor'
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTaskUpdate = async (taskId: string, note: string) => {
    try {
      await updateTask({
        taskId: taskId as any,
        updates: {
          clientNote: note,
          status: 'in_progress'
        }
      });
      setEditingTask(null);
      setTaskNote('');
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      await updateTask({
        taskId: taskId as any,
        updates: {
          status: 'completed',
          completedAt: Date.now()
        }
      });
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Partner Portal - {workspace.name} | LoanFlowPro</title>
        <meta name="description" content="Monitor loan progress and client status" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-brand-orange/5 to-gunmetal/5">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gunmetal">Partner Portal</h1>
                  <p className="text-sm text-gunmetal-light">
                    {isPreviewMode ? 'Preview Mode' : 'Welcome back, ' + user.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gunmetal-light">Workspace</p>
                <p className="font-medium text-gunmetal">{workspace.name}</p>
                {isPreviewMode && (
                  <p className="text-xs text-brand-orange bg-brand-orange/10 px-2 py-1 rounded mt-1">
                    Preview Mode
                  </p>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {['overview', 'loan-progress', 'documents', 'tasks', 'messages'].map((tab) => {
                const isActive = activeTab === tab;
                const isDisabled = 
                  (tab === 'loan-progress' && !canViewLoanFiles) ||
                  (tab === 'documents' && !canViewDocuments) ||
                  (tab === 'tasks' && !canViewTasks) ||
                  (tab === 'messages' && !canSendMessages);

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
                <h2 className="text-2xl font-bold text-gunmetal mb-4">
                  {isPreviewMode ? 'Partner Portal Preview' : 'Welcome to Your Partner Portal'}
                </h2>
                <p className="text-gunmetal-light mb-4">
                  {isPreviewMode 
                    ? 'This is what your partners will see in their portal. Use this to understand their experience and ensure they have access to the right information.'
                    : 'Here you can monitor loan progress, access relevant documents, and stay updated on client applications.'
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-gunmetal">Loan Progress</p>
                    <p className="text-sm text-gunmetal-light">{sampleLoanFiles.length} active</p>
                  </div>
                  <div className="text-center p-4 bg-blue-100 rounded-lg">
                    <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-gunmetal">Documents</p>
                    <p className="text-sm text-gunmetal-light">{sampleDocuments.length} available</p>
                  </div>
                  <div className="text-center p-4 bg-blue-100 rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-gunmetal">Client Status</p>
                    <p className="text-sm text-gunmetal-light">Monitoring enabled</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gunmetal mb-4">Recent Loan Activity</h3>
                <div className="space-y-3">
                  {sampleLoanFiles.slice(0, 3).map((file) => (
                    <div key={file._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gunmetal">{isPreviewMode ? 'Sample Loan' : `Loan ${file._id.slice(-4)}`}</p>
                        <p className="text-sm text-gunmetal-light">Stage: {file.currentStage}</p>
                      </div>
                      <span className="text-xs text-gunmetal-light">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {sampleLoanFiles.length === 0 && (
                    <p className="text-gunmetal-light text-center py-4">
                      {isPreviewMode ? 'No loan files in preview mode' : 'No recent activity'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loan-progress' && canViewLoanFiles && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gunmetal mb-6">Loan Progress Overview</h2>
              {sampleLoanFiles.length > 0 ? (
                <div className="space-y-4">
                  {sampleLoanFiles.map((file) => (
                    <div key={file._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gunmetal">{isPreviewMode ? 'Sample Loan' : `Loan ${file._id.slice(-4)}`}</h3>
                          <p className="text-sm text-gunmetal-light">Stage: {file.currentStage}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gunmetal-light">Created</p>
                          <p className="text-sm text-gunmetal">{new Date(file.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      {/* Loan Progress Details */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <h4 className="font-medium text-gunmetal mb-2">Progress Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gunmetal-light">Type:</span>
                            <span className="ml-2 text-gunmetal">{isPreviewMode ? 'Sample Type' : 'Residential'}</span>
                          </div>
                          <div>
                            <span className="text-gunmetal-light">Category:</span>
                            <span className="ml-2 text-gunmetal">Residential</span>
                          </div>
                          <div>
                            <span className="text-gunmetal-light">Current Stage:</span>
                            <span className="ml-2 text-gunmetal">{file.currentStage}</span>
                          </div>
                          <div>
                            <span className="text-gunmetal-light">Status:</span>
                            <span className="ml-2 text-gunmetal capitalize">{file.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gunmetal-light mb-1">
                          <span>Progress</span>
                          <span>75%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex justify-between items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          file.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          file.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                          file.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {file.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-gunmetal-light">
                          Last updated: {new Date(file.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
          )}

          {activeTab === 'documents' && canViewDocuments && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gunmetal mb-6">Available Documents</h2>
              {sampleDocuments.length > 0 ? (
                <div className="space-y-4">
                  {sampleDocuments.map((doc) => (
                    <div key={doc._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gunmetal">{doc.fileName}</h3>
                            <p className="text-sm text-gunmetal-light">
                              {doc.fileType.split('/')[1].toUpperCase()} • {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                            doc.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {doc.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gunmetal-light">
                          <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 p-2 rounded transition-colors duration-200">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
          )}

          {activeTab === 'tasks' && canViewTasks && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gunmetal mb-6">Task Overview</h2>
              {sampleTasks.length > 0 ? (
                <div className="space-y-4">
                  {sampleTasks.map((task) => (
                    <div key={task._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gunmetal">{task.title}</h3>
                          <p className="text-sm text-gunmetal-light">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      {task.status === 'completed' && task.completedAt && (
                        <div className="bg-green-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center space-x-2 text-green-800">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Completed on {new Date(task.completedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}
                      
                      {task.status !== 'completed' && (
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => setEditingTask(task._id)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Add Note
                          </button>
                          <button
                            onClick={() => handleTaskComplete(task._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors duration-200"
                          >
                            Mark Complete
                          </button>
                        </div>
                      )}
                      
                      {editingTask === task._id && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <textarea
                            value={taskNote}
                            onChange={(e) => setTaskNote(e.target.value)}
                            placeholder="Add a note about this task..."
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            rows={3}
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              onClick={() => setEditingTask(null)}
                              className="text-gray-600 hover:text-gray-800 text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleTaskUpdate(task._id, taskNote)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-gunmetal-light mb-2">No tasks available</p>
                  <p className="text-sm text-gray-500">
                    {isPartner ? 'You don\'t have permission to view tasks' : 'No tasks in the system'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && canSendMessages && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gunmetal mb-6">Messages</h2>
              
              {/* Message Input */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gunmetal mb-3">Send Message to Advisor</h3>
                <div className="flex space-x-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>

              {/* Sample Messages */}
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">P</span>
                      </div>
                      <span className="font-medium text-gunmetal">Partner</span>
                    </div>
                    <span className="text-xs text-gunmetal-light">
                      {new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gunmetal-light">
                    Hi, I wanted to check on the status of the Johnson loan application. Any updates on the appraisal?
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">A</span>
                      </div>
                      <span className="font-medium text-gunmetal">Advisor</span>
                    </div>
                    <span className="text-xs text-gunmetal-light">
                      {new Date(Date.now() - 1 * 60 * 60 * 1000).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gunmetal-light">
                    The appraisal came back positive. We're now moving to the underwriting phase. Should have an update by end of week.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default PartnerPortal;
