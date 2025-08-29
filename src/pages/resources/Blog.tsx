import React from 'react';
import { Link } from 'react-router-dom';
import ProfessionalNav from '../../components/ProfessionalNav';
import { Helmet } from 'react-helmet-async';

const Blog: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Blog & Insights | LoanFlowPro</title>
        <meta name="description" content="Stay updated with the latest insights, industry trends, and best practices in loan management and lending operations." />
        <meta name="keywords" content="loan management blog, lending insights, financial services, loan processing, industry trends" />
        <link rel="canonical" href="https://loanflowpro.com/resources/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Blog & Insights | LoanFlowPro" />
        <meta property="og:description" content="Stay updated with the latest insights, industry trends, and best practices in loan management." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/resources/blog" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog & Insights | LoanFlowPro" />
        <meta name="twitter:description" content="Stay updated with the latest insights, industry trends, and best practices in loan management." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Blog & Insights",
          "description": "Stay updated with the latest insights, industry trends, and best practices in loan management",
          "url": "https://loanflowpro.com/resources/blog",
          "mainEntity": {
            "@type": "Blog",
            "name": "LoanFlowPro Blog",
            "description": "Insights and best practices for loan management professionals"
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
                Blog &
                <span className="text-[#D4AF37] block">Insights</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Stay updated with the latest insights, industry trends, and best practices in loan management and lending operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transform-gpu"
                >
                  Subscribe to Updates
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

        {/* Featured Posts Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Featured Insights
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Discover the latest trends and best practices in loan management
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Featured Post 1 */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-slate-500 mb-3">
                    <span>Analytics</span>
                    <span className="mx-2">•</span>
                    <span>5 min read</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    The Future of Loan Analytics: AI-Powered Insights
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Discover how artificial intelligence is transforming loan analytics and providing deeper insights into lending performance.
                  </p>
                  <Link
                    to="#"
                    className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                  >
                    Read More →
                  </Link>
                </div>
              </div>

              {/* Featured Post 2 */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-slate-500 mb-3">
                    <span>Compliance</span>
                    <span className="mx-2">•</span>
                    <span>8 min read</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Navigating Regulatory Changes in 2024
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Stay compliant with the latest regulatory updates and understand how they impact your lending operations.
                  </p>
                  <Link
                    to="#"
                    className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                  >
                    Read More →
                  </Link>
                </div>
              </div>

              {/* Featured Post 3 */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-slate-500 mb-3">
                    <span>Efficiency</span>
                    <span className="mx-2">•</span>
                    <span>6 min read</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Streamlining Loan Processing Workflows
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Learn proven strategies to optimize your loan processing workflows and reduce processing time by up to 60%.
                  </p>
                  <Link
                    to="#"
                    className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Posts Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Latest Articles
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Stay current with our latest insights and industry analysis
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Latest Post 1 */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Building Strong Client Relationships in Digital Lending
                    </h3>
                    <p className="text-slate-600 mb-3">
                      Explore strategies for maintaining personal connections while leveraging digital tools in modern lending.
                    </p>
                    <div className="flex items-center text-sm text-slate-500">
                      <span>Client Management</span>
                      <span className="mx-2">•</span>
                      <span>4 min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Post 2 */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Risk Management Strategies for Small Business Lending
                    </h3>
                    <p className="text-slate-600 mb-3">
                      Learn effective risk management approaches tailored specifically for small business lending operations.
                    </p>
                    <div className="flex items-center text-sm text-slate-500">
                      <span>Risk Management</span>
                      <span className="mx-2">•</span>
                      <span>7 min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Post 3 */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Document Management Best Practices
                    </h3>
                    <p className="text-slate-600 mb-3">
                      Discover proven strategies for organizing and managing loan documents efficiently and securely.
                    </p>
                    <div className="flex items-center text-sm text-slate-500">
                      <span>Document Management</span>
                      <span className="mx-2">•</span>
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Post 4 */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Automation in Loan Processing: What's Next?
                    </h3>
                    <p className="text-slate-600 mb-3">
                      Explore the future of automation in loan processing and how it will reshape the industry.
                    </p>
                    <div className="flex items-center text-sm text-slate-500">
                      <span>Automation</span>
                      <span className="mx-2">•</span>
                      <span>6 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 2px, transparent 2px), radial-gradient(circle at 75% 75%, #D4AF37 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">
              Stay Updated with Our Insights
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Subscribe to our newsletter and get the latest insights, industry trends, and best practices delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 text-slate-900 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
              <button className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-500 shadow-lg hover:shadow-xl">
                Subscribe
              </button>
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

export default Blog;
