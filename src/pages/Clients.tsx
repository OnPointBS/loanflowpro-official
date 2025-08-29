import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { UserPlus, Eye, Users, Building, Filter, Settings, EyeOff, MessageSquare } from 'lucide-react';
import Chat from '../components/Chat';

import PartnerPermissionManager from '../components/PartnerPermissionManager';

interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'prospect' | 'invited' | 'declined';
  createdAt: number;
  loanTypeCount?: number;
  taskCount?: number;
}

interface Partner {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role: string;
  notes?: string;
  status: 'active' | 'inactive' | 'invited' | 'declined';
  createdAt: number;
  permissions?: string[];
}

interface ClientLoanType {
  _id: string;
  clientId: string;
  loanTypeId: string;
  customOrder: number;
  isActive: boolean;
  assignedAt: number;
  assignedBy: string;
  customName?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  loanType?: {
    name: string;
    description: string;
    category: string;
  };
  taskCount?: number;
  completedTasks?: number;
  progressPercentage?: number;
}

const Clients: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentWorkspace: workspace } = useWorkspace();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewFilter, setViewFilter] = useState<'all' | 'clients' | 'partners'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteLoanTypeModalOpen, setIsDeleteLoanTypeModalOpen] = useState(false);
  const [isLoanTypeEditModalOpen, setIsLoanTypeEditModalOpen] = useState(false);
  const [isClientDetailModalOpen, setIsClientDetailModalOpen] = useState(false);
  const [isPartnerDetailModalOpen, setIsPartnerDetailModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedLoanTypeToDelete, setSelectedLoanTypeToDelete] = useState<{ id: string; name: string; clientName: string } | null>(null);
  const [selectedLoanTypeToEdit, setSelectedLoanTypeToEdit] = useState<{ clientId: string; clientLoanType: any; clientName: string } | null>(null);
  const [loanTypeEditForm, setLoanTypeEditForm] = useState({
    customName: '',
    notes: '',
  });
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [selectedTaskToEdit, setSelectedTaskToEdit] = useState<any>(null);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'client' | 'partner'; item: Client | Partner } | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChatClient, setSelectedChatClient] = useState<{ id: string; name: string } | null>(null);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    instructions: '',
    assigneeRole: 'CLIENT' as 'ADVISOR' | 'STAFF' | 'CLIENT',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    dueInDays: 7,
    attachmentsAllowed: true,
    isRequired: true,
  });
  const [addClientForm, setAddClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    status: 'prospect' as const,
  });
  const [editClientForm, setEditClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    status: 'active' as 'active' | 'inactive' | 'prospect' | 'invited' | 'declined',
  });
  const [assignLoanTypeForm, setAssignLoanTypeForm] = useState({
    loanTypeId: '',
    customName: '',
    notes: '',
  });
  const [isPartnerPermissionModalOpen, setIsPartnerPermissionModalOpen] = useState(false);
  const [combinedModalType, setCombinedModalType] = useState<'add' | 'inviteClient' | 'invitePartner'>('add');
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    role: '',
    permissions: [] as string[],
  });

  // Check if this is a demo account
  const isDemoAccount = user?.email === 'demo@loanflowpro.com';
  const isVerifiedUser = user?.email === 'verified@example.com';
  const hasValidWorkspace = !!workspace?.id;

  // Demo data for demo accounts
  const demoClients: Client[] = [
    {
      _id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      status: 'active',
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      loanTypeCount: 2,
      taskCount: 8,
    },
    {
      _id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 987-6543',
      status: 'prospect',
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      loanTypeCount: 1,
      taskCount: 4,
    },
    {
      _id: '3',
      name: 'Mike Davis',
      email: 'mike@example.com',
      phone: '(555) 456-7890',
      status: 'inactive',
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
      loanTypeCount: 0,
      taskCount: 0,
    },
  ];

  const demoLoanTypes = [
    {
      _id: '1',
      name: 'FHA Loan (Residential)',
      description: 'Federal Housing Administration backed loan with lower down payment requirements',
      category: 'Residential',
    },
    {
      _id: '2',
      name: 'Conventional Loan',
      description: 'Traditional mortgage loan with competitive interest rates',
      category: 'Residential',
    },
    {
      _id: '3',
      name: 'Commercial Loan',
      description: 'Business property financing with flexible terms',
      category: 'Commercial',
    },
  ];

  // Mock data for demo users and verified users
  const mockClients: Client[] = [
    { 
      _id: "client1" as any, 
      name: "John Smith", 
      email: "john@example.com", 
      phone: "(555) 123-4567",
      notes: "Active client with multiple loan types",
      status: "active", 
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      loanTypeCount: 2,
      taskCount: 8
    },
    { 
      _id: "client2" as any, 
      name: "Sarah Johnson", 
      email: "sarah@example.com", 
      phone: "(555) 987-6543",
      notes: "Prospect client",
      status: "prospect", 
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      loanTypeCount: 1,
      taskCount: 4
    },
    { 
      _id: "client3" as any, 
      name: "Mike Davis", 
      email: "mike@example.com", 
      phone: "(555) 456-7890",
      notes: "Inactive client",
      status: "inactive", 
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
      loanTypeCount: 0,
      taskCount: 0
    }
  ];

  // Mock partner data
  const mockPartners: Partner[] = [
    { 
      _id: "partner1" as any, 
      name: "Jane Wilson", 
      email: "jane@realestate.com", 
      phone: "(555) 111-2222",
      company: "Wilson Real Estate", 
      role: "Real Estate Agent", 
      status: "active", 
      notes: "Primary real estate agent",
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, 
      permissions: ["view_loan_progress", "view_client_status"] 
    },
    { 
      _id: "partner2" as any, 
      name: "Bob Thompson", 
      phone: "(555) 333-4444",
      email: "bob@titleco.com", 
      company: "Thompson Title Co", 
      role: "Title Company", 
      status: "active", 
      notes: "Title company partner",
      createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000, 
      permissions: ["view_loan_progress", "view_documents"] 
    },
    { 
      _id: "partner3" as any, 
      name: "Lisa Chen", 
      phone: "(555) 555-6666",
      email: "lisa@insurance.com", 
      company: "Chen Insurance", 
      role: "Insurance Agent", 
      status: "invited", 
      notes: "Insurance partner",
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, 
      permissions: ["view_loan_progress"] 
    }
  ];

  // Use mock data for demo accounts and verified users, or real data for authenticated users
  const shouldUseMockData = isDemoAccount || isVerifiedUser;
  
  const clientsQuery = useQuery(api.clients.listByWorkspace, shouldUseMockData ? "skip" : { workspaceId: workspace?.id || "" as any });
  const clients = shouldUseMockData ? mockClients : (hasValidWorkspace && clientsQuery) ? clientsQuery : [];

  const partnersQuery = useQuery(api.partners.listPartners, shouldUseMockData ? "skip" : { workspaceId: workspace?.id || "" as any });
  const partners = shouldUseMockData ? mockPartners : (hasValidWorkspace && partnersQuery) ? partnersQuery : [];

  const loanTypesQuery = useQuery(
    api.loanTypes.listByWorkspace,
    shouldUseMockData ? "skip" : { workspaceId: workspace?.id || "" as any }
  );

  // Use real data or demo data based on account type
  const loanTypes = shouldUseMockData ? demoLoanTypes : (loanTypesQuery || []);

  const demoClientLoanTypes: ClientLoanType[] = [
    {
      _id: '1',
      clientId: '1',
      loanTypeId: '1',
      customOrder: 1,
      isActive: true,
      assignedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      assignedBy: 'advisor1',
      customName: 'Primary Mortgage',
      notes: 'Client prefers 30-year fixed rate',
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      loanType: demoLoanTypes[0],
      taskCount: 5,
      completedTasks: 3,
      progressPercentage: 60,
    },
    {
      _id: '2',
      clientId: '1',
      loanTypeId: '2',
      customOrder: 2,
      isActive: true,
      assignedAt: Date.now() - 3 * 24 * 24 * 60 * 60 * 1000,
      assignedBy: 'advisor1',
      customName: 'HELOC',
      notes: 'Home equity line of credit for renovations',
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      loanType: demoLoanTypes[1],
      taskCount: 3,
      completedTasks: 1,
      progressPercentage: 33,
    },
    {
      _id: '3',
      clientId: '2',
      loanTypeId: '1',
      customOrder: 1,
      isActive: true,
      assignedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      assignedBy: 'advisor1',
      customName: 'FHA Loan',
      notes: 'First-time homebuyer',
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      loanType: demoLoanTypes[0],
      taskCount: 4,
      completedTasks: 2,
      progressPercentage: 50,
    },
  ];

  // Fetch client loan types for real accounts
  const clientLoanTypesQuery = useQuery(
    api.clientLoanTypes.listByWorkspace,
    shouldUseMockData ? "skip" : { workspaceId: workspace?.id || "" as any }
  );

  // Fetch client tasks for real accounts to calculate task counts
  const clientTasksQuery = useQuery(
    api.clientLoanTypes.listClientTasksByWorkspace,
    shouldUseMockData ? "skip" : { workspaceId: workspace?.id || "" as any }
  );

  // Get client loan types (real or demo)
  const getClientLoanTypes = (clientId: string) => {
    if (isDemoAccount) {
      return demoClientLoanTypes.filter(clt => clt.clientId === clientId);
    }

    // For real accounts, filter from the workspace query and populate loan type details
    if (clientLoanTypesQuery && loanTypesQuery && clientTasksQuery) {
      return clientLoanTypesQuery
        .filter(clt => clt.clientId === clientId)
        .map(clt => {
          // Find the corresponding loan type
          const loanType = loanTypesQuery.find(lt => lt._id === clt.loanTypeId);
          
          // Get all tasks for this client loan type
          const tasks = clientTasksQuery.filter(task => task.clientLoanTypeId === clt._id);
          const taskCount = tasks.length;
          
          // Calculate completed tasks and progress
          const completedTasks = tasks.filter(task => task.status === 'completed').length;
          const progressPercentage = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;
          
          return {
            ...clt,
            loanType: loanType ? {
              name: loanType.name,
              description: loanType.description,
              category: loanType.category,
            } : undefined,
            taskCount,
            completedTasks,
            progressPercentage,
          };
        });
    }
    return [];
  };

  // Filter data based on view filter
  const filteredClients = clients.filter(client => {
    if (viewFilter === 'partners') return false;
    if (searchTerm && !client.name.toLowerCase().includes(searchTerm.toLowerCase()) && !client.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (statusFilter && client.status !== statusFilter) return false;
    return true;
  });

  const filteredPartners = partners.filter(partner => {
    if (viewFilter === 'clients') return false;
    if (searchTerm && !partner.name.toLowerCase().includes(searchTerm.toLowerCase()) && !partner.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (statusFilter && partner.status !== statusFilter) return false;
    return true;
  });

  // Combined data for display
  const displayData = viewFilter === 'clients' ? filteredClients : 
                     viewFilter === 'partners' ? filteredPartners : 
                     [...filteredClients, ...filteredPartners];

  // Type guards
  const isClient = (item: Client | Partner): item is Client => {
    // Check if item has client-specific properties
    return 'status' in item && 
           (item.status === 'active' || item.status === 'inactive' || item.status === 'prospect' || item.status === 'invited' || item.status === 'declined') &&
           !('role' in item);
  };
  
  const isPartner = (item: Client | Partner): item is Partner => {
    // Check if item has partner-specific properties
    return 'role' in item && 'company' in item;
  };

  // Get status options based on view filter
  const getStatusOptions = () => {
    if (viewFilter === 'clients') {
      return [
        { value: '', label: 'All Statuses' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'prospect', label: 'Prospect' },
        { value: 'invited', label: 'Invited' },
        { value: 'declined', label: 'Declined' }
      ];
    } else if (viewFilter === 'partners') {
      return [
        { value: '', label: 'All Statuses' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'invited', label: 'Invited' },
        { value: 'declined', label: 'Declined' }
      ];
    }
    return [
      { value: '', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'prospect', label: 'Prospect' },
      { value: 'invited', label: 'Invited' },
      { value: 'declined', label: 'Declined' }
    ];
  };

  // Mutations
  const createClient = useMutation(api.clients.create);
  const updateClient = useMutation(api.clients.update);
  const deleteClient = useMutation(api.clients.remove);
  const assignLoanType = useMutation(api.clientLoanTypes.assignLoanTypeToClient);
  const reorderLoanTypes = useMutation(api.clientLoanTypes.reorderClientLoanTypes);
  const removeLoanType = useMutation(api.clientLoanTypes.removeLoanTypeFromClient);
  const updateClientTaskStatus = useMutation(api.clientLoanTypes.updateClientTaskStatus);
  const updateClientLoanTypeAssignment = useMutation(api.clientLoanTypes.updateClientLoanTypeAssignment);

  // Delete mutations
  const deleteClientMutation = useMutation(api.clients.remove);
  const deletePartnerMutation = useMutation(api.partners.deletePartner);

  // Handle add client
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !user) return;

    try {
      await createClient({
        workspaceId: workspace.id as Id<"workspaces">,
        name: addClientForm.name,
        email: addClientForm.email,
        phone: addClientForm.phone || '',
        notes: addClientForm.notes || '',
      });

      setAddClientForm({ name: '', email: '', phone: '', notes: '', status: 'prospect' });
      setInviteForm({ name: '', email: '', company: '', phone: '', role: '', permissions: [] });
      setIsAddModalOpen(false);
      
      // The UI will automatically update due to Convex's real-time updates
      // No need for manual refresh
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  // Handle invite client/partner
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !user) return;

    try {
      if (combinedModalType === 'inviteClient') {
        // This is a simplified version - in the real implementation, you'd use the proper client invite API
        // For now, we'll add them as a client with invited status
        await createClient({
          workspaceId: workspace.id as Id<"workspaces">,
          name: inviteForm.name,
          email: inviteForm.email,
          phone: inviteForm.phone || '',
          notes: `Invited via portal - Company: ${inviteForm.company || 'N/A'}, Role: ${inviteForm.role || 'N/A'}`,
        });

        // Reset form and close modal
        setInviteForm({ name: '', email: '', company: '', phone: '', role: '', permissions: [] });
        setIsAddModalOpen(false);
        
        alert('Client invited successfully! In a full implementation, an email invitation would be sent.');
      } else if (combinedModalType === 'invitePartner') {
        // This is a simplified version - in the real implementation, you'd use the proper partner invite API
        // For now, we'll add them as a partner with invited status
        // Note: This would need to be updated to use the actual partner creation API
        alert('Partner invitation functionality would be implemented here. In the real system, this would create a partner invite record and send an email invitation.');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Error sending invitation. Please try again.');
    }
  };

  // Handle edit client
  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      await updateClient({
        clientId: selectedClient._id as any,
        name: editClientForm.name,
        email: editClientForm.email,
        phone: editClientForm.phone || '',
        notes: editClientForm.notes || '',
        status: editClientForm.status,
      });

      setIsEditModalOpen(false);
      setSelectedClient(null);
      
      // The UI will automatically update due to Convex's real-time updates
      // No need for manual refresh
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  // Handle delete client
  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteClient({ clientId: clientId as any });
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
      
      // The UI will automatically update due to Convex's real-time updates
      // No need for manual refresh
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  // Open delete modal
  const openDeleteModal = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  // Open delete loan type modal
  const openDeleteLoanTypeModal = (clientLoanTypeId: string, loanTypeName: string, clientName: string) => {
    setSelectedLoanTypeToDelete({ id: clientLoanTypeId, name: loanTypeName, clientName });
    setIsDeleteLoanTypeModalOpen(true);
  };

  // Open loan type edit modal
  const openLoanTypeEditModal = (clientId: string, clientLoanType: any, clientName: string) => {
    setSelectedLoanTypeToEdit({ clientId, clientLoanType, clientName });
    setLoanTypeEditForm({
      customName: clientLoanType.customName || '',
      notes: clientLoanType.notes || '',
    });
    setIsLoanTypeEditModalOpen(true);
  };

  // Open add task modal
  const openAddTaskModal = () => {
    setNewTaskForm({
      title: '',
      instructions: '',
      assigneeRole: 'CLIENT',
      priority: 'normal',
      dueInDays: 7,
      attachmentsAllowed: true,
      isRequired: true,
    });
    setIsAddTaskModalOpen(true);
  };

  // Open edit task modal
  const openEditTaskModal = (task: any) => {
    setSelectedTaskToEdit(task);
    setNewTaskForm({
      title: task.title || '',
      instructions: task.instructions || '',
      assigneeRole: task.assigneeRole || 'CLIENT',
      priority: task.priority || 'normal',
      dueInDays: task.dueInDays || 7,
      attachmentsAllowed: task.attachmentsAllowed !== undefined ? task.attachmentsAllowed : true,
      isRequired: task.isRequired !== undefined ? task.isRequired : true,
    });
    setIsEditTaskModalOpen(true);
  };

  // Get tasks for the selected loan type
  const tasksQuery = useQuery(
    api.clientLoanTypes.getTasksByClientLoanType,
    selectedLoanTypeToEdit ? {
      workspaceId: workspace?.id || "" as any,
      clientLoanTypeId: selectedLoanTypeToEdit.clientLoanType._id as any, // Use the nested clientLoanType ID
    } : "skip"
  );

  // Handle tasks query error gracefully
  const tasks = tasksQuery && !(tasksQuery instanceof Error) ? tasksQuery : [];
  const hasTasksError = tasksQuery instanceof Error;

  // Task mutations
  const createCustomTask = useMutation(api.clientLoanTypes.createCustomClientTask);
  const updateTask = useMutation(api.clientLoanTypes.updateClientTask);
  const deleteTask = useMutation(api.clientLoanTypes.deleteClientTask);
  const updateTaskStatus = useMutation(api.clientLoanTypes.updateClientTaskStatus);

  // Handle add new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanTypeToEdit || !workspace || !newTaskForm.title.trim()) {
      alert('Please provide a task title');
      return;
    }

    try {
      await createCustomTask({
        workspaceId: workspace.id as Id<"workspaces">,
        clientId: selectedLoanTypeToEdit.clientId as any,
        clientLoanTypeId: selectedLoanTypeToEdit.clientLoanType._id as any,
        title: newTaskForm.title,
        instructions: newTaskForm.instructions,
        assigneeRole: newTaskForm.assigneeRole,
        priority: newTaskForm.priority,
        dueInDays: newTaskForm.dueInDays,
        attachmentsAllowed: newTaskForm.attachmentsAllowed,
        isRequired: newTaskForm.isRequired,
      });

      // Close modal and reset form
      setIsAddTaskModalOpen(false);
      setNewTaskForm({
        title: '',
        instructions: '',
        assigneeRole: 'CLIENT',
        priority: 'normal',
        dueInDays: 7,
        attachmentsAllowed: true,
        isRequired: true,
      });

      console.log('✅ Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Error adding task. Please try again.');
    }
  };

  // Handle update task
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskToEdit || !newTaskForm.title.trim()) {
      alert('Please provide a task title');
      return;
    }

    try {
      await updateTask({
        taskId: selectedTaskToEdit._id as any,
        updates: {
          title: newTaskForm.title,
          instructions: newTaskForm.instructions,
          assigneeRole: newTaskForm.assigneeRole,
          priority: newTaskForm.priority,
          dueInDays: newTaskForm.dueInDays,
          attachmentsAllowed: newTaskForm.attachmentsAllowed,
          isRequired: newTaskForm.isRequired,
        },
      });

      setIsEditTaskModalOpen(false);
      setSelectedTaskToEdit(null);
      console.log('✅ Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task. Please try again.');
    }
  };

  // Handle delete task
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask({ taskId: taskId as any });
      console.log('✅ Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task. Please try again.');
    }
  };

  // Handle task status change
  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatus({
        taskId: taskId as any,
        status: newStatus as any,
      });
      console.log('✅ Task status updated successfully');
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Error updating task status. Please try again.');
    }
  };

  // Get tasks for a specific loan type
  const getTasksForLoanType = (clientLoanTypeId: string) => {
    if (!clientTasksQuery) return [];
    return clientTasksQuery.filter(task => task.clientLoanTypeId === clientLoanTypeId);
  };

  // Open edit modal
  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setEditClientForm({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      notes: client.notes || '',
      status: client.status,
    });
    setIsEditModalOpen(true);
  };

  // Handle assign loan type
  const handleAssignLoanType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !user || !selectedClient) return;

    try {
      await assignLoanType({
        workspaceId: workspace.id as Id<"workspaces">,
        clientId: selectedClient._id as any,
        loanTypeId: assignLoanTypeForm.loanTypeId as any,
        customName: assignLoanTypeForm.customName || undefined,
        notes: assignLoanTypeForm.notes || '',
        assignedBy: user._id as any,
      });

      setAssignLoanTypeForm({ loanTypeId: '', customName: '', notes: '' });
      setIsAssignModalOpen(false);
      
      // The UI will automatically update due to Convex's real-time updates
      // No need for manual refresh
    } catch (error) {
      console.error('Error assigning loan type:', error);
    }
  };

  // Handle reorder loan types
  const handleReorderLoanTypes = async (clientId: string, newOrder: number[]) => {
    if (!workspace) return;

    try {
      await reorderLoanTypes({
        workspaceId: workspace.id as Id<"workspaces">,
        clientId: clientId as any,
        newOrder: newOrder.map((order, index) => ({ clientLoanTypeId: `demo-${index}` as any, newOrder: order })),
      });
    } catch (error) {
      console.error('Error reordering loan types:', error);
    }
  };

  // Handle remove loan type
  const handleRemoveLoanType = async (clientLoanTypeId: string) => {
    try {
      if (isDemoAccount) {
        // For demo accounts, just remove from local state
        // In a real app, this would update the UI immediately
        console.log('Demo mode: Removing loan type assignment', clientLoanTypeId);
        // You could implement local state management here if needed
        alert('Demo mode: Loan type would be removed. In production, this would update the database.');
      } else {
        // For real accounts, call the Convex mutation
        await removeLoanType({ clientLoanTypeId: clientLoanTypeId as any });
        
        // The UI will automatically update due to Convex's real-time updates
        // No need for manual refresh
      }
      
      // Close the modal after successful deletion
      setIsDeleteLoanTypeModalOpen(false);
      setSelectedLoanTypeToDelete(null);
    } catch (error) {
      console.error('Error removing loan type:', error);
      alert('Error removing loan type. Please try again.');
    }
  };

  // Handle move loan type up
  const handleMoveLoanTypeUp = async (clientId: string, clientLoanTypeId: string) => {
    try {
      if (isDemoAccount) {
        console.log('Demo mode: Moving loan type up', clientLoanTypeId);
        alert('Demo mode: Loan type would be moved up. In production, this would update the database.');
        return;
      }

      // Get current loan types for this client
      const currentLoanTypes = getClientLoanTypes(clientId);
      const currentLoanType = currentLoanTypes.find(lt => lt._id === clientLoanTypeId);
      
      if (!currentLoanType || currentLoanType.customOrder <= 1) {
        return; // Already at the top
      }

      // Find the loan type above this one
      const aboveLoanType = currentLoanTypes.find(lt => lt.customOrder === currentLoanType.customOrder - 1);
      
      if (aboveLoanType) {
        // Swap the order values
        await reorderLoanTypes({
          workspaceId: workspace?.id || "" as any,
          clientId: clientId as any,
          newOrder: [
            { clientLoanTypeId: clientLoanTypeId as any, newOrder: aboveLoanType.customOrder },
            { clientLoanTypeId: aboveLoanType._id as any, newOrder: currentLoanType.customOrder }
          ]
        });
        
        console.log('✅ Loan type moved up successfully');
      }
    } catch (error) {
      console.error('Error moving loan type up:', error);
      alert('Error moving loan type. Please try again.');
    }
  };

  // Handle move loan type down
  const handleMoveLoanTypeDown = async (clientId: string, clientLoanTypeId: string) => {
    try {
      if (isDemoAccount) {
        console.log('Demo mode: Moving loan type down', clientLoanTypeId);
        alert('Demo mode: Loan type would be moved down. In production, this would update the database.');
        return;
      }

      // Get current loan types for this client
      const currentLoanTypes = getClientLoanTypes(clientId);
      const currentLoanType = currentLoanTypes.find(lt => lt._id === clientLoanTypeId);
      
      if (!currentLoanType || currentLoanType.customOrder >= currentLoanTypes.length) {
        return; // Already at the bottom
      }

      // Find the loan type below this one
      const belowLoanType = currentLoanTypes.find(lt => lt.customOrder === currentLoanType.customOrder + 1);
      
      if (belowLoanType) {
        // Swap the order values
        await reorderLoanTypes({
          workspaceId: workspace?.id || "" as any,
          clientId: clientId as any,
          newOrder: [
            { clientLoanTypeId: clientLoanTypeId as any, newOrder: belowLoanType.customOrder },
            { clientLoanTypeId: belowLoanType._id as any, newOrder: currentLoanType.customOrder }
          ]
        });
        
        console.log('✅ Loan type moved down successfully');
      }
    } catch (error) {
      console.error('Error moving loan type down:', error);
      alert('Error moving loan type. Please try again.');
    }
  };

  // Helper function to get status badge color
  const getTaskStatusBadge = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in_progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'overdue': 'bg-red-100 text-red-800 border-red-200',
      'skipped': 'bg-gray-100 text-gray-800 border-gray-200',
      'ready_for_review': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${colors[status as keyof typeof colors] || colors.pending}`}>
        {status === 'ready_for_review' ? 'Ready for Review' : 
         status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  // Helper function to get priority badge color
  const getPriorityBadge = (priority: string) => {
    const colors = {
      'low': 'bg-gray-100 text-gray-800 border-gray-200',
      'normal': 'bg-blue-100 text-blue-800 border-blue-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'urgent': 'bg-red-100 text-red-800 border-red-200',
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${colors[priority as keyof typeof colors] || colors.normal}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Helper function to format due date
  const formatDueDate = (dueDate: number | undefined) => {
    if (!dueDate) return 'No due date';
    
    const now = Date.now();
    const diff = dueDate - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-800 border-green-200',
      'inactive': 'bg-gray-100 text-gray-800 border-gray-200',
      'prospect': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${colors[status as keyof typeof colors] || colors.inactive}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Residential': 'bg-blue-100 text-blue-800 border-blue-200',
      'Commercial': 'bg-purple-100 text-purple-800 border-purple-200',
      'Personal': 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Handle click outside modal to close
  const handleModalBackdropClick = (e: React.MouseEvent, modalSetter: (value: boolean) => void) => {
    if (e.target === e.currentTarget) {
      modalSetter(false);
    }
  };

  // Effect to manage body scroll when modals are open
  useEffect(() => {
    const hasOpenModal = isAddModalOpen || isAssignModalOpen || isEditModalOpen || 
                        isDeleteModalOpen || isDeleteLoanTypeModalOpen || 
                        isLoanTypeEditModalOpen || isClientDetailModalOpen ||
                        isAddTaskModalOpen || isEditTaskModalOpen;
    
    if (hasOpenModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup function
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isAddModalOpen, isAssignModalOpen, isEditModalOpen, isDeleteModalOpen, 
       isDeleteLoanTypeModalOpen, isLoanTypeEditModalOpen, isClientDetailModalOpen,
       isAddTaskModalOpen, isEditTaskModalOpen]);

  // Handle save loan type assignment changes
  const handleSaveLoanTypeChanges = async () => {
    if (!selectedLoanTypeToEdit) return;

    try {
      await updateClientLoanTypeAssignment({
        clientLoanTypeId: selectedLoanTypeToEdit.clientLoanType._id as any,
        updates: {
          customName: loanTypeEditForm.customName || undefined,
          notes: loanTypeEditForm.notes || undefined,
        },
      });

      // Close modal and reset form
      setIsLoanTypeEditModalOpen(false);
      setSelectedLoanTypeToEdit(null);
      setLoanTypeEditForm({ customName: '', notes: '' });
      
      console.log('✅ Loan type assignment updated successfully');
    } catch (error) {
      console.error('Error updating loan type assignment:', error);
      alert('Error updating loan type assignment. Please try again.');
    }
  };

  // Modal functions
  const openClientDetailModal = (client: Client) => {
    setSelectedClient(client);
    setIsClientDetailModalOpen(true);
  };

  const openPartnerDetailModal = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsPartnerDetailModalOpen(true);
  };

  const openAssignLoanTypeModal = (client: Client) => {
    setSelectedClient(client);
    setIsAssignModalOpen(true);
  };

  // Enhanced delete confirmation modal function
  const openDeleteConfirmationModal = (type: 'client' | 'partner', item: Client | Partner) => {
    console.log('Opening delete confirmation modal:', { type, item });
    
    // Double-check the type matches the actual item
    if (type === 'client' && !isClient(item)) {
      console.error('Type mismatch: expected client but got partner-like item');
      alert('Error: Item type mismatch. Please try again.');
      return;
    }
    
    if (type === 'partner' && !isPartner(item)) {
      console.error('Type mismatch: expected partner but got client-like item');
      alert('Error: Item type mismatch. Please try again.');
      return;
    }
    
    setItemToDelete({ type, item });
    setIsDeleteConfirmationModalOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    setIsDeleteConfirmationModalOpen(false);
    setItemToDelete(null);
  };

  // Chat functions
  const openChat = (clientId: string, clientName: string) => {
    setSelectedChatClient({ id: clientId, name: clientName });
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedChatClient(null);
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Premium Header */}
      <div className="relative animate-fade-in-down">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 to-brand-orange-dark/10 rounded-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl mb-2 font-bold text-gray-800">Clients</h1>
              <p className="text-lg text-gray-600">Manage your client relationships and loan type assignments</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setCombinedModalType('add');
                  setIsAddModalOpen(true);
                }}
                className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setViewFilter('all')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
            viewFilter === 'all'
              ? 'bg-brand-orange text-white shadow-lg'
              : 'bg-white/80 text-gunmetal hover:bg-white hover:shadow-md'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>All ({clients.length + partners.length})</span>
        </button>
        <button
          onClick={() => setViewFilter('clients')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
            viewFilter === 'clients'
              ? 'bg-brand-orange text-white shadow-lg'
              : 'bg-white/80 text-gunmetal hover:bg-white hover:shadow-md'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Clients ({clients.length})</span>
        </button>
        <button
          onClick={() => setViewFilter('partners')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
            viewFilter === 'partners'
              ? 'bg-brand-orange text-white shadow-lg'
              : 'bg-white/80 text-gunmetal hover:bg-white hover:shadow-md'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Partners ({partners.length})</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder={`Search ${viewFilter === 'clients' ? 'clients' : viewFilter === 'partners' ? 'partners' : 'clients and partners'} by name or email...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
          >
            {getStatusOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State for Real Data */}
      {!isDemoAccount && !clients && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mr-3"></div>
            <p className="text-gunmetal-light">Loading clients from database...</p>
          </div>
        </div>
      )}

      {/* Clients and Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayData.map((item) => {
          if (isClient(item)) {
            const clientLoanTypes = getClientLoanTypes(item._id);
            
            // Get unread message count for this client
            const unreadMessageCount = useQuery(api.messages.getUnreadMessageCountBetweenUsers, {
              workspaceId: workspace?.id || "" as any,
              userId1: user?._id || "" as any,
              userId2: item._id as any,
            }) || 0;
            
            return (
              <div key={item._id} className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                {/* Client Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gunmetal truncate hover:text-brand-orange transition-colors duration-200">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gunmetal-light truncate">{item.email}</p>
                    {clientLoanTypes.length > 0 && (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-brand-orange to-brand-orange-dark h-1.5 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${clientLoanTypes.reduce((acc, lt) => acc + (lt.progressPercentage || 0), 0) / clientLoanTypes.length}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gunmetal-light">
                          {Math.round(clientLoanTypes.reduce((acc, lt) => acc + (lt.progressPercentage || 0), 0) / clientLoanTypes.length)}% complete
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Chat Button with Notification Count */}
                    <button
                      onClick={() => openChat(item._id, item.name)}
                      className="relative p-2 text-brand-orange hover:text-brand-orange-dark hover:bg-brand-orange/10 rounded-lg transition-all duration-200"
                      title="Chat with client"
                    >
                      <MessageSquare className="w-5 h-5" />
                      {unreadMessageCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                        </span>
                      )}
                    </button>
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                {/* Client Details */}
                <div className="space-y-3 mb-6">
                  {item.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gunmetal-light">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{item.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gunmetal-light">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Added {formatDate(item.createdAt)}</span>
                  </div>
                </div>

                {/* Loan Types Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gunmetal">Loan Types</h4>
                    <div className="flex items-center space-x-3">
                      {clientLoanTypes.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-brand-orange to-brand-orange-dark h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${clientLoanTypes.reduce((acc, lt) => acc + (lt.progressPercentage || 0), 0) / clientLoanTypes.length}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gunmetal-light">
                            {Math.round(clientLoanTypes.reduce((acc, lt) => acc + (lt.progressPercentage || 0), 0) / clientLoanTypes.length)}% overall
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-gunmetal-light bg-white/60 px-2 py-1 rounded-full">
                        {clientLoanTypes.length} assigned
                      </span>
                    </div>
                  </div>
                  
                  {clientLoanTypes.length > 0 ? (
                    <div className="space-y-3">
                      {clientLoanTypes
                        .sort((a, b) => a.customOrder - b.customOrder)
                        .map((clientLoanType) => (
                          <div 
                            key={clientLoanType._id} 
                            className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/20 cursor-pointer hover:bg-white/80 hover:shadow-md transition-all duration-200"
                            onClick={() => openLoanTypeEditModal(item._id, clientLoanType, item.name)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-gunmetal text-sm">
                                {clientLoanType.customName || clientLoanType.loanType?.name}
                              </h5>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(clientLoanType.loanType?.category || '')}`}>
                                  {clientLoanType.loanType?.category}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDeleteLoanTypeModal(
                                      clientLoanType._id,
                                      clientLoanType.customName || clientLoanType.loanType?.name || 'Unknown Loan Type',
                                      item.name
                                    );
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                                  title="Remove loan type"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-gunmetal-light mb-2 line-clamp-2">
                              {clientLoanType.loanType?.description}
                            </p>
                            
                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs text-gunmetal-light mb-1">
                                <span>Progress</span>
                                <span className="font-medium text-brand-orange">
                                  {clientLoanType.progressPercentage || 0}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-brand-orange to-brand-orange-dark h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${clientLoanType.progressPercentage || 0}%` }}
                                ></div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gunmetal-light mt-1">
                                <span>
                                  {clientLoanType.completedTasks || 0} of {clientLoanType.taskCount || 0} tasks completed
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gunmetal-light">
                              <span className="text-brand-orange font-medium">
                                {'taskCount' in clientLoanType ? (clientLoanType.taskCount || 0) : 'Tasks will be calculated'} tasks
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="text-gunmetal-light">Order: {clientLoanType.customOrder}</span>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveLoanTypeUp(item._id, clientLoanType._id);
                                    }}
                                    disabled={clientLoanType.customOrder === 1}
                                    className={`p-1 rounded transition-colors duration-200 ${
                                      clientLoanType.customOrder === 1 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                                    }`}
                                    title="Move up"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveLoanTypeDown(item._id, clientLoanType._id);
                                    }}
                                    disabled={clientLoanType.customOrder === clientLoanTypes.length}
                                    className={`p-1 rounded transition-colors duration-200 ${
                                      clientLoanType.customOrder === clientLoanTypes.length 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                                    }`}
                                    title="Move down"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="text-gunmetal-light mb-2">No loan types assigned</p>
                      <p className="text-sm text-gray-500">Assign loan types to get started</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openChat(item._id, item.name)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium flex items-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat {unreadMessageCount > 0 && `(${unreadMessageCount})`}</span>
                  </button>
                  <button
                    onClick={() => openAssignLoanTypeModal(item)}
                    className="bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-brand-orange-dark transition-colors duration-200 text-sm font-medium"
                  >
                    Assign Loan Type
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    className="bg-white/80 text-gunmetal border border-gray-300 px-4 py-2 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openClientDetailModal(item)}
                    className="bg-white/80 text-gunmetal border border-gray-300 px-4 py-2 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => window.open(`/client?clientId=${item._id}`, '_blank')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View as Client
                  </button>
                  <button
                    onClick={() => {
                      console.log('Delete client button clicked:', item);
                      openDeleteConfirmationModal('client', item);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          } else if (isPartner(item)) {
            return (
              <div key={item._id} className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                {/* Partner Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gunmetal truncate hover:text-blue-600 transition-colors duration-200">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gunmetal-light truncate">{item.email}</p>
                    {item.company && (
                      <p className="text-xs text-blue-600 font-medium">{item.company}</p>
                    )}
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {/* Partner Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gunmetal-light">
                    <Building className="w-4 h-4" />
                    <span className="font-medium">{item.role}</span>
                  </div>
                  {item.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gunmetal-light">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{item.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gunmetal-light">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Added {formatDate(item.createdAt)}</span>
                  </div>
                </div>

                {/* Permissions Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gunmetal">Permissions</h4>
                    <span className="text-sm text-gunmetal-light bg-white/60 px-2 py-1 rounded-full">
                      {item.permissions?.length || 0} granted
                    </span>
                  </div>
                  
                  {item.permissions && item.permissions.length > 0 ? (
                    <div className="space-y-2">
                      {item.permissions.map((permission, index) => (
                        <div key={index} className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                          <span className="text-sm text-gunmetal font-medium capitalize">
                            {permission.replace(/_/g, ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gunmetal-light">No permissions granted</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openPartnerDetailModal(item)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => window.open(`/partner?partnerId=${item._id}`, '_blank')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View as Partner
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPartner(item);
                      setIsPartnerPermissionModalOpen(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Manage Permissions
                  </button>
                  <button
                    onClick={() => openDeleteConfirmationModal('partner', item)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Empty State */}
      {displayData.length === 0 && (
        <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl p-12 border border-white/30 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent mb-2">
            No Clients Found
          </h3>
          <p className="text-gunmetal-light text-lg mb-6">
            {searchTerm || statusFilter
              ? 'Try adjusting your filters to see more results' 
              : 'Create your first client to get started'
            }
          </p>
          {!searchTerm && !statusFilter && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Create First Client
            </button>
          )}
        </div>
      )}

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddModalOpen(false);
              // Reset forms when closing modal via backdrop click
              setAddClientForm({ name: '', email: '', phone: '', notes: '', status: 'prospect' });
              setInviteForm({ name: '', email: '', company: '', phone: '', role: '', permissions: [] });
              setCombinedModalType('add');
            }
          }}
        >
          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl mx-4 relative">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2 pb-4 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent">
                {combinedModalType === 'add' 
                  ? 'Add New Client' 
                  : combinedModalType === 'inviteClient'
                  ? 'Invite Client'
                  : 'Invite Partner'
                }
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  // Reset forms when closing modal
                  setAddClientForm({ name: '', email: '', phone: '', notes: '', status: 'prospect' });
                  setInviteForm({ name: '', email: '', company: '', phone: '', role: '', permissions: [] });
                  setCombinedModalType('add');
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200 p-1 bg-white rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Modal Type Selector */}
            <div className="mb-6">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setCombinedModalType('add');
                    // Reset forms when switching
                    setAddClientForm({ name: '', email: '', phone: '', notes: '', status: 'prospect' });
                    setInviteForm({ name: '', email: '', company: '', phone: '', role: '', permissions: [] });
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    combinedModalType === 'add'
                      ? 'bg-brand-orange text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Add Client</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCombinedModalType('inviteClient');
                    // Reset forms when switching
                    setAddClientForm({ name: '', email: '', phone: '', notes: '', status: 'prospect' });
                    setInviteForm({ name: '', email: '', company: '', phone: '', role: '', permissions: [] });
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    combinedModalType === 'inviteClient'
                      ? 'bg-brand-orange text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Invite Client</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCombinedModalType('invitePartner');
                    // Reset forms when switching
                    setAddClientForm({ name: '', email: '', phone: '', notes: '', status: 'prospect' });
                    setInviteForm({ name: '', email: '', company: '', phone: '', role: '', permissions: [] });
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    combinedModalType === 'invitePartner'
                      ? 'bg-brand-orange text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Invite Partner</span>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {combinedModalType === 'add' 
                  ? 'Add a new client directly to your system.'
                  : combinedModalType === 'inviteClient'
                  ? 'Invite a client to access your platform.'
                  : 'Invite a partner (real estate agent, title company, etc.) to monitor loan progress.'
                }
              </p>
            </div>

            <form onSubmit={combinedModalType === 'add' ? handleAddClient : handleInvite} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gunmetal mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={combinedModalType === 'add' ? addClientForm.name : inviteForm.name}
                  onChange={(e) => {
                    if (combinedModalType === 'add') {
                      setAddClientForm({ ...addClientForm, name: e.target.value });
                    } else if (combinedModalType === 'inviteClient' || combinedModalType === 'invitePartner') {
                      setInviteForm({ ...inviteForm, name: e.target.value });
                    }
                  }}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <label className="block text-base sm:text-lg font-semibold text-gunmetal mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={combinedModalType === 'add' ? addClientForm.email : inviteForm.email}
                  onChange={(e) => {
                    if (combinedModalType === 'add') {
                      setAddClientForm({ ...addClientForm, email: e.target.value });
                    } else if (combinedModalType === 'inviteClient' || combinedModalType === 'invitePartner') {
                      setInviteForm({ ...inviteForm, email: e.target.value });
                    }
                  }}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                  placeholder="Enter client email"
                />
              </div>

              <div>
                <label className="block text-base sm:text-lg font-semibold text-gunmetal mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={combinedModalType === 'add' ? addClientForm.phone : inviteForm.phone}
                  onChange={(e) => {
                    if (combinedModalType === 'add') {
                      setAddClientForm({ ...addClientForm, phone: e.target.value });
                    } else if (combinedModalType === 'inviteClient' || combinedModalType === 'invitePartner') {
                      setInviteForm({ ...inviteForm, phone: e.target.value });
                    }
                  }}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-base sm:text-lg font-semibold text-gunmetal mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  value={combinedModalType === 'add' ? addClientForm.notes : ''}
                  onChange={(e) => {
                    if (combinedModalType === 'add') {
                      setAddClientForm({ ...addClientForm, notes: e.target.value });
                    }
                  }}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base resize-none"
                  placeholder="Enter any additional notes"
                  disabled={combinedModalType === 'inviteClient' || combinedModalType === 'invitePartner'}
                />
              </div>

              {/* Invite-specific fields */}
              {(combinedModalType === 'inviteClient' || combinedModalType === 'invitePartner') && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base sm:text-lg font-semibold text-gunmetal mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={inviteForm.company}
                        onChange={(e) => setInviteForm({ ...inviteForm, company: e.target.value })}
                        className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                        placeholder="Enter company name (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-base sm:text-lg font-semibold text-gunmetal mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        name="role"
                        value={inviteForm.role}
                        onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                        className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                        placeholder="Enter role (optional)"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    // Reset forms when canceling
                    setAddClientForm({ name: '', email: '', phone: '', notes: '', status: 'prospect' });
                    setInviteForm({ name: '', email: '', company: '', phone: '', role: '', permissions: [] });
                    setCombinedModalType('add');
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-base"
                >
                  {combinedModalType === 'add' 
                    ? 'Add Client' 
                    : combinedModalType === 'inviteClient'
                    ? 'Send Client Invitation'
                    : 'Send Partner Invitation'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Loan Type Modal */}
      {isAssignModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl mx-4 relative">
            <div className="flex justify-between items-start mb-6 sticky top-0 bg-white pt-2 pb-4 border-b border-gray-200">
              <div className="flex-1 pr-4">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent mb-2">
                  Assign Loan Type to {selectedClient.name}
                </h2>
                <p className="text-sm text-gunmetal-light">
                  You can assign the same loan type multiple times with different custom names
                </p>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200 p-1 flex-shrink-0 bg-white rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignLoanType} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gunmetal mb-2">
                  Loan Type *
                </label>
                <select
                  name="loanTypeId"
                  required
                  value={assignLoanTypeForm.loanTypeId}
                  onChange={(e) => setAssignLoanTypeForm({ ...assignLoanTypeForm, loanTypeId: e.target.value })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                >
                  <option value="">Select a loan type...</option>
                  {(isDemoAccount ? demoLoanTypes : loanTypes).map((loanType) => (
                    <option key={loanType._id} value={loanType._id}>
                      {loanType.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-base sm:text-lg font-semibold text-gunmetal mb-2">
                  Custom Name (Optional)
                </label>
                <input
                  type="text"
                  name="customName"
                  placeholder="e.g., John's Primary Mortgage, HELOC #2, Refinance Loan"
                  value={assignLoanTypeForm.customName}
                  onChange={(e) => setAssignLoanTypeForm({ ...assignLoanTypeForm, customName: e.target.value })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                />
                <p className="text-xs text-gunmetal-light mt-1">
                  Customize the name for this client. For duplicate loan types, consider names like "Primary Mortgage", "HELOC #2", or "Refinance Loan" to distinguish them.
                </p>
              </div>

              <div>
                <label className="block text-base sm:text-lg font-semibold text-gunmetal mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Any special notes about this assignment..."
                  value={assignLoanTypeForm.notes}
                  onChange={(e) => setAssignLoanTypeForm({ ...assignLoanTypeForm, notes: e.target.value })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base resize-none"
                />
              </div>

              <div className="bg-gradient-to-r from-brand-orange/5 to-brand-orange-dark/5 border border-brand-orange/20 rounded-lg p-3 sm:p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-brand-orange text-lg sm:text-xl flex-shrink-0">ℹ️</div>
                  <div className="text-sm text-gunmetal-light">
                    <p className="font-medium text-gunmetal mb-1">What happens when you assign a loan type?</p>
                    <ul className="space-y-1 text-xs">
                      <li>• All associated tasks are automatically cloned to the client profile</li>
                      <li>• Tasks are assigned based on the original template settings</li>
                      <li>• You can customize task names, due dates, and instructions per client</li>
                      <li>• The loan type can be renamed for client-specific needs</li>
                      <li>• You can assign the same loan type multiple times (e.g., Primary + HELOC)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-base"
                >
                  Assign Loan Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {isEditModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent">
                Edit Client: {selectedClient.name}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditClient} className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gunmetal mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={editClientForm.name}
                  onChange={(e) => setEditClientForm({ ...editClientForm, name: e.target.value })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gunmetal mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={editClientForm.email}
                  onChange={(e) => setEditClientForm({ ...editClientForm, email: e.target.value })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gunmetal mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editClientForm.phone}
                  onChange={(e) => setEditClientForm({ ...editClientForm, phone: e.target.value })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gunmetal mb-2">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={editClientForm.notes}
                  onChange={(e) => setEditClientForm({ ...editClientForm, notes: e.target.value })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gunmetal mb-2">
                  Status
                </label>
                <select
                  value={editClientForm.status}
                  onChange={(e) => setEditClientForm({ ...editClientForm, status: e.target.value as any })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                  <option value="invited">Invited</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Update Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                ⚠️ Delete Client
              </h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="text-red-600 text-xl">🚨</div>
                  <div className="text-sm text-red-800">
                    <p className="font-semibold mb-2">This action cannot be undone!</p>
                    <p>Deleting this client will permanently remove:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>All client information</li>
                      <li>Assigned loan types</li>
                      <li>Associated tasks</li>
                      <li>Document history</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Client to be deleted:</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{selectedClient.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedClient.name}</p>
                    <p className="text-sm text-gray-600">{selectedClient.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteClient(selectedClient._id)}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Loan Type Confirmation Modal */}
      {isDeleteLoanTypeModalOpen && selectedLoanTypeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                ⚠️ Remove Loan Type
              </h2>
              <button
                onClick={() => {
                  setIsDeleteLoanTypeModalOpen(false);
                  setSelectedLoanTypeToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="text-red-600 text-xl">🚨</div>
                  <div className="text-sm text-red-800">
                    <p className="font-semibold mb-2">This action cannot be undone!</p>
                    <p>Removing this loan type will permanently delete:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>The loan type assignment</li>
                      <li>All associated tasks for this loan type</li>
                      <li>Task progress and history</li>
                      <li>Custom notes and configurations</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Loan Type to be removed:</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">📋</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedLoanTypeToDelete.name}</p>
                    <p className="text-sm text-gray-600">Client: {selectedLoanTypeToDelete.clientName}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteLoanTypeModalOpen(false);
                  setSelectedLoanTypeToDelete(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveLoanType(selectedLoanTypeToDelete.id)}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Remove Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loan Type Edit Modal */}
      {isLoanTypeEditModalOpen && selectedLoanTypeToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl mx-4 relative">
            <div className="flex justify-between items-start mb-6 sticky top-0 bg-white pt-2 pb-4 border-b border-gray-200">
              <div className="flex-1 pr-4">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-brand-orange to-brand-orange-dark bg-clip-text text-transparent mb-2">
                  ✏️ Edit Loan Type Assignment
                </h2>
                <p className="text-gunmetal-light text-sm">
                  Manage loan type details and associated tasks for {selectedLoanTypeToEdit.clientName}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsLoanTypeEditModalOpen(false);
                  setSelectedLoanTypeToEdit(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200 p-1 flex-shrink-0 bg-white rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Column - Loan Type Details */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-brand-orange/5 to-brand-orange-dark/5 border border-brand-orange/20 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gunmetal mb-4 flex items-center">
                    <span className="text-brand-orange mr-2">🏠</span>
                    Loan Type Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gunmetal mb-2">Custom Name</label>
                      <input
                        type="text"
                        value={loanTypeEditForm.customName}
                        onChange={(e) => setLoanTypeEditForm({ ...loanTypeEditForm, customName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent text-sm"
                        placeholder="Enter custom name for this loan type"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gunmetal mb-2">Notes</label>
                      <textarea
                        value={loanTypeEditForm.notes}
                        onChange={(e) => setLoanTypeEditForm({ ...loanTypeEditForm, notes: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent text-sm resize-none"
                        placeholder="Enter any notes about this loan type assignment"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gunmetal mb-2">Base Loan Type</label>
                      <input
                        type="text"
                        value={selectedLoanTypeToEdit.clientLoanType.loanType?.name || 'Unknown'}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gunmetal mb-2">Category</label>
                      <input
                        type="text"
                        value={selectedLoanTypeToEdit.clientLoanType.loanType?.category || 'Unknown'}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gunmetal mb-2">Description</label>
                      <textarea
                        value={selectedLoanTypeToEdit.clientLoanType.loanType?.description || ''}
                        disabled
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gunmetal mb-2">Current Order</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-brand-orange">
                          {selectedLoanTypeToEdit.clientLoanType.customOrder}
                        </span>
                        <span className="text-sm text-gray-500">of {getClientLoanTypes(selectedLoanTypeToEdit.clientId).length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Tasks Management */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-800 flex items-center">
                      <span className="text-green-600 mr-2">✅</span>
                      Associated Tasks
                    </h3>
                    <button
                      onClick={openAddTaskModal}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                    >
                      + Add Task
                    </button>
                  </div>

                  <div className="space-y-3">
                    {hasTasksError ? (
                      <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-200">
                        <div className="text-2xl mb-2">⚠️</div>
                        <p className="text-yellow-700 text-sm font-medium mb-1">
                          Error loading tasks
                        </p>
                        <p className="text-yellow-600 text-xs mb-3">
                          There was an issue loading tasks. You can still add new tasks.
                        </p>
                        <button
                          onClick={openAddTaskModal}
                          className="bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-200 text-sm font-medium"
                        >
                          + Add First Task
                        </button>
                      </div>
                    ) : tasks && tasks.length > 0 ? (
                      tasks.map((task) => (
                        <div key={task._id} className="bg-white rounded-lg p-4 border border-green-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-green-900 text-sm mb-1">{task.title}</h4>
                              <p className="text-green-700 text-xs mb-2">{task.instructions}</p>
                              <div className="flex items-center space-x-2 mb-2">
                                {getTaskStatusBadge(task.status)}
                                {getPriorityBadge(task.priority)}
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                  {task.assigneeRole}
                                </span>
                              </div>
                              <p className="text-xs text-green-600">
                                {formatDueDate(task.dueDate)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              <button
                                onClick={() => openEditTaskModal(task)}
                                className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                                title="Edit task"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                                title="Delete task"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          {/* Task Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-green-100">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-green-600">Status:</span>
                              <select
                                value={task.status}
                                onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                                className="text-xs border border-green-200 rounded px-2 py-1 bg-white text-green-700 focus:outline-none focus:ring-1 focus:ring-green-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="ready_for_review">Ready for Review</option>
                                <option value="completed">Completed</option>
                                <option value="overdue">Overdue</option>
                                <option value="skipped">Skipped</option>
                              </select>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-xs text-green-600">
                              {task.attachmentsAllowed && (
                                <span className="flex items-center">
                                  📎 Attachments allowed
                                </span>
                              )}
                              {task.isRequired && (
                                <span className="flex items-center">
                                  ⚠️ Required
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-lg p-4 text-center border border-green-200">
                        <div className="text-2xl mb-2">📋</div>
                        <p className="text-green-700 text-sm font-medium mb-1">
                          No tasks yet
                        </p>
                        <p className="text-green-600 text-xs mb-3">
                          Click "Add Task" to create the first task for this loan type
                        </p>
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2 text-sm">💡 Task Management Features</h4>
                          <ul className="text-xs text-green-700 space-y-1 text-left">
                            <li>• Tasks are automatically created when loan types are assigned</li>
                            <li>• You can add custom tasks specific to this client</li>
                            <li>• Task status and progress are tracked in real-time</li>
                            <li>• Documents and notes can be attached to tasks</li>
                            <li>• Set due dates and priority levels for each task</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Task Statistics */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                    <span className="text-blue-600 mr-2">📊</span>
                    Task Overview
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">
                        {hasTasksError ? '?' : tasks.length}
                      </div>
                      <div className="text-xs text-blue-600">Total Tasks</div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 text-center border border-blue-200">
                      <div className="text-2xl font-bold text-green-600">
                        {hasTasksError ? '?' : tasks.filter(task => task.status === 'completed').length}
                      </div>
                      <div className="text-xs text-green-600">Completed</div>
                    </div>
                  </div>
                  
                  {!hasTasksError && tasks.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs text-blue-700">
                        <span className="font-medium">Status Breakdown:</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span>Pending:</span>
                          <span className="font-medium">{tasks.filter(t => t.status === 'pending').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>In Progress:</span>
                          <span className="font-medium">{tasks.filter(t => t.status === 'in_progress').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ready for Review:</span>
                          <span className="font-medium">{tasks.filter(t => t.status === 'ready_for_review').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overdue:</span>
                          <span className="font-medium">{tasks.filter(t => t.status === 'overdue').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Skipped:</span>
                          <span className="font-medium">{tasks.filter(t => t.status === 'skipped').length}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={() => {
                  setIsLoanTypeEditModalOpen(false);
                  setSelectedLoanTypeToEdit(null);
                }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLoanTypeChanges}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-brand-orange text-white rounded-lg font-semibold hover:bg-brand-orange-dark transition-colors duration-200 text-sm sm:text-base"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Detail Modal */}
      {isClientDetailModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gunmetal">Client Details</h2>
                <button
                  onClick={() => setIsClientDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gunmetal mb-3">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gunmetal font-medium">{selectedClient.name}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gunmetal font-medium">{selectedClient.email}</p>
                    </div>
                    
                    {selectedClient.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gunmetal font-medium">{selectedClient.phone}</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        selectedClient.status === 'active' ? 'bg-green-100 text-green-800' :
                        selectedClient.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        selectedClient.status === 'invited' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1)}
                      </span>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Added</label>
                      <p className="text-gunmetal font-medium">{new Date(selectedClient.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gunmetal mb-3">Loan Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Loan Types</label>
                      <p className="text-gunmetal font-medium">{selectedClient.loanTypeCount || 0} assigned</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Active Tasks</label>
                      <p className="text-gunmetal font-medium">{selectedClient.taskCount || 0} tasks</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsClientDetailModalOpen(false);
                    openAssignLoanTypeModal(selectedClient);
                  }}
                  className="bg-brand-orange hover:bg-brand-orange-dark text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Assign Loan Type
                </button>
                <button
                  onClick={() => {
                    setIsClientDetailModalOpen(false);
                    // Open edit modal
                  }}
                  className="bg-white border border-gray-300 text-gunmetal hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Edit Client
                </button>
                <button
                  onClick={() => {
                    setIsClientDetailModalOpen(false);
                    openDeleteConfirmationModal('client', selectedClient);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Delete Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partner Detail Modal */}
      {isPartnerDetailModalOpen && selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gunmetal">Partner Details</h2>
                <button
                  onClick={() => setIsPartnerDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Partner Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gunmetal mb-3">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gunmetal font-medium">{selectedPartner.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gunmetal font-medium">{selectedPartner.email}</p>
                    </div>
                    {selectedPartner.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gunmetal font-medium">{selectedPartner.phone}</p>
                      </div>
                    )}
                    {selectedPartner.company && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Company</label>
                        <p className="text-gunmetal font-medium">{selectedPartner.company}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-600">Role</label>
                      <p className="text-gunmetal font-medium">{selectedPartner.role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        selectedPartner.status === 'active' ? 'bg-green-100 text-green-800' :
                        selectedPartner.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        selectedPartner.status === 'invited' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedPartner.status.charAt(0).toUpperCase() + selectedPartner.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Added</label>
                      <p className="text-gunmetal font-medium">{new Date(selectedPartner.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gunmetal mb-3">Permissions</h3>
                  <div className="space-y-3">
                    {selectedPartner.permissions && selectedPartner.permissions.length > 0 ? (
                      <div className="space-y-2">
                        {selectedPartner.permissions.map((permission, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded-lg">
                            <span className="text-sm text-gunmetal font-medium capitalize">
                              {permission.replace(/_/g, ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No permissions granted</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsPartnerDetailModalOpen(false);
                    // Open edit modal
                  }}
                  className="bg-white border border-gray-300 text-gunmetal hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Edit Partner
                </button>
                <button
                  onClick={() => {
                    setIsPartnerDetailModalOpen(false);
                    openDeleteConfirmationModal('partner', selectedPartner);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Delete Partner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmationModalOpen && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-gunmetal text-center mb-2">
                Delete {itemToDelete.type === 'client' ? 'Client' : 'Partner'}?
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <strong>{itemToDelete.item.name}</strong>? 
                This action cannot be undone and will remove all associated data.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteConfirmationModal}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!itemToDelete) return;
                    
                    try {
                      console.log('Attempting to delete:', itemToDelete);
                      
                      if (itemToDelete.type === 'client') {
                        console.log('Deleting client with ID:', itemToDelete.item._id);
                        await deleteClientMutation({ clientId: itemToDelete.item._id as any });
                      } else if (itemToDelete.type === 'partner') {
                        console.log('Deleting partner with ID:', itemToDelete.item._id);
                        await deletePartnerMutation({ partnerId: itemToDelete.item._id as any });
                      } else {
                        throw new Error(`Unknown item type: ${itemToDelete.type}`);
                      }
                      
                      alert(`${itemToDelete.type === 'client' ? 'Client' : 'Partner'} deleted successfully`);
                      closeDeleteConfirmationModal();
                    } catch (error) {
                      console.error('Failed to delete:', error);
                      alert(`Failed to delete ${itemToDelete.type === 'client' ? 'client' : 'partner'}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl mx-4 relative">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2 pb-4 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent">
                ✨ Add New Task
              </h2>
              <button
                onClick={() => setIsAddTaskModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200 p-1 bg-white rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gunmetal mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-base sm:text-lg font-semibold text-gunmetal mb-2">
                  Instructions
                </label>
                <textarea
                  name="instructions"
                  value={newTaskForm.instructions}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, instructions: e.target.value })}
                  rows={3}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base resize-none"
                  placeholder="Enter task instructions"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-semibold text-gunmetal mb-2">
                    Assignee Role
                  </label>
                  <select
                    name="assigneeRole"
                    value={newTaskForm.assigneeRole}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, assigneeRole: e.target.value as any })}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                  >
                    <option value="CLIENT">Client</option>
                    <option value="ADVISOR">Advisor</option>
                    <option value="STAFF">Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gunmetal mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={newTaskForm.priority}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value as any })}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-gunmetal mb-2">
                  Due In (Days)
                </label>
                <input
                  type="number"
                  name="dueInDays"
                  min="1"
                  max="365"
                  required
                  value={newTaskForm.dueInDays}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, dueInDays: parseInt(e.target.value) || 7 })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="attachmentsAllowed"
                    checked={newTaskForm.attachmentsAllowed}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, attachmentsAllowed: e.target.checked })}
                    className="mr-2 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
                  />
                  <span className="text-sm text-gunmetal">Allow file attachments</span>
                </label>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isRequired"
                    checked={newTaskForm.isRequired}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, isRequired: e.target.checked })}
                    className="mr-2 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
                  />
                  <span className="text-sm text-gunmetal">Required task</span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-base"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditTaskModalOpen && selectedTaskToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl mx-4 relative">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2 pb-4 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gunmetal to-gunmetal-dark bg-clip-text text-transparent">
                ✏️ Edit Task
              </h2>
              <button
                onClick={() => setIsEditTaskModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200 p-1 bg-white rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateTask} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gunmetal mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-base sm:text-lg font-semibold text-gunmetal mb-2">
                  Instructions
                </label>
                <textarea
                  name="instructions"
                  value={newTaskForm.instructions}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, instructions: e.target.value })}
                  rows={3}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base resize-none"
                  placeholder="Enter task instructions"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-semibold text-gunmetal mb-2">
                    Assignee Role
                  </label>
                  <select
                    name="assigneeRole"
                    value={newTaskForm.assigneeRole}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, assigneeRole: e.target.value as any })}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                  >
                    <option value="CLIENT">Client</option>
                    <option value="ADVISOR">Advisor</option>
                    <option value="STAFF">Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gunmetal mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={newTaskForm.priority}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value as any })}
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-gunmetal mb-2">
                  Due In (Days)
                </label>
                <input
                  type="number"
                  name="dueInDays"
                  min="1"
                  max="365"
                  required
                  value={newTaskForm.dueInDays}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, dueInDays: parseInt(e.target.value) || 7 })}
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-brand-orange/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange text-gunmetal font-medium shadow-lg transition-all duration-200 text-base"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="attachmentsAllowed"
                    checked={newTaskForm.attachmentsAllowed}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, attachmentsAllowed: e.target.checked })}
                    className="mr-2 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
                  />
                  <span className="text-sm text-gunmetal">Allow file attachments</span>
                </label>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isRequired"
                    checked={newTaskForm.isRequired}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, isRequired: e.target.checked })}
                    className="mr-2 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
                  />
                  <span className="text-sm text-gunmetal">Required task</span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsEditTaskModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-base"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Partner Permission Manager Modal */}
      {isPartnerPermissionModalOpen && selectedPartner && (
        <PartnerPermissionManager
          partnerId={selectedPartner._id}
          partnerName={selectedPartner.name}
          onClose={() => {
            setIsPartnerPermissionModalOpen(false);
            setSelectedPartner(null);
          }}
        />
      )}

      {/* Chat Component */}
      {selectedChatClient && (
        <Chat
          workspaceId={workspace?.id || ""}
          clientId={selectedChatClient.id}
          clientName={selectedChatClient.name}
          isOpen={isChatOpen}
          onClose={closeChat}
        />
      )}
    </div>
  );
};

export default Clients;
