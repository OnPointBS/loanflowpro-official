import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProfessionalNav from '../components/ProfessionalNav';
import { Helmet } from 'react-helmet-async';
import FiberWaves from '../components/ui/shadcn-io/fiber-waves';

const Landing: React.FC = () => {

  // Refs for parallax elements
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Add smooth scrolling for anchor links
  React.useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        if (id) {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

        // Parallax scrolling effect - DISABLED for all sections
      // useEffect(() => {
      //   const handleScroll = () => {
      //     const scrolled = window.pageYOffset;
      //     const rate = scrolled * -0.5;

      //     // Hero parallax
      //     if (heroRef.current) {
      //       const heroContent = heroRef.current.querySelector('.hero-content');
      //       if (heroContent) {
      //         (heroContent as HTMLElement).style.transform = `translateY(${rate * 0.3}px)`;
      //       }
      //     }

      //     // Features parallax - DISABLED to prevent overlap
      //     // if (featuresRef.current) {
      //     //   const cards = featuresRef.current.querySelectorAll('.feature-card');
      //     //   cards.forEach((card, index) => {
      //     //     const delay = index * 0.05;
      //     //     const cardRate = rate * (0.1 + delay);
      //     //     (card as HTMLElement).style.transform = `translateY(${cardRate}px)`;
      //     //   });
      //     // }

      //     // Pricing parallax
      //     if (pricingRef.current) {
      //       const plans = pricingRef.current.querySelectorAll('.pricing-plan');
      //       plans.forEach((plan, index) => {
      //         const delay = index * 0.15;
      //         const planRate = rate * (0.15 + delay);
      //         (plan as HTMLElement).style.transform = `translateY(${planRate}px)`;
      //       });
      //     }

      //     // Contact parallax
      //     if (contactRef.current) {
      //       const contactContent = contactRef.current.querySelector('.contact-content');
      //       if (contactContent) {
      //         (contactContent as HTMLElement).style.transform = `translateY(${rate * 0.25}px)`;
      //       }
      //     }
      //   };

      //   window.addEventListener('scroll', handleScroll);
      //   return () => window.removeEventListener('scroll', handleScroll);
      // }, []);



  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>LoanFlowPro - Premium Loan Management Platform | Streamline Your Lending Operations</title>
        <meta name="description" content="Professional loan management platform designed for lenders, brokers, and financial advisors. Manage clients, track applications, and streamline your workflow with our comprehensive solution." />
        <meta name="keywords" content="loan management, loan processing, client management, document management, loan software, lending platform, mortgage software, financial services" />
        <link rel="canonical" href="https://loanflowpro.com/" />
        
        {/* Open Graph */}
        <meta property="og:title" content="LoanFlowPro - Premium Loan Management Platform" />
        <meta property="og:description" content="Professional loan management platform designed for lenders, brokers, and financial advisors. Manage clients, track applications, and streamline your workflow." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/" />
        <meta property="og:image" content="https://loanflowpro.com/og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LoanFlowPro - Premium Loan Management Platform" />
        <meta name="twitter:description" content="Professional loan management platform designed for lenders, brokers, and financial advisors. Manage clients, track applications, and streamline your workflow." />
        <meta name="twitter:image" content="https://loanflowpro.com/twitter-image.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "LoanFlowPro - Premium Loan Management Platform",
          "description": "Professional loan management platform designed for lenders, brokers, and financial advisors",
          "url": "https://loanflowpro.com/",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "LoanFlowPro",
            "description": "Professional loan management platform for modern lending operations",
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
      <section ref={heroRef} className="relative overflow-hidden py-16 min-h-screen flex items-center">
        {/* FiberWaves Background */}
        <div className="absolute inset-0 w-full h-full bg-slate-900/95">
          <FiberWaves 
            color={[0.83, 0.69, 0.22]}
            amplitude={2.0}
            distance={0.3}
            enableMouseInteraction={true}
          />
        </div>
        
        {/* Floating particles background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="floating-particle"
              style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 6}s`
              }}
            />
          ))}
        </div>
        
        {/* Content overlay */}
        <div className="hero-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center animate-on-scroll">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight animate-slide-up">
              Streamline Your
              <span className="text-[#D4AF37] block animate-slide-up-delay">Loan Management</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto animate-slide-up-delay-2">
              Professional loan management platform designed for lenders, brokers, and financial advisors. 
              Manage clients, track applications, and streamline your workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-delay-3">
              <Link
                to="/signin"
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transform-gpu"
              >
                Get Started Free
              </Link>
                                <Link
                    to="/features"
                    className="border-2 border-slate-300 hover:border-[#D4AF37] text-slate-300 hover:text-[#D4AF37] font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105 transform-gpu"
                  >
                    Learn More
                  </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 bg-slate-50 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100/50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 animate-slide-up">
              Powerful Features for Modern Lending
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-slide-up-delay">
              Everything you need to manage loans efficiently and grow your business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Client Management */}
            <div className="feature-card bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu animate-on-scroll">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Client Management</h3>
              <p className="text-slate-600 mb-6">
                Organize and track all your clients in one place with detailed profiles, communication history, and relationship management tools.
              </p>
              <Link
                to="/features/client-management"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Document Management */}
            <div className="feature-card bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu animate-on-scroll">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Document Management</h3>
              <p className="text-slate-600 mb-6">
                Securely store and organize all loan documents with automated categorization, OCR scanning, and advanced search capabilities.
              </p>
              <Link
                to="/features/document-management"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Task Automation */}
            <div className="feature-card bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu animate-on-scroll">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Task Automation</h3>
              <p className="text-slate-600 mb-6">
                Automate repetitive tasks and workflows to save time, reduce errors, and ensure consistent loan processing.
              </p>
              <Link
                to="/features/task-automation"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Loan Processing */}
            <div className="feature-card bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu animate-on-scroll">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Loan Processing</h3>
              <p className="text-slate-600 mb-6">
                Streamlined loan application processing with customizable workflows, status tracking, and approval management.
              </p>
              <Link
                to="/features/loan-processing"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Compliance & Reporting */}
            <div className="feature-card bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu animate-on-scroll">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Compliance & Reporting</h3>
              <p className="text-slate-600 mb-6">
                Built-in compliance tools, audit trails, and comprehensive reporting to meet regulatory requirements and track performance.
              </p>
              <Link
                to="/features/compliance-security"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Analytics & Insights */}
            <div className="feature-card bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu animate-on-scroll">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Analytics & Insights</h3>
              <p className="text-slate-600 mb-6">
                Powerful analytics dashboard with real-time insights, performance metrics, and data-driven decision making tools.
              </p>
              <Link
                to="/features/reporting-analytics"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Communication Tools */}
            <div className="feature-card bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu animate-on-scroll">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Communication Tools</h3>
              <p className="text-slate-600 mb-6">
                Integrated messaging, email templates, and client portal for seamless communication throughout the loan process.
              </p>
              <Link
                to="/features/client-management"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Mobile Access */}
            <div className="feature-card bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu animate-on-scroll">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Mobile Access</h3>
              <p className="text-slate-600 mb-6">
                Full mobile functionality allowing you to manage loans, review documents, and stay connected from anywhere.
              </p>
              <Link
                to="/features/client-management"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Integration Hub */}
            <div className="feature-card bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu animate-on-scroll">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Integration Hub</h3>
              <p className="text-slate-600 mb-6">
                Seamlessly integrate with your existing systems, CRMs, accounting software, and third-party services.
              </p>
              <Link
                to="/features/client-management"
                className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 2px, transparent 2px), radial-gradient(circle at 75% 75%, #D4AF37 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-on-scroll">
            <h2 className="text-4xl font-bold text-white mb-6 animate-slide-up">
              Ready to Transform Your Loan Management?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto animate-slide-up-delay">
              Join thousands of professionals who trust LoanFlowPro to streamline their lending operations.
            </p>
            <Link
              to="/signin"
              className="btn-luxury bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl inline-block"
            >
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} id="pricing" className="py-20 bg-white relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-slate-50/50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 animate-slide-up">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-slide-up-delay">
              Choose the plan that fits your business needs
            </p>
          </div>
          
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Starter Plan */}
                <div className="pricing-plan bg-white p-8 rounded-xl shadow-lg border-2 border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu animate-on-scroll">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
                    <div className="text-4xl font-bold text-[#D4AF37] mb-2">$99</div>
                    <div className="text-slate-600">per month</div>
                    <p className="text-sm text-slate-500 mt-2">Perfect for growing practices</p>
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
                  </ul>
                  <Link
                    to="/signin"
                    className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-[1.02] transform-gpu text-center block"
                  >
                    Start Free Trial
                  </Link>
                </div>
                
                {/* Professional Plan */}
                <div className="pricing-plan bg-white p-8 rounded-xl shadow-lg border-2 border-[#D4AF37] relative hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] transform-gpu animate-on-scroll">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#D4AF37] text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Professional</h3>
                    <div className="text-4xl font-bold text-[#D4AF37] mb-2">$399</div>
                    <div className="text-slate-600">per month</div>
                    <p className="text-sm text-slate-500 mt-2">For established practices</p>
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
                  </ul>
                  <Link
                    to="/signin"
                    className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-[1.02] transform-gpu text-center block"
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} id="contact" className="py-20 bg-slate-50 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100/50"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 animate-slide-up">
              Get in Touch
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto animate-slide-up-delay">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          
          <div className="contact-content bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 animate-on-scroll">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors duration-200"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors duration-200"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors duration-200"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors duration-200"
                  placeholder="Tell us about your needs..."
                ></textarea>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#D4AF37] mb-4">LoanFlowPro</h3>
              <p className="text-slate-300">
                Professional loan management platform designed for modern lending operations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link to="/features" className="hover:text-[#D4AF37] transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-[#D4AF37] transition-colors">Pricing</Link></li>
                <li><Link to="/signin" className="hover:text-[#D4AF37] transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Contact</Link></li>
                <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors">About</Link></li>
                <li><Link to="#" className="hover:text-[#D4AF37] transition-colors">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link to="/help-center" className="hover:text-[#D4AF37] transition-colors">Help Center</Link></li>
                <li><Link to="/resources/guides" className="hover:text-[#D4AF37] transition-colors">Documentation</Link></li>
                <li><Link to="/status" className="hover:text-[#D4AF37] transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 LoanFlowPro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      </div>
    </>
  );
};

export default Landing;
