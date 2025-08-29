import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

interface WorkspaceSelectorProps {
  userId: Id<"users">;
  onWorkspaceSelect: (workspaceId: Id<"workspaces">) => void;
}

interface WorkspaceWithMembership {
  _id: Id<"workspaces">;
  name: string;
  status: string;
  createdAt: number;
  membership: {
    _id: string;
    role: 'ADVISOR' | 'STAFF' | 'CLIENT';
    status: string;
  };
}

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({ userId, onWorkspaceSelect }) => {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<Id<"workspaces"> | null>(null);
  
  // Get user's workspaces and memberships
  const userWorkspaces = useQuery(api.workspaces.listByUser, { userId }) || [];
  const userMemberships = useQuery(api.workspaceMembers.getByUser, { userId }) || [];

  // Combine workspace data with membership data
  const workspacesWithMemberships: WorkspaceWithMembership[] = userWorkspaces.map(workspace => {
    const membership = userMemberships.find(m => m.workspaceId === workspace._id);
    return {
      ...workspace,
      membership: membership || {
        _id: 'temp',
        role: 'ADVISOR' as const,
        status: 'active'
      }
    };
  });

  const handleWorkspaceSelect = (workspaceId: Id<"workspaces">) => {
    setSelectedWorkspaceId(workspaceId);
  };

  const handleContinue = () => {
    if (selectedWorkspaceId) {
      onWorkspaceSelect(selectedWorkspaceId);
    }
  };

  if (workspacesWithMemberships.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Workspaces Found</h2>
            <p className="text-gray-600 mb-6">
              You don't have access to any workspaces yet. Please contact your administrator.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (workspacesWithMemberships.length === 1) {
    // Auto-select if only one workspace
    React.useEffect(() => {
      onWorkspaceSelect(workspacesWithMemberships[0]._id);
    }, []);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Workspace</h2>
            <p className="text-gray-600">Redirecting to {workspacesWithMemberships[0].name}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Workspace</h2>
          <p className="text-gray-600">
            You have access to multiple workspaces. Please select one to continue.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {workspacesWithMemberships.map((workspace) => (
            <div
              key={workspace._id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedWorkspaceId === workspace._id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleWorkspaceSelect(workspace._id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{workspace.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      workspace.membership.role === 'ADVISOR' 
                        ? 'bg-blue-100 text-blue-800'
                        : workspace.membership.role === 'STAFF'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {workspace.membership.role}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      workspace.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {workspace.status}
                    </span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedWorkspaceId === workspace._id
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300'
                }`}>
                  {selectedWorkspaceId === workspace._id && (
                    <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedWorkspaceId}
          className={`w-full px-4 py-3 rounded-md font-medium transition-colors ${
            selectedWorkspaceId
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Workspace
        </button>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = '/login'}
            className="text-orange-600 hover:text-orange-700 text-sm"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSelector;
