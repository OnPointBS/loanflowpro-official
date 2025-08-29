import React from 'react';
import { Helmet } from 'react-helmet-async';
import ProfessionalNav from '../../components/ProfessionalNav';
import { Link } from 'react-router-dom';

export default function TaskAutomation() {
  return (
    <>
      <Helmet>
        <title>Task Automation Software - LoanFlowPro | Streamline Workflows & Processes</title>
        <meta name="description" content="LoanFlowPro's task automation software helps you streamline workflows and processes to save time, reduce errors, and ensure consistent loan processing." />
        <meta name="keywords" content="task automation software, workflow automation, loan process automation, business process automation, lending workflow, mortgage automation" />
        <link rel="canonical" href="https://loanflowpro.com/features/task-automation" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Task Automation Software - LoanFlowPro" />
        <meta property="og:description" content="Streamline workflows and processes to save time, reduce errors, and ensure consistent loan processing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/features/task-automation" />
        <meta property="og:image" content="https://loanflowpro.com/task-automation-og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Task Automation Software - LoanFlowPro" />
        <meta name="twitter:description" content="Streamline workflows and processes to save time, reduce errors, and ensure consistent loan processing." />
        <meta name="twitter:image" content="https://loanflowpro.com/task-automation-twitter-image.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Task Automation Software - LoanFlowPro",
          "description": "Task automation software for loan professionals",
          "url": "https://loanflowpro.com/features/task-automation",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "LoanFlowPro Task Automation",
            "description": "Task automation software for loan professionals",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "featureList": [
              "Workflow Automation",
              "Process Optimization",
              "Error Reduction",
              "Consistent Processing",
              "Time Savings",
              "Custom Workflows"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Task Automation
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
            Automate repetitive tasks and workflows to save time, reduce errors, and ensure consistent loan processing
          </p>
        </div>
      </section>

      {/* Feature Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Streamline Your Workflows
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Eliminate manual, time-consuming tasks with intelligent automation that adapts to your business processes. Our system learns from your workflows and continuously improves efficiency.
              </p>
              <p className="text-lg text-slate-600 mb-6">
                From simple reminders to complex multi-step processes, Task Automation ensures nothing falls through the cracks while freeing your team to focus on high-value activities.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-slate-900">Reduce manual work by 60%</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">24/7</div>
                  <div className="text-slate-600">Operation</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">99.9%</div>
                  <div className="text-slate-600">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">Real-time</div>
                  <div className="text-slate-600">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">Smart</div>
                  <div className="text-slate-600">Learning</div>
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
              Automation Capabilities
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful tools to automate every aspect of your loan operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Workflow Templates</h3>
              <p className="text-slate-600">
                Pre-built templates for common loan processes that you can customize to match your specific business requirements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Automated Reminders</h3>
              <p className="text-slate-600">
                Smart notification system that sends timely reminders for follow-ups, document requests, and important deadlines.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Task Dependencies</h3>
              <p className="text-slate-600">
                Set up complex workflows where tasks automatically trigger based on completion of prerequisite activities.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Progress Tracking</h3>
              <p className="text-slate-600">
                Real-time visibility into task completion rates, bottlenecks, and overall workflow performance with detailed analytics.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Smart Routing</h3>
              <p className="text-slate-600">
                Intelligent task assignment based on team member skills, workload, and availability to optimize efficiency.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Error Prevention</h3>
              <p className="text-slate-600">
                Built-in validation rules and automated checks prevent common errors and ensure data quality throughout the process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Examples */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Common Workflow Examples
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how automation transforms your daily operations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Client Onboarding</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <span className="text-slate-700">New client application received</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <span className="text-slate-700">Automated document request sent</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <span className="text-slate-700">Team member assigned based on workload</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                  <span className="text-slate-700">Follow-up reminders scheduled</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Document Review</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <span className="text-slate-700">Document uploaded to system</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <span className="text-slate-700">OCR processing and categorization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <span className="text-slate-700">Review task created and assigned</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                  <span className="text-slate-700">Approval workflow triggered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose Task Automation?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transform your operational efficiency and team productivity
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
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Increased Productivity</h3>
                  <p className="text-slate-600">Automate routine tasks and free up your team to focus on high-value activities that drive business growth.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Reduction</h3>
                  <p className="text-slate-600">Eliminate human errors with automated validation, consistent processes, and built-in quality checks.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Better Compliance</h3>
                  <p className="text-slate-600">Ensure regulatory compliance with automated audit trails, consistent documentation, and standardized processes.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Performance Impact</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Time Savings</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">60%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Error Reduction</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Process Speed</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">+300%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Team Efficiency</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">+45%</span>
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
            Ready to Automate Your Workflows?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Experience the power of intelligent task automation and see how it can transform your loan operations.
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
