import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

interface TaskTemplate {
  _id: Id<"taskTemplates">;
  workspaceId: Id<"workspaces">;
  title: string;
  assigneeRole: "ADVISOR" | "STAFF" | "CLIENT";
  instructions: string;
  isRequired: boolean;
  dueInDays: number;
  attachmentsAllowed: boolean;
  priority: "low" | "normal" | "high" | "urgent";
  order: number;
  createdAt: number;
  updatedAt: number;
  loanTypes?: (LoanType | null)[]; // Associated loan types (may include null values)
}

interface LoanType {
  _id: Id<"loanTypes">;
  name: string;
  description: string;
  category: string;
}

const Tasks: React.FC = () => {
  const { workspace } = useWorkspace();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskTemplate | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Id<"taskTemplates"> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedLoanTypes, setSelectedLoanTypes] = useState<Id<"loanTypes">[]>([]);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    assigneeRole: 'ADVISOR' as 'ADVISOR' | 'STAFF' | 'CLIENT',
    instructions: '',
    isRequired: true,
    dueInDays: 30,
    attachmentsAllowed: false,
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    order: 1,
  });

  // Fetch task templates for the current workspace
  const taskTemplates = useQuery(api.taskTemplates.listByWorkspace, 
    workspace?.id ? { workspaceId: workspace.id as Id<"workspaces"> } : "skip"
  );
  const loanTypes = useQuery(api.loanTypes.listByWorkspace, { 
    workspaceId: workspace?.id as Id<"workspaces"> || "" as any 
  }) || [];

  // Get loan types for a specific task template (for editing)
  const getLoanTypesForTaskTemplate = useQuery(
    api.taskTemplateLoanTypes.getLoanTypesForTaskTemplate,
    editingTask ? { taskTemplateId: editingTask._id } : "skip"
  );

  // Get all task templates with their associated loan types for display
  const taskTemplatesWithLoanTypes = useQuery(
    api.taskTemplateLoanTypes.getTaskTemplatesWithLoanTypes,
    workspace?.id ? { workspaceId: workspace.id as Id<"workspaces"> } : "skip"
  );

  // Use the enhanced data if available, fallback to basic task templates
  const displayTaskTemplates = taskTemplatesWithLoanTypes || taskTemplates;

  // Filter task templates based on selected loan types and search
  const filteredTaskTemplates = displayTaskTemplates?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.instructions.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         // Search through associated loan type names if available
                         (('loanTypes' in task && task.loanTypes) && 
                          Array.isArray(task.loanTypes) && 
                          task.loanTypes.some(lt => 
                            lt && typeof lt === 'object' && 'name' in lt && 
                            typeof lt.name === 'string' && 
                            lt.name.toLowerCase().includes(searchTerm.toLowerCase())
                          ));
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesRole = selectedRole === 'all' || task.assigneeRole === selectedRole;
    
    return matchesSearch && matchesPriority && matchesRole;
  }) || [];

  // Mutations
  const createTaskTemplate = useMutation(api.taskTemplates.create);
  const updateTaskTemplate = useMutation(api.taskTemplates.update);
  const deleteTaskTemplate = useMutation(api.taskTemplates.remove);
  const associateTaskWithLoanTypes = useMutation(api.taskTemplateLoanTypes.associateWithLoanTypes);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      assigneeRole: 'ADVISOR',
      instructions: '',
      isRequired: true,
      dueInDays: 30,
      attachmentsAllowed: true,
      priority: 'normal',
      order: 1,
    });
    setSelectedLoanTypes([]);
    setIsDuplicateTitle(false); // Reset duplicate flag
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowCreateModal(false);
    resetForm();
  };

  // Handle escape key
  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && showCreateModal) {
      handleModalClose();
    }
  };

  // Add escape key listener
  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showCreateModal]);

  // Edit task template
  const handleEdit = (task: TaskTemplate) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      assigneeRole: task.assigneeRole,
      instructions: task.instructions,
      isRequired: task.isRequired,
      dueInDays: task.dueInDays,
      attachmentsAllowed: task.attachmentsAllowed,
      priority: task.priority,
      order: task.order,
    });
    
    // Reset duplicate title state when editing
    setIsDuplicateTitle(false);
    
    // The selectedLoanTypes will be set by the useEffect below when the query results change
    setShowCreateModal(true);
  };

  // Update selectedLoanTypes when editingTask changes and query results are available
  useEffect(() => {
    if (editingTask && getLoanTypesForTaskTemplate) {
      if (getLoanTypesForTaskTemplate.length > 0) {
        const loanTypeIds = getLoanTypesForTaskTemplate
          .filter((lt): lt is NonNullable<typeof lt> => lt !== null)
          .map(lt => lt._id);
        setSelectedLoanTypes(loanTypeIds);
      } else {
        setSelectedLoanTypes([]);
      }
    }
  }, [editingTask, getLoanTypesForTaskTemplate]);

  // Delete task
  const handleDelete = async (taskId: Id<"taskTemplates">) => {
    try {
      await deleteTaskTemplate({ taskTemplateId: taskId });
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting task template:', error);
      alert('Error deleting task template');
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'from-red-400 to-red-500 bg-red-50 border-red-200 text-red-800';
      case 'high': return 'from-orange-400 to-orange-500 bg-orange-50 border-orange-200 text-orange-800';
      case 'normal': return 'from-blue-400 to-blue-500 bg-blue-50 border-blue-200 text-blue-800';
      case 'low': return 'from-emerald-400 to-emerald-500 bg-emerald-50 border-emerald-200 text-emerald-800';
      default: return 'from-gray-400 to-gray-500 bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADVISOR': return 'from-blue-400 to-blue-500 bg-blue-50 border-blue-200 text-blue-800';
      case 'STAFF': return 'from-emerald-400 to-emerald-500 bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'CLIENT': return 'from-purple-400 to-purple-500 bg-purple-50 border-purple-200 text-purple-800';
      default: return 'from-gray-400 to-gray-500 bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'high': return '⚡';
      case 'normal': return '📋';
      case 'low': return '📝';
      default: return '📋';
    }
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADVISOR': return '👨‍💼';
      case 'STAFF': return '👷';
      case 'CLIENT': return '👤';
      default: return '👤';
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workspace?.id) return;

    // Check for duplicate title before submission
    if (isDuplicateTitle) {
      alert('Please use a unique task title. A task with this title already exists.');
      return;
    }

    try {
      if (editingTask) {
        // Update existing task template
        await updateTaskTemplate({
          taskTemplateId: editingTask._id,
          ...formData,
        });
        
        // Update loan type associations
        await associateTaskWithLoanTypes({
          workspaceId: workspace.id as any,
          taskTemplateId: editingTask._id,
          loanTypeIds: selectedLoanTypes,
        });
        
        setEditingTask(null);
      } else {
        // Create new task template
        const taskTemplateId = await createTaskTemplate({
          workspaceId: workspace.id as any,
          ...formData,
        });
        
        // Associate with selected loan types
        if (selectedLoanTypes.length > 0) {
          await associateTaskWithLoanTypes({
            workspaceId: workspace.id as any,
            taskTemplateId,
            loanTypeIds: selectedLoanTypes,
          });
        }
      }
      
      setShowCreateModal(false);
      resetForm();
      setIsDuplicateTitle(false); // Reset duplicate flag
    } catch (error) {
      console.error('Error saving task template:', error);
      alert('Error saving task template');
    }
  };

  // Check for duplicate task titles
  const checkDuplicateTitle = (title: string, excludeId?: string) => {
    if (!title.trim()) return false;
    
    return taskTemplates?.some(task => 
      task.title.toLowerCase().trim() === title.toLowerCase().trim() && 
      task._id !== excludeId
    ) || false;
  };

  // State for duplicate checking
  const [isDuplicateTitle, setIsDuplicateTitle] = useState(false);
  const [titleCheckTimeout, setTitleCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle title change with debounced duplicate checking
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({ ...prev, title: newTitle }));
    
    // Clear previous timeout
    if (titleCheckTimeout) {
      clearTimeout(titleCheckTimeout);
    }
    
    // Debounce the duplicate check to avoid excessive API calls
    const timeout = setTimeout(() => {
      if (newTitle.trim()) {
        const isDuplicate = checkDuplicateTitle(newTitle, editingTask?._id);
        setIsDuplicateTitle(isDuplicate);
      } else {
        setIsDuplicateTitle(false);
      }
    }, 500); // 500ms delay
    
    setTitleCheckTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (titleCheckTimeout) {
        clearTimeout(titleCheckTimeout);
      }
    };
  }, [titleCheckTimeout]);

  // Don't render until workspace is loaded
  if (!workspace?.id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gunmetal-light text-lg font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // Handle loading state for task templates
  if (!taskTemplates) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gunmetal-light text-lg font-medium">Loading task templates...</p>
        </div>
      </div>
    );
  }

  // Handle error state - if no task templates exist and no filters are applied
  if (taskTemplates.length === 0 && !searchTerm && selectedLoanTypes.length === 0 && selectedPriority === 'all' && selectedRole === 'all') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 space-y-8">
        {/* Premium Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 to-brand-orange-dark/10 rounded-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-6 lg:space-y-0">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent mb-3">
                  Task Templates
                </h1>
                <p className="text-xl text-gunmetal-light leading-relaxed">
                  Manage task templates for loan types with mobile-friendly design
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setEditingTask(null);
                  setShowCreateModal(true);
                }}
                className="bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                + Add Task Template
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="text-6xl mb-6">📋</div>
          <h2 className="text-3xl font-bold text-gunmetal mb-4">No Task Templates Yet</h2>
          <p className="text-xl text-gunmetal-light mb-8">
            Create your first task template to get started with loan processing workflows.
          </p>
          <button
            onClick={() => {
              resetForm();
              setEditingTask(null);
              setShowCreateModal(true);
            }}
            className="bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Create First Task Template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Premium Header */}
      <div className="relative animate-fade-in-down">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 to-brand-orange-dark/10 rounded-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl mb-2 font-bold text-gray-800">Task Templates</h1>
              <p className="text-lg text-gray-600">Manage task templates for loan types with mobile-friendly design</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingTask(null);
                setShowCreateModal(true);
              }}
              className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
            >
              + Add Task Template
            </button>
          </div>
        </div>
      </div>

      {/* Premium Filters */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 group-hover:shadow-3xl"></div>
        <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent mb-6">
            Filters & Search
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gunmetal mb-3">
                Loan Types
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLoanTypes([])}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedLoanTypes.length === 0
                      ? 'bg-brand-orange text-white shadow-lg'
                      : 'bg-white/60 text-gunmetal border-2 border-brand-orange/20 hover:border-brand-orange/40'
                  }`}
                >
                  All Loan Types
                </button>
                {loanTypes.map((loanType) => (
                  <button
                    key={loanType._id}
                    onClick={() => {
                      if (selectedLoanTypes.includes(loanType._id)) {
                        setSelectedLoanTypes(prev => prev.filter(id => id !== loanType._id));
                      } else {
                        setSelectedLoanTypes(prev => [...prev, loanType._id]);
                      }
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedLoanTypes.includes(loanType._id)
                        ? 'bg-brand-orange text-white shadow-lg'
                        : 'bg-white/60 text-gunmetal border-2 border-brand-orange/20 hover:border-brand-orange/40'
                    }`}
                  >
                    {loanType.name}
                    {selectedLoanTypes.includes(loanType._id) && (
                      <span className="ml-2">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-lg font-semibold text-gunmetal mb-3">
                Search Tasks
              </label>
              <input
                type="text"
                placeholder="Search by title, instructions, or loan type names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Task Templates Cards */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent">
            Task Templates ({filteredTaskTemplates.length})
          </h2>
          <div className="text-sm text-gunmetal-light">
            {searchTerm || selectedLoanTypes.length > 0 ? 'Filtered results' : 'All tasks'}
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTaskTemplates.map((task, index) => (
            <div key={task._id} className={`group animate-fade-in-up`} style={{ animationDelay: `${index * 100}ms` }}>
              {/* Individual Task Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 group-hover:shadow-3xl group-hover:scale-105"></div>
                <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-xl">
                  
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${getPriorityColor(task.priority).split(' ')[0]} ${getPriorityColor(task.priority).split(' ')[1]} text-white shadow-lg flex-shrink-0`}>
                        <span className="text-xl">{getPriorityIcon(task.priority)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gunmetal text-base leading-tight mb-1 group-hover:text-brand-orange transition-colors duration-200">
                          {task.title}
                        </h3>
                        <p className="text-xs text-gunmetal-light font-medium">Order: {task.order}</p>
                        
                        {/* Document Proof Required Banner */}
                        {task.attachmentsAllowed && (
                          <div className="mt-2 p-2 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <span className="text-orange-600 text-lg">📄</span>
                              <span className="text-xs font-bold text-orange-800">DOCUMENT PROOF REQUIRED</span>
                            </div>
                            <p className="text-xs text-orange-700 mt-1">
                              This task requires supporting documentation to be uploaded
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="space-y-4 mb-6">
                    {/* Instructions */}
                    <div>
                      <p className="text-xs font-semibold text-gunmetal-light mb-2 uppercase tracking-wide">Instructions</p>
                      <div className="bg-white/40 rounded-lg p-3 border border-white/20">
                        <p className="text-gunmetal text-sm leading-relaxed">
                          {task.instructions}
                        </p>
                      </div>
                    </div>

                    {/* Associated Loan Types */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-gunmetal-light uppercase tracking-wide">Associated Loan Types</span>
                      </div>
                      {('loanTypes' in task && task.loanTypes && Array.isArray(task.loanTypes) && task.loanTypes.length > 0) ? (
                        <div className="flex flex-wrap gap-2">
                          {task.loanTypes.map((loanType, idx) => (
                            loanType && typeof loanType === 'object' && 'name' in loanType && typeof loanType.name === 'string' ? (
                              <span key={idx} className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-1.5 rounded-lg border border-brand-orange/20 shadow-sm">
                                {loanType.name}
                              </span>
                            ) : null
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-gunmetal-light bg-white/60 px-3 py-1.5 rounded-lg border border-white/30 shadow-sm">
                          General Task
                        </span>
                      )}
                    </div>

                    {/* Role and Priority Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gunmetal-light uppercase tracking-wide mb-2">Role</p>
                        <span className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold border ${getRoleColor(task.assigneeRole)}`}>
                          <span className="mr-1.5 text-sm">{getRoleIcon(task.assigneeRole)}</span>
                          {task.assigneeRole}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gunmetal-light uppercase tracking-wide mb-2">Priority</p>
                        <span className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold border ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Due Days and Status */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gunmetal-light uppercase tracking-wide mb-2">Due In</p>
                        <span className="text-sm font-bold text-gunmetal bg-white/60 px-3 py-1.5 rounded-lg border border-white/30 shadow-sm">
                          {task.dueInDays} days
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gunmetal-light uppercase tracking-wide mb-2">Status</p>
                        <div className="space-y-1">
                          {task.isRequired && (
                            <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full border border-emerald-200">
                              ✓ Required
                            </span>
                          )}
                          {task.attachmentsAllowed && (
                            <div className="space-y-1">
                              <span className="inline-block text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-full border border-blue-200">
                                📎 Attachments
                              </span>
                              <span className="inline-block text-xs font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-full border border-orange-200">
                                📄 Document Proof Required
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Task Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/30">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="text-brand-orange hover:text-brand-orange-dark text-xs font-semibold transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-brand-orange/10 border border-brand-orange/20 hover:border-brand-orange/40"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(task._id)}
                        className="text-red-600 hover:text-red-700 text-xs font-semibold transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-red-100 border border-red-200 hover:border-red-300"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="text-xs text-gunmetal-light font-mono bg-white/40 px-2 py-1 rounded border border-white/20">
                      {task._id.slice(-6)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTaskTemplates.length === 0 && (
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 group-hover:shadow-3xl"></div>
            <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl p-12 border border-white/30 shadow-xl text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent mb-2">
                No Task Templates Found
              </h3>
              <p className="text-gunmetal-light text-lg mb-6">
                {searchTerm || selectedLoanTypes.length > 0 
                  ? 'Try adjusting your filters to see more results' 
                  : 'Create your first task template to get started'
                }
              </p>
              {!searchTerm && selectedLoanTypes.length === 0 && (
                <button
                  onClick={() => {
                    resetForm();
                    setEditingTask(null);
                    setShowCreateModal(true);
                  }}
                  className="bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Create First Task Template
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleModalClose}
        >
          <div 
            className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent">
                {editingTask ? 'Edit Task Template' : 'Create Task Template'}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gunmetal mb-3">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter a unique task title..."
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    className={`w-full bg-white/80 backdrop-blur-sm border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 transition-all duration-200 ${
                      isDuplicateTitle 
                        ? 'border-red-400 focus:ring-red-200 focus:border-red-500' 
                        : 'border-brand-orange/20 focus:ring-brand-orange/20 focus:border-brand-orange'
                    } text-gunmetal font-medium shadow-lg`}
                  />
                  {isDuplicateTitle && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-500 text-lg">⚠️</span>
                        <div>
                          <p className="text-red-700 text-sm font-medium">Duplicate Task Title</p>
                          <p className="text-red-600 text-xs">A task with this title already exists. Please use a unique title.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gunmetal mb-2">
                    Associated Loan Types
                  </label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {loanTypes.map((loanType) => (
                        <button
                          key={loanType._id}
                          type="button"
                          onClick={() => {
                            if (selectedLoanTypes.includes(loanType._id)) {
                              setSelectedLoanTypes(prev => prev.filter(id => id !== loanType._id));
                            } else {
                              setSelectedLoanTypes(prev => [...prev, loanType._id]);
                            }
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedLoanTypes.includes(loanType._id)
                              ? 'bg-brand-orange text-white shadow-lg'
                              : 'bg-white/60 text-gunmetal border-2 border-brand-orange/20 hover:border-brand-orange/40'
                          }`}
                        >
                          {loanType.name}
                          {selectedLoanTypes.includes(loanType._id) && (
                            <span className="ml-2">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                    {selectedLoanTypes.length > 0 && (
                      <div className="text-sm text-gunmetal-light">
                        Selected: {selectedLoanTypes.length} loan type(s)
                      </div>
                    )}
                    <p className="text-xs text-gunmetal-light">
                      Select the loan types this task applies to. Leave unselected if the task is general.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gunmetal mb-2">
                    Assignee Role *
                  </label>
                  <select
                    required
                    value={formData.assigneeRole}
                    onChange={(e) => setFormData({ ...formData, assigneeRole: e.target.value as any })}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                  >
                    <option value="ADVISOR">Advisor</option>
                    <option value="STAFF">Staff</option>
                    <option value="CLIENT">Client</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gunmetal mb-2">
                    Due In (Days) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.dueInDays}
                    onChange={(e) => setFormData({ ...formData, dueInDays: parseInt(e.target.value) })}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gunmetal mb-2">
                    Priority *
                  </label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gunmetal mb-2">
                    Order *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gunmetal mb-2">
                  Instructions *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isRequired}
                    onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                    className="h-5 w-5 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
                  />
                  <span className="ml-3 text-lg text-gunmetal">Required Task</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.attachmentsAllowed}
                    onChange={(e) => setFormData({ ...formData, attachmentsAllowed: e.target.checked })}
                    className="h-5 w-5 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
                  />
                  <span className="ml-3 text-lg text-gunmetal">📄 Document Proof Required</span>
                </label>
                {formData.attachmentsAllowed && (
                  <div className="ml-8 mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <span className="text-orange-600 text-lg">💡</span>
                      <div>
                        <p className="text-sm font-medium text-orange-800">Document Proof Required</p>
                        <p className="text-xs text-orange-700 mt-1">
                          When enabled, this task will require users to upload supporting documentation such as:
                        </p>
                        <ul className="text-xs text-orange-700 mt-2 ml-4 list-disc space-y-1">
                          <li>Income verification documents</li>
                          <li>Bank statements</li>
                          <li>Tax returns</li>
                          <li>Other supporting materials</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-6 py-3 text-gunmetal bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl mb-4">🗑️</div>
              <h3 className="text-xl font-bold text-gunmetal mb-4">Delete Task Template</h3>
              <p className="text-gunmetal-light mb-6">
                Are you sure you want to delete this task template? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-6 py-3 text-gunmetal bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
