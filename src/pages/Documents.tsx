import React, { useState } from 'react';

interface Document {
  _id: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  clientName?: string;
  loanFileName?: string;
  uploadedBy: string;
  createdAt: number;
  ocrText?: string;
  pageCount?: number;
}

const Documents: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for MVP
  const documents: Document[] = [
    {
      _id: '1',
      fileName: 'Loan Application.pdf',
      mimeType: 'application/pdf',
      fileSize: 2048576,
      status: 'ready',
      clientName: 'John Smith',
      loanFileName: 'REF-001',
      uploadedBy: 'Demo Advisor',
      createdAt: Date.now() - 86400000,
      ocrText: 'Sample OCR text extracted from loan application...',
      pageCount: 5,
    },
    {
      _id: '2',
      fileName: 'Income Verification.pdf',
      mimeType: 'application/pdf',
      fileSize: 1048576,
      status: 'ready',
      clientName: 'Sarah Johnson',
      loanFileName: 'REF-002',
      uploadedBy: 'Demo Advisor',
      createdAt: Date.now() - 172800000,
      ocrText: 'Sample OCR text extracted from income verification...',
      pageCount: 3,
    },
    {
      _id: '3',
      fileName: 'Bank Statement.pdf',
      mimeType: 'application/pdf',
      fileSize: 1536000,
      status: 'processing',
      clientName: 'Mike Davis',
      loanFileName: 'REF-003',
      uploadedBy: 'Demo Advisor',
      createdAt: Date.now() - 3600000,
    },
  ];

  const filteredDocuments = documents.filter(doc =>
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      uploading: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status as keyof typeof statusConfig]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
              <h1 className="text-3xl lg:text-4xl mb-2 font-bold text-gray-800">Documents</h1>
              <p className="text-lg text-gray-600">Manage document uploads and OCR processing</p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
            >
              Upload Document
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search documents by name or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            <option value="">All Statuses</option>
            <option value="uploading">Uploading</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <div key={document._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 truncate">{document.fileName}</h3>
                <p className="text-sm text-gray-500">{document.mimeType}</p>
              </div>
              {getStatusBadge(document.status)}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Size:</span>
                <span className="text-gray-900">{formatFileSize(document.fileSize)}</span>
              </div>
              {document.pageCount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pages:</span>
                  <span className="text-gray-900">{document.pageCount}</span>
                </div>
              )}
              {document.clientName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Client:</span>
                  <span className="text-gray-900">{document.clientName}</span>
                </div>
              )}
              {document.loanFileName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Loan File:</span>
                  <span className="text-gray-900">{document.loanFileName}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uploaded by:</span>
                <span className="text-gray-900">{document.uploadedBy}</span>
              </div>
            </div>
            
            {document.ocrText && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">OCR Text Preview:</h4>
                <p className="text-xs text-gray-600 line-clamp-3">
                  {document.ocrText}
                </p>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {formatDate(document.createdAt)}
              </span>
              <div className="flex space-x-2">
                <button className="text-orange-600 hover:text-orange-900 text-sm">
                  View
                </button>
                <button className="text-gray-600 hover:text-gray-900 text-sm">
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Document</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client (Optional)</label>
                  <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="">Select client</option>
                    <option value="john-smith">John Smith</option>
                    <option value="sarah-johnson">Sarah Johnson</option>
                    <option value="mike-davis">Mike Davis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loan File (Optional)</label>
                  <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="">Select loan file</option>
                    <option value="ref-001">REF-001</option>
                    <option value="ref-002">REF-002</option>
                    <option value="ref-003">REF-003</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Document</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                  >
                    Upload
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

export default Documents;
