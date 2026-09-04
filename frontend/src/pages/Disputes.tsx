import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getDisputes } from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { AlertCircle, CheckCircle2, ShieldCheck, Clock, ShieldAlert, Volume2 } from 'lucide-react';

interface Dispute {
  id: string;
  worker_name: string;
  platform: string;
  delivery_id: string;
  date: string;
  penalty_type: string;
  customer_rating?: number;
  complaint: string;
  amount_at_risk: number;
  status: string;
  incentive_shield_status: string;
  pickup_time: string;
  delivery_time: string;
  pickup_location: string;
  delivery_location: string;
  completion_status: string;
}

const Disputes: FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t, easyAccess, speak } = useAccessibility();

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const data = await getDisputes();
      setDisputes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load disputes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const activeDisputes = disputes.filter(d => d.status !== 'Resolved');
  const resolvedDisputes = disputes.filter(d => d.status === 'Resolved');
  const totalProtected = disputes.reduce((sum, d) => sum + d.amount_at_risk, 0);

  return (
    <Layout>
      <div className={`max-w-7xl mx-auto space-y-6 ${easyAccess ? 'space-y-8' : ''}`}>
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className={`font-extrabold text-slate-900 ${easyAccess ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
              📋 {t('disputes_title')}
            </h1>
            <p className={`text-slate-600 mt-1 ${easyAccess ? 'text-xl font-medium' : 'text-base'}`}>
              {t('disputes_subtitle')}
            </p>
          </div>

          <button
            onClick={() => speak(`${t('disputes_title')}. ${t('disputes_subtitle')}. Active disputes: ${activeDisputes.length}`, 'disp_header')}
            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
            title={t('listen')}
          >
            <Volume2 className="h-6 w-6" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-sm flex items-center justify-between">
            <div>
              <p className={`font-bold text-amber-800 ${easyAccess ? 'text-lg' : 'text-sm'}`}>
                {t('active_disputes')}
              </p>
              <h3 className={`font-black text-slate-900 mt-1 ${easyAccess ? 'text-3xl' : 'text-2xl'}`}>
                {activeDisputes.length}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <AlertCircle className="h-7 w-7 text-amber-600" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-blue-200 shadow-sm flex items-center justify-between">
            <div>
              <p className={`font-bold text-blue-800 ${easyAccess ? 'text-lg' : 'text-sm'}`}>
                {t('under_review')}
              </p>
              <h3 className={`font-black text-slate-900 mt-1 ${easyAccess ? 'text-3xl' : 'text-2xl'}`}>
                {activeDisputes.filter(d => d.status === 'Under Review').length}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Clock className="h-7 w-7 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm flex items-center justify-between">
            <div>
              <p className={`font-bold text-emerald-800 ${easyAccess ? 'text-lg' : 'text-sm'}`}>
                {t('resolved')}
              </p>
              <h3 className={`font-black text-slate-900 mt-1 ${easyAccess ? 'text-3xl' : 'text-2xl'}`}>
                {resolvedDisputes.length}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className={`font-bold text-slate-700 ${easyAccess ? 'text-lg' : 'text-sm'}`}>
                {t('total_protected')}
              </p>
              <h3 className={`font-black text-slate-900 mt-1 ${easyAccess ? 'text-3xl' : 'text-2xl'}`}>
                ₹{totalProtected.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <ShieldCheck className="h-7 w-7 text-emerald-600" />
            </div>
          </div>

        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-900 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center">
              <ShieldAlert className="h-6 w-6 mr-2 text-red-600" />
              <span className="font-bold">{error}</span>
            </div>
            <button onClick={fetchDisputes} className="font-extrabold underline">Retry</button>
          </div>
        )}

        {/* Active Disputes */}
        <div className="space-y-4">
          <h2 className={`font-bold text-slate-900 ${easyAccess ? 'text-2xl' : 'text-lg'}`}>
            ⚠️ {t('active_disputes')}
          </h2>

          {loading ? (
            <div className="text-center py-8 text-slate-500 font-bold">Loading...</div>
          ) : activeDisputes.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 text-center text-slate-500 font-bold">
              {t('no_disputes_found')}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {activeDisputes.map(dispute => (
                <div key={dispute.id} className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full md:w-auto">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">{dispute.id}</p>
                      <p className={`font-black text-slate-900 ${easyAccess ? 'text-xl' : 'text-base'}`}>{dispute.penalty_type}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Delivery / Date</p>
                      <p className="font-bold text-slate-900">{dispute.delivery_id}</p>
                      <p className="text-xs text-slate-500">{dispute.date}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">{t('amount_at_risk')}</p>
                      <p className={`font-black text-red-600 ${easyAccess ? 'text-2xl' : 'text-lg'}`}>
                        ₹{dispute.amount_at_risk.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">{t('status')}</p>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black bg-amber-100 text-amber-800">
                        {dispute.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={() => speak(`Dispute ${dispute.id}. ${dispute.penalty_type}. Amount at risk: ${dispute.amount_at_risk} rupees. Status: ${dispute.status}`, `disp_${dispute.id}`)}
                      className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                    >
                      <Volume2 className="h-5 w-5" />
                    </button>
                    <Link
                      to={`/disputes/${dispute.id}`}
                      className={`flex-1 md:flex-initial px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-center transition-colors ${
                        easyAccess ? 'text-lg py-3.5' : 'text-sm'
                      }`}
                    >
                      {t('view_details')} &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resolved Disputes */}
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <h2 className={`font-bold text-slate-900 ${easyAccess ? 'text-2xl' : 'text-lg'}`}>
            ✅ {t('resolved')}
          </h2>

          {resolvedDisputes.map(dispute => (
            <div key={dispute.id} className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                  ✅ {t('resolved')} — ₹{dispute.amount_at_risk} Restored
                </span>
                <h4 className={`font-bold text-slate-900 mt-2 ${easyAccess ? 'text-xl' : 'text-base'}`}>
                  {dispute.penalty_type} ({dispute.delivery_id})
                </h4>
                <p className="text-xs text-slate-500">{dispute.date} • {dispute.pickup_location} → {dispute.delivery_location}</p>
              </div>

              <Link
                to={`/disputes/${dispute.id}`}
                className="px-5 py-2.5 border-2 border-slate-200 hover:bg-slate-50 font-bold text-slate-700 rounded-xl text-sm"
              >
                {t('view_details')}
              </Link>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
};

export default Disputes;
