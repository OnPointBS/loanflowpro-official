import React, { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

interface SignInFormProps {
  onClose?: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "check-email">("email");
  const navigate = useNavigate();

  // Try to get the Convex actions, but handle the case when they're not available
  let sendMagicLink: any = null;
  let createDemoAccount: any = null;
  try {
    sendMagicLink = useAction(api.auth.sendMagicLink);
    createDemoAccount = useMutation(api.authMutations.createDemoAccount);
  } catch (err) {
    console.warn("Convex not available:", err);
  }

  const handleDemoAccount = async () => {
    console.log('🚀 Demo account clicked - setting up demo user...');
    
    if (!createDemoAccount) {
      console.error('❌ Demo account creation not available');
      setError("Demo account creation is not available. Please try again later.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔧 Creating demo account in database...');
      const result = await createDemoAccount();
      
      if (result.success) {
        console.log('✅ Demo account created successfully:', result);
        
        // Set demo user in localStorage with real database data
        const demoUser = {
          _id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          isDemo: true,
          sessionToken: "demo-session-token",
          workspaceId: result.workspace.id
        };
        
        localStorage.setItem("demoUser", JSON.stringify(demoUser));
        
        // Dispatch custom event to notify WorkspaceContext of localStorage change
        window.dispatchEvent(new CustomEvent('localStorageChange', {
          detail: { key: 'demoUser', newValue: JSON.stringify(demoUser) }
        }));
        
        console.log('✅ Demo user set in localStorage:', demoUser);
        
        // Close modal if in modal context
        if (onClose) {
          onClose();
        }
        
        // Use React Router navigation instead of window.location
        console.log('🔄 Navigating to dashboard...');
        navigate("/app/dashboard", { replace: true });
      } else {
        throw new Error('Demo account creation failed');
      }
    } catch (error) {
      console.error('❌ Error creating demo account:', error);
      setError("Failed to create demo account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      
      // Check if Convex is available
      if (!sendMagicLink) {
        setError("Authentication service is not available. Please try the demo account or contact support.");
        setIsLoading(false);
        return;
      }
      
      const result = await sendMagicLink({ email });
      
      if (result.success) {
        setStep("check-email");
        setMessage(`✅ Magic link sent! Check your email at ${email} and click the sign-in link.`);
      } else {
        setError("Failed to send magic link");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError(err instanceof Error ? err.message : "Failed to send magic link. Please try the demo account.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setError(null);
    setMessage(null);
  };

  if (step === "check-email") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#D4AF37]/20 mb-4">
            <svg className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Check your email</h3>
          <p className="text-slate-300 text-sm">
            We sent a magic link to your email
          </p>
          
          {message && (
            <div className="mt-4 p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl">
              <p className="text-sm text-[#D4AF37]">{message}</p>
            </div>
          )}
          
          <div className="mt-4">
            <p className="text-xs text-slate-400">
              Click the link in your email to sign in securely. The link will expire in 15 minutes.
            </p>
          </div>
          
          <div className="mt-6">
            <button
              type="button"
              onClick={handleBackToEmail}
              className="w-full bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-[#D4AF37]/50 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              ← Back to email input
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Convex Not Available Warning */}
      {!sendMagicLink && (
        <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-yellow-400">Development Mode</h3>
              <p className="text-sm text-yellow-300 mt-1">Authentication service is not configured. Use the demo account to explore the platform.</p>
            </div>
          </div>
        </div>
      )}

      {/* Email Input Section */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-400">Error</h3>
                <p className="text-sm text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !sendMagicLink}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-slate-900 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <span>Sending Magic Link...</span>
            </div>
          ) : !sendMagicLink ? (
            <span>Authentication Unavailable</span>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Send Magic Link</span>
            </div>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-600/50"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-slate-800 text-slate-400">or</span>
        </div>
      </div>

      {/* Demo Account Section */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-slate-300 font-medium mb-3">Want to explore quickly?</p>
          <button
            type="button"
            onClick={handleDemoAccount}
            className="w-full bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-[#D4AF37]/50 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-xl group-hover:scale-110 transition-transform">🚀</span>
              <span>Try Demo Account (Instant Access)</span>
            </div>
          </button>
          <p className="text-xs text-slate-400 mt-2">No email required • Full access to all features</p>
        </div>
      </div>

      {/* Additional Demo Option */}
      <div className="text-center pt-2">
        <p className="text-slate-400 text-sm">New to LoanFlowPro?</p>
        <button
          type="button"
          onClick={handleDemoAccount}
          className="text-[#D4AF37] hover:text-[#B8941F] font-medium text-sm transition-colors duration-200 hover:underline"
        >
          Try Demo Account
        </button>
      </div>

      {/* Security Note */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-5 h-5 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-400">
              <span className="font-medium text-slate-300">Secure & Private:</span> We use industry-standard encryption and never share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
