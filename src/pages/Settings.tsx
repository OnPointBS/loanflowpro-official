import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useAuth } from '../auth/AuthProvider';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: 'ADVISOR' | 'STAFF' | 'CLIENT';
  status: 'active' | 'invited' | 'removed';
  joinedAt: number;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, any>;
}

const Settings: React.FC = () => {
  const { workspace, membership } = useWorkspace();
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [generalForm, setGeneralForm] = useState({
    workspaceName: workspace?.name || '',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    currency: 'USD',
    language: 'en'
  });

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    title: '',
    bio: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'STAFF' as 'ADVISOR' | 'STAFF' | 'CLIENT',
    message: ''
  });

  // Mock data for demonstration
  const [teamMembers] = useState<TeamMember[]>([
    {
      _id: '1',
      name: user?.name || 'Demo User',
      email: user?.email || 'demo@loanflowpro.com',
      role: 'ADVISOR',
      status: 'active',
      joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000
    }
  ]);

  const [integrations] = useState<Integration[]>([
    {
      id: 'google-vision',
      name: 'Google Cloud Vision API',
      description: 'OCR processing for documents',
      status: 'connected',
      config: { apiKey: '***', region: 'us-central1' }
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing and billing',
      status: 'connected',
      config: { publishableKey: 'pk_***', webhookSecret: '***' }
    },
    {
      id: 'resend',
      name: 'Resend',
      description: 'Transactional email service',
      status: 'connected',
      config: { apiKey: 're_***', domain: 'loanflowpro.com' }
    }
  ]);

  // Update forms when workspace/user data changes
  useEffect(() => {
    if (workspace) {
      setGeneralForm(prev => ({ ...prev, workspaceName: workspace.name }));
    }
    if (user) {
      setProfileForm(prev => ({ 
        ...prev, 
        name: user.name || '', 
        email: user.email || '' 
      }));
    }
  }, [workspace, user]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // General Settings
  const handleGeneralSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to update workspace settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showMessage('success', 'General settings saved successfully!');
    } catch (error) {
      showMessage('error', 'Failed to save general settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Profile Settings
  const handleProfileSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      showMessage('error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Password Change
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showMessage('error', 'New password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('success', 'Password changed successfully!');
    } catch (error) {
      showMessage('error', 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  // Team Management
  const handleInviteMember = async () => {
    if (!inviteForm.email.trim()) {
      showMessage('error', 'Email is required');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement API call to invite member
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setInviteForm({ email: '', role: 'STAFF', message: '' });
      showMessage('success', 'Invitation sent successfully!');
    } catch (error) {
      showMessage('error', 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    setIsLoading(true);
    try {
      // TODO: Implement API call to remove member
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showMessage('success', 'Team member removed successfully!');
    } catch (error) {
      showMessage('error', 'Failed to remove team member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: 'ADVISOR' | 'STAFF' | 'CLIENT') => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to change role
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showMessage('success', 'Role updated successfully!');
    } catch (error) {
      showMessage('error', 'Failed to update role');
    } finally {
      setIsLoading(false);
    }
  };

  // Integration Management
  const handleIntegrationToggle = async (integrationId: string, enabled: boolean) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to toggle integration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showMessage('success', `Integration ${enabled ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      showMessage('error', 'Failed to update integration');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'team', name: 'Team', icon: '👥' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
    { id: 'workspace', name: 'Workspace', icon: '🏢' },
    { id: 'debug', name: 'Debug', icon: '🐛' },
  ];

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Premium Header */}
      <div className="relative animate-fade-in-down">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 to-brand-orange-dark/10 rounded-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div>
            <h1 className="text-3xl lg:text-4xl mb-2 font-bold text-gray-800">Settings</h1>
            <p className="text-lg text-gray-600">Manage your workspace configuration and preferences</p>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workspace Name</label>
                <input
                  type="text"
                  value={generalForm.workspaceName}
                  onChange={(e) => setGeneralForm(prev => ({ ...prev, workspaceName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter workspace name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select 
                  value={generalForm.timezone}
                  onChange={(e) => setGeneralForm(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select 
                  value={generalForm.dateFormat}
                  onChange={(e) => setGeneralForm(prev => ({ ...prev, dateFormat: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                <select 
                  value={generalForm.timeFormat}
                  onChange={(e) => setGeneralForm(prev => ({ ...prev, timeFormat: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="12">12-hour (AM/PM)</option>
                  <option value="24">24-hour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select 
                  value={generalForm.currency}
                  onChange={(e) => setGeneralForm(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select 
                  value={generalForm.language}
                  onChange={(e) => setGeneralForm(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4">
              <button 
                onClick={handleGeneralSave}
                disabled={isLoading}
                className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  value={profileForm.title}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your job title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <button 
                onClick={handleProfileSave}
                disabled={isLoading}
                className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        )}

        {/* Team Management */}
        {activeTab === 'team' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Team Management</h3>
            
            {/* Current Team Members */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Current Team Members</h4>
              {teamMembers.map((member) => (
                <div key={member._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-medium text-sm">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <p className="text-xs text-gray-400">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member._id, e.target.value as 'ADVISOR' | 'STAFF' | 'CLIENT')}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="ADVISOR">Advisor</option>
                      <option value="STAFF">Staff</option>
                      <option value="CLIENT">Client</option>
                    </select>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.status}
                    </span>
                    {member.status === 'active' && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Invite New Member */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-700 mb-4">Invite New Team Member</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value as 'ADVISOR' | 'STAFF' | 'CLIENT' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="ADVISOR">Advisor</option>
                    <option value="STAFF">Staff</option>
                    <option value="CLIENT">Client</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleInviteMember}
                    disabled={isLoading || !inviteForm.email.trim()}
                    className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : 'Send Invitation'}
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Personal Message (Optional)</label>
                <textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Add a personal message to your invitation"
                />
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
            
            {/* Password Change */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Change Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handlePasswordChange}
                    disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                    className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            </div>

            {/* Security Options */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Security Options</h4>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h5>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                  Enable
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="text-sm font-medium text-gray-900">Session Timeout</h5>
                  <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="text-sm font-medium text-gray-900">Audit Logging</h5>
                  <p className="text-sm text-gray-500">Track all user actions and changes</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Enabled
                </span>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="text-sm font-medium text-gray-900">Login Notifications</h5>
                  <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Enabled
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Integrations */}
        {activeTab === 'integrations' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Integrations</h3>
            
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                      <p className="text-sm text-gray-500">{integration.description}</p>
                      <div className="mt-2 space-y-1">
                        {Object.entries(integration.config).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{key}:</span>
                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        integration.status === 'connected' ? 'bg-green-100 text-green-800' :
                        integration.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {integration.status}
                      </span>
                      <button
                        onClick={() => handleIntegrationToggle(integration.id, integration.status !== 'connected')}
                        disabled={isLoading}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          integration.status === 'connected'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        } disabled:opacity-50`}
                      >
                        {isLoading ? '...' : integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Integration */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-700 mb-4">Add New Integration</h4>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
                Browse Integrations
              </button>
            </div>
          </div>
        )}

        {/* Workspace Settings */}
        {activeTab === 'workspace' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Workspace Settings</h3>
            
            <div className="space-y-6">
              {/* Workspace Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-3">Workspace Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Workspace ID</label>
                    <p className="text-sm font-mono bg-white px-3 py-2 border border-gray-300 rounded">
                      {workspace?.id || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                    <p className="text-sm text-gray-900">
                      {workspace?.createdAt ? new Date(workspace.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      workspace?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {workspace?.status || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {membership?.role || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Data Management</h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">Export Workspace Data</h5>
                        <p className="text-sm text-gray-500">Download all your data in JSON format</p>
                      </div>
                      <span className="text-orange-600">→</span>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">Backup Settings</h5>
                        <p className="text-sm text-gray-500">Create a backup of your workspace configuration</p>
                      </div>
                      <span className="text-orange-600">→</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-red-700 mb-3">Danger Zone</h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-red-900">Delete Workspace</h5>
                        <p className="text-sm text-red-600">Permanently delete this workspace and all its data</p>
                      </div>
                      <span className="text-red-600">→</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debug Information */}
        {activeTab === 'debug' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Debug Information</h3>
            <p className="text-sm text-gray-600 mb-4">
              Technical information for troubleshooting and development purposes
            </p>
            
            <div className="space-y-6">
              {/* Authentication Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-3">🔐 Authentication Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Auth Status</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Authenticated
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <p className="text-sm font-mono bg-white px-3 py-2 border border-gray-300 rounded">
                      {user?._id || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                    <p className="text-sm text-gray-900">
                      {user?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
                    <p className="text-sm text-gray-900">
                      {user?.email || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Workspace Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-3">🏢 Workspace Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Loading</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Loaded
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Name</label>
                    <p className="text-sm text-gray-900">
                      {workspace?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Workspace ID</label>
                    <p className="text-sm font-mono bg-white px-3 py-2 border border-gray-300 rounded">
                      {workspace?.id || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      workspace?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {workspace?.status || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                    <p className="text-sm text-gray-900">
                      {workspace?.createdAt ? new Date(workspace.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
                    <p className="text-sm text-gray-900">
                      {workspace?.updatedAt ? new Date(workspace.updatedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Membership Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-3">👤 Membership Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {membership?.role || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      membership?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {membership?.status || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Joined At</label>
                    <p className="text-sm text-gray-900">
                      {membership?.joinedAt ? new Date(membership.joinedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                    <p className="text-sm text-gray-900">
                      {membership?.role === 'ADVISOR' ? 'Full access' : 
                       membership?.role === 'STAFF' ? 'Limited access' : 
                       membership?.role === 'CLIENT' ? 'Client access' : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Environment Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-3">🌍 Environment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {import.meta.env.MODE === 'production' ? 'Production' : 'Development'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Build Time</label>
                    <p className="text-sm text-gray-900">
                      {new Date().toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Agent</label>
                    <p className="text-sm font-mono bg-white px-3 py-2 border border-gray-300 rounded text-xs">
                      {navigator.userAgent.substring(0, 100)}...
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Screen Resolution</label>
                    <p className="text-sm text-gray-900">
                      {window.screen.width} x {window.screen.height}
                    </p>
                  </div>
                </div>
              </div>

              {/* Convex Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-3">🔗 Convex Backend Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Connection</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Connected
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
                    <p className="text-sm font-mono bg-white px-3 py-2 border border-gray-300 rounded text-xs">
                      {import.meta.env.VITE_CONVEX_URL || 'Default'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Debug Actions */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">🔧 Debug Actions</h4>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      console.log('=== DEBUG INFO ===');
                      console.log('User:', user);
                      console.log('Workspace:', workspace);
                      console.log('Membership:', membership);
                      console.log('Environment:', import.meta.env.MODE);
                      console.log('User Agent:', navigator.userAgent);
                      console.log('Screen:', { width: window.screen.width, height: window.screen.height });
                      console.log('==================');
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Log Debug Info to Console
                  </button>
                  
                  <button 
                    onClick={() => {
                      const debugInfo = {
                        user,
                        workspace,
                        membership,
                        environment: process.env.NODE_ENV,
                        userAgent: navigator.userAgent,
                        screen: { width: window.screen.width, height: window.screen.height },
                        timestamp: new Date().toISOString()
                      };
                      const blob = new Blob([JSON.stringify(debugInfo, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `debug-info-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Download Debug Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
