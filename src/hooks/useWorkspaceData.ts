import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';

// Mock data for development
const mockData = {
  entitlements: {
    seats: 5,
    activeClients: 50,
    storageBytes: 200 * 1024 * 1024 * 1024, // 200 GB
    documentsHub: true,
    lenderExportBranding: true,
    customLinks: true,
  },
  storageUsage: {
    bytes: 2.4 * 1024 * 1024 * 1024, // 2.4 GB
    updatedAt: Date.now(),
  },
  activeClients: [
    { _id: 'client_1', name: 'Mike Wilson', email: 'mike@example.com', status: 'active' },
    { _id: 'client_2', name: 'Sarah Johnson', email: 'sarah@example.com', status: 'active' },
  ],
  openTasks: [
    { _id: 'task_1', title: 'Review DSCR & eligibility', status: 'open', priority: 'high', dueAt: Date.now() + 86400000 },
    { _id: 'task_2', title: 'Rate lock decision', status: 'open', priority: 'medium', dueAt: Date.now() + 172800000 },
  ],
  overdueTasks: [
    { _id: 'task_3', title: 'Tax returns upload', status: 'open', priority: 'high', dueAt: Date.now() - 86400000 },
  ],
};

export function useWorkspaceData() {
  const { workspace } = useAuth();
  const [data, setData] = useState(mockData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (workspace) {
      // Simulate API call
      setTimeout(() => {
        setData(mockData);
        setIsLoading(false);
      }, 500);
    }
  }, [workspace]);

  return {
    entitlements: data.entitlements,
    storageUsage: data.storageUsage,
    activeClients: data.activeClients,
    openTasks: data.openTasks,
    overdueTasks: data.overdueTasks,
    isLoading,
  };
}

export function useClients() {
  const { workspace } = useAuth();
  const [clients, setClients] = useState(mockData.activeClients);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (workspace) {
      setTimeout(() => {
        setClients(mockData.activeClients);
        setIsLoading(false);
      }, 500);
    }
  }, [workspace]);

  const createClient = async (clientData: any) => {
    // Simulate client creation
    const newClient = {
      _id: `client_${Date.now()}`,
      ...clientData,
      status: 'active',
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  return {
    clients,
    createClient,
    isLoading,
  };
}

export function useLoanTypes() {
  const { workspace } = useAuth();
  const [loanTypes, setLoanTypes] = useState([
    { _id: 'type_1', name: 'SBA 7(a)', description: 'Small Business Administration loan' },
    { _id: 'type_2', name: 'Business LOC', description: 'Business Line of Credit' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (workspace) {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [workspace]);

  const createLoanType = async (loanTypeData: any) => {
    const newLoanType = {
      _id: `type_${Date.now()}`,
      ...loanTypeData,
    };
    setLoanTypes(prev => [...prev, newLoanType]);
    return newLoanType;
  };

  return {
    loanTypes,
    createLoanType,
    isLoading,
  };
}

export function useLoanFiles() {
  const { workspace } = useAuth();
  const [loanFiles, setLoanFiles] = useState([
    { _id: 'file_1', clientName: 'Mike Wilson', loanType: 'SBA 7(a)', status: 'active' },
    { _id: 'file_2', clientName: 'Sarah Johnson', loanType: 'Business LOC', status: 'active' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (workspace) {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [workspace]);

  const createLoanFile = async (loanFileData: any) => {
    const newLoanFile = {
      _id: `file_${Date.now()}`,
      ...loanFileData,
      status: 'active',
    };
    setLoanFiles(prev => [...prev, newLoanFile]);
    return newLoanFile;
  };

  return {
    loanFiles,
    createLoanFile,
    isLoading,
  };
}
