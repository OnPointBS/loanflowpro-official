import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProfessionalNav from '../components/ProfessionalNav';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About LoanFlowPro - Our Mission, Values & Team | Loan Management Platform</title>
        <meta name="description" content="Learn about LoanFlowPro's mission to revolutionize loan management. Discover our core values, meet our expert team, and understand how we're transforming the lending industry." />
        <meta name="keywords" content="about LoanFlowPro, loan management company, lending software company, financial technology, loan processing platform, mortgage software company" />
        <link rel="canonical" href="https://loanflowpro.com/about" />
        
        {/* Open Graph */}
        <meta property="og:title" content="About LoanFlowPro - Our Mission, Values & Team" />
        <meta property="og:description" content="Learn about LoanFlowPro's mission to revolutionize loan management. Discover our core values, meet our expert team, and understand how we're transforming the lending industry." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/about" />
        <meta property="og:image" content="https://loanflowpro.com/about-og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About LoanFlowPro - Our Mission, Values & Team" />
        <meta name="twitter:description" content="Learn about LoanFlowPro's mission to revolutionize loan management. Discover our core values, meet our expert team, and understand how we're transforming the lending industry." />
        <meta name="twitter:image" content="https://loanflowpro.com/about-twitter-image.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About LoanFlowPro",
          "description": "Learn about LoanFlowPro's mission to revolutionize loan management",
          "url": "https://loanflowpro.com/about",
          "mainEntity": {
            "@type": "Organization",
            "name": "LoanFlowPro",
            "description": "Professional loan management platform for modern lending operations",
            "url": "https://loanflowpro.com",
            "foundingDate": "2024",
            "industry": "Financial Technology"
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
            About
            <span className="text-[#D4AF37] block">LoanFlowPro</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
            Revolutionizing loan management with innovative technology and unwavering commitment to excellence
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                At LoanFlowPro, we're dedicated to transforming the lending industry by providing financial professionals with the tools they need to succeed in an increasingly complex market.
              </p>
              <p className="text-lg text-slate-600 mb-6">
                Our platform streamlines every aspect of loan management, from initial client contact to final closing, ensuring nothing falls through the cracks and every opportunity is maximized.
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
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">$2.5B+</div>
                  <div className="text-slate-600">Loans Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">98%</div>
                  <div className="text-slate-600">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">24/7</div>
                  <div className="text-slate-600">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">50+</div>
                  <div className="text-slate-600">Integrations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Innovation</h3>
              <p className="text-slate-600">
                We constantly push the boundaries of what's possible in loan management technology, always seeking new ways to improve efficiency and user experience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Trust</h3>
              <p className="text-slate-600">
                We build lasting relationships based on transparency, reliability, and consistent delivery of exceptional results for our clients.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Excellence</h3>
              <p className="text-slate-600">
                We strive for excellence in every aspect of our platform, from user interface design to customer support and everything in between.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              The passionate professionals behind LoanFlowPro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Sarah Johnson</h3>
              <p className="text-[#D4AF37] font-semibold mb-2">CEO & Founder</p>
              <p className="text-slate-600">
                15+ years in fintech, former VP at major lending institutions
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Michael Chen</h3>
              <p className="text-[#D4AF37] font-semibold mb-2">CTO</p>
              <p className="text-slate-600">
                Expert in scalable architecture and financial technology systems
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Emily Rodriguez</h3>
              <p className="text-[#D4AF37] font-semibold mb-2">Head of Product</p>
              <p className="text-slate-600">
                Former product manager at leading financial software companies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Join the Future of Lending?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Experience the power of LoanFlowPro and transform your loan management operations today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signin"
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="border-2 border-slate-300 hover:border-[#D4AF37] text-slate-300 hover:text-[#D4AF37] font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200"
            >
              Contact Sales
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
                <li><Link to="/about" className="text-[#D4AF37] font-semibold">About</Link></li>
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
