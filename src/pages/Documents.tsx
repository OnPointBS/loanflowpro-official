import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  RotateCw,
  Crop,
  Edit3,
  User,
  Calendar,
  Image,
  FileText as FileTextIcon
} from 'lucide-react';

interface Document {
  _id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: 'uploading' | 'processing' | 'ready' | 'error' | 'pending_review' | 'approved' | 'rejected';
  clientId?: string;
  clientName?: string;
  taskId?: string;
  taskName?: string;
  uploadedBy: string;
  uploadedAt: number;
  createdAt: number;
  ocrText?: string;
  pageCount?: number;
}

const Documents: React.FC = () => {
  const { user, workspace } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Get real documents from the database
  const documents = useQuery(api.documents.listByWorkspace, {
    workspaceId: workspace?.id || '',
  }) || [];

  // Get client information for documents
  const clients = useQuery(api.clients.listByWorkspace, {
    workspaceId: workspace?.id || '',
  }) || [];

  // Get task information for documents
  const tasks = useQuery(api.tasks.listByWorkspace, {
    workspaceId: workspace?.id || '',
  }) || [];

  // Get user information for uploadedBy
  const users = useQuery(api.users.listByWorkspace, {
    workspaceId: workspace?.id || '',
  }) || [];

  // Mutations
  const updateDocumentStatus = useMutation(api.documents.updateStatus);
  const updateDocument = useMutation(api.documents.updateDocument);

  // Process documents with additional information
  const processedDocuments: Document[] = React.useMemo(() => {
    if (!documents || !clients || !tasks || !users) return [];

    return documents.map((doc: any) => {
      const client = clients.find((c: any) => c._id === doc.clientId);
      const task = tasks.find((t: any) => t._id === doc.taskId);
      const uploader = users.find((u: any) => u._id === doc.uploadedBy);

      return {
        ...doc,
        clientName: client?.name || 'Unknown Client',
        taskName: task?.title || 'No Task',
        uploadedBy: uploader?.name || 'Unknown User',
      };
    });
  }, [documents, clients, tasks, users]);

  // Filter documents
  const filteredDocuments = processedDocuments.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.taskName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || doc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      uploading: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      pending_review: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    
    const statusLabels = {
      uploading: 'Uploading',
      processing: 'Processing',
      ready: 'Ready',
      error: 'Error',
      pending_review: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status as keyof typeof statusConfig]}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
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

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileTextIcon className="h-5 w-5 text-red-500" />;
    if (fileType.includes('image')) return <Image className="h-5 w-5 text-green-500" />;
    return <FileTextIcon className="h-5 w-5 text-blue-500" />;
  };

  const handleStatusChange = async (documentId: string, newStatus: string) => {
    try {
      await updateDocumentStatus({
        documentId: documentId as any,
        status: newStatus as any,
      });
    } catch (error) {
      console.error('Error updating document status:', error);
    }
  };

  const openViewModal = (document: Document) => {
    setSelectedDocument(document);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedDocument(null);
    setIsViewModalOpen(false);
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
              placeholder="Search documents by name, client, or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Statuses</option>
            <option value="uploading">Uploading</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="pending_review">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

            {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <div key={document._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getFileIcon(document.fileType)}
                  <h3 className="text-lg font-medium text-gray-900 truncate">{document.fileName}</h3>
                </div>
                <p className="text-sm text-gray-500">{document.fileType}</p>
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
              {document.taskName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Task:</span>
                  <span className="text-gray-900">{document.taskName}</span>
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
                {formatDate(document.uploadedAt || document.createdAt)}
              </span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => openViewModal(document)}
                  className="text-orange-600 hover:text-orange-900 text-sm flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button className="text-gray-600 hover:text-gray-900 text-sm flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document View Modal */}
      {isViewModalOpen && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Document Review</h2>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Document Preview */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Document Preview</h3>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <div className="text-gray-500 mb-2">
                      {getFileIcon(selectedDocument.fileType)}
                    </div>
                    <p className="text-sm text-gray-600">{selectedDocument.fileName}</p>
                    <p className="text-xs text-gray-500">{selectedDocument.fileType}</p>
                  </div>
                </div>
                
                {/* Document Details & Actions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Document Details</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span>{getStatusBadge(selectedDocument.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client:</span>
                      <span className="text-gray-900">{selectedDocument.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Task:</span>
                      <span className="text-gray-900">{selectedDocument.taskName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="text-gray-900">{formatFileSize(selectedDocument.fileSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uploaded:</span>
                      <span className="text-gray-900">{formatDate(selectedDocument.uploadedAt || selectedDocument.createdAt)}</span>
                    </div>
                  </div>
                  
                  {/* Status Management */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Update Status</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleStatusChange(selectedDocument._id, 'approved')}
                        disabled={selectedDocument.status === 'approved'}
                        className="px-3 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center space-x-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedDocument._id, 'rejected')}
                        disabled={selectedDocument.status === 'rejected'}
                        className="px-3 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center space-x-1"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedDocument._id, 'pending_review')}
                        disabled={selectedDocument.status === 'pending_review'}
                        className="px-3 py-2 bg-orange-100 text-orange-800 rounded-md hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center space-x-1"
                      >
                        <Clock className="h-4 w-4" />
                        <span>Mark for Review</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Document Actions */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Document Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm flex items-center space-x-1">
                        <RotateCw className="h-4 w-4" />
                        <span>Rotate</span>
                      </button>
                      <button className="px-3 py-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 text-sm flex items-center space-x-1">
                        <Crop className="h-4 w-4" />
                        <span>Crop</span>
                      </button>
                      <button className="px-3 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 text-sm flex items-center space-x-1">
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* OCR Text */}
                  {selectedDocument.ocrText && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">OCR Text</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-700">{selectedDocument.ocrText}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Documents;
