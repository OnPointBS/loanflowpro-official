import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProfessionalNav from '../components/ProfessionalNav';

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>LoanFlowPro Pricing - Simple, Transparent Plans | Starting at $99/month</title>
        <meta name="description" content="Simple, transparent pricing for LoanFlowPro. Choose from Starter ($99/month) or Professional ($399/month) plans. Perfect for growing and established lending practices." />
        <meta name="keywords" content="loan management pricing, loan software cost, lending platform pricing, mortgage software pricing, loan management software pricing, financial software pricing" />
        <link rel="canonical" href="https://loanflowpro.com/pricing" />
        
        {/* Open Graph */}
        <meta property="og:title" content="LoanFlowPro Pricing - Simple, Transparent Plans" />
        <meta property="og:description" content="Simple, transparent pricing for LoanFlowPro. Choose from Starter ($99/month) or Professional ($399/month) plans." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/pricing" />
        <meta property="og:image" content="https://loanflowpro.com/pricing-og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LoanFlowPro Pricing - Simple, Transparent Plans" />
        <meta name="twitter:description" content="Simple, transparent pricing for LoanFlowPro. Choose from Starter ($99/month) or Professional ($399/month) plans." />
        <meta name="twitter:image" content="https://loanflowpro.com/pricing-twitter-image.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "LoanFlowPro Pricing",
          "description": "Simple, transparent pricing plans for loan management software",
          "url": "https://loanflowpro.com/pricing",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "LoanFlowPro",
            "description": "Professional loan management platform",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": [
              {
                "@type": "Offer",
                "name": "Starter Plan",
                "price": "99",
                "priceCurrency": "USD",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": "99",
                  "priceCurrency": "USD",
                  "billingIncrement": "P1M"
                }
              },
              {
                "@type": "Offer",
                "name": "Professional Plan",
                "price": "399",
                "priceCurrency": "USD",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": "399",
                  "priceCurrency": "USD",
                  "billingIncrement": "P1M"
                }
              }
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
            Simple, Transparent
            <span className="text-[#D4AF37] block">Pricing</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
            Choose the plan that fits your business needs. All plans include a 14-day free trial.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-[#D4AF37] mb-2">$99</div>
                <div className="text-slate-600 mb-4">per month</div>
                <p className="text-sm text-slate-500">Perfect for growing practices</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Up to 25 active loans
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Basic workflow templates
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Client portal access
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Email support
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Basic reporting
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mobile access
                </li>
              </ul>
              <Link
                to="/signin"
                className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-[1.02] transform-gpu block text-center"
              >
                Start Free Trial
              </Link>
            </div>
            
            {/* Professional Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-[#D4AF37] relative hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#D4AF37] text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Professional</h3>
                <div className="text-4xl font-bold text-[#D4AF37] mb-2">$399</div>
                <div className="text-slate-600 mb-4">per month</div>
                <p className="text-sm text-slate-500">For established practices</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited active loans
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom workflow builder
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  API access
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  White-label options
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom integrations
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced reporting
                </li>
              </ul>
              <Link
                to="/signin"
                className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-[1.02] transform-gpu block text-center"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Need Enterprise Features?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            For large organizations with custom requirements, we offer tailored enterprise solutions with dedicated support and custom development.
          </p>
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 rounded-2xl mb-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Custom Development</h3>
                <p className="text-slate-600">Tailored features for your specific needs</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Dedicated Support</h3>
                <p className="text-slate-600">24/7 phone and email support</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">SLA Guarantee</h3>
                <p className="text-slate-600">99.9% uptime guarantee</p>
              </div>
            </div>
          </div>
          <Link
            to="/contact"
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Contact Sales
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Can I change my plan at any time?
              </h3>
              <p className="text-slate-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                What's included in the free trial?
              </h3>
              <p className="text-slate-600">
                The 14-day free trial includes access to all features of the Professional plan, so you can experience the full power of LoanFlowPro before making a decision.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Do you offer annual billing discounts?
              </h3>
              <p className="text-slate-600">
                Yes, we offer a 20% discount for annual billing. This applies to both Starter and Professional plans.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Is there a setup fee?
              </h3>
              <p className="text-slate-600">
                No setup fees! You can get started immediately with your free trial. We only charge for the plan you choose after the trial period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of professionals who trust LoanFlowPro to streamline their lending operations.
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
                <li><Link to="/pricing" className="text-[#D4AF37] font-semibold">Pricing</Link></li>
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
