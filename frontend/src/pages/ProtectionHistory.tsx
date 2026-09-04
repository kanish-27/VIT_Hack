import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getDisputes } from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { ShieldCheck, History, ArrowLeft, CheckCircle2, AlertTriangle, ShieldAlert, Volume2 } from 'lucide-react';

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

  const { t, easyAccess, speak } = useAccessibility();

  useEffect(() => {
    getDisputes()
      .then(data => {
        const protectedDisputes = data.filter((d: Dispute) => 
          ['Protected', 'Protected During Review', 'Incentive Restored'].includes(d.incentive_shield_status) ||
          d.status === 'Resolved'
        );
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
      <div className={`max-w-7xl mx-auto space-y-6 ${easyAccess ? 'space-y-8' : ''}`}>
        {/* Header */}
        <div>
          <Link to="/resilience" className="inline-flex items-center font-bold text-blue-600 hover:text-blue-700 mb-4 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-1" />
            {t('back')}
          </Link>
          <div className="flex justify-between items-start">
            <h1 className={`font-extrabold text-slate-900 flex items-center ${easyAccess ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
              <History className="h-7 w-7 mr-3 text-slate-700" />
              {t('protection_history')}
            </h1>
            <button
              onClick={() => speak(`${t('protection_history')}. A log of past protected earnings and restored incentives. Total records: ${history.length}`, 'history_header')}
              className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
            >
              <Volume2 className="h-6 w-6" />
            </button>
          </div>
          <p className={`text-slate-600 mt-1 ${easyAccess ? 'text-xl font-medium' : 'text-base'}`}>
            A log of your past protected earnings and restored incentives.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-900 p-4 rounded-xl flex items-center">
            <ShieldAlert className="h-6 w-6 mr-2 text-red-600" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500 font-bold">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-bold">
              <ShieldCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p>No protection history found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase">{t('date')}</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase">Incident / Reference</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase">{t('total_protected')}</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase">{t('status')}</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase">Verification</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase">Shield Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-sm font-bold text-slate-600 whitespace-nowrap">{item.date}</td>
                      <td className="py-4 px-4">
                        <div className={`font-bold text-slate-900 ${easyAccess ? 'text-lg' : 'text-sm'}`}>{item.penalty_type}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.id}</div>
                      </td>
                      <td className={`py-4 px-4 font-black text-emerald-600 ${easyAccess ? 'text-xl' : 'text-sm'}`}>
                        ₹{item.amount_at_risk.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black ${item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {item.verification?.decision ? (
                           <span className="flex items-center text-emerald-600 font-extrabold text-xs">
                             <CheckCircle2 className="w-4 h-4 mr-1" />
                             Verified
                           </span>
                        ) : (
                          <span className="flex items-center text-amber-600 font-extrabold text-xs">
                             <AlertTriangle className="w-4 h-4 mr-1" />
                             Pending
                           </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                         <span className="flex items-center text-blue-600 font-bold text-sm">
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
