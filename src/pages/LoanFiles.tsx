import React, { useState } from 'react';

interface LoanFile {
  _id: string;
  clientName: string;
  loanType: string;
  status: 'draft' | 'in_progress' | 'under_review' | 'approved' | 'closed';
  currentStage: string;
  advisor: string;
  createdAt: number;
  updatedAt: number;
}

const LoanFiles: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock data for MVP
  const loanFiles: LoanFile[] = [
    {
      _id: '1',
      clientName: 'John Smith',
      loanType: 'Conventional Mortgage',
      status: 'under_review',
      currentStage: 'Underwriting',
      advisor: 'Demo Advisor',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 3600000,
    },
    {
      _id: '2',
      clientName: 'Sarah Johnson',
      loanType: 'FHA Loan',
      status: 'in_progress',
      currentStage: 'Application',
      advisor: 'Demo Advisor',
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 7200000,
    },
    {
      _id: '3',
      clientName: 'Mike Davis',
      loanType: 'Business Line of Credit',
      status: 'draft',
      currentStage: 'Application',
      advisor: 'Demo Advisor',
      createdAt: Date.now() - 259200000,
      updatedAt: Date.now() - 86400000,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      closed: 'bg-purple-100 text-purple-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status as keyof typeof statusConfig]}`}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Premium Header */}
      <div className="relative animate-fade-in-down">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 to-brand-orange-dark/10 rounded-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl mb-2 font-bold text-gray-800">Loan Files</h1>
              <p className="text-lg text-gray-600">Manage your active loan applications and files</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
            >
              Create Loan File
            </button>
          </div>
        </div>
      </div>

      {/* Loan Files Table */}
      <div className="relative animate-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl transition-all duration-300"></div>
        <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">
              {loanFiles.length} Loan File{loanFiles.length !== 1 ? 's' : ''}
            </h3>
          </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Advisor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loanFiles.map((loanFile) => (
                <tr key={loanFile._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{loanFile.clientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{loanFile.loanType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(loanFile.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{loanFile.currentStage}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{loanFile.advisor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(loanFile.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-orange-600 hover:text-orange-900 mr-3">
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

      {/* Create Loan File Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Loan File</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client</label>
                  <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="">Select client</option>
                    <option value="john-smith">John Smith</option>
                    <option value="sarah-johnson">Sarah Johnson</option>
                    <option value="mike-davis">Mike Davis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loan Type</label>
                  <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="">Select loan type</option>
                    <option value="conventional">Conventional Mortgage</option>
                    <option value="fha">FHA Loan</option>
                    <option value="business">Business Line of Credit</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                  >
                    Create Loan File
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanFiles;
