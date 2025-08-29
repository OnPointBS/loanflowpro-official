import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { 
  Building, 
  Eye, 
  EyeOff, 
  FileText, 
  CheckCircle, 
  X, 
  Save,
  Settings,
  Shield,
  Users,
  Calendar,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

interface PartnerPermissionManagerProps {
  partnerId: string;
  partnerName: string;
  onClose: () => void;
}

const PartnerPermissionManager: React.FC<PartnerPermissionManagerProps> = ({
  partnerId,
  partnerName,
  onClose
}) => {
  const { user } = useAuth();
  const { workspace } = useWorkspace();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get current partner permissions
  const partnerPermissions = useQuery(api.partners.getPartnerPermissions, {
    workspaceId: workspace?.id || '',
    partnerId: partnerId as any,
  });

  // Update partner permissions mutation
  const updatePartnerPermissions = useMutation(api.partners.updatePartnerPermissions);

  // Available permissions with descriptions
  const availablePermissions = [
    {
      key: 'view_loan_progress',
      label: 'View Loan Progress',
      description: 'See loan application status and current stage',
      icon: TrendingUp,
      category: 'Loan Monitoring'
    },
    {
      key: 'view_client_status',
      label: 'View Client Status',
      description: 'See client information and contact details',
      icon: Users,
      category: 'Client Information'
    },
    {
      key: 'view_documents',
      label: 'View Documents',
      description: 'Access to relevant loan documents (read-only)',
      icon: FileText,
      category: 'Document Access'
    },
    {
      key: 'view_tasks',
      label: 'View Tasks',
      description: 'See tasks and deadlines for loan applications',
      icon: Calendar,
      category: 'Task Management'
    },
    {
      key: 'view_calendar',
      label: 'View Calendar',
      description: 'Access to loan-related calendar events',
      icon: Calendar,
      category: 'Calendar Access'
    },
    {
      key: 'send_messages',
      label: 'Send Messages',
      description: 'Communicate with advisors and clients',
      icon: MessageSquare,
      category: 'Communication'
    },
    {
      key: 'view_analytics',
      label: 'View Analytics',
      description: 'Access to loan performance metrics',
      icon: TrendingUp,
      category: 'Analytics'
    },
    {
      key: 'view_reports',
      label: 'View Reports',
      description: 'Access to loan progress reports',
      icon: FileText,
      category: 'Reporting'
    }
  ];

  // Group permissions by category
  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof availablePermissions>);

  // Initialize permissions when component mounts
  React.useEffect(() => {
    if (partnerPermissions?.permissions) {
      setPermissions(partnerPermissions.permissions);
    }
  }, [partnerPermissions]);

  const handlePermissionToggle = (permissionKey: string) => {
    setPermissions(prev => 
      prev.includes(permissionKey)
        ? prev.filter(p => p !== permissionKey)
        : [...prev, permissionKey]
    );
  };

  const handleSave = async () => {
    if (!workspace?.id) return;
    
    setIsLoading(true);
    try {
      await updatePartnerPermissions({
        partnerId: partnerId as any,
        permissions: permissions,
      });
      
      alert('Partner permissions updated successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to update permissions:', error);
      alert(`Failed to update permissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    setPermissions(availablePermissions.map(p => p.key));
  };

  const handleClearAll = () => {
    setPermissions([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gunmetal">Partner Permissions</h2>
                <p className="text-gunmetal-light">Control what {partnerName} can see and do</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Actions */}
          <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold text-gunmetal">Quick Actions</h3>
              <p className="text-sm text-gunmetal-light">Select common permission sets</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                Select All
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Permissions by Category */}
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([category, perms]) => (
              <div key={category} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gunmetal">{category}</h4>
                </div>
                
                <div className="p-4 space-y-3">
                  {perms.map((permission) => (
                    <div key={permission.key} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={permission.key}
                          checked={permissions.includes(permission.key)}
                          onChange={() => handlePermissionToggle(permission.key)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <permission.icon className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor={permission.key} className="block text-sm font-medium text-gunmetal cursor-pointer">
                          {permission.label}
                        </label>
                        <p className="text-sm text-gunmetal-light">{permission.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {permissions.includes(permission.key) ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Disabled
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-blue-800">Permission Summary</h4>
                <p className="text-sm text-blue-600">
                  {permissions.length} of {availablePermissions.length} permissions enabled
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600">
                  Partner will have {permissions.length === 0 ? 'no' : permissions.length} access level{permissions.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Permissions</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerPermissionManager;
