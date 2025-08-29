import React from 'react';
import { Link } from 'react-router-dom';
import ProfessionalNav from '../../components/ProfessionalNav';
import { Helmet } from 'react-helmet-async';

const SmallBusiness: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Small Business Lending Solutions | LoanFlowPro</title>
        <meta name="description" content="Streamline small business lending with our comprehensive loan management platform. Perfect for community banks, credit unions, and small business lenders." />
        <meta name="keywords" content="small business lending, SBA loans, business loan management, community banking, credit union lending" />
        <link rel="canonical" href="https://loanflowpro.com/solutions/small-business" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Small Business Lending Solutions | LoanFlowPro" />
        <meta property="og:description" content="Streamline small business lending with our comprehensive loan management platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/solutions/small-business" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Small Business Lending Solutions | LoanFlowPro" />
        <meta name="twitter:description" content="Streamline small business lending with our comprehensive loan management platform." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Small Business Lending Solutions",
          "description": "Streamline small business lending with our comprehensive loan management platform",
          "url": "https://loanflowpro.com/solutions/small-business",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "LoanFlowPro Small Business Lending",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web"
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
                Small Business
                <span className="text-[#D4AF37] block">Lending Solutions</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Streamline small business lending operations with our comprehensive platform designed for community banks, credit unions, and small business lenders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transform-gpu"
                >
                  Get Started Today
                </Link>
                <Link
                  to="/features"
                  className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500"
                >
                  View Features
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Built for Small Business Lending
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Everything you need to efficiently manage small business loans, from application to closing
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* SBA Loan Management */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">SBA Loan Management</h3>
                <p className="text-slate-600">
                  Streamlined SBA loan processing with built-in compliance checks, document management, and approval workflows.
                </p>
              </div>

              {/* Quick Application Processing */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Quick Application Processing</h3>
                <p className="text-slate-600">
                  Accelerate loan decisions with automated underwriting, risk assessment, and streamlined approval processes.
                </p>
              </div>

              {/* Client Portal */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Client Portal</h3>
                <p className="text-slate-600">
                  Professional client portal for document uploads, application status, and secure communication.
                </p>
              </div>

              {/* Risk Management */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Risk Management</h3>
                <p className="text-slate-600">
                  Comprehensive risk assessment tools with credit scoring, financial analysis, and portfolio monitoring.
                </p>
              </div>

              {/* Compliance Tools */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Compliance Tools</h3>
                <p className="text-slate-600">
                  Built-in regulatory compliance for CRA, fair lending, and other banking regulations.
                </p>
              </div>

              {/* Reporting & Analytics */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Reporting & Analytics</h3>
                <p className="text-slate-600">
                  Detailed reporting on loan performance, portfolio health, and business growth metrics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Why Choose LoanFlowPro for Small Business Lending?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our platform is specifically designed to address the unique challenges of small business lending
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Streamlined Operations</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">Reduce loan processing time by up to 60%</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">Automated document collection and verification</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">Integrated workflow management</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Risk Mitigation</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">Advanced credit scoring and risk assessment</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">Real-time portfolio monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">Compliance automation and audit trails</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 2px, transparent 2px), radial-gradient(circle at 75% 75%, #D4AF37 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Small Business Lending?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join community banks and credit unions who trust LoanFlowPro to streamline their small business lending operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl"
              >
                Schedule a Demo
              </Link>
              <Link
                to="/pricing"
                className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500"
              >
                View Pricing
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

export default SmallBusiness;
