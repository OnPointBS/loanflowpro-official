import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../auth/AuthProvider';
import { Mail, UserPlus, Eye, EyeOff, CheckCircle, Clock, X, Users, Building } from 'lucide-react';

interface ClientInviteManagerProps {
  onClose: () => void;
}

const ClientInviteManager: React.FC<ClientInviteManagerProps> = ({ onClose }) => {
  const { workspace, user } = useAuth();
  const [isInviting, setIsInviting] = useState(false);
  const [inviteType, setInviteType] = useState<'client' | 'partner'>('client');
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    role: '',
    permissions: [] as string[],
  });

  // Available permissions for clients
  const clientPermissions = [
    { key: 'view_loan_files', label: 'View Loan Files', description: 'See loan application status and details' },
    { key: 'view_documents', label: 'View Documents', description: 'Access uploaded documents and forms' },
    { key: 'view_tasks', label: 'View Tasks', description: 'See assigned tasks and deadlines' },
    { key: 'view_analytics', label: 'View Analytics', description: 'Access loan progress analytics' },
    { key: 'upload_documents', label: 'Upload Documents', description: 'Upload required documents' },
    { key: 'send_messages', label: 'Send Messages', description: 'Send messages to your advisor' },
  ];

  // Available permissions for partners
  const partnerPermissions = [
    { key: 'view_loan_progress', label: 'View Loan Progress', description: 'Monitor loan application stages and milestones' },
    { key: 'view_client_status', label: 'View Client Status', description: 'See client information and loan status' },
    { key: 'view_documents', label: 'View Documents', description: 'Access relevant documents (read-only)' },
    { key: 'view_timeline', label: 'View Timeline', description: 'See loan processing timeline and deadlines' },
    { key: 'receive_notifications', label: 'Receive Notifications', description: 'Get updates on important milestones' },
    { key: 'view_analytics', label: 'View Analytics', description: 'Access loan progress analytics' },
  ];

  // Get pending invitations
  const pendingClientInvites = useQuery(api.clientInvites.getPendingInvites, {
    workspaceId: workspace?.id || '',
  }) || [];

  const pendingPartnerInvites = useQuery(api.partners.getPendingPartnerInvites, {
    workspaceId: workspace?.id || '',
  }) || [];

  // Get all invitations to show status
  const allClientInvites = useQuery(api.clientInvites.getAllInvites, {
    workspaceId: workspace?.id || '',
  }) || [];

  const allPartnerInvites = useQuery(api.partners.getAllPartnerInvites, {
    workspaceId: workspace?.id || '',
  }) || [];

  // Mutations
  const createClientInvite = useMutation(api.clientInvites.createInvite);
  const createPartnerInvite = useMutation(api.partners.createPartnerInvite);
  const deleteClientInvite = useMutation(api.clientInvites.deleteInvite);
  const deletePartnerInvite = useMutation(api.partners.deletePartnerInvite);
  const resendClientInvite = useMutation(api.clientInvites.resendInvite);
  const resendPartnerInvite = useMutation(api.partners.resendPartnerInvite);

  const handlePermissionToggle = (permissionKey: string) => {
    setInviteForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(p => p !== permissionKey)
        : [...prev.permissions, permissionKey]
    }));
  };

  const handleDeleteInvite = async (inviteId: string, type: 'client' | 'partner') => {
    if (!confirm('Are you sure you want to delete this invitation?')) return;
    
    try {
      if (type === 'client') {
        await deleteClientInvite({ inviteId: inviteId as any });
      } else {
        await deletePartnerInvite({ inviteId: inviteId as any });
      }
      alert('Invitation deleted successfully');
    } catch (error) {
      console.error('Failed to delete invitation:', error);
      alert(`Failed to delete invitation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleResendInvite = async (inviteId: string, type: 'client' | 'partner') => {
    try {
      if (type === 'client') {
        await resendClientInvite({ inviteId: inviteId as any });
      } else {
        await resendPartnerInvite({ inviteId: inviteId as any });
      }
      alert('Invitation resent successfully');
    } catch (error) {
      console.error('Failed to resend invitation:', error);
      alert(`Failed to resend invitation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      accepted: { color: 'bg-green-100 text-green-800', label: 'Accepted' },
      declined: { color: 'bg-red-100 text-red-800', label: 'Declined' },
      expired: { color: 'bg-gray-100 text-gray-800', label: 'Expired' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace?.id || !user?._id) return;

    setIsInviting(true);
    try {
      if (inviteType === 'client') {
        await createClientInvite({
          workspaceId: workspace.id,
          clientEmail: inviteForm.email,
          clientName: inviteForm.name,
          invitedBy: user._id,
          permissions: inviteForm.permissions,
        });
      } else {
        await createPartnerInvite({
          workspaceId: workspace.id,
          partnerEmail: inviteForm.email,
          partnerName: inviteForm.name,
          partnerRole: inviteForm.role || 'Partner',
          company: inviteForm.company,
          phone: inviteForm.phone,
          invitedBy: user._id,
          permissions: inviteForm.permissions,
        });
      }

      // Reset form
      setInviteForm({
        name: '',
        email: '',
        company: '',
        phone: '',
        role: '',
        permissions: [],
      });

      // Show success message
      const typeLabel = inviteType === 'client' ? 'Client' : 'Partner';
      alert(`${typeLabel} invitation sent successfully! An email will be sent to ${inviteForm.email} with instructions to join the portal.`);
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

  const currentPermissions = inviteType === 'client' ? clientPermissions : partnerPermissions;
  const pendingInvites = inviteType === 'client' ? pendingClientInvites : pendingPartnerInvites;

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
              <h2 className="text-xl font-semibold text-gunmetal">Invite to Portal</h2>
              <p className="text-sm text-gunmetal-light">Give access to clients or partners</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Invite Type Selector */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setInviteType('client')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                inviteType === 'client'
                  ? 'bg-brand-orange text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Client</span>
            </button>
            <button
              onClick={() => setInviteType('partner')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                inviteType === 'partner'
                  ? 'bg-brand-orange text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Partner</span>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {inviteType === 'client' 
              ? 'Clients are borrowers who need access to their loan information and tasks.'
              : 'Partners are professionals (like real estate agents) who need to monitor loan progress.'
            }
          </p>
        </div>

        {/* Invite Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {inviteType === 'client' ? 'Client Name' : 'Partner Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  placeholder={inviteType === 'client' ? 'John Doe' : 'Jane Smith'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              {inviteType === 'partner' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={inviteForm.company}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      placeholder="Real Estate Agency"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      placeholder="Real Estate Agent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={inviteForm.phone}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Permissions
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentPermissions.map((permission) => (
                  <label key={permission.key} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inviteForm.permissions.includes(permission.key)}
                      onChange={() => handlePermissionToggle(permission.key)}
                      className="mt-1 h-4 w-4 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{permission.label}</div>
                      <div className="text-xs text-gray-500">{permission.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isInviting}
                className="px-6 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
        </div>

        {/* All Invitations */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gunmetal mb-4">
            All Invitations
          </h3>
          
          {/* Client Invitations */}
          {allClientInvites.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-gunmetal mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Client Invitations ({allClientInvites.length})
              </h4>
              <div className="space-y-3">
                {allClientInvites.map((invite) => (
                  <div key={invite._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-brand-orange/20 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-brand-orange" />
                      </div>
                      <div>
                        <p className="font-medium text-gunmetal">{invite.clientEmail}</p>
                        <p className="text-sm text-gray-500">
                          Invited {new Date(invite.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(invite.status)}
                      <span className="text-sm text-gray-500">
                        {formatExpiryDate(invite.expiresAt)}
                      </span>
                      {invite.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleResendInvite(invite._id, 'client')}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded transition-colors duration-200"
                            title="Resend invitation"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteInvite(invite._id, 'client')}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                            title="Delete invitation"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partner Invitations */}
          {allPartnerInvites.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-gunmetal mb-3 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Partner Invitations ({allPartnerInvites.length})
              </h4>
              <div className="space-y-3">
                {allPartnerInvites.map((invite) => (
                  <div key={invite._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Building className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gunmetal">{invite.partnerEmail}</p>
                        <p className="text-sm text-gray-500">
                          Invited {new Date(invite.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(invite.status)}
                      <span className="text-sm text-gray-500">
                        {formatExpiryDate(invite.expiresAt)}
                      </span>
                      {invite.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleResendInvite(invite._id, 'partner')}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded transition-colors duration-200"
                            title="Resend invitation"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteInvite(invite._id, 'partner')}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                            title="Delete invitation"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {allClientInvites.length === 0 && allPartnerInvites.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📧</div>
              <p className="text-gunmetal-light mb-2">No invitations yet</p>
              <p className="text-sm text-gray-500">Invitations will appear here once you send them</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientInviteManager;
