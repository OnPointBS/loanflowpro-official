import React from 'react';
import { Link } from 'react-router-dom';
import ProfessionalNav from '../../components/ProfessionalNav';
import { Helmet } from 'react-helmet-async';

const CaseStudies: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Case Studies | LoanFlowPro</title>
        <meta name="description" content="Discover real-world success stories and case studies from financial institutions using LoanFlowPro to transform their lending operations." />
        <meta name="keywords" content="loan management case studies, lending success stories, financial services case studies, loan processing success" />
        <link rel="canonical" href="https://loanflowpro.com/resources/case-studies" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Case Studies | LoanFlowPro" />
        <meta property="og:description" content="Discover real-world success stories from financial institutions using LoanFlowPro." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/resources/case-studies" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Case Studies | LoanFlowPro" />
        <meta name="twitter:description" content="Discover real-world success stories from financial institutions using LoanFlowPro." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Case Studies",
          "description": "Discover real-world success stories from financial institutions using LoanFlowPro",
          "url": "https://loanflowpro.com/resources/case-studies",
          "mainEntity": {
            "@type": "Article",
            "name": "LoanFlowPro Case Studies",
            "description": "Success stories and case studies from financial institutions"
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
                Case
                <span className="text-[#D4AF37] block">Studies</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Discover real-world success stories from financial institutions using LoanFlowPro to transform their lending operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transform-gpu"
                >
                  Request Demo
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

        {/* Featured Case Study Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Featured Success Story
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                How a regional bank achieved 300% growth in loan volume
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center text-sm text-slate-500 mb-4">
                    <span className="bg-[#D4AF37] text-white px-3 py-1 rounded-full text-xs font-medium">Featured</span>
                    <span className="mx-3">•</span>
                    <span>Regional Bank</span>
                    <span className="mx-3">•</span>
                    <span>500+ Employees</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-6">
                    Regional Bank Achieves 300% Growth in Loan Volume
                  </h3>
                  <p className="text-lg text-slate-600 mb-6">
                    Discover how First Regional Bank transformed their lending operations with LoanFlowPro, 
                    achieving unprecedented growth while maintaining compliance and customer satisfaction.
                  </p>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <div className="text-3xl font-bold text-[#D4AF37] mb-2">300%</div>
                      <div className="text-sm text-slate-600">Increase in loan volume</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#D4AF37] mb-2">60%</div>
                      <div className="text-sm text-slate-600">Reduction in processing time</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#D4AF37] mb-2">95%</div>
                      <div className="text-sm text-slate-600">Customer satisfaction rate</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#D4AF37] mb-2">$50M</div>
                      <div className="text-sm text-slate-600">Additional loans processed</div>
                    </div>
                  </div>
                  <Link
                    to="/contact"
                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 inline-flex items-center"
                  >
                    Read Full Case Study
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h4 className="text-xl font-semibold text-slate-900 mb-4">Key Results</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">Streamlined loan processing workflow</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">Automated compliance checking</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">Enhanced customer experience</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">Improved risk management</span>
                    </li>
                  </ul>
                </div>
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
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join hundreds of financial institutions that have transformed their lending operations with LoanFlowPro
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl"
              >
                Start Your Transformation
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

export default CaseStudies;
