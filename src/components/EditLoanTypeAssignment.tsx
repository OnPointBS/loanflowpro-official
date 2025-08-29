import React, { useState, useEffect } from 'react';
import { X, Home, CheckCircle, BarChart3, Paperclip, AlertTriangle, Edit, Trash2, Plus } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

interface EditLoanTypeAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  loanTypeId: string;
  clientId: string;
  workspaceId: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assigneeRole: 'CLIENT' | 'ADVISOR' | 'STAFF';
  dueInDays: number;
  attachmentsAllowed: boolean;
  required: boolean;
  dueAt?: number;
}

export default function EditLoanTypeAssignment({ 
  isOpen, 
  onClose, 
  loanTypeId, 
  clientId, 
  workspaceId 
}: EditLoanTypeAssignmentProps) {
  const [loanTypeData, setLoanTypeData] = useState({
    customName: '',
    notes: '',
    baseLoanType: '',
    category: '',
    description: '',
    currentOrder: 1
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'normal' as const,
    assigneeRole: 'CLIENT' as const,
    dueInDays: 30,
    attachmentsAllowed: true,
    required: true
  });

  // Fetch loan type data
  const loanType = useQuery(api.loanTypes.get, { 
    workspaceId: workspaceId as any, 
    loanTypeId: loanTypeId as any 
  });

  // Fetch tasks for this loan type
  const loanTypeTasks = useQuery(api.tasks.listByLoanType, { 
    workspaceId: workspaceId as any, 
    loanTypeId: loanTypeId as any 
  });

  // Mutations
  const updateLoanType = useMutation(api.loanTypes.update);
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.remove);

  // Initialize data when component loads
  useEffect(() => {
    if (loanType) {
      setLoanTypeData({
        customName: loanType.customName || loanType.name,
        notes: loanType.notes || '',
        baseLoanType: loanType.name,
        category: loanType.category,
        description: loanType.description || '',
        currentOrder: loanType.order || 1
      });
    }
  }, [loanType]);

  useEffect(() => {
    if (loanTypeTasks) {
      setTasks(loanTypeTasks);
    }
  }, [loanTypeTasks]);

  const handleSaveChanges = async () => {
    try {
      // Update loan type
      await updateLoanType({
        loanTypeId: loanTypeId as any,
        updates: {
          name: loanTypeData.customName,
          description: loanTypeData.description,
          notes: loanTypeData.notes,
          order: loanTypeData.currentOrder
        }
      });

      // Close modal
      onClose();
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      await createTask({
        workspaceId: workspaceId as any,
        loanTypeId: loanTypeId as any,
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        assigneeRole: newTask.assigneeRole,
        dueInDays: newTask.dueInDays,
        attachmentsAllowed: newTask.attachmentsAllowed,
        required: newTask.required,
        status: 'pending',
        assigneeId: clientId as any
      });

      // Reset new task form
      setNewTask({
        title: '',
        description: '',
        priority: 'normal',
        assigneeRole: 'CLIENT',
        dueInDays: 30,
        attachmentsAllowed: true,
        required: true
      });
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTask({
        taskId: taskId as any,
        updates
      });
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask({ taskId: taskId as any });
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-brand-orange">Edit Loan Type Assignment</h2>
            <p className="text-gray-600 mt-1">Manage loan type details and associated tasks for Ryan Loan</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel: Loan Type Information */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center space-x-2 mb-4">
                <Home className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-800">Loan Type Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-800 mb-1">Custom Name</label>
                  <input
                    type="text"
                    value={loanTypeData.customName}
                    onChange={(e) => setLoanTypeData(prev => ({ ...prev, customName: e.target.value }))}
                    className="w-full border border-yellow-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-800 mb-1">Notes</label>
                  <textarea
                    value={loanTypeData.notes}
                    onChange={(e) => setLoanTypeData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full border border-yellow-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-800 mb-1">Base Loan Type</label>
                  <input
                    type="text"
                    value={loanTypeData.baseLoanType}
                    onChange={(e) => setLoanTypeData(prev => ({ ...prev, baseLoanType: e.target.value }))}
                    className="w-full border border-yellow-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-800 mb-1">Category</label>
                  <input
                    type="text"
                    value={loanTypeData.category}
                    onChange={(e) => setLoanTypeData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-yellow-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-800 mb-1">Description</label>
                  <textarea
                    value={loanTypeData.description}
                    onChange={(e) => setLoanTypeData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-yellow-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-800 mb-1">Current Order</label>
                  <input
                    type="text"
                    value={loanTypeData.currentOrder}
                    onChange={(e) => setLoanTypeData(prev => ({ ...prev, currentOrder: parseInt(e.target.value) || 1 }))}
                    className="w-full border border-yellow-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel: Associated Tasks */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">Associated Tasks</h3>
                </div>
                <button
                  onClick={handleAddTask}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>

              {/* Add New Task Form */}
              <div className="bg-white rounded-lg p-3 mb-4 border border-green-200">
                <h4 className="text-sm font-medium text-green-800 mb-2">Add New Task</h4>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="border border-green-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500"
                  />
                  <select
                    value={newTask.assigneeRole}
                    onChange={(e) => setNewTask(prev => ({ ...prev, assigneeRole: e.target.value as any }))}
                    className="border border-green-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500"
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="ADVISOR">ADVISOR</option>
                    <option value="STAFF">STAFF</option>
                  </select>
                </div>
                <textarea
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-green-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500 mb-2"
                  rows={2}
                />
                <div className="flex items-center space-x-4 text-xs">
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={newTask.attachmentsAllowed}
                      onChange={(e) => setNewTask(prev => ({ ...prev, attachmentsAllowed: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Attachments</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={newTask.required}
                      onChange={(e) => setNewTask(prev => ({ ...prev, required: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Required</span>
                  </label>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task._id} className={`border rounded-lg p-3 ${
                    task.assigneeRole === 'CLIENT' ? 'border-blue-200 bg-blue-50' :
                    task.assigneeRole === 'ADVISOR' ? 'border-orange-200 bg-orange-50' :
                    task.assigneeRole === 'STAFF' ? 'border-purple-200 bg-purple-50' :
                    'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gunmetal">{task.title}</h4>
                        <p className="text-xs text-gunmetal-light">{task.description}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        {/* Role Badge */}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          task.assigneeRole === 'CLIENT' ? 'bg-blue-100 text-blue-800' :
                          task.assigneeRole === 'ADVISOR' ? 'bg-orange-100 text-orange-800' :
                          task.assigneeRole === 'STAFF' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.assigneeRole}
                        </span>
                        {/* Priority Badge */}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          task.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.priority}
                        </span>
                        {/* Status Badge */}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          task.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gunmetal-light">
                      <div className="flex items-center space-x-3">
                        <span>Due in {task.dueInDays} days</span>
                        {task.attachmentsAllowed && (
                          <span className="flex items-center space-x-1">
                            <Paperclip className="w-3 h-3" />
                            <span>Attachments allowed</span>
                          </span>
                        )}
                        {task.required && (
                          <span className="flex items-center space-x-1 text-yellow-600">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Required</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingTask(editingTask === task._id ? null : task._id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Edit Task Form */}
                    {editingTask === task._id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) => handleUpdateTask(task._id, { title: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 text-xs"
                          />
                          <select
                            value={task.assigneeRole}
                            onChange={(e) => handleUpdateTask(task._id, { assigneeRole: e.target.value as any })}
                            className="border border-gray-300 rounded px-2 py-1 text-xs"
                          >
                            <option value="CLIENT">CLIENT</option>
                            <option value="ADVISOR">ADVISOR</option>
                            <option value="STAFF">STAFF</option>
                          </select>
                        </div>
                        <textarea
                          value={task.description}
                          onChange={(e) => handleUpdateTask(task._id, { description: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2"
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Overview */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Task Overview</h3>
            </div>
            <div className="text-sm text-gray-600">
              Status Breakdown: {tasks.filter(t => t.status === 'completed').length} completed, {tasks.filter(t => t.status === 'pending').length} pending, {tasks.filter(t => t.status === 'in_progress').length} in progress
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
