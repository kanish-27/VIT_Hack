import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getDisputes } from '../services/api';
import { ShieldCheck, History, ArrowLeft, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface Dispute {
  id: string;
  date: string;
  penalty_type: string;
  complaint: string;
  amount_at_risk: number;
  status: string;
  incentive_shield_status: string;
  verification?: {
    decision: string;
  };
}

const ProtectionHistory: FC = () => {
  const [history, setHistory] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDisputes()
      .then(data => {
        // Filter out disputes that have some kind of protection or resolved status
        const protectedDisputes = data.filter((d: Dispute) => 
          ['Protected', 'Protected During Review', 'Incentive Restored'].includes(d.incentive_shield_status) ||
          d.status === 'Resolved'
        );
        // Sort by date descending
        protectedDisputes.sort((a: Dispute, b: Dispute) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setHistory(protectedDisputes);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load protection history. Please try again.');
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link to="/resilience" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Resilience
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <History className="h-6 w-6 mr-3 text-slate-700" />
            Protection History
          </h1>
          <p className="text-slate-500 mt-1">A record of your past protections and successfully restored earnings.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
            <ShieldAlert className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <ShieldCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p>No protection history found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Incident / Reference</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Amount Protected</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Verification</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Shield Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-sm text-slate-600 whitespace-nowrap">{item.date}</td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-900 text-sm">{item.penalty_type}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.id}</div>
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-emerald-600">
                        ₹{item.amount_at_risk.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {item.verification?.decision ? (
                           <span className="flex items-center text-emerald-600 font-medium text-xs">
                             <CheckCircle2 className="w-4 h-4 mr-1" />
                             Verified
                           </span>
                        ) : (
                          <span className="flex items-center text-amber-600 font-medium text-xs">
                             <AlertTriangle className="w-4 h-4 mr-1" />
                             Pending
                           </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                         <span className="flex items-center text-blue-600 text-sm font-medium">
                           <ShieldCheck className="h-4 w-4 mr-1" />
                           {item.incentive_shield_status}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProtectionHistory;
