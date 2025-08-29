import React from 'react';
import { Helmet } from 'react-helmet-async';
import ProfessionalNav from '../../components/ProfessionalNav';
import { Link } from 'react-router-dom';

export default function ClientManagement() {
  return (
    <>
      <Helmet>
        <title>Client Management Software - LoanFlowPro | Organize & Track Clients</title>
        <meta name="description" content="LoanFlowPro's client management software helps you organize and track all your clients in one centralized system. Comprehensive profiles, communication history, and relationship management tools." />
        <meta name="keywords" content="client management software, loan client management, client relationship management, lending CRM, mortgage client management, financial client tracking" />
        <link rel="canonical" href="https://loanflowpro.com/features/client-management" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Client Management Software - LoanFlowPro" />
        <meta property="og:description" content="Organize and track all your clients in one centralized system with comprehensive profiles and relationship management tools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/features/client-management" />
        <meta property="og:image" content="https://loanflowpro.com/client-management-og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Client Management Software - LoanFlowPro" />
        <meta name="twitter:description" content="Organize and track all your clients in one centralized system with comprehensive profiles and relationship management tools." />
        <meta name="twitter:image" content="https://loanflowpro.com/client-management-twitter-image.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Client Management Software - LoanFlowPro",
          "description": "Client management software for loan professionals",
          "url": "https://loanflowpro.com/features/client-management",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "LoanFlowPro Client Management",
            "description": "Client management software for loan professionals",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "featureList": [
              "Comprehensive Client Profiles",
              "Communication Tracking",
              "Document History",
              "Relationship Insights",
              "Automated Workflows",
              "Advanced Search"
            ]
          }
        })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-white">
        {/* Professional Navigation */}
        <ProfessionalNav />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 2px, transparent 2px), radial-gradient(circle at 75% 75%, #D4AF37 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-20 h-20 bg-[#D4AF37] rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Client Management
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
            Organize and track all your clients in one centralized system with comprehensive profiles and relationship management tools
          </p>
        </div>
      </section>

      {/* Feature Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Centralized Client Database
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Say goodbye to scattered client information across multiple systems. LoanFlowPro provides a single, comprehensive platform where you can manage all your client relationships, track interactions, and maintain complete histories.
              </p>
              <p className="text-lg text-slate-600 mb-6">
                Our client management system is designed specifically for loan professionals, with built-in workflows that streamline your client onboarding process and ensure nothing falls through the cracks.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-slate-900">Trusted by 10,000+ professionals</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">24/7</div>
                  <div className="text-slate-600">Access</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">100%</div>
                  <div className="text-slate-600">Secure</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">Real-time</div>
                  <div className="text-slate-600">Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">Mobile</div>
                  <div className="text-slate-600">Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Key Capabilities
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to manage client relationships effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Comprehensive Profiles</h3>
              <p className="text-slate-600">
                Store complete client information including personal details, financial data, loan history, and preferences in organized, searchable profiles.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Communication Tracking</h3>
              <p className="text-slate-600">
                Log all client interactions, emails, calls, and meetings with automatic timestamps and follow-up reminders.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Document History</h3>
              <p className="text-slate-600">
                Maintain complete document trails with version control, approval workflows, and automatic categorization.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Relationship Insights</h3>
              <p className="text-slate-600">
                Gain valuable insights into client relationships with analytics, engagement metrics, and opportunity tracking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Automated Workflows</h3>
              <p className="text-slate-600">
                Set up automated processes for client onboarding, follow-ups, and milestone tracking to ensure nothing is missed.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Advanced Search</h3>
              <p className="text-slate-600">
                Find clients quickly with powerful search capabilities, filters, and saved search queries for common scenarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose Our Client Management?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transform how you manage client relationships
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Increased Efficiency</h3>
                  <p className="text-slate-600">Reduce time spent on administrative tasks and focus on building relationships and closing deals.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Better Client Experience</h3>
                  <p className="text-slate-600">Provide personalized service with complete client history and preferences at your fingertips.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Improved Compliance</h3>
                  <p className="text-slate-600">Maintain complete audit trails and ensure regulatory compliance with built-in documentation.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Key Statistics</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Time Saved</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">40%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Client Retention</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">+25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Response Time</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">-60%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Data Accuracy</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Client Management?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Experience the power of centralized client management and see how it can improve your loan operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signin"
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              to="/features"
              className="border-2 border-slate-300 hover:border-[#D4AF37] text-slate-300 hover:text-[#D4AF37] font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200"
            >
              View All Features
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">LoanFlowPro</h3>
              <p className="text-slate-400">Professional loan management platform designed for modern lending operations.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="hover:text-[#D4AF37] transition-colors duration-200">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-[#D4AF37] transition-colors duration-200">Pricing</Link></li>
                <li><Link to="/signin" className="hover:text-[#D4AF37] transition-colors duration-200">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors duration-200">About</Link></li>
                <li><Link to="/contact" className="hover:text-[#D4AF37] transition-colors duration-200">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-[#D4AF37] transition-colors duration-200">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/help" className="hover:text-[#D4AF37] transition-colors duration-200">Help Center</Link></li>
                <li><Link to="/docs" className="hover:text-[#D4AF37] transition-colors duration-200">Documentation</Link></li>
                <li><Link to="/status" className="hover:text-[#D4AF37] transition-colors duration-200">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center">
            <p className="text-slate-400">© 2024 LoanFlowPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
