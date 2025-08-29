import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function ProfessionalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setActiveMegaMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setActiveMegaMenu(null);
  }, [location]);

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    setActiveMegaMenu(null);
  };

  const toggleMegaMenu = (menu: string) => {
    setActiveMegaMenu(activeMegaMenu === menu ? null : menu);
    setActiveDropdown(null);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 text-2xl font-bold text-[#D4AF37] tracking-tight">
              <img
                src="/wave-icon.svg"
                alt="LoanFlowPro Logo"
                className="w-8 h-8"
              />
              <span>LoanFlowPro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Home */}
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
                  : 'text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {/* About Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('about')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  activeDropdown === 'about' || location.pathname.startsWith('/about')
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
                    : 'text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50'
                }`}
              >
                <span>About</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === 'about' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                  <Link
                    to="/about"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors duration-200"
                  >
                    Company Overview
                  </Link>
                  <Link
                    to="/about#mission"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors duration-200"
                  >
                    Mission & Values
                  </Link>
                  <Link
                    to="/about#team"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors duration-200"
                  >
                    Our Team
                  </Link>
                  <Link
                    to="/about#careers"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors duration-200"
                  >
                    Careers
                  </Link>
                </div>
              )}
            </div>

            {/* Features Mega Menu */}
            <div className="relative">
              <button
                onClick={() => toggleMegaMenu('features')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  activeMegaMenu === 'features' || location.pathname.startsWith('/features')
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
                    : 'text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50'
                }`}
              >
                <span>Features</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${activeMegaMenu === 'features' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeMegaMenu === 'features' && (
                <div className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-lg shadow-xl border border-slate-200 py-6 z-50">
                  <div className="grid grid-cols-2 gap-8 px-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Core Features</h3>
                      <div className="space-y-3">
                        <Link
                          to="/features/client-management"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 group"
                        >
                          <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors duration-200">
                            <svg className="w-4 h-4 text-[#D4AF37] group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 group-hover:text-[#D4AF37] transition-colors duration-200">Client Management</div>
                            <div className="text-sm text-slate-600">Organize and track all your clients</div>
                          </div>
                        </Link>
                        
                        <Link
                          to="/features/document-management"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 group"
                        >
                          <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors duration-200">
                            <svg className="w-4 h-4 text-[#D4AF37] group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 group-hover:text-[#D4AF37] transition-colors duration-200">Document Management</div>
                            <div className="text-sm text-slate-600">Secure storage and organization</div>
                          </div>
                        </Link>
                        
                        <Link
                          to="/features/task-automation"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 group"
                        >
                          <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors duration-200">
                            <svg className="w-4 h-4 text-[#D4AF37] group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 group-hover:text-[#D4AF37] transition-colors duration-200">Task Automation</div>
                            <div className="text-sm text-slate-600">Streamline workflows and processes</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Advanced Features</h3>
                      <div className="space-y-3">
                        <Link
                          to="/features/loan-processing"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 group"
                        >
                          <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors duration-200">
                            <svg className="w-4 h-4 text-[#D4AF37] group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 group-hover:text-[#D4AF37] transition-colors duration-200">Loan Processing</div>
                            <div className="text-sm text-slate-600">End-to-end loan management</div>
                          </div>
                        </Link>
                        
                        <Link
                          to="/features/reporting-analytics"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 group"
                        >
                          <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors duration-200">
                            <svg className="w-4 h-4 text-[#D4AF37] group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 group-hover:text-[#D4AF37] transition-colors duration-200">Reporting & Analytics</div>
                            <div className="text-sm text-slate-600">Data-driven insights</div>
                          </div>
                        </Link>
                        
                        <Link
                          to="/features/compliance-security"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 group"
                        >
                          <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors duration-200">
                            <svg className="w-4 h-4 text-[#D4AF37] group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 group-hover:text-[#D4AF37] transition-colors duration-200">Compliance & Security</div>
                            <div className="text-sm text-slate-600">Enterprise-grade protection</div>
                          </div>
                        </Link>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-slate-200">
                        <Link
                          to="/features"
                          className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200"
                        >
                          View All Features
                          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('solutions')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  activeDropdown === 'solutions'
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
                    : 'text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50'
                }`}
              >
                <span>Solutions</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'solutions' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === 'solutions' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                  <Link
                    to="/solutions/small-business"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors duration-200"
                  >
                    Small Business Lending
                  </Link>
                  <Link
                    to="/solutions/commercial"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors duration-200"
                  >
                    Commercial Lending
                  </Link>
                  <Link
                    to="/solutions/consumer"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors duration-200"
                  >
                    Consumer Lending
                  </Link>
                  <Link
                    to="/solutions/mortgage"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors duration-200"
                  >
                    Mortgage Lending
                  </Link>
                  <Link
                    to="/solutions/enterprise"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors duration-200"
                  >
                    Enterprise Solutions
                  </Link>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('resources')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  activeDropdown === 'resources'
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
                    : 'text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50'
                }`}
              >
                <span>Resources</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === 'resources' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                  <Link
                    to="/resources/blog"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors duration-200"
                  >
                    Blog & Insights
                  </Link>
                  <Link
                    to="/resources/guides"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors duration-200"
                  >
                    Guides & Tutorials
                  </Link>
                  <Link
                    to="/resources/webinars"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors duration-200"
                  >
                    Webinars & Events
                  </Link>
                  <Link
                    to="/resources/case-studies"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors duration-200"
                  >
                    Case Studies
                  </Link>
                  <Link
                    to="/resources/api-docs"
                    className="block px-4 py-2 text-sm text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors duration-200"
                  >
                    API Documentation
                  </Link>
                </div>
              )}
            </div>

            {/* Pricing */}
            <Link
              to="/pricing"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/pricing') 
                  ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
                  : 'text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50'
              }`}
            >
              Pricing
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/contact') 
                  ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
                  : 'text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right side - Login Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link
              to="/signin"
              className="hidden md:block bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Sign In
            </Link>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
            >
              <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4">
            <div className="space-y-2">
              <Link
                to="/"
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
                    : 'text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50'
                }`}
              >
                Home
              </Link>
              
              <Link
                to="/about"
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  location.pathname.startsWith('/about')
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
                    : 'text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50'
                }`}
              >
                About
              </Link>
              
              <Link
                to="/features"
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  location.pathname.startsWith('/features')
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
                    : 'text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50'
                }`}
              >
                Features
              </Link>
              
              <Link
                to="/pricing"
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive('/pricing') 
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
                    : 'text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50'
                }`}
              >
                Pricing
              </Link>
              
              <Link
                to="/contact"
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive('/contact') 
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
                    : 'text-slate-700 hover:text-[#D4AF37] hover:bg-slate-50'
                }`}
              >
                Contact
              </Link>
              
              <div className="pt-2 border-t border-slate-200">
                <Link
                  to="/signin"
                  className="block w-full text-center bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
