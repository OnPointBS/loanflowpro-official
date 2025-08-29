import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProfessionalNav from '../components/ProfessionalNav';

export default function Features() {
  return (
    <>
      <Helmet>
        <title>LoanFlowPro Features - Complete Loan Management Platform | Client, Document & Task Management</title>
        <meta name="description" content="Discover LoanFlowPro's comprehensive features: client management, document management, task automation, loan processing, reporting & analytics, and compliance tools. Transform your lending operations." />
        <meta name="keywords" content="loan management features, client management software, document management system, task automation, loan processing software, reporting analytics, compliance tools, lending platform features" />
        <link rel="canonical" href="https://loanflowpro.com/features" />
        
        {/* Open Graph */}
        <meta property="og:title" content="LoanFlowPro Features - Complete Loan Management Platform" />
        <meta property="og:description" content="Discover LoanFlowPro's comprehensive features: client management, document management, task automation, loan processing, reporting & analytics, and compliance tools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/features" />
        <meta property="og:image" content="https://loanflowpro.com/features-og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LoanFlowPro Features - Complete Loan Management Platform" />
        <meta name="twitter:description" content="Discover LoanFlowPro's comprehensive features: client management, document management, task automation, loan processing, reporting & analytics, and compliance tools." />
        <meta name="twitter:image" content="https://loanflowpro.com/features-twitter-image.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "LoanFlowPro Features",
          "description": "Complete loan management platform features including client management, document management, and task automation",
          "url": "https://loanflowpro.com/features",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "LoanFlowPro",
            "description": "Professional loan management platform with comprehensive features",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "featureList": [
              "Client Management",
              "Document Management", 
              "Task Automation",
              "Loan Processing",
              "Reporting & Analytics",
              "Compliance & Security"
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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Powerful Features for
            <span className="text-[#D4AF37] block">Modern Lending</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to manage loans efficiently, grow your business, and deliver exceptional client experiences
          </p>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Core Platform Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive tools designed specifically for loan management professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Client Management */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Client Management</h3>
              <p className="text-slate-600 mb-4">
                Organize and track all your clients in one centralized system with detailed profiles, communication history, and relationship management tools.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Comprehensive client profiles</li>
                <li>• Communication tracking</li>
                <li>• Document history</li>
                <li>• Relationship insights</li>
              </ul>
              <Link
                to="/features/client-management"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-semibold transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Document Management */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Document Management</h3>
              <p className="text-slate-600 mb-4">
                Securely store and organize all loan documents with automated categorization, OCR scanning, and advanced search capabilities.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Automated categorization</li>
                <li>• OCR text extraction</li>
                <li>• Advanced search</li>
                <li>• Version control</li>
              </ul>
              <Link
                to="/features/document-management"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-semibold transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Task Automation */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Task Automation</h3>
              <p className="text-slate-600 mb-4">
                Automate repetitive tasks and workflows to save time, reduce errors, and ensure consistent loan processing.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Workflow templates</li>
                <li>• Automated reminders</li>
                <li>• Task dependencies</li>
                <li>• Progress tracking</li>
              </ul>
              <Link
                to="/features/task-automation"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-semibold transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Loan Processing */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Loan Processing</h3>
              <p className="text-slate-600 mb-4">
                Streamlined loan application processing with customizable workflows, status tracking, and approval management.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Custom workflows</li>
                <li>• Status tracking</li>
                <li>• Approval routing</li>
                <li>• Compliance checks</li>
              </ul>
              <Link
                to="/features/loan-processing"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-semibold transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Compliance & Reporting */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Compliance & Reporting</h3>
              <p className="text-slate-600 mb-4">
                Built-in compliance tools, audit trails, and comprehensive reporting to meet regulatory requirements and track performance.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Regulatory compliance</li>
                <li>• Audit trails</li>
                <li>• Custom reports</li>
                <li>• Performance metrics</li>
              </ul>
              <Link
                to="/features/compliance-security"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-semibold transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Analytics & Insights */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Analytics & Insights</h3>
              <p className="text-slate-600 mb-4">
                Powerful analytics dashboard with real-time insights, performance metrics, and data-driven decision making tools.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Real-time dashboards</li>
                <li>• Performance metrics</li>
                <li>• Trend analysis</li>
                <li>• Custom KPIs</li>
              </ul>
              <Link
                to="/features/reporting-analytics"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-semibold transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Advanced Capabilities
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Enterprise-grade features for growing businesses
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                API & Integrations
              </h3>
              <p className="text-lg text-slate-600 mb-6">
                Seamlessly integrate LoanFlowPro with your existing systems, CRMs, accounting software, and third-party services through our robust API.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  <span className="text-slate-700">RESTful API with comprehensive documentation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  <span className="text-slate-700">Pre-built integrations with popular platforms</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  <span className="text-slate-700">Webhook support for real-time updates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  <span className="text-slate-700">Custom integration development support</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 rounded-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-slate-900 mb-2">50+ Integrations</h4>
                <p className="text-slate-600">Connect with your favorite tools and services</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile & Accessibility */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#D4AF37] rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-2">Mobile First</h4>
                  <p className="text-slate-600">Full functionality on any device</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                Mobile & Accessibility
              </h3>
              <p className="text-lg text-slate-600 mb-6">
                Access LoanFlowPro from anywhere with our fully responsive mobile application and comprehensive accessibility features.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  <span className="text-slate-700">Responsive design for all screen sizes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  <span className="text-slate-700">Native mobile app for iOS and Android</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  <span className="text-slate-700">WCAG 2.1 AA compliance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  <span className="text-slate-700">Offline capability for critical functions</span>
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
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Start your free trial today and see how LoanFlowPro can transform your loan management operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signin"
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              to="/pricing"
              className="border-2 border-slate-300 hover:border-[#D4AF37] text-slate-300 hover:text-[#D4AF37] font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200"
            >
              View Pricing
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
                <li><Link to="/features" className="text-[#D4AF37] font-semibold">Features</Link></li>
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
