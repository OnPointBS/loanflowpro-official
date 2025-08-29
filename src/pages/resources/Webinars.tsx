import React from 'react';
import { Link } from 'react-router-dom';
import ProfessionalNav from '../../components/ProfessionalNav';
import { Helmet } from 'react-helmet-async';

const Webinars: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Webinars & Events | LoanFlowPro</title>
        <meta name="description" content="Join our live webinars and events to learn about loan management best practices, industry trends, and platform updates." />
        <meta name="keywords" content="loan management webinars, lending events, financial services training, loan processing webinars" />
        <link rel="canonical" href="https://loanflowpro.com/resources/webinars" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Webinars & Events | LoanFlowPro" />
        <meta property="og:description" content="Join our live webinars and events to learn about loan management best practices." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/resources/webinars" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Webinars & Events | LoanFlowPro" />
        <meta name="twitter:description" content="Join our live webinars and events to learn about loan management best practices." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Webinars & Events",
          "description": "Join our live webinars and events to learn about loan management best practices",
          "url": "https://loanflowpro.com/resources/webinars",
          "mainEntity": {
            "@type": "Event",
            "name": "LoanFlowPro Webinars",
            "description": "Educational webinars and events for loan management professionals"
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
                Webinars &
                <span className="text-[#D4AF37] block">Events</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Join our live webinars and events to learn about loan management best practices, industry trends, and platform updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transform-gpu"
                >
                  Register for Events
                </Link>
                <Link
                  to="/resources/blog"
                  className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500"
                >
                  View Blog
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Upcoming Events
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Don't miss these upcoming webinars and events designed for loan management professionals
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Event 1 */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-slate-500 mb-3">
                    <span>March 15, 2024</span>
                    <span className="mx-2">•</span>
                    <span>2:00 PM EST</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    AI-Powered Loan Analytics
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Discover how artificial intelligence is transforming loan analytics and providing deeper insights.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Free Webinar</span>
                    <Link
                      to="/contact"
                      className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-200"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>

              {/* Event 2 */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-slate-500 mb-3">
                    <span>March 22, 2024</span>
                    <span className="mx-2">•</span>
                    <span>1:00 PM EST</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Compliance Updates 2024
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Stay compliant with the latest regulatory updates and understand their impact on lending operations.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Free Webinar</span>
                    <Link
                      to="/contact"
                      className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-200"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>

              {/* Event 3 */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-slate-500 mb-3">
                    <span>April 5, 2024</span>
                    <span className="mx-2">•</span>
                    <span>3:00 PM EST</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Workflow Automation Masterclass
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Learn advanced workflow automation techniques to streamline your loan processing operations.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Premium Event</span>
                    <Link
                      to="/contact"
                      className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-200"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Past Webinars Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Past Webinars
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Catch up on our previous webinars and events
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Past Webinar 1 */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Digital Transformation in Lending
                    </h3>
                    <p className="text-slate-600 mb-3">
                      Learn how digital transformation is reshaping the lending industry and what it means for your business.
                    </p>
                    <div className="flex items-center text-sm text-slate-500 mb-3">
                      <span>February 28, 2024</span>
                      <span className="mx-2">•</span>
                      <span>60 min</span>
                    </div>
                    <Link
                      to="#"
                      className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                    >
                      Watch Recording →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Past Webinar 2 */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Risk Management Strategies
                    </h3>
                    <p className="text-slate-600 mb-3">
                      Explore effective risk management strategies for different types of lending operations.
                    </p>
                    <div className="flex items-center text-sm text-slate-500 mb-3">
                      <span>February 15, 2024</span>
                      <span className="mx-2">•</span>
                      <span>75 min</span>
                    </div>
                    <Link
                      to="#"
                      className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                    >
                      Watch Recording →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Past Webinar 3 */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Document Management Best Practices
                    </h3>
                    <p className="text-slate-600 mb-3">
                      Discover proven strategies for organizing and managing loan documents efficiently and securely.
                    </p>
                    <div className="flex items-center text-sm text-slate-500 mb-3">
                      <span>February 1, 2024</span>
                      <span className="mx-2">•</span>
                      <span>45 min</span>
                    </div>
                    <Link
                      to="#"
                      className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                    >
                      Watch Recording →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Past Webinar 4 */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Client Relationship Management
                    </h3>
                    <p className="text-slate-600 mb-3">
                      Learn how to build and maintain strong client relationships in the digital lending era.
                    </p>
                    <div className="flex items-center text-sm text-slate-500 mb-3">
                      <span>January 18, 2024</span>
                      <span className="mx-2">•</span>
                      <span>50 min</span>
                    </div>
                    <Link
                      to="#"
                      className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                    >
                      Watch Recording →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Categories Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Event Categories
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Find events that match your interests and expertise level
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Beginner */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Beginner</h3>
                <p className="text-slate-600 text-sm">
                  Perfect for those new to loan management or LoanFlowPro
                </p>
              </div>

              {/* Intermediate */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Intermediate</h3>
                <p className="text-slate-600 text-sm">
                  For users with some experience looking to enhance their skills
                </p>
              </div>

              {/* Advanced */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Advanced</h3>
                <p className="text-slate-600 text-sm">
                  Deep dives into complex features and advanced techniques
                </p>
              </div>

              {/* Industry Focus */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Industry Focus</h3>
                <p className="text-slate-600 text-sm">
                  Specialized content for specific lending sectors
                </p>
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
              Stay Connected with Our Events
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Get notified about upcoming webinars, events, and industry insights
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

export default Webinars;
