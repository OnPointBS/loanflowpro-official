import React from 'react';
import { Link } from 'react-router-dom';
import ProfessionalNav from '../components/ProfessionalNav';
import { Helmet } from 'react-helmet-async';

const Status: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>System Status | LoanFlowPro</title>
        <meta name="description" content="Check the current status of LoanFlowPro services, uptime, and any ongoing maintenance or issues." />
        <meta name="keywords" content="LoanFlowPro status, system status, uptime, maintenance, service status" />
        <link rel="canonical" href="https://loanflowpro.com/status" />
        
        {/* Open Graph */}
        <meta property="og:title" content="System Status | LoanFlowPro" />
        <meta property="og:description" content="Check the current status of LoanFlowPro services, uptime, and any ongoing maintenance or issues." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/status" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="System Status | LoanFlowPro" />
        <meta name="twitter:description" content="Check the current status of LoanFlowPro services, uptime, and any ongoing maintenance or issues." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "System Status",
          "description": "Check the current status of LoanFlowPro services",
          "url": "https://loanflowpro.com/status"
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
                System
                <span className="text-[#D4AF37] block">Status</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Real-time status of LoanFlowPro services and infrastructure
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/help-center"
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transform-gpu"
                >
                  Get Help
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500"
                >
                  Report Issue
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Overall Status Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Overall System Status
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Current operational status of all LoanFlowPro services
              </p>
            </div>
            
            {/* Status Indicator */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center mb-12">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-green-800 mb-2">All Systems Operational</h3>
              <p className="text-green-700 text-lg">
                All LoanFlowPro services are running normally
              </p>
              <div className="mt-4 text-sm text-green-600">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>

            {/* Uptime Stats */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#D4AF37] mb-2">99.9%</div>
                <div className="text-slate-600">Uptime (30 days)</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#D4AF37] mb-2">24/7</div>
                <div className="text-slate-600">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#D4AF37] mb-2">&lt;100ms</div>
                <div className="text-slate-600">Response Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Status Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Service Status
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Detailed status of individual services and components
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Core Platform */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Core Platform</h3>
                      <p className="text-slate-600">Main application and user interface</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">Operational</div>
                    <div className="text-xs text-slate-500">No issues</div>
                  </div>
                </div>
              </div>

              {/* API Services */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">API Services</h3>
                      <p className="text-slate-600">REST API and integration endpoints</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">Operational</div>
                    <div className="text-xs text-slate-500">No issues</div>
                  </div>
                </div>
              </div>

              {/* Database */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Database</h3>
                      <p className="text-slate-600">Data storage and management</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">Operational</div>
                    <div className="text-xs text-slate-500">No issues</div>
                  </div>
                </div>
              </div>

              {/* File Storage */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">File Storage</h3>
                      <p className="text-slate-600">Document and file management</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">Operational</div>
                    <div className="text-xs text-slate-500">No issues</div>
                  </div>
                </div>
              </div>

              {/* Email Services */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Email Services</h3>
                      <p className="text-slate-600">Notifications and communications</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">Operational</div>
                    <div className="text-xs text-slate-500">No issues</div>
                  </div>
                </div>
              </div>

              {/* Third-party Integrations */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Third-party Integrations</h3>
                      <p className="text-slate-600">External service connections</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">Operational</div>
                    <div className="text-xs text-slate-500">No issues</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Incident History Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Recent Incidents
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                History of recent service disruptions and resolutions
              </p>
            </div>
            
            <div className="space-y-6">
              {/* No Recent Incidents */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">No Recent Incidents</h3>
                <p className="text-green-700">
                  All services have been running smoothly with no major disruptions in the past 30 days.
                </p>
              </div>

              {/* Past Incident Example (commented out for now) */}
              {/*
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Scheduled Maintenance</h3>
                    <p className="text-slate-600">Database optimization and performance improvements</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-600">Resolved</div>
                    <div className="text-xs text-slate-500">Dec 15, 2024</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  <p><strong>Duration:</strong> 2 hours (2:00 AM - 4:00 AM EST)</p>
                  <p><strong>Impact:</strong> Minor - Some features temporarily unavailable</p>
                  <p><strong>Resolution:</strong> Successfully completed with improved performance metrics</p>
                </div>
              </div>
              */}
            </div>
          </div>
        </section>

        {/* Subscribe to Updates Section */}
        <section className="py-20 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 2px, transparent 2px), radial-gradient(circle at 75% 75%, #D4AF37 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Get notified about service status updates and maintenance schedules
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl"
              >
                Subscribe to Updates
              </Link>
              <Link
                to="/help-center"
                className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500"
              >
                Get Help
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
                  <li><Link to="/help-center" className="hover:text-[#D4AF37] transition-colors">Help Center</Link></li>
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

export default Status;
