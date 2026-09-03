import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FC } from 'react';
import Layout from '../components/Layout';
import { checkHealth, getDashboardData } from '../services/api';
import { Activity, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockIncomeData = [
  { name: 'Mon', income: 800 },
  { name: 'Tue', income: 1100 },
  { name: 'Wed', income: 900 },
  { name: 'Thu', income: 1400 },
  { name: 'Fri', income: 1800 },
  { name: 'Sat', income: 2100 },
  { name: 'Sun', income: 1500 },
];

const Dashboard: FC = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    checkHealth()
      .then((data) => {
        if (data.status === 'ok') {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      })
      .catch(() => {
        setApiStatus('offline');
      });

    getDashboardData().then(data => setDashboardData(data)).catch(console.error);
  }, []);

  const activeDisputes = dashboardData?.active_disputes || 0;
  const resolvedDisputes = dashboardData?.resolved_disputes || 0;
  const protectionScore = dashboardData?.protection_score || 0;
  
  // Create dynamic recent activity
  const recentActivity = (dashboardData?.recent_activity || []).map((activity: any) => {
    let icon = Activity;
    let color = 'text-slate-500';
    let bg = 'bg-slate-50';

    if (activity.type === 'success') {
      icon = CheckCircle2;
      color = 'text-emerald-500';
      bg = 'bg-emerald-50';
    } else if (activity.type === 'warning') {
      icon = AlertTriangle;
      color = 'text-amber-500';
      bg = 'bg-amber-50';
    } else if (activity.type === 'error') {
      icon = AlertTriangle;
      color = 'text-red-500';
      bg = 'bg-red-50';
    }

    return {
      title: activity.title,
      time: activity.time,
      icon,
      color,
      bg
    };
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard overview</h1>
            <p className="text-slate-500 mt-1">Welcome back. Here is your GigShield summary.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <div className={`h-2.5 w-2.5 rounded-full mr-2 ${apiStatus === 'online' ? 'bg-emerald-500' : apiStatus === 'checking' ? 'bg-amber-400' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-slate-700">
              API Status: {apiStatus.charAt(0).toUpperCase() + apiStatus.slice(1)}
            </span>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 pointer-events-none"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-500">Incentive Shield</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  ₹{(dashboardData?.shield?.amount || 0).toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-blue-600 relative z-10">
              <div className="font-medium mb-1">{dashboardData?.shield?.status || 'Not Active'}:</div> 
              <div className="text-xs text-blue-700/80 leading-relaxed">{dashboardData?.shield?.explanation || 'No active protections.'}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Disputes</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{activeDisputes}</h3>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-500 flex items-center">
              <span>{activeDisputes > 0 ? `${activeDisputes} awaiting review` : 'All clear'}</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Resolved</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{resolvedDisputes}</h3>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-emerald-600 flex items-center">
              <span>Disputes resolved</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Protection Score</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{protectionScore}/100</h3>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
              {dashboardData?.score_explanation || 'Based on verification'}
            </div>
          </div>
        </div>

        {/* Protection Factors & Earnings Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
             <div className="mb-4 border-b border-slate-100 pb-2">
               <h3 className="text-lg font-semibold text-slate-800">Protection Factors</h3>
             </div>
             <div className="space-y-3">
               <div>
                 <h4 className="text-sm font-medium text-emerald-700 mb-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> Positive Factors</h4>
                 <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                   {(dashboardData?.protection_factors?.positive || []).map((factor: string, i: number) => (
                     <li key={i}>{factor}</li>
                   ))}
                   {(!dashboardData?.protection_factors?.positive || dashboardData.protection_factors.positive.length === 0) && (
                     <li className="text-slate-400 italic">No specific positive factors identified.</li>
                   )}
                 </ul>
               </div>
               <div>
                 <h4 className="text-sm font-medium text-amber-700 mb-2 flex items-center"><AlertTriangle className="w-4 h-4 mr-1"/> Review Factors</h4>
                 <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                   {(dashboardData?.protection_factors?.review || []).map((factor: string, i: number) => (
                     <li key={i}>{factor}</li>
                   ))}
                   {(!dashboardData?.protection_factors?.review || dashboardData.protection_factors.review.length === 0) && (
                     <li className="text-slate-400 italic">No review factors identified.</li>
                   )}
                 </ul>
               </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Earnings Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-sm text-slate-600">Total Protected (Historical)</span>
                <span className="font-semibold text-slate-900">₹{(dashboardData?.earnings_breakdown?.total_protected || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-sm text-slate-600">Amount Recovered</span>
                <span className="font-semibold text-emerald-600">₹{(dashboardData?.earnings_breakdown?.amount_recovered || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-sm text-slate-600">Amount At Risk</span>
                <span className="font-semibold text-amber-600">₹{(dashboardData?.earnings_breakdown?.amount_at_risk || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Protected Disruptions</span>
                <span className="font-semibold text-slate-900">{dashboardData?.earnings_breakdown?.protected_disruptions || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Insights */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Verification Insights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {(dashboardData?.verification_insights || []).map((insight: any, i: number) => (
              <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="text-sm font-medium text-slate-500 mb-2 truncate" title={insight.signal}>{insight.signal}</div>
                <div className="flex items-end">
                  <span className="text-2xl font-bold text-slate-900">{insight.percentage}%</span>
                  <span className="text-xs text-slate-500 ml-1 mb-1">verified</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${insight.percentage}%` }}></div>
                </div>
              </div>
            ))}
            {(!dashboardData?.verification_insights || dashboardData.verification_insights.length === 0) && (
              <div className="col-span-full text-center py-6 text-slate-500 text-sm">
                No verification insights available yet.
              </div>
            )}
          </div>
        </div>

        {/* Charts & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Income History</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockIncomeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`₹${value}`, 'Income']}
                  />
                  <Line type="monotone" dataKey="income" stroke="#2563EB" strokeWidth={3} dot={{r: 4, fill: '#2563EB', strokeWidth: 0}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.slice(0, 4).map((activity: any, i: number) => {
                const Icon = activity.icon;
                return (
                <div key={i} className="flex items-start">
                  <div className={`p-2 rounded-full ${activity.bg} mr-3 mt-0.5`}>
                    <Icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
                );
              })}
            </div>
            <button className="mt-6 w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors border border-blue-200 rounded-lg hover:bg-blue-50">
              View all activity
            </button>
          </div>
        </div>
        {/* Recent Disputes Cards */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Recent Disputes</h3>
            <Link to="/disputes" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(dashboardData?.recent_disputes || []).map((dispute: any) => (
              <Link key={dispute.id} to={`/disputes/${dispute.id}`} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all block group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    {dispute.id}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                    dispute.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                    dispute.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {dispute.status}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{dispute.penalty_type}</h4>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{dispute.complaint}</p>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-slate-500">Amount at risk:</span>
                    <span className="font-semibold text-slate-900 ml-1">₹{dispute.amount_at_risk}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {dispute.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
