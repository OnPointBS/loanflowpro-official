import React, { useState, useMemo } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const Analytics: React.FC = () => {
  const { workspace } = useWorkspace();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedLoanType, setSelectedLoanType] = useState('all');

  // Fetch data from Convex
  const clients = useQuery(api.clients.listByWorkspace, { workspaceId: workspace?.id || "" as any }) || [];
  const loanFiles = useQuery(api.loanFiles.listByWorkspace, { workspaceId: workspace?.id || "" as any }) || [];
  const loanTypes = useQuery(api.loanTypes.listByWorkspace, { workspaceId: workspace?.id || "" as any }) || [];

  // Don't render until workspace is loaded
  if (!workspace?.id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalClients = clients.length;
    const totalLoans = loanFiles.length;
    const approvedLoans = loanFiles.filter(f => f.status === 'approved').length;
    const closedLoans = loanFiles.filter(f => f.status === 'closed').length;
    const pendingLoans = loanFiles.filter(f => f.status === 'pending').length;
    
    const conversionRate = totalLoans > 0 ? (approvedLoans / totalLoans * 100).toFixed(1) : '0';
    const closeRate = approvedLoans > 0 ? (closedLoans / approvedLoans * 100).toFixed(1) : '0';
    
    return {
      totalClients,
      totalLoans,
      approvedLoans,
      closedLoans,
      pendingLoans,
      conversionRate,
      closeRate
    };
  }, [clients, loanFiles]);

  // Loan status distribution
  const loanStatusData = useMemo(() => {
    const statuses = ['pending', 'under_review', 'approved', 'closed', 'rejected'];
    return statuses.map(status => ({
      status: status.replace('_', ' ').toUpperCase(),
      count: loanFiles.filter(f => f.status === status).length,
      percentage: loanFiles.length > 0 ? (loanFiles.filter(f => f.status === status).length / loanFiles.length * 100).toFixed(1) : '0'
    }));
  }, [loanFiles]);

  // Loan type performance
  const loanTypePerformance = useMemo(() => {
    const typeStats: { [key: string]: { total: number; approved: number; rate: string } } = {};
    
    loanTypes.forEach(type => {
      const typeLoans = loanFiles.filter(f => f.loanType === type.name);
      const approved = typeLoans.filter(f => f.status === 'approved').length;
      const rate = typeLoans.length > 0 ? (approved / typeLoans.length * 100).toFixed(1) : '0';
      
      typeStats[type.name] = {
        total: typeLoans.length,
        approved,
        rate
      };
    });
    
    return typeStats;
  }, [loanFiles, loanTypes]);

  // Monthly trends (mock data for now)
  const monthlyTrends = [
    { month: 'Jan', applications: 45, approvals: 38, closes: 32 },
    { month: 'Feb', applications: 52, approvals: 44, closes: 37 },
    { month: 'Mar', applications: 48, approvals: 41, closes: 35 },
    { month: 'Apr', applications: 61, approvals: 52, closes: 45 },
    { month: 'May', applications: 55, approvals: 47, closes: 40 },
    { month: 'Jun', applications: 58, approvals: 49, closes: 42 },
  ];

  // Top performing advisors (mock data)
  const topAdvisors = [
    { name: 'John Smith', loans: 24, conversionRate: '87.5%', avgTime: '18 days' },
    { name: 'Sarah Johnson', loans: 21, conversionRate: '85.7%', avgTime: '20 days' },
    { name: 'Mike Chen', loans: 19, conversionRate: '84.2%', avgTime: '22 days' },
    { name: 'Lisa Rodriguez', loans: 17, conversionRate: '82.4%', avgTime: '25 days' },
  ];

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Premium Header */}
      <div className="relative animate-fade-in-down">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 to-brand-orange-dark/10 rounded-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl mb-2 font-bold text-gray-800">Analytics & Insights</h1>
              <p className="text-lg text-gray-600">Track your loan performance, conversion rates, and business metrics</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Period:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">👥</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">📁</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Loans</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalLoans}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">📈</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.conversionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">✅</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Close Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.closeRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Status Distribution</h3>
          <div className="space-y-3">
            {loanStatusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">{item.status}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  <span className="text-xs text-gray-500">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loan Type Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Type Performance</h3>
          <div className="space-y-3">
            {Object.entries(loanTypePerformance).map(([type, stats]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{type}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-900">{stats.approved}/{stats.total}</span>
                  <span className="text-xs text-gray-500">({stats.rate}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-7 gap-4 text-center text-sm font-medium text-gray-500 border-b border-gray-200 pb-2">
              <div>Month</div>
              <div>Applications</div>
              <div>Approvals</div>
              <div>Closes</div>
              <div>App. Rate</div>
              <div>Close Rate</div>
              <div>Trend</div>
            </div>
            {monthlyTrends.map((trend, index) => {
              const appRate = ((trend.approvals / trend.applications) * 100).toFixed(1);
              const closeRate = ((trend.closes / trend.approvals) * 100).toFixed(1);
              const trendDirection = index > 0 ? 
                (trend.applications > monthlyTrends[index - 1].applications ? '↗️' : '↘️') : '➡️';
              
              return (
                <div key={trend.month} className="grid grid-cols-7 gap-4 text-center py-3 border-b border-gray-100 hover:bg-gray-50">
                  <div className="font-medium text-gray-900">{trend.month}</div>
                  <div className="text-gray-900">{trend.applications}</div>
                  <div className="text-gray-900">{trend.approvals}</div>
                  <div className="text-gray-900">{trend.closes}</div>
                  <div className="text-green-600 font-medium">{appRate}%</div>
                  <div className="text-blue-600 font-medium">{closeRate}%</div>
                  <div className="text-2xl">{trendDirection}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Performing Advisors */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Advisors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topAdvisors.map((advisor, index) => (
            <div key={advisor.name} className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-bold">{index + 1}</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{advisor.name}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{advisor.loans} loans</p>
                <p className="text-green-600 font-medium">{advisor.conversionRate} conversion</p>
                <p>{advisor.avgTime} avg time</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Conversion Rate Improving</p>
                <p className="text-xs text-gray-600">Your approval rate has increased by 12% this quarter</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">FHA Loans Performing Well</p>
                <p className="text-xs text-gray-600">FHA loans show 89% approval rate vs 76% overall</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Processing Time Optimization</p>
                <p className="text-xs text-gray-600">Average processing time reduced by 3 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm font-medium text-blue-900 mb-1">Focus on FHA Loans</p>
              <p className="text-xs text-blue-700">Your FHA performance is excellent. Consider marketing this strength.</p>
            </div>
            <div className="p-3 bg-green-50 rounded-md">
              <p className="text-sm font-medium text-green-900 mb-1">Optimize Conventional Process</p>
              <p className="text-xs text-green-700">Conventional loans have lower conversion. Review your process.</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-md">
              <p className="text-sm font-medium text-yellow-900 mb-1">Staff Training</p>
              <p className="text-xs text-yellow-700">Consider additional training for advisors with lower conversion rates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
