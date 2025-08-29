import React, { useState } from 'react';

interface Subscription {
  plan: 'starter' | 'team';
  interval: 'monthly' | 'yearly';
  status: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  amount: number;
}

const Billing: React.FC = () => {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Mock data for MVP
  const subscription: Subscription = {
    plan: 'starter',
    interval: 'monthly',
    status: 'active',
    currentPeriodStart: Date.now() - 2592000000, // 30 days ago
    currentPeriodEnd: Date.now() + 86400000, // 1 day from now
    amount: 99,
  };

  const plans = [
    {
      name: 'Starter',
      price: 99,
      interval: 'month',
      features: [
        '1 user seat',
        '10 active clients',
        '100MB storage',
        'Documents Hub',
        'Basic support',
      ],
      current: subscription.plan === 'starter',
    },
    {
      name: 'Team',
      price: 299,
      interval: 'month',
      features: [
        '5 user seats',
        '50 active clients',
        '1GB storage',
        'Documents Hub',
        'Lender Export Branding',
        'Custom Links',
        'Priority support',
      ],
      current: subscription.plan === 'team',
    },
  ];

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Premium Header */}
      <div className="relative animate-fade-in-down">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 to-brand-orange-dark/10 rounded-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div>
            <h1 className="text-3xl lg:text-4xl mb-2 font-bold text-gray-800">Billing & Subscription</h1>
            <p className="text-lg text-gray-600">Manage your subscription and billing preferences</p>
          </div>
        </div>
      </div>

      {/* Current Subscription */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Subscription</h3>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
              </h4>
              <p className="text-sm text-gray-500">
                ${subscription.amount}/{subscription.interval}
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Current period:</span>
              <p className="text-gray-900">
                {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Next billing:</span>
              <p className="text-gray-900">{formatDate(subscription.currentPeriodEnd)}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              {subscription.plan === 'starter' ? 'Upgrade to Team' : 'Change Plan'}
            </button>
          </div>
        </div>
      </div>

      {/* Usage Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">1</div>
            <div className="text-sm text-gray-500">User Seats</div>
            <div className="text-xs text-gray-400">of 1 used</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">3</div>
            <div className="text-sm text-gray-500">Active Clients</div>
            <div className="text-xs text-gray-400">of 10 used</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">45%</div>
            <div className="text-sm text-gray-500">Storage Used</div>
            <div className="text-xs text-gray-400">45MB of 100MB</div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Plans</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-lg p-6 ${
                plan.current ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
              }`}
            >
              <div className="text-center">
                <h4 className="text-xl font-medium text-gray-900">{plan.name}</h4>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>
                
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6">
                  {plan.current ? (
                    <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100">
                      Current Plan
                    </span>
                  ) : (
                    <button
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                    >
                      {subscription.plan === 'starter' ? 'Upgrade' : 'Switch to'} {plan.name}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(Date.now() - 2592000000)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Starter Plan - Monthly
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $99.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upgrade Subscription</h3>
              <p className="text-sm text-gray-600 mb-4">
                You're about to upgrade to the Team plan. This will give you access to more features and higher limits.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">$299</div>
                  <div className="text-sm text-gray-500">per month</div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
