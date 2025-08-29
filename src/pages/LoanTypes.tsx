import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

interface LoanType {
  _id: Id<"loanTypes">;
  workspaceId: Id<"workspaces">;
  name: string;
  description: string;
  category: string;
  stages: string[];
  status: "active" | "inactive";
  minLoanAmount?: number;
  maxLoanAmount?: number;
  minInterestRate?: number;
  maxInterestRate?: number;
  createdAt: number;
  updatedAt: number;
}

interface Client {
  _id: Id<"clients">;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: number;
  updatedAt: number;
}

interface User {
  _id: Id<"users">;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADVISOR' | 'STAFF' | 'CLIENT';
  createdAt: number;
  updatedAt: number;
}

interface TaskTemplate {
  _id: Id<"taskTemplates">;
  title: string;
  assigneeRole: 'ADVISOR' | 'STAFF' | 'CLIENT';
  instructions: string;
  isRequired: boolean;
  dueInDays: number;
  attachmentsAllowed: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  order: number;
  loanTypeId: Id<"loanTypes">;
  createdAt: number;
  updatedAt: number;
}

interface ClientLoanType {
  _id: Id<"clientLoanTypes">;
  clientId: Id<"clients">;
  loanTypeId: Id<"loanTypes">;
  customOrder: number;
  isActive: boolean;
  assignedAt: number;
  assignedBy: Id<"users">;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

interface ClientTask {
  _id: Id<"clientTasks">;
  clientId: Id<"clients">;
  clientLoanTypeId: Id<"clientLoanTypes">;
  taskTemplateId: Id<"taskTemplates">;
  title: string;
  assigneeRole: 'ADVISOR' | 'STAFF' | 'CLIENT';
  instructions: string;
  isRequired: boolean;
  dueInDays: number;
  attachmentsAllowed: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'skipped';
  dueDate?: number;
  completedAt?: number;
  assignedTo?: Id<"users">;
  clientNotes?: string;
  createdAt: number;
  updatedAt: number;
}

interface LoanFile {
  _id: Id<"loanFiles">;
  loanTypeId: Id<"loanTypes">;
  clientId: Id<"clients">;
  advisorId: Id<"users">;
  status: 'active' | 'closed' | 'archived';
  createdAt: number;
  updatedAt: number;
}

const LoanTypes: React.FC = () => {
  const { workspace } = useWorkspace();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLoanType, setEditingLoanType] = useState<LoanType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Id<"loanTypes"> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');


  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Residential',
    stages: ['Application', 'Underwriting', 'Approval', 'Closing'],
    status: 'active' as 'active' | 'inactive',
    minLoanAmount: undefined as number | undefined,
    maxLoanAmount: undefined as number | undefined,
    minInterestRate: undefined as number | undefined,
    maxInterestRate: undefined as number | undefined,
  });

  // Fetch data
  const loanTypes = useQuery(api.loanTypes.listByWorkspace, { workspaceId: workspace?.id || "" as any }) || [];
  const clients = useQuery(api.clients.listByWorkspace, { workspaceId: workspace?.id || "" as any }) || [];
  const users = useQuery(api.workspaceMembers.getByWorkspace, { workspaceId: workspace?.id || "" as any }) || [];
  const loanFiles = useQuery(api.loanFiles.listByWorkspace, { workspaceId: workspace?.id || "" as any }) || [];
  const clientLoanTypes = useQuery(api.clientLoanTypes.listByWorkspace, { workspaceId: workspace?.id || "" as any }) || [];
  const clientTasks = useQuery(api.clientLoanTypes.listClientTasksByWorkspace, { workspaceId: workspace?.id || "" as any }) || [];
  const taskTemplates = useQuery(api.taskTemplates.listByWorkspace, { workspaceId: workspace?.id || "" as any }) || [];
  
  // Get task templates associated with the currently editing loan type
  const associatedTaskTemplates = useQuery(
    api.taskTemplateLoanTypes.getTaskTemplatesForLoanType, 
    editingLoanType?._id ? { loanTypeId: editingLoanType._id } : "skip"
  ) || [];

  // Mutations
  const createLoanType = useMutation(api.loanTypes.create);
  const updateLoanType = useMutation(api.loanTypes.update);
  const deleteLoanType = useMutation(api.loanTypes.remove);

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

  // Filter loan types based on search and category
  const filteredLoanTypes = loanTypes.filter(loanType => {
    const matchesCategory = selectedCategory === 'all' || loanType.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || loanType.status === selectedStatus;
    
    // Enhanced search that includes task content
    let matchesSearch = loanType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       loanType.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If search term exists, also check if it matches any associated tasks
    if (searchTerm && !matchesSearch) {
      const associatedTasks = clientTasks.filter(task => {
        const clientLoanType = clientLoanTypes.find(clt => clt._id === task.clientLoanTypeId);
        return clientLoanType?.loanTypeId === loanType._id;
      });
      
      // Check if any task title or instructions match the search term
      matchesSearch = associatedTasks.some(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.instructions.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Helper functions
  const getClientName = (clientId: Id<"clients">) => {
    return clients.find(c => c._id === clientId)?.name || 'Unknown Client';
  };

  const getUserName = (userId: Id<"users">) => {
    const user = users.find((u: any) => u.user?._id === userId);
    return user?.user?.name || 'Unknown User';
  };

  const getTaskTemplatesForLoanType = (loanTypeId: Id<"loanTypes">) => {
    return taskTemplates.filter(t => t.loanTypeId === loanTypeId);
  };

  const getClientsForLoanType = (loanTypeId: Id<"loanTypes">) => {
    return clientLoanTypes.filter(clt => clt.loanTypeId === loanTypeId);
  };

  const getTasksForClientLoanType = (clientLoanTypeId: Id<"clientLoanTypes">) => {
    return clientTasks.filter(ct => ct.clientLoanTypeId === clientLoanTypeId);
  };

  const getLoanFilesForLoanType = (loanTypeId: Id<"loanTypes">) => {
    return loanFiles.filter(lf => lf.loanTypeId === loanTypeId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'from-red-400 to-red-500 bg-red-50 border-red-200 text-red-800';
      case 'high': return 'from-orange-400 to-orange-500 bg-orange-50 border-orange-200 text-orange-800';
      case 'normal': return 'from-blue-400 to-blue-500 bg-blue-50 border-blue-200 text-blue-800';
      case 'low': return 'from-emerald-400 to-emerald-500 bg-emerald-50 border-emerald-200 text-emerald-800';
      default: return 'from-gray-400 to-gray-500 bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADVISOR': return 'from-blue-400 to-blue-500 bg-blue-50 border-blue-200 text-blue-800';
      case 'STAFF': return 'from-emerald-400 to-emerald-500 bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'CLIENT': return 'from-purple-400 to-purple-500 bg-purple-50 border-purple-200 text-purple-800';
      default: return 'from-gray-400 to-gray-500 bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'from-green-400 to-green-500 bg-green-50 border-green-200 text-green-800';
      case 'in_progress': return 'from-blue-400 to-blue-500 bg-blue-50 border-blue-200 text-blue-800';
      case 'pending': return 'from-yellow-400 to-yellow-500 bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'overdue': return 'from-red-400 to-red-500 bg-red-50 border-red-200 text-red-800';
      case 'skipped': return 'from-gray-400 to-gray-500 bg-gray-50 border-gray-200 text-gray-800';
      default: return 'from-gray-400 to-gray-500 bg-gray-50 border-gray-200 text-gray-800';
    }
  };



  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workspace?.id) return;

    try {
      if (editingLoanType) {
        await updateLoanType({
          loanTypeId: editingLoanType._id,
          ...formData,
        });
        setEditingLoanType(null);
      } else {
        await createLoanType({
          workspaceId: workspace.id as any,
          ...formData,
        });
      }
      
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving loan type:', error);
      alert('Error saving loan type');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Residential',
      stages: ['Application', 'Underwriting', 'Approval', 'Closing'],
      status: 'active' as 'active' | 'inactive',
      minLoanAmount: undefined,
      maxLoanAmount: undefined,
      minInterestRate: undefined,
      maxInterestRate: undefined,
    });
    // Reset filter states back to 'all' when creating new loan type
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  // Handle modal close/cancel
  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditingLoanType(null);
    // Reset filters back to 'all' when closing modal
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  // Edit loan type
  const handleEdit = (loanType: LoanType) => {
    setEditingLoanType(loanType);
    setFormData({
      name: loanType.name,
      description: loanType.description,
      category: loanType.category,
      stages: loanType.stages,
      status: loanType.status,
      minLoanAmount: loanType.minLoanAmount,
      maxLoanAmount: loanType.maxLoanAmount,
      minInterestRate: loanType.minInterestRate,
      maxInterestRate: loanType.maxInterestRate,
    });
    // Also update the filter states to match the loan type being edited
    setSelectedCategory(loanType.category);
    setSelectedStatus(loanType.status);
    setShowCreateModal(true);
  };

  // Delete loan type
  const handleDelete = async (loanTypeId: Id<"loanTypes">) => {
    try {
      await deleteLoanType({ loanTypeId });
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting loan type:', error);
      alert('Error deleting loan type');
    }
  };

  // Add stage
  const addStage = () => {
    setFormData(prev => ({
      ...prev,
      stages: [...prev.stages, 'New Stage']
    }));
  };

  // Remove stage
  const removeStage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index)
    }));
  };

  // Update stage
  const updateStage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) => i === index ? value : stage)
    }));
  };

  // Move stage up
  const moveStageUp = (index: number) => {
    if (index === 0) return; // Can't move first stage up
    setFormData(prev => {
      const newStages = [...prev.stages];
      [newStages[index - 1], newStages[index]] = [newStages[index], newStages[index - 1]];
      return { ...prev, stages: newStages };
    });
  };

  // Move stage down
  const moveStageDown = (index: number) => {
    setFormData(prev => {
      if (index === prev.stages.length - 1) return prev; // Can't move last stage down
      const newStages = [...prev.stages];
      [newStages[index], newStages[index + 1]] = [newStages[index + 1], newStages[index]];
      return { ...prev, stages: newStages };
    });
  };

  // Get stage description
  const getStageDescription = (stageName: string) => {
    const stage = stageName.toLowerCase();
    if (stage.includes('application') || stage.includes('apply')) return 'Initial loan application and documentation';
    if (stage.includes('underwriting') || stage.includes('review')) return 'Loan analysis and risk assessment';
    if (stage.includes('approval') || stage.includes('approve')) return 'Final loan decision and approval';
    if (stage.includes('closing') || stage.includes('close')) return 'Document signing and loan funding';
    if (stage.includes('funding') || stage.includes('fund')) return 'Loan disbursement and activation';
    if (stage.includes('servicing') || stage.includes('service')) return 'Ongoing loan management';
    return 'Custom workflow stage';
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Residential': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Commercial': return 'bg-green-100 text-green-800 border-green-200';
      case 'Personal': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format loan amount
  const formatLoanAmount = (amount: number | undefined) => {
    if (!amount) return 'Unlimited';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  // Format interest rate
  const formatInterestRate = (minRate: number | undefined, maxRate: number | undefined) => {
    if (minRate && maxRate) {
      return `${minRate.toFixed(2)}% - ${maxRate.toFixed(2)}%`;
    } else if (minRate) {
      return `${minRate.toFixed(2)}%+`;
    } else if (maxRate) {
      return `Up to ${maxRate.toFixed(2)}%`;
    }
    return 'Variable';
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Premium Header */}
      <div className="relative animate-fade-in-down">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 to-brand-orange-dark/10 rounded-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl mb-2 font-bold text-gray-800">Loan Types</h1>
              <p className="text-lg text-gray-600">Manage loan type templates with associated tasks, clients, and advisors</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingLoanType(null);
                setShowCreateModal(true);
              }}
              className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
            >
              + Add Loan Type
            </button>
          </div>
        </div>
      </div>

      {/* Premium Filters */}
      <div className="relative animate-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl transition-all duration-300"></div>
        <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent text-gray-700 font-medium transition-all duration-200"
              >
                <option value="all">All Categories</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent text-gray-700 font-medium transition-all duration-200"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search loan types, tasks, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent text-gray-700 font-medium transition-all duration-200"
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Search through loan type names, descriptions, and associated task content
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Types with Associated Data */}
      <div className="space-y-6 animate-fade-in-up">
        {filteredLoanTypes.map((loanType) => {



          return (
            <div key={loanType._id} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 group-hover:shadow-3xl"></div>
              <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
                {/* Loan Type Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent">
                        {loanType.name}
                      </h3>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getCategoryColor(loanType.category)}`}>
                        {loanType.category}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        loanType.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {loanType.status}
                      </span>
                    </div>
                    <p className="text-lg text-gunmetal-light leading-relaxed mb-4">
                      {loanType.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">

                    <button 
                      onClick={() => handleEdit(loanType)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(loanType._id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>


              </div>
            </div>
          );
        })}
      </div>

      {filteredLoanTypes.length === 0 && (
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 group-hover:shadow-3xl"></div>
          <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl p-12 border border-white/30 shadow-xl text-center">
            <div className="text-6xl mb-4">🏦</div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent mb-2">
              No Loan Types Found
            </h3>
            <p className="text-gunmetal-light text-lg mb-6">
              {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters to see more results' 
                : 'Create your first loan type to get started'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && selectedStatus === 'all' && (
              <button
                onClick={() => {
                  resetForm();
                  setEditingLoanType(null);
                  setShowCreateModal(true);
                }}
                className="bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Create First Loan Type
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent">
                {editingLoanType ? 'Edit Loan Type' : 'Create Loan Type'}
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
                  <label className="block text-lg font-semibold text-gunmetal mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gunmetal mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gunmetal mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gunmetal mb-2">
                    Minimum Loan Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    value={formData.minLoanAmount || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      minLoanAmount: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                  />
                  <p className="text-xs text-gunmetal-light mt-1">Leave empty for no minimum</p>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gunmetal mb-2">
                    Maximum Loan Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="Unlimited"
                    value={formData.maxLoanAmount || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      maxLoanAmount: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                  />
                  <p className="text-xs text-gunmetal-light mt-1">Leave empty for unlimited</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gunmetal mb-2">
                    Minimum Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.minInterestRate || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      minInterestRate: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                  />
                  <p className="text-xs text-gunmetal-light mt-1">Leave empty for no minimum</p>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gunmetal mb-2">
                    Maximum Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="Unlimited"
                    value={formData.maxInterestRate || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      maxInterestRate: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                  />
                  <p className="text-xs text-gunmetal-light mt-1">Leave empty for unlimited</p>
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gunmetal mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <p className="text-xs text-gunmetal-light mt-1">
                  Active loan types can be assigned to clients. Inactive types are hidden from client assignments.
                </p>
              </div>

              {/* Associated Tasks Section - Only show when editing */}
              {editingLoanType && (
                <div>
                  <label className="block text-lg font-semibold text-gunmetal mb-3">
                    📋 Associated Tasks
                  </label>
                  <div className="bg-gradient-to-r from-brand-orange/5 to-brand-orange-dark/5 border border-brand-orange/20 rounded-xl p-4">
                    {(() => {
                      // Get task templates associated with this loan type
                      const associatedTasks = associatedTaskTemplates.filter(Boolean);

                      if (associatedTasks.length === 0) {
                        return (
                          <div className="text-center py-6">
                            <div className="text-3xl mb-2">📝</div>
                            <p className="text-gunmetal-light text-sm">No task templates are currently associated with this loan type</p>
                            <p className="text-xs text-gunmetal-light mt-1">Task templates can be associated from the Tasks page</p>
                          </div>
                        );
                      }

                      // Group tasks by role
                      const tasksByRole = {
                        CLIENT: associatedTasks.filter(task => task && task.assigneeRole === 'CLIENT'),
                        ADVISOR: associatedTasks.filter(task => task && task.assigneeRole === 'ADVISOR'),
                        STAFF: associatedTasks.filter(task => task && task.assigneeRole === 'STAFF')
                      };

                      return (
                        <div className="space-y-4">
                          {/* Client Tasks */}
                          {tasksByRole.CLIENT.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gunmetal text-sm mb-2 flex items-center">
                                <span className="mr-2">👥</span>
                                Client Tasks ({tasksByRole.CLIENT.length})
                              </h4>
                              <div className="space-y-2">
                                {tasksByRole.CLIENT.map((task) => task && (
                                  <div key={task._id} className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                                    <div className="flex items-start justify-between mb-2">
                                      <h5 className="font-medium text-gunmetal text-sm">{task.title}</h5>
                                      <span className="text-xs text-brand-orange font-medium">
                                        Template
                                      </span>
                                    </div>
                                    
                                    {/* Document Proof Required Indicator */}
                                    {task.attachmentsAllowed && (
                                      <div className="mb-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-orange-600 text-sm">📄</span>
                                          <span className="text-xs font-bold text-orange-800">DOCUMENT PROOF REQUIRED</span>
                                        </div>
                                      </div>
                                    )}
                                    
                                    <p className="text-xs text-gunmetal-light mb-2 line-clamp-2">{task.instructions}</p>
                                    <div className="flex items-center justify-between text-xs text-gunmetal-light">
                                      <span>Due: {task.dueInDays} days</span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Advisor Tasks */}
                          {tasksByRole.ADVISOR.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gunmetal text-sm mb-2 flex items-center">
                                <span className="mr-2">🎯</span>
                                Advisor Tasks ({tasksByRole.ADVISOR.length})
                              </h4>
                              <div className="space-y-2">
                                {tasksByRole.ADVISOR.map((task) => task && (
                                  <div key={task._id} className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                                    <div className="flex items-start justify-between mb-2">
                                      <h5 className="font-medium text-gunmetal text-sm">{task.title}</h5>
                                      <span className="text-xs text-brand-orange font-medium">
                                        Template
                                      </span>
                                    </div>
                                    
                                    {/* Document Proof Required Indicator */}
                                    {task.attachmentsAllowed && (
                                      <div className="mb-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-orange-600 text-sm">📄</span>
                                          <span className="text-xs font-bold text-orange-800">DOCUMENT PROOF REQUIRED</span>
                                        </div>
                                      </div>
                                    )}
                                    
                                    <p className="text-xs text-gunmetal-light mb-2 line-clamp-2">{task.instructions}</p>
                                    <div className="flex items-center justify-between text-xs text-gunmetal-light">
                                      <span>Due: {task.dueInDays} days</span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Staff Tasks */}
                          {tasksByRole.STAFF.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gunmetal text-sm mb-2 flex items-center">
                                <span className="mr-2">👷</span>
                                Staff Tasks ({tasksByRole.STAFF.length})
                              </h4>
                              <div className="space-y-2">
                                {tasksByRole.STAFF.map((task) => task && (
                                  <div key={task._id} className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                                    <div className="flex items-start justify-between mb-2">
                                      <h5 className="font-medium text-gunmetal text-sm">{task.title}</h5>
                                      <span className="text-xs text-brand-orange font-medium">
                                        Template
                                      </span>
                                    </div>
                                    
                                    {/* Document Proof Required Indicator */}
                                    {task.attachmentsAllowed && (
                                      <div className="mb-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-orange-600 text-sm">📄</span>
                                          <span className="text-xs font-bold text-orange-800">DOCUMENT PROOF REQUIRED</span>
                                        </div>
                                      </div>
                                    )}
                                    
                                    <p className="text-xs text-gunmetal-light mb-2 line-clamp-2">{task.instructions}</p>
                                    <div className="flex items-center justify-between text-xs text-gunmetal-light">
                                      <span>Due: {task.dueInDays} days</span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Summary */}
                          <div className="mt-4 pt-3 border-t border-brand-orange/20">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gunmetal font-medium">Total Associated Task Templates:</span>
                              <span className="text-brand-orange font-bold text-lg">{associatedTasks.length}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gunmetal-light">
                              <div className="text-center">
                                <div className="font-medium text-gunmetal">👥</div>
                                <div>{tasksByRole.CLIENT.length} Client</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-gunmetal">🎯</div>
                                <div>{tasksByRole.ADVISOR.length} Advisor</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-gunmetal">👷</div>
                                <div>{tasksByRole.STAFF.length} Staff</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <p className="text-xs text-gunmetal-light mt-2">
                    💡 These are the task templates associated with this loan type. 
                    When clients are assigned this loan type, these tasks will be automatically created for them.
                  </p>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-lg font-semibold text-gunmetal">
                    Workflow Stages *
                  </label>
                  <button
                    type="button"
                    onClick={addStage}
                    className="flex items-center space-x-2 px-4 py-2 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange hover:text-brand-orange-dark font-semibold rounded-lg border border-brand-orange/30 hover:border-brand-orange/50 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Stage</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.stages.map((stage, index) => (
                    <div key={index} className="group relative bg-white/60 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl p-3 hover:border-brand-orange/40 transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        {/* Stage Number Badge */}
                        <div className="flex-shrink-0 w-8 h-8 bg-brand-orange/20 border border-brand-orange/30 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-brand-orange">{index + 1}</span>
                        </div>
                        
                        {/* Stage Name Input */}
                        <input
                          type="text"
                          required
                          value={stage}
                          onChange={(e) => updateStage(index, e.target.value)}
                          className="flex-1 bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-sm transition-all duration-200"
                          placeholder="Enter stage name..."
                        />
                        
                        {/* Reorder Controls */}
                        <div className="flex items-center space-x-1">
                          {/* Move Up Button */}
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveStageUp(index)}
                              className="p-2 text-brand-orange hover:text-brand-orange-dark hover:bg-brand-orange/10 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-70"
                              title="Move stage up"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                          )}
                          
                          {/* Move Down Button */}
                          {index < formData.stages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveStageDown(index)}
                              className="p-2 text-brand-orange hover:text-brand-orange-dark hover:bg-brand-orange/10 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-70"
                              title="Move stage down"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          )}
                          
                          {/* Delete Button */}
                          {formData.stages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStage(index)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-70"
                              title="Delete stage"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Stage Description Hint */}
                      <div className="mt-2 ml-11">
                        <p className="text-xs text-gunmetal-light">
                          Stage {index + 1} of {formData.stages.length} • {getStageDescription(stage)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gunmetal-light mt-1">
                  At least one stage is required. Stages will be used to organize the loan process workflow.
                </p>
                
                {/* Workflow Flow Visualization */}
                {formData.stages.length > 1 && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-brand-orange/5 to-brand-orange-dark/5 border border-brand-orange/20 rounded-lg">
                    <div className="flex items-center justify-between text-xs text-gunmetal-light mb-2">
                      <span className="font-medium text-gunmetal">Workflow Flow:</span>
                      <span className="text-brand-orange font-medium">Drag stages to reorder</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {formData.stages.map((stage, index) => (
                        <div key={index} className="flex items-center">
                          <div className="px-3 py-1 bg-white/80 border border-brand-orange/30 rounded-lg text-xs font-medium text-gunmetal">
                            {stage}
                          </div>
                          {index < formData.stages.length - 1 && (
                            <svg className="w-4 h-4 text-brand-orange mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
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
                  {editingLoanType ? 'Update Loan Type' : 'Create Loan Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent mb-4">Delete Loan Type</h3>
            <p className="text-gunmetal-light mb-6">
              Are you sure you want to delete this loan type? This action cannot be undone and will also remove any associated task templates.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-6 py-3 text-gunmetal bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanTypes;

