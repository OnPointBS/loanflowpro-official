import React from 'react';
import { Link } from 'react-router-dom';
import ProfessionalNav from '../components/ProfessionalNav';
import { Helmet } from 'react-helmet-async';

const HelpCenter: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Help Center | LoanFlowPro</title>
        <meta name="description" content="Get help and support for LoanFlowPro. Find answers to common questions, troubleshooting guides, and contact our support team." />
        <meta name="keywords" content="LoanFlowPro help, support, troubleshooting, FAQ, customer service" />
        <link rel="canonical" href="https://loanflowpro.com/help-center" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Help Center | LoanFlowPro" />
        <meta property="og:description" content="Get help and support for LoanFlowPro. Find answers to common questions and troubleshooting guides." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/help-center" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Help Center | LoanFlowPro" />
        <meta name="twitter:description" content="Get help and support for LoanFlowPro. Find answers to common questions and troubleshooting guides." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Help Center",
          "description": "Get help and support for LoanFlowPro",
          "url": "https://loanflowpro.com/help-center",
          "mainEntity": {
            "@type": "FAQPage",
            "name": "LoanFlowPro Help Center",
            "description": "Frequently asked questions and support resources"
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
                Help
                <span className="text-[#D4AF37] block">Center</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Get the support you need to make the most of LoanFlowPro
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transform-gpu"
                >
                  Contact Support
                </Link>
                <Link
                  to="/resources/guides"
                  className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500"
                >
                  View Guides
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Help Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                How Can We Help?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Choose from the options below to get the help you need
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Documentation */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Documentation</h3>
                <p className="text-slate-600 mb-4">
                  Comprehensive guides, tutorials, and reference materials for all features.
                </p>
                <Link
                  to="/resources/guides"
                  className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                >
                  Browse Documentation →
                </Link>
              </div>

              {/* FAQ */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Frequently Asked Questions</h3>
                <p className="text-slate-600 mb-4">
                  Quick answers to common questions about LoanFlowPro features and usage.
                </p>
                <button className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200">
                  View FAQ →
                </button>
              </div>

              {/* Contact Support */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Contact Support</h3>
                <p className="text-slate-600 mb-4">
                  Get personalized help from our expert support team via email or chat.
                </p>
                <Link
                  to="/contact"
                  className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                >
                  Contact Us →
                </Link>
              </div>

              {/* Video Tutorials */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Video Tutorials</h3>
                <p className="text-slate-600 mb-4">
                  Step-by-step video guides for common tasks and workflows.
                </p>
                <Link
                  to="/resources/webinars"
                  className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                >
                  Watch Videos →
                </Link>
              </div>

              {/* Community */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Community</h3>
                <p className="text-slate-600 mb-4">
                  Connect with other users and share best practices.
                </p>
                <Link
                  to="/resources/blog"
                  className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                >
                  Join Community →
                </Link>
              </div>

              {/* Status */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">System Status</h3>
                <p className="text-slate-600 mb-4">
                  Check the current status of LoanFlowPro services and any ongoing issues.
                </p>
                <Link
                  to="/status"
                  className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                >
                  Check Status →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Quick answers to common questions about LoanFlowPro
              </p>
            </div>
            
            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  How do I get started with LoanFlowPro?
                </h3>
                <p className="text-slate-600">
                  Getting started is easy! Simply sign up for an account, complete your profile setup, and follow our step-by-step onboarding guide. You can also request a demo to see the platform in action before committing.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  What types of loans does LoanFlowPro support?
                </h3>
                <p className="text-slate-600">
                  LoanFlowPro supports all major loan types including consumer loans, commercial loans, mortgage loans, and small business loans. Our platform is designed to handle the complete loan lifecycle from origination to servicing.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Is my data secure on LoanFlowPro?
                </h3>
                <p className="text-slate-600">
                  Absolutely! We use bank-level encryption and security measures to protect your data. We're SOC 2 Type II compliant and follow industry best practices for data security and privacy.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Can I integrate LoanFlowPro with my existing systems?
                </h3>
                <p className="text-slate-600">
                  Yes! LoanFlowPro offers robust API integration capabilities and can connect with your existing CRM, accounting software, and other business systems. Our team can help you set up custom integrations.
                </p>
              </div>

              {/* FAQ Item 5 */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  What kind of support do you provide?
                </h3>
                <p className="text-slate-600">
                  We provide comprehensive support including documentation, video tutorials, email support, and live chat during business hours. Enterprise customers also get dedicated account management and priority support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="py-20 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 2px, transparent 2px), radial-gradient(circle at 75% 75%, #D4AF37 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">
              Still Need Help?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Our support team is here to help you succeed with LoanFlowPro
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl"
              >
                Contact Support
              </Link>
              <Link
                to="/resources/guides"
                className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500"
              >
                Browse Documentation
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

export default HelpCenter;
