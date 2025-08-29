import React from 'react';
import { WorkspaceProvider } from '../contexts/WorkspaceContext';
import WorkspaceLayout from './WorkspaceLayout';

const Layout: React.FC = () => {
  return (
    <WorkspaceProvider>
      <WorkspaceLayout />
    </WorkspaceProvider>
  );
};

export default Layout;
