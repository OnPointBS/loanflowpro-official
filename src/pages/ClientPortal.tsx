import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../auth/AuthProvider';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useQuery, useMutation } from 'convex/react';
import { useSearchParams } from 'react-router-dom';
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
  Shield
} from 'lucide-react';

const ClientPortal: React.FC = () => {
  const { user, workspace } = useAuth();
  const { workspace: currentWorkspace, membership: currentMembership } = useWorkspace();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [taskNote, setTaskNote] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);

  // Get client ID from URL if in preview mode
  const clientIdFromUrl = searchParams.get('clientId');

  // Check if user is a client or if we're in preview mode
  const isClient = user?.role === 'CLIENT';
  const isPreviewMode = !isClient && currentMembership?.role === 'ADVISOR';

  // Get client permissions and data (only for actual clients, not preview mode)
  const clientPermissions = isClient && !isPreviewMode ? useQuery(api.clientInvites.getClientPermissions, {
    workspaceId: workspace?.id || '',
    userId: user?._id || '',
  }) : null;

  // Get specific client information for preview mode
  const specificClient = clientIdFromUrl ? useQuery(api.clients.getClient, {
    clientId: clientIdFromUrl as any,
  }) : null;

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

  // Get client information for preview mode (only if we have a client ID)
  const clientInfo = clientIdFromUrl ? useQuery(api.clients.getClientByEmail, {
    workspaceId: workspace?.id || '',
    email: user?.email || '',
  }) : null;

  // Mutations
  const sendMessage = useMutation(api.messages.sendMessage);
  const uploadDocument = useMutation(api.documents.uploadDocument);
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

  if (!isClient && !isPreviewMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gunmetal mb-4">Access Denied</h2>
          <p className="text-gunmetal-light mb-6">
            You don't have permission to access this client portal.
          </p>
          {currentMembership?.role === 'ADVISOR' && (
            <p className="text-sm text-brand-orange">
              Use "View as Client" from the Clients page to preview the client portal.
            </p>
          )}
        </div>
      </div>
    );
  }

  // For preview mode, show real data but filter based on what a client would see
  const canViewLoanFiles = clientPermissions?.permissions?.includes('view_loan_files') || isPreviewMode;
  const canViewDocuments = clientPermissions?.permissions?.includes('view_documents') || isPreviewMode;
  const canViewTasks = clientPermissions?.permissions?.includes('view_tasks') || isPreviewMode;
  const canViewAnalytics = clientPermissions?.permissions?.includes('view_analytics') || isPreviewMode;
  const canUploadDocuments = clientPermissions?.permissions?.includes('upload_documents') || isPreviewMode;
  const canSendMessages = clientPermissions?.permissions?.includes('send_messages') || isPreviewMode;

  // Filter data based on permissions
  const displayLoanFiles = canViewLoanFiles ? loanFiles : [];
  const displayDocuments = canViewDocuments ? documents : [];
  const displayTasks = canViewTasks ? tasks : [];

  // Permission-based access control
  const hasAnyAccess = canViewLoanFiles || canViewDocuments || canViewTasks || canViewAnalytics || canUploadDocuments || canSendMessages;

  if (!hasAnyAccess && !isPreviewMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-yellow-500 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gunmetal mb-4">No Access Granted</h2>
          <p className="text-gunmetal-light mb-6">
            You don't have any permissions to view content in this portal. Please contact your advisor.
          </p>
        </div>
      </div>
    );
  }

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
        type: 'client_to_advisor'
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      // In a real implementation, you'd upload to a file service first
      // For now, we'll simulate the upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const loanFileId = displayLoanFiles[0]?._id || 'placeholder-loan-file' as any;
      
      await uploadDocument({
        workspaceId: workspace.id,
        loanFileId: loanFileId,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        uploadedBy: user._id,
        status: 'pending_review'
      });
      
      setSelectedFile(null);
    } catch (error) {
      console.error('Failed to upload document:', error);
    } finally {
      setUploading(false);
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
                  <p className="text-sm text-gunmetal-light">
                    {isPreviewMode ? 'Preview Mode' : 'Welcome back, ' + user.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gunmetal-light">Workspace</p>
                <p className="font-medium text-gunmetal">{workspace.name}</p>
                {isPreviewMode && (
                  <div className="mt-2 p-2 bg-brand-orange/10 rounded border border-brand-orange/20">
                    <p className="text-xs text-brand-orange font-medium">Previewing Client</p>
                    <p className="text-xs text-brand-orange">
                      {specificClient?.name || 'No client data'}
                    </p>
                  </div>
                )}
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
              {['overview', 'loan-files', 'documents', 'tasks', 'messages'].map((tab) => {
                const isActive = activeTab === tab;
                const isDisabled = 
                  (tab === 'loan-files' && !canViewLoanFiles) ||
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
                  {isPreviewMode ? 'Client Portal Preview' : 'Welcome to Your Portal'}
                </h2>
                <p className="text-gunmetal-light mb-4">
                  {isPreviewMode 
                    ? 'This is what your clients will see in their portal. Use this to understand their experience and ensure they have access to the right information.'
                    : 'Here you can track your loan progress, access important documents, and stay updated on your application.'
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {canViewLoanFiles && (
                    <div className="text-center p-4 bg-brand-orange/10 rounded-lg">
                      <FileText className="w-8 h-8 text-brand-orange mx-auto mb-2" />
                      <p className="font-medium text-gunmetal">Loan Files</p>
                      <p className="text-sm text-gunmetal-light">{displayLoanFiles.length} active</p>
                    </div>
                  )}
                  {canViewDocuments && (
                    <div className="text-center p-4 bg-brand-orange/10 rounded-lg">
                      <Calendar className="w-8 h-8 text-brand-orange mx-auto mb-2" />
                      <p className="font-medium text-gunmetal">Documents</p>
                      <p className="text-sm text-gunmetal-light">{displayDocuments.length} uploaded</p>
                    </div>
                  )}
                  {canViewTasks && (
                    <div className="text-center p-4 bg-brand-orange/10 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-brand-orange mx-auto mb-2" />
                      <p className="font-medium text-gunmetal">Tasks</p>
                      <p className="text-sm text-gunmetal-light">{displayTasks.filter(t => t.status === 'completed').length} completed</p>
                    </div>
                  )}
                  {!canViewLoanFiles && !canViewDocuments && !canViewTasks && (
                    <div className="col-span-3 text-center p-4 bg-yellow-100 rounded-lg">
                      <Shield className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="font-medium text-gunmetal">Limited Access</p>
                      <p className="text-sm text-yellow-600">Contact your advisor for permissions</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gunmetal mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {displayLoanFiles.slice(0, 3).map((file) => (
                                            <div key={file._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <FileText className="w-5 h-5 text-brand-orange" />
                          <div className="flex-1">
                            <p className="font-medium text-gunmetal">{isPreviewMode ? 'Sample Loan' : `Loan ${file._id.slice(-4)}`}</p>
                            <p className="text-sm text-gunmetal-light">Status: {file.status}</p>
                          </div>
                          <span className="text-xs text-gunmetal-light">
                            {new Date(file.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                  ))}
                  {displayLoanFiles.length === 0 && (
                    <p className="text-gunmetal-light text-center py-4">
                      {isPreviewMode ? 'No loan files in preview mode' : 'No recent activity'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loan-files' && canViewLoanFiles && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gunmetal mb-6">Your Loan Files</h2>
              {displayLoanFiles.length > 0 ? (
                <div className="space-y-4">
                  {displayLoanFiles.map((file) => (
                    <div key={file._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gunmetal">{isPreviewMode ? 'Sample Loan' : `Loan ${file._id.slice(-4)}`}</h3>
                          <p className="text-sm text-gunmetal-light">Status: {file.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gunmetal-light">Created</p>
                          <p className="text-sm text-gunmetal">{new Date(file.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      {/* Loan Type Details */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <h4 className="font-medium text-gunmetal mb-2">Loan Type Details</h4>
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
                            <span className="text-gunmetal-light">Stage:</span>
                            <span className="ml-2 text-gunmetal">{file.currentStage}</span>
                          </div>
                          <div>
                            <span className="text-gunmetal-light">Status:</span>
                            <span className="ml-2 text-gunmetal capitalize">{file.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Associated Tasks */}
                      <div className="border-t pt-3">
                        <h4 className="font-medium text-gunmetal mb-2">Associated Tasks</h4>
                        {tasks.filter(task => task.loanFileId === file._id).length > 0 ? (
                          <div className="space-y-2">
                            {tasks.filter(task => task.loanFileId === file._id).map((task) => (
                              <div key={task._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className={`w-4 h-4 ${task.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`} />
                                  <span className="text-sm text-gunmetal">{task.title}</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {task.status.replace('_', ' ')}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gunmetal-light">No tasks assigned to this loan file</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gunmetal-light mb-2">
                    {isPreviewMode ? 'No loan files in preview mode' : 'No loan files found'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isPreviewMode ? 'Loan files will appear here when clients are assigned to them' : 'Your loan files will appear here once they are created'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && canViewDocuments && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gunmetal">Documents</h2>
                {canUploadDocuments && (
                  <button className="bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-brand-orange/90 transition-colors flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Document</span>
                  </button>
                )}
              </div>

              {/* Upload Section */}
              {canUploadDocuments && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-gunmetal mb-3">Upload New Document</h3>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <button
                      onClick={handleFileUpload}
                      disabled={!selectedFile || uploading}
                      className="bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-brand-orange/90 transition-colors disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG
                  </p>
                </div>
              )}

              {/* Documents List */}
              {displayDocuments.length > 0 ? (
                <div className="space-y-3">
                  {displayDocuments.map((doc) => (
                    <div key={doc._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-brand-orange" />
                        <div>
                          <p className="font-medium text-gunmetal">{doc.fileName}</p>
                          <p className="text-sm text-gunmetal-light">
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                          doc.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                        <button className="text-brand-orange hover:text-brand-orange/80">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gunmetal-light mb-2">
                    {isPreviewMode ? 'No documents in preview mode' : 'No documents found'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isPreviewMode ? 'Documents will appear here when clients upload them' : 'Your documents will appear here once they are uploaded'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && canViewTasks && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gunmetal mb-6">Your Tasks</h2>
              {displayTasks.length > 0 ? (
                <div className="space-y-4">
                  {displayTasks.map((task) => (
                    <div key={task._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gunmetal">{task.title}</h3>
                          <p className="text-sm text-gunmetal-light mb-2">{task.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gunmetal-light">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              task.priority === 'high' ? 'bg-red-100 text-red-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {task.priority} priority
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          {task.status !== 'completed' && (
                            <button
                              onClick={() => handleTaskComplete(task._id)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Task Actions */}
                      {task.status !== 'completed' && (
                        <div className="border-t pt-3">
                          <h4 className="font-medium text-gunmetal mb-2">Add Note or Update</h4>
                          {editingTask === task._id ? (
                            <div className="flex items-center space-x-2">
                              <textarea
                                value={taskNote}
                                onChange={(e) => setTaskNote(e.target.value)}
                                placeholder="Add a note about this task..."
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                rows={2}
                              />
                              <button
                                onClick={() => handleTaskUpdate(task._id, taskNote)}
                                className="bg-brand-orange text-white px-3 py-2 rounded-lg hover:bg-brand-orange/90 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingTask(null);
                                  setTaskNote('');
                                }}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingTask(task._id)}
                              className="text-brand-orange hover:text-brand-orange/80 text-sm"
                            >
                              Add Note
                            </button>
                          )}
                        </div>
                      )}

                      {/* Client Notes */}
                      {task.clientNote && (
                        <div className="border-t pt-3 mt-3">
                          <h4 className="font-medium text-gunmetal mb-2">Your Notes</h4>
                          <p className="text-sm text-gunmetal-light bg-blue-50 p-3 rounded-lg">
                            {task.clientNote}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gunmetal-light mb-2">
                    {isPreviewMode ? 'No tasks in preview mode' : 'No tasks found'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isPreviewMode ? 'Tasks will appear here when assigned to clients' : 'Your tasks will appear here once they are assigned'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && canSendMessages && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gunmetal mb-6">Messages</h2>
              
              {/* Message Input */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gunmetal mb-3">Send Message to Your Advisor</h3>
                <div className="flex items-center space-x-4">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-brand-orange/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>

              {/* Messages List */}
              <div className="space-y-4">
                <div className="text-center py-8">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gunmetal-light mb-2">
                    {isPreviewMode ? 'No messages in preview mode' : 'No messages yet'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isPreviewMode ? 'Messages will appear here when clients send them' : 'Your conversation with your advisor will appear here'}
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

export default ClientPortal;
