import React, { useState } from 'react';
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
  Shield,
  ClipboardList
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
  const [taskUploads, setTaskUploads] = useState<Record<string, File | null>>({});
  const [taskUploading, setTaskUploading] = useState<Record<string, boolean>>({});
  const [taskNotes, setTaskNotes] = useState<Record<string, string>>({});

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

  // Get workspace loan types and task templates for realistic sample data
  const workspaceLoanTypes = useQuery(api.loanTypes.listByWorkspace, {
    workspaceId: workspace?.id || '',
  }) || [];

  const workspaceTaskTemplates = useQuery(api.taskTemplates.listByWorkspace, {
    workspaceId: workspace?.id || '',
  }) || [];

  // Get client information for preview mode (only if we have a client ID)
  const clientInfo = clientIdFromUrl ? useQuery(api.clients.getClientByEmail, {
    workspaceId: workspace?.id || '',
    email: user?.email || '',
  }) : null;

  // Sample data for preview mode - dynamically generated based on real workspace data
  const sampleTasks = React.useMemo(() => {
    if (workspaceLoanTypes.length === 0 || workspaceTaskTemplates.length === 0) {
      // Fallback sample data if no real data exists
      return [
        {
          _id: 'sample-task-1' as any,
          title: 'Submit Income Verification',
          description: 'Please provide your most recent pay stubs and W-2 forms for income verification.',
          status: 'pending' as const,
          priority: 'high' as const,
          dueAt: Date.now() + (7 * 24 * 60 * 60 * 1000),
          createdAt: Date.now() - (3 * 24 * 60 * 60 * 1000),
          updatedAt: Date.now() - (3 * 24 * 60 * 60 * 1000),
          clientNote: 'I will gather these documents this week.',
          loanTypeId: 'sample-loan-type-1' as any,
          loanTypeName: 'Residential Mortgage',
          loanTypeOrder: 1
        }
      ];
    }

    // Create sample tasks for multiple loan types with proper ordering
    const allTasks: Array<{
      _id: any;
      title: string;
      description: string;
      status: 'pending' | 'in_progress' | 'completed' | 'overdue';
      priority: 'low' | 'normal' | 'high' | 'urgent';
      dueAt: number;
      createdAt: number;
      updatedAt: number;
      clientNote: string | null;
      loanTypeId: any;
      loanTypeName: string;
      loanTypeOrder: number;
    }> = [];
    let taskIdCounter = 1;

    // Generate tasks for each loan type in order
    workspaceLoanTypes.slice(0, 3).forEach((loanType, loanTypeIndex) => {
      // Get task templates for this loan type
      const loanTypeTaskTemplates = workspaceTaskTemplates.filter(template => 
        template.loanTypeId === loanType._id
      );

      // Create sample tasks based on real task templates
      const tasks = loanTypeTaskTemplates
        .filter(template => template.assigneeRole === 'CLIENT')
        .slice(0, 2) // Limit to 2 tasks per loan type for preview
        .map((template, taskIndex) => ({
          _id: `sample-task-${taskIdCounter++}` as any,
          title: template.title,
          description: template.instructions,
          status: loanTypeIndex === 0 && taskIndex === 0 ? 'in_progress' as const : 'pending' as const,
          priority: template.priority,
          dueAt: Date.now() + (template.dueInDays * 24 * 60 * 60 * 1000),
          createdAt: Date.now() - ((taskIdCounter + 1) * 24 * 60 * 60 * 1000),
          updatedAt: Date.now() - ((taskIdCounter + 1) * 24 * 60 * 60 * 1000),
          clientNote: loanTypeIndex === 0 && taskIndex === 0 ? 'Working on this task.' : null,
          loanTypeId: loanType._id,
          loanTypeName: loanType.name,
          loanTypeOrder: loanTypeIndex + 1
        }));

      allTasks.push(...tasks);
    });

    return allTasks.length > 0 ? allTasks : [
      {
        _id: 'sample-task-1' as any,
        title: 'Submit Income Verification',
        description: 'Please provide your most recent pay stubs and W-2 forms for income verification.',
        status: 'pending' as const,
        priority: 'high' as const,
        dueAt: Date.now() + (7 * 24 * 60 * 60 * 1000),
        createdAt: Date.now() - (3 * 24 * 60 * 60 * 1000),
        updatedAt: Date.now() - (3 * 24 * 60 * 60 * 1000),
        clientNote: 'I will gather these documents this week.',
        loanTypeId: 'sample-loan-type-1' as any,
        loanTypeName: 'Residential Mortgage',
        loanTypeOrder: 1
      }
    ];
  }, [workspaceLoanTypes, workspaceTaskTemplates]);

  const sampleLoanTypes = React.useMemo(() => {
    if (workspaceLoanTypes.length === 0) {
      return [{
        _id: 'sample-loan-type-1' as any,
        name: 'Residential Mortgage',
        category: 'Residential',
        stages: ['Application', 'Document Collection', 'Underwriting', 'Approval'],
        order: 1
      }];
    }

    // Create sample loan types with proper ordering
    return workspaceLoanTypes.slice(0, 3).map((loanType, index) => ({
      _id: loanType._id,
      name: loanType.name,
      category: loanType.category,
      stages: loanType.stages,
      order: index + 1
    }));
  }, [workspaceLoanTypes]);

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
  const displayLoanTypes = canViewLoanFiles ? (isPreviewMode ? sampleLoanTypes : workspaceLoanTypes) : [];
  const displayTasks = canViewTasks ? (isPreviewMode ? sampleTasks : tasks) : [];

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
      // Check if we have a loan file to associate with
      let loanFileId: any = undefined;
      if (loanFiles.length > 0) {
        loanFileId = loanFiles[0]._id;
      }
      
      // Upload the document
      await uploadDocument({
        workspaceId: workspace.id,
        loanFileId: loanFileId,
        clientId: specificClient?._id || undefined,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        uploadedBy: user._id,
        status: 'pending_review'
      });
      
      setSelectedFile(null);
      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload document:', error);
      alert('Failed to upload document. Please try again.');
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

  const handleTaskFileUpload = async (taskId: string) => {
    const file = taskUploads[taskId];
    if (!file) return;
    
    setTaskUploading(prev => ({ ...prev, [taskId]: true }));
    try {
      // Get the task to find its loan file
      const task = displayTasks.find(t => t._id === taskId);
      let loanFileId: any = undefined;
      if (task?.loanTypeId) {
        loanFileId = task.loanTypeId;
      }
      
      // Upload the document linked to the task
      await uploadDocument({
        workspaceId: workspace.id,
        loanFileId: loanFileId,
        clientId: specificClient?._id || undefined,
        taskId: taskId as any,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadedBy: user._id,
        status: 'pending_review'
      });
      
      // Clear the file input for this task
      setTaskUploads(prev => ({ ...prev, [taskId]: null }));
      alert('Document uploaded successfully for this task!');
    } catch (error) {
      console.error('Failed to upload document for task:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setTaskUploading(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const handleUpdateTask = async (taskId: string) => {
    const note = taskNotes[taskId] || '';
    if (!note.trim()) return;

    try {
      await updateTask({
        taskId: taskId as any,
        updates: {
          clientNote: note
        }
      });
      setTaskNotes(prev => ({ ...prev, [taskId]: '' }));
    } catch (error) {
      console.error('Failed to update task note:', error);
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
              {['overview', 'loan-types', 'tasks', 'messages'].map((tab) => {
                const isActive = activeTab === tab;
                const isDisabled = 
                  (tab === 'loan-types' && !canViewLoanFiles) ||
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
                
                {/* Loan Type Information */}
                {displayLoanTypes.length > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-4">Loan Applications</h3>
                    
                    {/* Multiple Loan Types with Progress */}
                    <div className="space-y-4">
                      {displayLoanTypes.map((loanType, index) => {
                        const loanTypeTasks = displayTasks.filter(task => {
                          // For sample tasks, check loanTypeId
                          if ((task as any).loanTypeId) {
                            return (task as any).loanTypeId === loanType._id;
                          }
                          // For real tasks, we need to find the loan file that matches this loan type
                          // For now, we'll show all tasks in preview mode
                          return isPreviewMode;
                        });
                        const completedTasks = loanTypeTasks.filter(task => task.status === 'completed').length;
                        const totalTasks = loanTypeTasks.length;
                        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                        
                        return (
                          <div key={loanType._id} className="border border-blue-200 rounded-lg p-4 bg-white">
                            {/* Loan Type Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                  index === 0 ? 'bg-green-500' : 
                                  index === 1 ? 'bg-blue-500' : 'bg-gray-400'
                                }`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-blue-800">
                                    {loanType.name}
                                  </h4>
                                  <p className="text-sm text-blue-600">
                                    {index === 0 ? 'Current Priority' : 
                                     index === 1 ? 'Next in Queue' : 'Pending'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`text-xs px-2 py-1 rounded ${
                                  loanType.stages.length > 0 && loanType.stages[loanType.stages.length - 1] === 'Approval' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {loanType.stages.length > 0 ? loanType.stages[loanType.stages.length - 1] : 'No Stages'}
                                </span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="flex justify-between text-sm text-blue-600 mb-1">
                                <span>Progress</span>
                                <span>{completedTasks} of {totalTasks} tasks completed</span>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Current Stage and Tasks */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-blue-600">Current Stage:</span>
                                <p className="font-medium text-blue-800">
                                  {loanType.stages.length > 0 ? loanType.stages[loanType.stages.length - 1] : 'No Stages'}
                                </p>
                              </div>
                              <div>
                                <span className="text-blue-600">Next Action:</span>
                                <p className="font-medium text-blue-800">
                                  {loanTypeTasks.find(t => t.status === 'pending')?.title || 'Complete current tasks'}
                                </p>
                              </div>
                            </div>

                            {/* Task Summary */}
                            {totalTasks > 0 && (
                              <div className="mt-3 pt-3 border-t border-blue-200">
                                <div className="flex justify-between text-xs text-blue-600">
                                  <span>Task Status:</span>
                                  <span>
                                    {loanTypeTasks.filter(t => t.status === 'in_progress').length} in progress, 
                                    {loanTypeTasks.filter(t => t.status === 'pending').length} pending
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Overall Progress Summary */}
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-800">Overall Progress</span>
                        <span className="text-sm text-blue-600">
                          {displayTasks.filter(t => t.status === 'completed').length} of {displayTasks.length} total tasks completed
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {canViewLoanFiles && (
                    <div className="text-center p-4 bg-brand-orange/10 rounded-lg">
                      <FileText className="w-8 h-8 text-brand-orange mx-auto mb-2" />
                      <p className="font-medium text-gunmetal">Loan Types</p>
                      <p className="text-sm text-gunmetal-light">{displayLoanTypes.length} available</p>
                    </div>
                  )}
                  {canViewDocuments && (
                    <div className="text-center p-4 bg-brand-orange/10 rounded-lg">
                      <Calendar className="w-8 h-8 text-brand-orange mx-auto mb-2" />
                      <p className="font-medium text-gunmetal">Documents</p>
                      <p className="text-sm text-gunmetal-light">{documents.length} uploaded</p>
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
                  {loanFiles.slice(0, 3).map((file) => (
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
                  {loanFiles.length === 0 && (
                    <p className="text-gunmetal-light text-center py-4">
                      {isPreviewMode ? 'No loan files in preview mode' : 'No recent activity'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loan-types' && canViewLoanFiles && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gunmetal mb-6">Your Loan Types</h2>
              {displayLoanTypes.length > 0 ? (
                <div className="space-y-4">
                  {displayLoanTypes.map((loanType) => (
                    <div key={loanType._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gunmetal">{loanType.name}</h3>
                          <p className="text-sm text-gunmetal-light">Category: {loanType.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gunmetal-light">Stages:</p>
                          <p className="text-sm text-gunmetal">
                            {loanType.stages.length > 0 ? loanType.stages.join(', ') : 'No Stages'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Associated Tasks */}
                      <div className="border-t pt-3">
                        <h4 className="font-medium text-gunmetal mb-2">Associated Tasks</h4>
                        {displayTasks.filter(task => {
                           // For sample tasks, check loanTypeId
                           if ((task as any).loanTypeId) {
                             return (task as any).loanTypeId === loanType._id;
                           }
                           // For real tasks, we need to find the loan file that matches this loan type
                           // For now, we'll show all tasks in preview mode
                           return isPreviewMode;
                         }).length > 0 ? (
                           <div className="space-y-2">
                             {displayTasks.filter(task => {
                               // For sample tasks, check loanTypeId
                               if ((task as any).loanTypeId) {
                                 return (task as any).loanTypeId === loanType._id;
                               }
                               // For real tasks, we need to find the loan file that matches this loan type
                               // For now, we'll show all tasks in preview mode
                               return isPreviewMode;
                             }).map((task) => (
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
                          <p className="text-sm text-gunmetal-light">No tasks assigned to this loan type</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gunmetal-light mb-2">
                    {isPreviewMode ? 'No loan types in preview mode' : 'No loan types found'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isPreviewMode ? 'Loan types will appear here when clients are assigned to them' : 'Your loan types will appear here once they are created'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && canViewTasks && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gunmetal">Your Tasks</h2>
                <p className="text-sm text-gunmetal-light">
                  {displayTasks.length} total tasks across {displayLoanTypes.length} loan types
                </p>
              </div>

              {/* Tasks Organized by Loan Type */}
              {displayLoanTypes.length > 0 ? (
                <div className="space-y-6">
                  {displayLoanTypes.map((loanType, loanTypeIndex) => {
                    // Get tasks for this specific loan type
                    const loanTypeTasks = displayTasks.filter(task => {
                      // For sample tasks, check loanTypeId
                      if ((task as any).loanTypeId) {
                        return (task as any).loanTypeId === loanType._id;
                      }
                      // For real tasks, we need to find the loan file that matches this loan type
                      // For now, we'll show all tasks in preview mode
                      return isPreviewMode;
                    });

                    if (loanTypeTasks.length === 0) return null;

                    const completedTasks = loanTypeTasks.filter(task => task.status === 'completed').length;
                    const totalTasks = loanTypeTasks.length;
                    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                    return (
                      <div key={loanType._id} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Loan Type Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {loanTypeIndex + 1}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-blue-800">{loanType.name}</h3>
                                <p className="text-sm text-blue-600">
                                  {completedTasks} of {totalTasks} tasks completed
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-blue-600 mb-1">Progress</div>
                              <div className="w-24 bg-blue-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progressPercentage}%` }}
                                />
                              </div>
                              <div className="text-xs text-blue-600 mt-1">{Math.round(progressPercentage)}%</div>
                            </div>
                          </div>
                        </div>

                        {/* Tasks for this Loan Type */}
                        <div className="p-6">
                          <div className="space-y-4">
                            {loanTypeTasks.map((task) => (
                              <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                {/* Task Header */}
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gunmetal text-lg">{task.title}</h4>
                                    <p className="text-gunmetal-light mt-1">{task.description}</p>
                                  </div>
                                  <div className="flex items-center space-x-3 ml-4">
                                    {/* Priority Badge */}
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                      task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                      task.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </span>
                                    {/* Status Badge */}
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                      task.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                                    </span>
                                  </div>
                                </div>

                                {/* Task Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                                  <div>
                                    <span className="text-gunmetal-light">Due Date:</span>
                                    <p className="font-medium text-gunmetal">
                                      {task.dueAt ? new Date(task.dueAt).toLocaleDateString() : 'No due date'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gunmetal-light">Created:</span>
                                    <p className="font-medium text-gunmetal">
                                      {new Date(task.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gunmetal-light">Last Updated:</span>
                                    <p className="font-medium text-gunmetal">
                                      {new Date(task.updatedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                {/* Client Note Section */}
                                {task.clientNote && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                    <div className="flex items-start space-x-2">
                                      <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium text-blue-800 mb-1">Your Note:</p>
                                        <p className="text-sm text-blue-700">{task.clientNote}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Add Note Section */}
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gunmetal mb-2">
                                    Add a note about this task:
                                  </label>
                                  <textarea
                                    value={taskNotes[task._id] || ''}
                                    onChange={(e) => setTaskNotes(prev => ({ ...prev, [task._id]: e.target.value }))}
                                    placeholder="Add your notes, questions, or updates here..."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                  />
                                  <div className="flex justify-end mt-2">
                                    <button
                                      onClick={() => handleUpdateTask(task._id)}
                                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                                    >
                                      Update Note
                                    </button>
                                  </div>
                                </div>

                                {/* File Upload Section */}
                                <div className="border-t pt-4">
                                  <h5 className="font-medium text-gunmetal mb-3">Upload Files for This Task</h5>
                                  <div className="flex items-center space-x-4">
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          setTaskUploads(prev => ({ ...prev, [task._id]: file }));
                                        }
                                      }}
                                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    />
                                    <button
                                      onClick={() => handleTaskFileUpload(task._id)}
                                      disabled={!taskUploads[task._id] || taskUploading[task._id]}
                                      className="bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-brand-orange/90 transition-colors disabled:opacity-50 text-sm"
                                    >
                                      {taskUploading[task._id] ? 'Uploading...' : 'Upload'}
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-2">
                                    Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gunmetal-light mb-2">
                    {isPreviewMode ? 'No tasks in preview mode' : 'No tasks found'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isPreviewMode ? 'Tasks will appear here when clients are assigned to them' : 'Your tasks will appear here once they are assigned'}
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
