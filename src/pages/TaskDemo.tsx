import React, { useState } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const TaskDemo: React.FC = () => {
  const { workspace } = useWorkspace();
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedLoanType, setSelectedLoanType] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Fetch data
  const clients = useQuery(api.clients.listByWorkspace, { workspaceId: workspace?._id || "" }) || [];
  const loanTypes = useQuery(api.loanTypes.listByWorkspace, { workspaceId: workspace?._id || "" }) || [];
  const tasks = useQuery(api.tasks.getTasksByWorkspace, { workspaceId: workspace?._id || "" }) || [];

  // Mutations
  const createLoanFile = useMutation(api.loanFiles.createFromLoanType);

  const handleCreateLoanFile = async () => {
    if (!selectedClient || !selectedLoanType || !workspace?._id) {
      alert('Please select both a client and loan type');
      return;
    }

    setIsCreating(true);
    try {
      const result = await createLoanFile({
        workspaceId: workspace._id,
        loanTypeId: selectedLoanType,
        clientId: selectedClient,
        advisorId: workspace.ownerUserId, // Using workspace owner as advisor for demo
      });
      
      setResult(result);
      alert(`Success! Created loan file with ${result.tasksCreated} tasks`);
    } catch (error) {
      console.error('Error creating loan file:', error);
      alert('Error creating loan file. Check console for details.');
    } finally {
      setIsCreating(false);
    }
  };

  const getClientName = (clientId: string) => {
    return clients.find(c => c._id === clientId)?.name || 'Unknown Client';
  };

  const getLoanTypeName = (loanTypeId: string) => {
    return loanTypes.find(lt => lt._id === loanTypeId)?.name || 'Unknown Loan Type';
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!workspace?._id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Task Creation Demo</h1>
        <p className="text-gray-600">
          See how tasks are automatically created when loan types are added to clients
        </p>
      </div>

      {/* Demo Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Loan File & Generate Tasks</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Client
            </label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Choose a client...</option>
              {clients.map(client => (
                <option key={client._id} value={client._id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Loan Type
            </label>
            <select
              value={selectedLoanType}
              onChange={(e) => setSelectedLoanType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Choose a loan type...</option>
              {loanTypes.map(loanType => (
                <option key={loanType._id} value={loanType._id}>
                  {loanType.name} - {loanType.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCreateLoanFile}
          disabled={!selectedClient || !selectedLoanType || isCreating}
          className="w-full bg-orange-600 text-white px-4 py-3 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isCreating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating Loan File & Tasks...
            </>
          ) : (
            'Create Loan File & Generate Tasks'
          )}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-sm font-medium text-green-800 mb-2">Success!</h3>
            <p className="text-sm text-green-700">{result.message}</p>
            <p className="text-sm text-green-600 mt-1">Loan File ID: {result.loanFileId}</p>
          </div>
        )}
      </div>

      {/* Current Tasks Display */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Tasks ({tasks.length})</h2>
        
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tasks created yet. Create a loan file to see tasks generated automatically!</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <div className={`w-3 h-3 ${getPriorityColor(task.priority)} rounded-full`}></div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{task.instructions}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>👤 {getClientName(task.clientId || '')}</span>
                      <span>📋 {getLoanTypeName(task.loanTypeId || '')}</span>
                      <span>👨‍💼 {task.assigneeRole}</span>
                      <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">How It Works</h2>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium">1. Select Client & Loan Type</p>
              <p>Choose which client will receive the loan and what type of loan they're applying for.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium">2. Automatic Task Generation</p>
              <p>The system automatically creates a set of standard tasks based on the loan type template.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium">3. Task Assignment</p>
              <p>Tasks are automatically assigned to the appropriate roles (Advisor, Staff, Client) with due dates.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium">4. Workflow Management</p>
              <p>Each task includes detailed instructions and can be tracked through completion.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Default Task Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Default Task Templates</h2>
        <p className="text-gray-600 mb-4">
          When a loan type doesn't have custom task templates, these standard tasks are automatically created:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">1.</span>
              <span className="text-sm text-gray-600">Initial Client Consultation (Advisor)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">2.</span>
              <span className="text-sm text-gray-600">Document Collection (Client)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">3.</span>
              <span className="text-sm text-gray-600">Credit Check (Advisor)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">4.</span>
              <span className="text-sm text-gray-600">Income Verification (Staff)</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">5.</span>
              <span className="text-sm text-gray-600">Property Appraisal (Advisor)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">6.</span>
              <span className="text-sm text-gray-600">Title Search (Staff)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">7.</span>
              <span className="text-sm text-gray-600">Insurance Verification (Staff)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">8.</span>
              <span className="text-sm text-gray-600">Final Review (Advisor)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDemo;
