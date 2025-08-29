import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../auth/AuthProvider';
import { Mail, UserPlus, Eye, EyeOff, CheckCircle, Clock, X } from 'lucide-react';

interface ClientInviteManagerProps {
  onClose: () => void;
}

const ClientInviteManager: React.FC<ClientInviteManagerProps> = ({ onClose }) => {
  const { workspace, user } = useAuth();
  const [isInviting, setIsInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    clientName: '',
    clientEmail: '',
    permissions: [] as string[],
  });

  // Available permissions for clients
  const availablePermissions = [
    { key: 'view_loan_files', label: 'View Loan Files', description: 'See loan application status and details' },
    { key: 'view_documents', label: 'View Documents', description: 'Access uploaded documents and forms' },
    { key: 'view_tasks', label: 'View Tasks', description: 'See assigned tasks and deadlines' },
    { key: 'view_analytics', label: 'View Analytics', description: 'Access loan progress analytics' },
    { key: 'upload_documents', label: 'Upload Documents', description: 'Upload required documents' },
    { key: 'send_messages', label: 'Send Messages', description: 'Send messages to your advisor' },
  ];

  // Get pending invitations
  const pendingInvites = useQuery(api.clientInvites.getPendingInvites, {
    workspaceId: workspace?.id || '',
  }) || [];

  // Mutations
  const createInvite = useMutation(api.clientInvites.createInvite);

  const handlePermissionToggle = (permissionKey: string) => {
    setInviteForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(p => p !== permissionKey)
        : [...prev.permissions, permissionKey]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace?.id || !user?._id) return;

    setIsInviting(true);
    try {
      await createInvite({
        workspaceId: workspace.id,
        clientEmail: inviteForm.clientEmail,
        clientName: inviteForm.clientName,
        invitedBy: user._id,
        permissions: inviteForm.permissions,
      });

      // Reset form
      setInviteForm({
        clientName: '',
        clientEmail: '',
        permissions: [],
      });

      // Show success message (you could add a toast here)
      alert('Client invitation sent successfully!');
    } catch (error) {
      console.error('Failed to send invitation:', error);
      alert(`Failed to send invitation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsInviting(false);
    }
  };

  const formatExpiryDate = (expiresAt: number) => {
    const now = Date.now();
    const diff = expiresAt - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return 'Expired';
    if (days === 1) return 'Expires tomorrow';
    return `Expires in ${days} days`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gunmetal">Invite Clients to Portal</h2>
              <p className="text-sm text-gunmetal-light">Give clients access to their loan information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Invite Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gunmetal mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={inviteForm.clientName}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, clientName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-colors"
                  placeholder="Enter client's full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gunmetal mb-2">
                  Client Email *
                </label>
                <input
                  type="email"
                  required
                  value={inviteForm.clientEmail}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, clientEmail: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-colors"
                  placeholder="client@example.com"
                />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gunmetal mb-3">
                Portal Permissions
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availablePermissions.map((permission) => (
                  <label
                    key={permission.key}
                    className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={inviteForm.permissions.includes(permission.key)}
                      onChange={() => handlePermissionToggle(permission.key)}
                      className="mt-1 w-4 h-4 text-brand-orange border-gray-300 rounded focus:ring-brand-orange"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gunmetal text-sm">{permission.label}</p>
                      <p className="text-xs text-gunmetal-light">{permission.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gunmetal rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isInviting || !inviteForm.clientName || !inviteForm.clientEmail}
                className="px-6 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isInviting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send Invitation</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Pending Invitations */}
          {pendingInvites.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gunmetal mb-4">Pending Invitations</h3>
              <div className="space-y-3">
                {pendingInvites.map((invite) => (
                  <div key={invite._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gunmetal">{invite.clientEmail}</p>
                        <p className="text-sm text-gunmetal-light">
                          Invited {new Date(invite.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        invite.expiresAt < Date.now() 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {formatExpiryDate(invite.expiresAt)}
                      </span>
                      <div className="text-xs text-gunmetal-light">
                        {invite.permissions.length} permissions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientInviteManager;
