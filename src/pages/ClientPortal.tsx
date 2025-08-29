import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../auth/AuthProvider';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useQuery, useMutation } from 'convex/react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import { 
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  MessageSquare,
  X,
  Download,
  Edit3
} from 'lucide-react';

const ClientPortal: React.FC = () => {
  const { user, workspace } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [searchParams] = useSearchParams();
  const [expandedLoanTypes, setExpandedLoanTypes] = useState<Set<string>>(new Set());
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File[]>>({});
  const [taskNotes, setTaskNotes] = useState<Record<string, string>>({});
  const [editingTask, setEditingTask] = useState<string | null>(null);
  
  // Get client ID from URL
  const clientIdFromUrl = searchParams.get('clientId');

  // Check if we're in preview mode (advisor viewing as client)
  const isPreviewMode = !user?.role || user?.role === 'ADVISOR';

  // Mutations
  const uploadDocument = useMutation(api.documents.uploadDocument);
  const updateClientTask = useMutation(api.clientLoanTypes.updateClientTask);

  // Get real client data if we have a client ID
  const clientData = useQuery(api.clients.getClient, {
    clientId: clientIdFromUrl as any || '',
  });

  // Get client's assigned loan types and tasks
  const clientLoanTypes = useQuery(api.clientLoanTypes.getClientLoanTypes, {
    workspaceId: workspace?.id || '',
    clientId: clientIdFromUrl as any || '',
  });

  // Get all tasks for this client
  const clientTasks = useQuery(api.clientLoanTypes.getClientTasks, {
    workspaceId: workspace?.id || '',
    clientId: clientIdFromUrl as any || '',
  });

  // Get all documents for the workspace to filter by task
  const allDocuments = useQuery(api.documents.listByWorkspace, {
    workspaceId: workspace?.id || '',
  });

  // Get workspace loan types for reference
  const workspaceLoanTypes = useQuery(api.loanTypes.listByWorkspace, {
    workspaceId: workspace?.id || '',
  });

  // Get advisor information
  const advisorInfo = useQuery(api.workspaceMembers.getByWorkspace, {
    workspaceId: workspace?.id || '',
  });

  // Helper function to get documents for a specific task
  const getDocumentsForTask = (taskId: string) => {
    if (!allDocuments) return [];
    return allDocuments.filter((doc: any) => doc.taskId === taskId);
  };

  // Find the primary advisor
  const primaryAdvisor = React.useMemo(() => {
    if (!advisorInfo?.length) return null;
    const owner = advisorInfo.find((member: any) => member.role === 'ADVISOR');
    return owner || advisorInfo[0];
  }, [advisorInfo]);

  // Process loan types with progress and tasks
  const processedLoanTypes = React.useMemo(() => {
    console.log('🔍 [DEBUG] ClientPortal - Data Debug:', {
      clientIdFromUrl,
      clientData,
      clientLoanTypes,
      clientTasks,
      workspaceId: workspace?.id
    });

    if (!clientLoanTypes || !clientTasks) {
      console.log('🔍 [DEBUG] ClientPortal - Missing data, returning empty array');
      return [];
    }

    console.log('🔍 [DEBUG] ClientPortal - Processing data:', {
      clientLoanTypesLength: clientLoanTypes.length,
      clientTasksLength: clientTasks.length,
      clientLoanTypes: clientLoanTypes,
      clientTasks: clientTasks
    });

    return clientLoanTypes.map((clientLoanType: any) => {
      // Find the tasks for this loan type assignment
      const loanTypeTasks = clientTasks.find((taskGroup: any) => 
        taskGroup.clientLoanType._id === clientLoanType._id
      );
      
      // Filter tasks to only show CLIENT tasks
      const clientOnlyTasks = loanTypeTasks?.tasks?.filter((task: any) => 
        task.assigneeRole === 'CLIENT'
      ) || [];
      
      console.log('🔍 [DEBUG] ClientPortal - Processing loan type:', {
        clientLoanTypeId: clientLoanType._id,
        loanTypeTasks,
        foundTaskGroup: !!loanTypeTasks,
        totalTasks: loanTypeTasks?.tasks?.length || 0,
        clientTasks: clientOnlyTasks.length
      });
      
      const tasks = clientOnlyTasks;
      const completedTasks = tasks.filter((task: any) => task.status === 'completed').length;
      const totalTasks = tasks.length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...clientLoanType,
        tasks,
        completedTasks,
        totalTasks,
        progress,
        order: clientLoanType.order || 1
      };
    }).sort((a: any, b: any) => (a.order || 1) - (b.order || 1));
  }, [clientLoanTypes, clientTasks]);

  // Toggle loan type expansion
  const toggleLoanType = (loanTypeId: string) => {
    const newExpanded = new Set(expandedLoanTypes);
    if (newExpanded.has(loanTypeId)) {
      newExpanded.delete(loanTypeId);
    } else {
      newExpanded.add(loanTypeId);
    }
    setExpandedLoanTypes(newExpanded);
  };

  // Handle file selection
  const handleFileSelect = (taskId: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), ...fileArray]
      }));
    }
  };

  // Handle file removal
  const handleFileRemove = (taskId: string, index: number) => {
    setSelectedFiles(prev => ({
      ...prev,
      [taskId]: prev[taskId]?.filter((_, i) => i !== index) || []
    }));
  };

  // Handle file upload
  const handleFileUpload = async (taskId: string) => {
    const files = selectedFiles[taskId];
    if (!files || files.length === 0) return;

    setUploadingFiles(prev => ({ ...prev, [taskId]: true }));

    try {
      for (const file of files) {
        await uploadDocument({
          workspaceId: workspace?.id || '',
          clientId: clientIdFromUrl as any,
          taskId: taskId as any,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadedBy: user?._id || '',
          status: 'pending_review',
        });
      }

      // Clear selected files after successful upload
      setSelectedFiles(prev => ({ ...prev, [taskId]: [] }));
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [taskId]: false }));
    }
  };

  // Handle task note update
  const handleTaskNoteUpdate = async (taskId: string) => {
    const note = taskNotes[taskId];
    if (!note) return;

    try {
      await updateClientTask({
        taskId: taskId as any,
        updates: {
          clientNotes: note
        }
      });
      
      // Clear editing state
      setEditingTask(null);
      setTaskNotes(prev => ({ ...prev, [taskId]: '' }));
    } catch (error) {
      console.error('Error updating task note:', error);
    }
  };

  // Handle task status change
  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateClientTask({
        taskId: taskId as any,
        updates: {
          status: newStatus as any
        }
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Start editing a task note
  const startEditingNote = (taskId: string, currentNote: string) => {
    setEditingTask(taskId);
    setTaskNotes(prev => ({ ...prev, [taskId]: currentNote || '' }));
  };

  // Loading state
  if (!user || !workspace || !currentWorkspace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-orange mx-auto mb-4"></div>
          <p className="text-gunmetal">Loading your portal...</p>
        </div>
      </div>
    );
  }

  // Get client name
  const clientName = clientData?.name || 'Client';
  const isClient = user?.role === 'CLIENT';

  return (
    <>
      <Helmet>
        <title>{isPreviewMode ? 'Client Portal Preview' : 'Client Portal'} - {currentWorkspace.name} | LoanFlowPro</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gunmetal">
                  {isPreviewMode ? 'Client Portal Preview' : 'Client Portal'}
                </h1>
                <p className="text-gunmetal-light">
                  {isPreviewMode ? 'Preview Mode' : `Welcome, ${clientName}`}
                </p>
              </div>
              
              {/* Advisor Contact Info */}
              {primaryAdvisor && (
                <div className="text-right">
                  <p className="text-sm text-gunmetal-light">Your Advisor</p>
                  <p className="font-medium text-gunmetal">{primaryAdvisor.user?.name || 'Advisor'}</p>
                  <p className="text-sm text-brand-orange">{primaryAdvisor.user?.email || ''}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loan Types List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gunmetal">Your Loan Applications</h2>
              <div className="text-sm text-gunmetal-light">
                {processedLoanTypes.length} loan type{processedLoanTypes.length !== 1 ? 's' : ''}
              </div>
            </div>

            {processedLoanTypes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gunmetal mb-2">No loan applications yet</h3>
                <p className="text-gunmetal-light">Your advisor will assign loan types and tasks to get you started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {processedLoanTypes.map((clientLoanType: any) => (
                  <div key={clientLoanType._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Loan Type Header */}
                    <div 
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleLoanType(clientLoanType._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {clientLoanType.order || 1}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gunmetal">
                                {clientLoanType.loanType?.name || 'Loan Type'}
                              </h3>
                              <p className="text-sm text-gunmetal-light">
                                {clientLoanType.loanType?.description || 'No description available'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {/* Progress */}
                          <div className="text-right">
                            <div className="text-sm text-gunmetal-light">Progress</div>
                            <div className="text-lg font-semibold text-gunmetal">{clientLoanType.progress}%</div>
                          </div>
                          
                          {/* Tasks Summary */}
                          <div className="text-right">
                            <div className="text-sm text-gunmetal-light">Tasks</div>
                            <div className="text-lg font-semibold text-gunmetal">
                              {clientLoanType.completedTasks}/{clientLoanType.totalTasks}
                            </div>
                          </div>
                          
                          {/* Expand/Collapse Icon */}
                          <div className="flex-shrink-0">
                            {expandedLoanTypes.has(clientLoanType._id) ? (
                              <ChevronDown className="h-5 w-5 text-gunmetal" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gunmetal" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-gunmetal-light mb-2">
                          <span>Overall Progress</span>
                          <span>{clientLoanType.progress}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-brand-orange h-2 rounded-full transition-all duration-300"
                            style={{ width: `${clientLoanType.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Tasks Section */}
                    {expandedLoanTypes.has(clientLoanType._id) && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        <div className="p-6">
                          <h4 className="text-md font-medium text-gunmetal mb-4">Tasks</h4>
                          
                          {clientLoanType.tasks.length === 0 ? (
                            <p className="text-gunmetal-light text-center py-4">No tasks assigned yet.</p>
                          ) : (
                            <div className="space-y-3">
                              {clientLoanType.tasks.map((task: any) => {
                                // Get documents for this task
                                const taskDocuments = getDocumentsForTask(task._id);
                                
                                return (
                                  <div key={task._id} className="bg-white rounded-md p-4 border border-gray-200">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                          {/* Task Status Icon */}
                                          {task.status === 'completed' ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                          ) : task.status === 'in_progress' ? (
                                            <Clock className="h-5 w-5 text-blue-500" />
                                          ) : (
                                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                                          )}
                                          
                                          {/* Task Title */}
                                          <h5 className="font-medium text-gunmetal">{task.title}</h5>
                                          
                                          {/* Document Upload Indicator - Use real attachmentsAllowed field */}
                                          {task.attachmentsAllowed && (
                                            <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                                              <Upload className="h-3 w-3" />
                                              <span>Documents Required</span>
                                            </div>
                                          )}
                                        </div>
                                        
                                        {/* Task Description */}
                                        {task.description && (
                                          <p className="text-sm text-gunmetal-light mb-2">{task.description}</p>
                                          )}
                                        
                                        {/* Task Instructions */}
                                        {task.instructions && (
                                          <p className="text-sm text-gunmetal-light mb-2">{task.instructions}</p>
                                        )}
                                        
                                        {/* Client Note if available */}
                                        {task.clientNote && (
                                          <div className="bg-gray-50 p-2 rounded text-sm text-gunmetal-light">
                                            <span className="font-medium">Note:</span> {task.clientNote}
                                          </div>
                                        )}
                                        
                                        {/* Task Note Management */}
                                        <div className="mt-3">
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gunmetal">Your Notes</span>
                                            {editingTask !== task._id && (
                                              <button
                                                onClick={() => startEditingNote(task._id, task.clientNote || '')}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                title={task.clientNote ? 'Edit Note' : 'Add Note'}
                                              >
                                                <Edit3 className="h-4 w-4" />
                                              </button>
                                            )}
                                          </div>
                                          
                                          {editingTask === task._id ? (
                                            <div className="space-y-2">
                                              <textarea
                                                value={taskNotes[task._id] || ''}
                                                onChange={(e) => setTaskNotes(prev => ({ ...prev, [task._id]: e.target.value }))}
                                                placeholder="Add your notes about this task..."
                                                className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                                                rows={3}
                                              />
                                              <div className="flex gap-2">
                                                <button
                                                  onClick={() => handleTaskNoteUpdate(task._id)}
                                                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                                  title="Save Note"
                                                >
                                                  <CheckCircle className="h-4 w-4" />
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    setEditingTask(null);
                                                    setTaskNotes(prev => ({ ...prev, [task._id]: '' }));
                                                  }}
                                                  className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                                                  title="Cancel"
                                                >
                                                  <X className="h-4 w-4" />
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="bg-gray-50 p-2 rounded text-sm">
                                              <p className="text-gunmetal-light">
                                                {task.clientNote || 'No notes added yet'}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                        
                                        {/* Task Status Management */}
                                        <div className="mt-3">
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gunmetal">Task Status</span>
                                          </div>
                                          
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => handleTaskStatusChange(task._id, 'in_progress')}
                                              disabled={task.status === 'in_progress'}
                                              className={`p-2 rounded-full transition-colors ${
                                                task.status === 'in_progress'
                                                  ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                                                  : 'text-blue-600 hover:bg-blue-50'
                                              }`}
                                              title="Mark as In Progress"
                                            >
                                              <Clock className="h-4 w-4" />
                                            </button>
                                            
                                            <button
                                              onClick={() => handleTaskStatusChange(task._id, 'ready_for_review')}
                                              disabled={task.status === 'ready_for_review'}
                                              className={`p-2 rounded-full transition-colors ${
                                                task.status === 'ready_for_review'
                                                  ? 'bg-orange-100 text-orange-800 cursor-not-allowed'
                                                  : 'text-orange-600 hover:bg-orange-50'
                                              }`}
                                              title="Mark as Ready for Review"
                                            >
                                              <AlertCircle className="h-4 w-4" />
                                            </button>
                                            
                                            <button
                                              onClick={() => handleTaskStatusChange(task._id, 'completed')}
                                              disabled={task.status === 'completed'}
                                              className={`p-2 rounded-full transition-colors ${
                                                task.status === 'completed'
                                                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                                  : 'text-green-600 hover:bg-green-50'
                                              }`}
                                              title="Mark as Complete"
                                            >
                                              <CheckCircle className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </div>
                                        
                                        {/* Uploaded Documents Section */}
                                        <div className="mt-3">
                                          <div className="flex items-center gap-2 mb-2">
                                            <FileText className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gunmetal">Documents</span>
                                          </div>
                                          
                                          {/* Show uploaded documents */}
                                          {taskDocuments && taskDocuments.length > 0 ? (
                                            <div className="space-y-2">
                                              {taskDocuments.map((doc: any) => (
                                                <div key={doc._id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                  <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm text-gunmetal">{doc.fileName}</span>
                                                    <span className="text-xs text-gray-500">({doc.fileType})</span>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <span className={`text-xs px-2 py-1 rounded ${
                                                      doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                      doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                      'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                      {doc.status}
                                                    </span>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <div className="bg-gray-50 p-2 rounded text-sm">
                                              <p className="text-gunmetal-light">No documents uploaded yet</p>
                                            </div>
                                          )}
                                          
                                          {/* File Upload Section - Only show if attachments are allowed */}
                                          {task.attachmentsAllowed && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                                              <h6 className="text-sm font-medium text-blue-800 mb-2">Upload Documents</h6>
                                              
                                              {/* File Input */}
                                              <div className="mb-3">
                                                <input
                                                  type="file"
                                                  multiple
                                                  onChange={(e) => handleFileSelect(task._id, e.target.files)}
                                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                                                />
                                              </div>
                                              
                                              {/* Selected Files */}
                                              {selectedFiles[task._id] && selectedFiles[task._id].length > 0 && (
                                                <div className="mb-3">
                                                  <div className="text-sm font-medium text-blue-800 mb-2">Selected Files:</div>
                                                  <div className="space-y-1">
                                                    {selectedFiles[task._id].map((file, index) => (
                                                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                                                        <span className="text-gray-700">{file.name}</span>
                                                        <button
                                                          onClick={() => handleFileRemove(task._id, index)}
                                                          className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                          title="Remove file"
                                                        >
                                                          <X className="h-3 w-3" />
                                                        </button>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}
                                              
                                              {/* Upload Button */}
                                              <button
                                                onClick={() => handleFileUpload(task._id)}
                                                disabled={!selectedFiles[task._id] || selectedFiles[task._id].length === 0 || uploadingFiles[task._id]}
                                                className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                              >
                                                {uploadingFiles[task._id] ? (
                                                  <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Uploading...
                                                  </>
                                                ) : (
                                                  <>
                                                    <Upload className="h-4 w-4" />
                                                    Upload Documents
                                                  </>
                                                )}
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                        
                                        {/* Task Status Badge */}
                                        <div className="mt-2">
                                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            task.status === 'completed' 
                                              ? 'bg-green-100 text-green-800' 
                                              : task.status === 'in_progress'
                                              ? 'bg-blue-100 text-blue-800'
                                              : task.status === 'ready_for_review'
                                              ? 'bg-orange-100 text-orange-800'
                                              : 'bg-yellow-100 text-yellow-800'
                                          }`}>
                                            {task.status === 'completed' ? 'Completed' : 
                                             task.status === 'in_progress' ? 'In Progress' : 
                                             task.status === 'ready_for_review' ? 'Ready for Review' :
                                             'Pending'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ClientPortal;
