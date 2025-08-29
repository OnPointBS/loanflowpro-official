import React from 'react';
import { Link } from 'react-router-dom';
import ProfessionalNav from '../../components/ProfessionalNav';
import { Helmet } from 'react-helmet-async';

const Guides: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Guides & Tutorials | LoanFlowPro</title>
        <meta name="description" content="Comprehensive guides and tutorials to help you master loan management, from basic setup to advanced features and best practices." />
        <meta name="keywords" content="loan management guides, tutorials, how-to guides, loan processing, best practices, documentation" />
        <link rel="canonical" href="https://loanflowpro.com/resources/guides" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Guides & Tutorials | LoanFlowPro" />
        <meta property="og:description" content="Comprehensive guides and tutorials to help you master loan management." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/resources/guides" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Guides & Tutorials | LoanFlowPro" />
        <meta name="twitter:description" content="Comprehensive guides and tutorials to help you master loan management." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Guides & Tutorials",
          "description": "Comprehensive guides and tutorials to help you master loan management",
          "url": "https://loanflowpro.com/resources/guides",
          "mainEntity": {
            "@type": "HowTo",
            "name": "Loan Management Guides",
            "description": "Step-by-step guides and tutorials for loan management professionals"
          }
        })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-white">
        {/* Professional Navigation */}
        <ProfessionalNav />

        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 2px, transparent 2px), radial-gradient(circle at 75% 75%, #D4AF37 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Guides &
                <span className="text-[#D4AF37] block">Tutorials</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Comprehensive guides and tutorials to help you master loan management, from basic setup to advanced features and best practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transform-gpu"
                >
                  Get Help
                </Link>
                <Link
                  to="/resources/api-docs"
                  className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500"
                >
                  API Docs
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Getting Started
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                New to LoanFlowPro? Start here with our essential guides
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Quick Start Guide */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Quick Start Guide</h3>
                <p className="text-slate-600 mb-4">
                  Get up and running with LoanFlowPro in under 30 minutes with this comprehensive quick start guide.
                </p>
                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <span>15 min read</span>
                  <span className="mx-2">•</span>
                  <span>Beginner</span>
                </div>
                <Link
                  to="#"
                  className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                >
                  Read Guide →
                </Link>
              </div>

              {/* Account Setup */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Account Setup</h3>
                <p className="text-slate-600 mb-4">
                  Complete step-by-step instructions for setting up your account and configuring your workspace.
                </p>
                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <span>20 min read</span>
                  <span className="mx-2">•</span>
                  <span>Beginner</span>
                </div>
                <Link
                  to="#"
                  className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                >
                  Read Guide →
                </Link>
              </div>

              {/* First Loan */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Creating Your First Loan</h3>
                <p className="text-slate-600 mb-4">
                  Learn how to create and manage your first loan from application to closing.
                </p>
                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <span>25 min read</span>
                  <span className="mx-2">•</span>
                  <span>Beginner</span>
                </div>
                <Link
                  to="#"
                  className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                >
                  Read Guide →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Core Features
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Master the essential features of LoanFlowPro
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Client Management */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Client Management</h3>
                    <p className="text-slate-600 mb-4">
                      Complete guide to managing clients, including profiles, communication history, and relationship management.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-500">
                        <span>• Adding New Clients</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <span>• Client Profiles & Notes</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <span>• Communication Tracking</span>
                      </div>
                    </div>
                    <Link
                      to="#"
                      className="inline-block mt-4 text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                    >
                      View Guide →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Document Management */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Document Management</h3>
                    <p className="text-slate-600 mb-4">
                      Learn how to organize, store, and manage loan documents securely and efficiently.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-500">
                        <span>• Document Upload & Organization</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <span>• Version Control</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <span>• Security & Permissions</span>
                      </div>
                    </div>
                    <Link
                      to="#"
                      className="inline-block mt-4 text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                    >
                      View Guide →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Loan Processing */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Loan Processing</h3>
                    <p className="text-slate-600 mb-4">
                      Step-by-step guide to processing loans from application to closing.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-500">
                        <span>• Application Workflow</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <span>• Underwriting Process</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <span>• Closing & Funding</span>
                      </div>
                    </div>
                    <Link
                      to="#"
                      className="inline-block mt-4 text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                    >
                      View Guide →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Reporting & Analytics */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Reporting & Analytics</h3>
                    <p className="text-slate-600 mb-4">
                      Master the reporting tools and analytics to gain insights into your lending operations.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-500">
                        <span>• Custom Reports</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <span>• Dashboard Creation</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <span>• Data Export</span>
                      </div>
                    </div>
                    <Link
                      to="#"
                      className="inline-block mt-4 text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                    >
                      View Guide →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Topics Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Advanced Topics
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Take your skills to the next level with advanced guides
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* API Integration */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">API Integration</h3>
                <p className="text-slate-600 mb-4">
                  Learn how to integrate LoanFlowPro with your existing systems using our REST API.
                </p>
                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <span>45 min read</span>
                  <span className="mx-2">•</span>
                  <span>Advanced</span>
                </div>
                <Link
                  to="/resources/api-docs"
                  className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                >
                  View Guide →
                </Link>
              </div>

              {/* Workflow Automation */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Workflow Automation</h3>
                <p className="text-slate-600 mb-4">
                  Automate repetitive tasks and create custom workflows to streamline your operations.
                </p>
                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <span>60 min read</span>
                  <span className="mx-2">•</span>
                  <span>Advanced</span>
                </div>
                <Link
                  to="#"
                  className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                >
                  View Guide →
                </Link>
              </div>

              {/* Security Best Practices */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Security Best Practices</h3>
                <p className="text-slate-600 mb-4">
                  Implement security best practices to protect sensitive loan data and maintain compliance.
                </p>
                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <span>40 min read</span>
                  <span className="mx-2">•</span>
                  <span>Advanced</span>
                </div>
                <Link
                  to="#"
                  className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                >
                  View Guide →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-20 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 2px, transparent 2px), radial-gradient(circle at 75% 75%, #D4AF37 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">
              Need More Help?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl"
              >
                Contact Support
              </Link>
              <Link
                to="/resources/webinars"
                className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500"
              >
                Join Webinar
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">LoanFlowPro</h3>
                <p className="text-slate-400">
                  Professional loan management platform designed for modern lending operations.
                </p>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Solutions</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><Link to="/solutions/small-business" className="hover:text-[#D4AF37] transition-colors">Small Business</Link></li>
                  <li><Link to="/solutions/commercial" className="hover:text-[#D4AF37] transition-colors">Commercial</Link></li>
                  <li><Link to="/solutions/consumer" className="hover:text-[#D4AF37] transition-colors">Consumer</Link></li>
                  <li><Link to="/solutions/mortgage" className="hover:text-[#D4AF37] transition-colors">Mortgage</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors">About</Link></li>
                  <li><Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Contact</Link></li>
                  <li><Link to="/pricing" className="hover:text-[#D4AF37] transition-colors">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><Link to="/resources/guides" className="hover:text-[#D4AF37] transition-colors">Documentation</Link></li>
                  <li><Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Help Center</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
              <p>&copy; 2024 LoanFlowPro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Guides;
