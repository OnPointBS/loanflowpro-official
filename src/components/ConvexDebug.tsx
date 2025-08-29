import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const ConvexDebug: React.FC = () => {
  // Try to call a simple query to test the connection
  const testQuery = useQuery(api.clients.listByWorkspace, { workspaceId: "test" });

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-medium text-yellow-800 mb-2">Convex Debug Info</h3>
      <div className="text-xs text-yellow-700 space-y-1">
        <p>Convex URL: {import.meta.env.VITE_CONVEX_URL || 'Not set'}</p>
        <p>Environment: {import.meta.env.MODE}</p>
        <p>Test Query Result: {testQuery ? 'Success' : 'Loading...'}</p>
        <p>API Functions Available:</p>
        <ul className="ml-4 list-disc">
          <li>clients.listByWorkspace: {typeof api.clients.listByWorkspace}</li>
          <li>loanFiles.listByWorkspace: {typeof api.loanFiles.listByWorkspace}</li>
          <li>documents.listByWorkspace: {typeof api.documents.listByWorkspace}</li>
        </ul>
      </div>
    </div>
  );
};

export default ConvexDebug;
