import React from 'react';
import { Helmet } from 'react-helmet-async';
import ProfessionalNav from '../../components/ProfessionalNav';
import { Link } from 'react-router-dom';

export default function ReportingAnalytics() {
  return (
    <>
      <Helmet>
        <title>Reporting & Analytics Software - LoanFlowPro | Data-Driven Insights</title>
        <meta name="description" content="LoanFlowPro's reporting and analytics software provides powerful insights with real-time data, performance metrics, and data-driven decision making tools for loan professionals." />
        <meta name="keywords" content="reporting software, analytics software, loan reporting, financial analytics, business intelligence, lending analytics, mortgage reporting" />
        <link rel="canonical" href="https://loanflowpro.com/features/reporting-analytics" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Reporting & Analytics Software - LoanFlowPro" />
        <meta property="og:description" content="Powerful analytics dashboard with real-time insights, performance metrics, and data-driven decision making tools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/features/reporting-analytics" />
        <meta property="og:image" content="https://loanflowpro.com/reporting-analytics-og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Reporting & Analytics Software - LoanFlowPro" />
        <meta name="twitter:description" content="Powerful analytics dashboard with real-time insights, performance metrics, and data-driven decision making tools." />
        <meta name="twitter:image" content="https://loanflowpro.com/reporting-analytics-twitter-image.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Reporting & Analytics Software - LoanFlowPro",
          "description": "Reporting and analytics software for loan professionals",
          "url": "https://loanflowpro.com/features/reporting-analytics",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "LoanFlowPro Reporting & Analytics",
            "description": "Reporting and analytics software for loan professionals",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "featureList": [
              "Real-time Analytics",
              "Performance Metrics",
              "Data Visualization",
              "Custom Reports",
              "Business Intelligence",
              "Decision Support"
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
          <div className="w-20 h-20 bg-[#D4AF37] rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Reporting & Analytics
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
            Transform your data into actionable insights with comprehensive reporting and real-time analytics
          </p>
        </div>
      </section>

      {/* Feature Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Data-Driven Decision Making
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Access real-time insights into your loan portfolio performance, team productivity, and business metrics. Our advanced analytics platform provides the visibility you need to make informed decisions and optimize your operations.
              </p>
              <p className="text-lg text-slate-600 mb-6">
                From customizable dashboards to automated reporting, you'll have everything needed to track KPIs, identify trends, and drive continuous improvement across your lending business.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-slate-900">Real-time insights and performance tracking</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">Real-time</div>
                  <div className="text-slate-600">Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">Custom</div>
                  <div className="text-slate-600">Dashboards</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">Automated</div>
                  <div className="text-slate-600">Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">Advanced</div>
                  <div className="text-slate-600">Analytics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Analytics Capabilities
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive tools to analyze, visualize, and report on your business data
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Custom Dashboards</h3>
              <p className="text-slate-600">
                Create personalized dashboards with the metrics that matter most to your business and team performance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Interactive Charts</h3>
              <p className="text-slate-600">
                Visualize your data with interactive charts, graphs, and heatmaps that make complex information easy to understand.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Financial Metrics</h3>
              <p className="text-slate-600">
                Track key financial indicators including loan volume, revenue, conversion rates, and portfolio performance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Team Performance</h3>
              <p className="text-slate-600">
                Monitor individual and team productivity, workload distribution, and performance metrics to optimize resource allocation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Automated Reports</h3>
              <p className="text-slate-600">
                Schedule and automate regular reports for stakeholders, ensuring everyone has access to current information.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Trend Analysis</h3>
              <p className="text-slate-600">
                Identify patterns and trends in your data to predict future performance and make proactive business decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Report Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Report Library
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Pre-built reports covering all aspects of your lending operations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Operational Reports</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">•</div>
                  <span className="text-slate-700">Loan pipeline status and progress</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">•</div>
                  <span className="text-slate-700">Document processing times</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">•</div>
                  <span className="text-slate-700">Task completion rates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">•</div>
                  <span className="text-slate-700">Team workload distribution</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Financial Reports</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">•</div>
                  <span className="text-slate-700">Revenue and profit analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">•</div>
                  <span className="text-slate-700">Loan volume trends</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">•</div>
                  <span className="text-slate-700">Conversion rate metrics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">•</div>
                  <span className="text-slate-700">Portfolio performance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Interactive Dashboard Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful tools to visualize and interact with your business data
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Real-time Updates</h3>
                  <p className="text-slate-600">All data updates in real-time, ensuring your reports and dashboards always reflect the current state of your business.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Drill-down Capability</h3>
                  <p className="text-slate-600">Click on any metric to drill down into the underlying data and understand what's driving your performance.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Export Options</h3>
                  <p className="text-slate-600">Export reports in multiple formats including PDF, Excel, and CSV for easy sharing and further analysis.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Widgets</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">KPI Cards</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Charts & Graphs</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Data Tables</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Progress Bars</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose Our Analytics?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transform your data into strategic advantages
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Data-Driven Decisions</h3>
                  <p className="text-slate-600">Make informed decisions based on real data rather than gut feelings or assumptions.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Performance Optimization</h3>
                  <p className="text-slate-600">Identify bottlenecks and inefficiencies to continuously improve your operations.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Stakeholder Communication</h3>
                  <p className="text-slate-600">Share clear, professional reports with clients, investors, and team members.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Business Impact</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Faster Decisions</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">+40%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Performance Visibility</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">100%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Report Generation</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">-80%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Data Accuracy</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">99.9%</span>
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
            Ready to Unlock Your Data's Potential?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Start making data-driven decisions with our comprehensive reporting and analytics platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signin"
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              to="/features"
              className="border-2 border-slate-300 hover:border-[#D4AF37] text-slate-300 hover:text-[#D4AF37] font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200"
            >
              View All Features
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
