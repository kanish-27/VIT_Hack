import { useEffect, useState } from 'react';
import type { FC } from 'react';
import Layout from '../components/Layout';
import { checkHealth, getDisputes } from '../services/api';
import { Activity, AlertTriangle, ShieldCheck, TrendingUp, IndianRupee, CheckCircle2 } from 'lucide-react';
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
  const [disputes, setDisputes] = useState<any[]>([]);

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

    getDisputes().then(data => setDisputes(data)).catch(console.error);
  }, []);

  const activeDisputes = disputes.filter(d => d.status !== 'Resolved').length;
  const resolvedDisputes = disputes.filter(d => d.status === 'Resolved').length;
  const isResolved = resolvedDisputes > 0;
  const protectedIncome = isResolved ? 1800 : 0;
  
  // Create dynamic recent activity
  const recentActivity = [];
  if (isResolved) {
    recentActivity.push({
      title: `Dispute Resolved — ₹1,800 incentive restored`,
      time: 'Just now',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    });
  }
  recentActivity.push(...[
    { title: 'Rating Dispute Filed', time: '2 hours ago', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Income Guarantee Paid', time: 'Yesterday', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Shield Plan Upgraded', time: '3 days ago', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'System Analysis Complete', time: '1 week ago', icon: Activity, color: 'text-slate-500', bg: 'bg-slate-50' }
  ]);


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
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Protected Income</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">₹{protectedIncome.toLocaleString('en-IN')}</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-emerald-600 flex items-center">
              <span>{isResolved ? 'Restored today' : 'Awaiting review'}</span>
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
                <p className="text-sm font-medium text-slate-500">Shield Status</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Active</h3>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-500 flex items-center">
              <span>Coverage up to ₹50,000</span>
            </div>
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
              {recentActivity.slice(0, 4).map((activity, i) => {
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

      </div>
    </Layout>
  );
};

export default Dashboard;
