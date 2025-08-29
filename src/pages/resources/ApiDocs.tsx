import React from 'react';
import { Link } from 'react-router-dom';
import ProfessionalNav from '../../components/ProfessionalNav';
import { Helmet } from 'react-helmet-async';

const ApiDocs: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>API Documentation | LoanFlowPro</title>
        <meta name="description" content="Comprehensive API documentation for integrating LoanFlowPro with your existing systems. RESTful APIs, authentication, and code examples." />
        <meta name="keywords" content="loan management API, lending API documentation, REST API, financial services API, integration documentation" />
        <link rel="canonical" href="https://loanflowpro.com/resources/api-docs" />
        
        {/* Open Graph */}
        <meta property="og:title" content="API Documentation | LoanFlowPro" />
        <meta property="og:description" content="Comprehensive API documentation for integrating LoanFlowPro with your existing systems." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanflowpro.com/resources/api-docs" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="API Documentation | LoanFlowPro" />
        <meta name="twitter:description" content="Comprehensive API documentation for integrating LoanFlowPro with your existing systems." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "API Documentation",
          "description": "Comprehensive API documentation for integrating LoanFlowPro with your existing systems",
          "url": "https://loanflowpro.com/resources/api-docs",
          "mainEntity": {
            "@type": "TechArticle",
            "name": "LoanFlowPro API Documentation",
            "description": "RESTful API documentation and integration guides"
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
                API
                <span className="text-[#D4AF37] block">Documentation</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Comprehensive API documentation for integrating LoanFlowPro with your existing systems. RESTful APIs, authentication, and code examples.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transform-gpu"
                >
                  Get API Access
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

        {/* Quick Start Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Quick Start
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Get up and running with our API in minutes
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Authentication */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">1. Authentication</h3>
                <p className="text-slate-600 mb-4">
                  Get your API key and set up authentication headers for all requests.
                </p>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm font-mono">
                  Authorization: Bearer YOUR_API_KEY
                </div>
              </div>

              {/* First Request */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">2. First Request</h3>
                <p className="text-slate-600 mb-4">
                  Make your first API call to retrieve loan data or create a new loan.
                </p>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm font-mono">
                  GET /api/v1/loans
                </div>
              </div>

              {/* Integration */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">3. Integration</h3>
                <p className="text-slate-600 mb-4">
                  Integrate the API into your existing systems and workflows.
                </p>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm font-mono">
                  Webhooks & Real-time updates
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Endpoints Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Core API Endpoints
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Essential endpoints for loan management operations
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Loans Endpoint */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">GET</span>
                      <span className="font-mono text-lg">/api/v1/loans</span>
                    </div>
                    <p className="text-slate-600 mb-4">
                      Retrieve a list of loans with optional filtering, sorting, and pagination.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Query Parameters</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• <code>status</code> - Filter by loan status</li>
                          <li>• <code>client_id</code> - Filter by client</li>
                          <li>• <code>limit</code> - Number of results (max 100)</li>
                          <li>• <code>offset</code> - Pagination offset</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Response</h4>
                        <div className="bg-slate-900 text-green-400 p-3 rounded-lg text-sm font-mono">
                          {`{
  "loans": [...],
  "total": 150,
  "limit": 20,
  "offset": 0
}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Create Loan Endpoint */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">POST</span>
                      <span className="font-mono text-lg">/api/v1/loans</span>
                    </div>
                    <p className="text-slate-600 mb-4">
                      Create a new loan with client information, loan details, and terms.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Request Body</h4>
                        <div className="bg-slate-900 text-green-400 p-3 rounded-lg text-sm font-mono">
                          {`{
  "client_id": "123",
  "loan_type": "commercial",
  "amount": 500000,
  "term": 60,
  "rate": 5.25
}`}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Response</h4>
                        <div className="bg-slate-900 text-green-400 p-3 rounded-lg text-sm font-mono">
                          {`{
  "loan_id": "456",
  "status": "pending",
  "created_at": "2024-03-15T10:00:00Z"
}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Loan Endpoint */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">PUT</span>
                      <span className="font-mono text-lg">/api/v1/loans/{'{loan_id}'}</span>
                    </div>
                    <p className="text-slate-600 mb-4">
                      Update an existing loan's information, status, or terms.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Request Body</h4>
                        <div className="bg-slate-900 text-green-400 p-3 rounded-lg text-sm font-mono">
                          {`{
  "status": "approved",
  "approved_amount": 500000,
  "approved_rate": 5.25
}`}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Response</h4>
                        <div className="bg-slate-900 text-green-400 p-3 rounded-lg text-sm font-mono">
                          {`{
  "loan_id": "456",
  "status": "approved",
  "updated_at": "2024-03-15T14:30:00Z"
}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Code Examples
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Get started quickly with these code examples in popular programming languages
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* JavaScript Example */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">JavaScript/Node.js</h3>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  {`const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://api.loanflowpro.com/v1',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

// Get all loans
const getLoans = async () => {
  try {
    const response = await apiClient.get('/loans');
    return response.data;
  } catch (error) {
    console.error('Error fetching loans:', error);
  }
};

// Create a new loan
const createLoan = async (loanData) => {
  try {
    const response = await apiClient.post('/loans', loanData);
    return response.data;
  } catch (error) {
    console.error('Error creating loan:', error);
  }
};`}
                </div>
              </div>

              {/* Python Example */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Python</h3>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  {`import requests

class LoanFlowProAPI:
    def __init__(self, api_key):
        self.base_url = 'https://api.loanflowpro.com/v1'
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def get_loans(self, params=None):
        response = requests.get(
            f'{self.base_url}/loans',
            headers=self.headers,
            params=params
        )
        return response.json()
    
    def create_loan(self, loan_data):
        response = requests.post(
            f'{self.base_url}/loans',
            headers=self.headers,
            json=loan_data
        )
        return response.json()

# Usage
api = LoanFlowProAPI('YOUR_API_KEY')
loans = api.get_loans({'status': 'pending'})`}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication & Security Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Authentication & Security
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Secure your API integration with proper authentication and security practices
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">API Keys</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">Generate API keys from your dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">Include in Authorization header</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">Rotate keys regularly for security</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Rate Limiting</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">1000 requests per minute per API key</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">Monitor usage with response headers</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">Implement exponential backoff for retries</span>
                  </li>
                </ul>
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
              Ready to Integrate?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Get started with our API and transform your lending operations today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500 shadow-lg hover:shadow-xl"
              >
                Get API Access
              </Link>
              <Link
                to="/resources/guides"
                className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-500"
              >
                View Integration Guides
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

export default ApiDocs;
