import React from 'react';

const TestPage: React.FC = () => {
  console.log('TestPage rendering...');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Test Page</h1>
        <p className="text-gray-600 mb-6">If you can see this, the app is working!</p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <div className="text-left space-y-2">
            <p><strong>NODE_ENV:</strong> {import.meta.env.NODE_ENV}</p>
            <p><strong>VITE_APP_ENV:</strong> {import.meta.env.VITE_APP_ENV}</p>
            <p><strong>VITE_CONVEX_URL:</strong> {import.meta.env.VITE_CONVEX_URL || 'Not set'}</p>
            <p><strong>Current URL:</strong> {window.location.href}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
          </div>
        </div>
        <div className="mt-6">
          <a 
            href="/app/clients" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mr-2"
          >
            Go to Clients
          </a>
          <a 
            href="/" 
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
