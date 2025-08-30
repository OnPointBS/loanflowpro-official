import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './auth/AuthProvider';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import WorkspaceLayout from './components/WorkspaceLayout';
import Landing from './pages/Landing';
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import ClientManagement from './pages/features/ClientManagement';
import DocumentManagement from './pages/features/DocumentManagement';
import TaskAutomation from './pages/features/TaskAutomation';
import ReportingAnalytics from './pages/features/ReportingAnalytics';
import ComplianceSecurity from './pages/features/ComplianceSecurity';
import LoanProcessing from './pages/features/LoanProcessing';
import SmallBusiness from './pages/solutions/SmallBusiness';
import Commercial from './pages/solutions/Commercial';
import Consumer from './pages/solutions/Consumer';
import Mortgage from './pages/solutions/Mortgage';
import Enterprise from './pages/solutions/Enterprise';
import Blog from './pages/resources/Blog';
import Guides from './pages/resources/Guides';
import Webinars from './pages/resources/Webinars';
import CaseStudies from './pages/resources/CaseStudies';
import ApiDocs from './pages/resources/ApiDocs';
import HelpCenter from './pages/HelpCenter';
import Status from './pages/Status';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import LoanTypes from './pages/LoanTypes';
import LoanFiles from './pages/LoanFiles';
import Documents from './pages/Documents';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import ClientPortal from './pages/ClientPortal';
import PartnerPortal from './pages/PartnerPortal';
import TestPage from './pages/TestPage';
import { api } from '../convex/_generated/api';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import ConvexErrorBoundary from './components/ConvexErrorBoundary';

// Initialize Convex client with error handling
const convexUrl = import.meta.env.VITE_CONVEX_URL || 'https://loanflowpro.convex.cloud';
console.log('Initializing Convex client with URL:', convexUrl);
console.log('Environment variables:', {
  VITE_CONVEX_URL: import.meta.env.VITE_CONVEX_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV
});

let convex: ConvexReactClient;
try {
  convex = new ConvexReactClient(convexUrl);
  console.log('Convex client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Convex client:', error);
  // Fallback to a default URL if the main one fails
  convex = new ConvexReactClient('https://loanflowpro.convex.cloud');
}

// Simple VerifyEmail component to handle magic link verification (NEW)
const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const inviteType = searchParams.get('inviteType');
  const inviteId = searchParams.get('inviteId');
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const verifyToken = async () => {
      if (!token) { 
        setError('No token provided'); 
        setIsVerifying(false); 
        return; 
      }
      
      try {
        console.log('Magic link token received:', token);
        console.log('Invite type:', inviteType);
        console.log('Invite ID:', inviteId);
        
        // Call the Convex verifyMagicLink function to create/verify user
        const result = await convex.mutation(api.authMutations.verifyMagicLink, { token });
        
        if (result?.success) {
          console.log('User verified successfully:', result.user);
          
          // Store the verified user data
          const authData = {
            isAuthenticated: true,
            user: result.user,
            workspace: result.workspace || { id: 'default', name: 'Default Workspace', status: 'active' },
            sessionToken: result.sessionToken
          };
          
          localStorage.setItem('verifiedUser', JSON.stringify(authData));
          
          // Dispatch custom event to notify WorkspaceContext of localStorage change
          window.dispatchEvent(new CustomEvent('localStorageChange', {
            detail: { key: 'verifiedUser', newValue: JSON.stringify(authData) }
          }));
          
          // Handle different invitation types
          if (inviteType === 'client' && inviteId) {
            // Accept client invitation
            try {
              const inviteResult = await convex.mutation(api.clientInvites.acceptInvite, { 
                inviteId: inviteId as any, 
                userId: result.user._id 
              });
              console.log('Client invitation accepted successfully');
              
              // Get the client ID from the invite result
              if (inviteResult && inviteResult.clientId) {
                // Redirect to client portal with the specific client ID
                navigate(`/client?clientId=${inviteResult.clientId}`, { replace: true });
              } else {
                // Fallback to client portal without specific client ID
                navigate('/client', { replace: true });
              }
            } catch (inviteError) {
              console.error('Failed to accept client invitation:', inviteError);
              // Still navigate to dashboard if invitation acceptance fails
              navigate('/app/dashboard', { replace: true });
            }
          } else if (inviteType === 'partner' && inviteId) {
            // Accept partner invitation
            try {
              await convex.mutation(api.partners.acceptPartnerInvite, { 
                inviteId: inviteId as any, 
                userId: result.user._id 
              });
              console.log('Partner invitation accepted successfully');
              navigate('/app/dashboard', { replace: true }); // Redirect to dashboard
            } catch (inviteError) {
              console.error('Failed to accept partner invitation:', inviteError);
              // Still navigate to dashboard if invitation acceptance fails
              navigate('/app/dashboard', { replace: true });
            }
          } else {
            // Regular sign-in, go to dashboard
            navigate('/app/dashboard', { replace: true });
          }
        } else {
          throw new Error('Verification failed');
        }
      } catch (err) {
        console.error('Verification failed:', err);
        setError('Verification failed. Please try again.');
        setIsVerifying(false);
      }
    };
    
    verifyToken();
  }, [token, inviteType, inviteId, navigate]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-orange/10 to-gunmetal/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-orange mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gunmetal mb-2">Verifying your email...</h2>
          <p className="text-gunmetal-light">Please wait while we verify your magic link.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-orange/10 to-gunmetal/10">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gunmetal mb-4">Verification Failed</h2>
          <p className="text-gunmetal-light mb-6">{error}</p>
          <button
            onClick={() => navigate('/signin')}
            className="bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return null;
};

function App() {
  console.log('App component rendering...');
  console.log('Convex client:', convex);
  
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ConvexErrorBoundary>
          <ConvexProvider client={convex}>
            <ConvexAuthProvider client={convex}>
            <Router>
              <AuthProvider>
                <WorkspaceProvider>
                <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signin" element={<Login />} />
                <Route path="/verify" element={<VerifyEmail />} />
                <Route path="/test" element={<TestPage />} />
                
                {/* Feature detail pages */}
                <Route path="/features/client-management" element={<ClientManagement />} />
                <Route path="/features/document-management" element={<DocumentManagement />} />
                <Route path="/features/task-automation" element={<TaskAutomation />} />
                <Route path="/features/loan-processing" element={<LoanProcessing />} />
                <Route path="/features/reporting-analytics" element={<ReportingAnalytics />} />
                <Route path="/features/compliance-security" element={<ComplianceSecurity />} />
                
                {/* Solutions pages */}
                <Route path="/solutions/small-business" element={<SmallBusiness />} />
                <Route path="/solutions/commercial" element={<Commercial />} />
                <Route path="/solutions/consumer" element={<Consumer />} />
                <Route path="/solutions/mortgage" element={<Mortgage />} />
                <Route path="/solutions/enterprise" element={<Enterprise />} />
                
                {/* Resources pages */}
                <Route path="/resources/blog" element={<Blog />} />
                <Route path="/resources/guides" element={<Guides />} />
                <Route path="/resources/webinars" element={<Webinars />} />
                <Route path="/resources/case-studies" element={<CaseStudies />} />
                <Route path="/resources/api-docs" element={<ApiDocs />} />
                
                {/* Support pages */}
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/status" element={<Status />} />
                
                {/* Protected routes */}
                <Route path="/app" element={
                  <ProtectedRoute>
                    <WorkspaceLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="loan-types" element={<LoanTypes />} />
                  <Route path="loan-files" element={<LoanFiles />} />
                  <Route path="documents" element={<Documents />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="billing" element={<Billing />} />
                </Route>
                
                {/* Portal routes */}
                <Route path="/client" element={<ClientPortal />} />
                <Route path="/partner" element={<PartnerPortal />} />
                
                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
                </WorkspaceProvider>
              </AuthProvider>
            </Router>
                      </ConvexAuthProvider>
          </ConvexProvider>
        </ConvexErrorBoundary>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
