import { useEffect, useState } from 'react';
import type { FC } from 'react';
import Layout from '../components/Layout';
import { getResilienceData, createDispute } from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { ShieldAlert, Map, AlertTriangle, ShieldCheck, IndianRupee, Activity, X, Volume2 } from 'lucide-react';

const Resilience: FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t, easyAccess, speak } = useAccessibility();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportSuccess, setReportSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    penalty_type: 'Disruption Reported',
    date: new Date().toISOString().split('T')[0],
    delivery_id: '',
    pickup_location: '',
    complaint: '',
    amount_at_risk: 0
  });

  useEffect(() => {
    getResilienceData()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load resilience data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64 font-bold text-slate-500">
          Loading disruption intelligence...
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Unable to load disruption data</h2>
          <p className="text-slate-500 mt-2">{error}</p>
        </div>
      </Layout>
    );
  }

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setReportError(null);
    setReportSuccess(false);

    try {
      const newDispute = {
        id: `GS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        worker_name: 'Rahul Kumar',
        platform: 'Delivery Partner',
        delivery_id: formData.delivery_id || `DEL-${Math.floor(10000 + Math.random() * 90000)}`,
        date: formData.date,
        penalty_type: formData.penalty_type,
        complaint: formData.complaint,
        amount_at_risk: Number(formData.amount_at_risk),
        status: 'Under Review',
        incentive_shield_status: 'Pending Verification',
        pickup_time: 'N/A',
        delivery_time: 'N/A',
        pickup_location: formData.pickup_location || 'Unknown',
        delivery_location: 'Unknown',
        completion_status: 'Impacted'
      };

      await createDispute(newDispute);
      setReportSuccess(true);
      setTimeout(() => {
        setIsReportModalOpen(false);
        setReportSuccess(false);
        setFormData({
          penalty_type: 'Disruption Reported',
          date: new Date().toISOString().split('T')[0],
          delivery_id: '',
          pickup_location: '',
          complaint: '',
          amount_at_risk: 0
        });
      }, 2000);
    } catch (err: any) {
      setReportError(err.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { current_disruption, worker_exposure, risk_score, affected_zones } = data;

  return (
    <Layout>
      <div className={`max-w-7xl mx-auto space-y-6 ${easyAccess ? 'space-y-8' : ''}`}>
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className={`font-extrabold text-slate-900 ${easyAccess ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
              ☔ {t('resilience_title')}
            </h1>
            <p className={`text-slate-600 mt-1 ${easyAccess ? 'text-xl font-medium' : 'text-base'}`}>
              {t('resilience_subtitle')}
            </p>
          </div>

          <button
            onClick={() => speak(`${t('resilience_title')}. ${t('resilience_subtitle')}. Risk score: ${risk_score.score} out of 100. Level: ${risk_score.level}`, 'resilience_header')}
            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
          >
            <Volume2 className="h-6 w-6" />
          </button>
        </div>

        {/* Active Disruption Banner */}
        {current_disruption.is_active ? (
          <div className="bg-red-50 border-2 border-red-300 p-6 rounded-2xl shadow-sm flex items-start justify-between">
            <div className="flex items-start">
              <ShieldAlert className="h-8 w-8 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className={`font-black text-red-950 flex items-center gap-2 ${easyAccess ? 'text-2xl' : 'text-lg'}`}>
                  <span>{current_disruption.type.toUpperCase()}</span>
                  <span className="text-xs font-black px-2.5 py-1 bg-red-600 text-white rounded-full">
                    {current_disruption.severity}
                  </span>
                </h3>
                <p className={`text-red-900 mt-1 ${easyAccess ? 'text-xl font-medium' : 'text-sm'}`}>
                  {current_disruption.delivery_impact}
                </p>
              </div>
            </div>

            <button
              onClick={() => speak(`${current_disruption.type}. ${current_disruption.delivery_impact}`, 'res_banner')}
              className="p-2 text-red-700 hover:bg-red-200/60 rounded-xl"
            >
              <Volume2 className="h-6 w-6" />
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 border-2 border-emerald-300 p-5 rounded-2xl shadow-sm flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-emerald-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-emerald-950 text-lg">No Active Disruptions</h3>
              <p className="text-emerald-800 text-sm">Delivery conditions are normal in your active zones.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Worker Exposure Card */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className={`font-bold text-slate-900 flex items-center ${easyAccess ? 'text-xl' : 'text-base'}`}>
                <IndianRupee className="w-5 h-5 mr-2 text-blue-600" />
                {t('worker_exposure')}
              </h3>
            </div>

            <div className={`space-y-3 ${easyAccess ? 'text-lg font-bold' : 'text-sm'}`}>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-slate-600">{t('affected_deliveries')}</span>
                <span className="font-black text-slate-900">{worker_exposure.deliveries_affected}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-slate-600">{t('amount_at_risk')}</span>
                <span className="font-black text-red-600">₹{worker_exposure.earnings_at_risk.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">{t('protected')}</span>
                <span className="font-black text-emerald-600">₹{worker_exposure.protection_available.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Risk Score Card */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className={`font-bold text-slate-900 flex items-center ${easyAccess ? 'text-xl' : 'text-base'}`}>
                <Activity className="w-5 h-5 mr-2 text-amber-600" />
                {t('risk_level')}
              </h3>
            </div>

            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-slate-900">{risk_score.score}<span className="text-lg text-slate-400">/100</span></span>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 font-black rounded-md text-xs">
                {risk_score.level}
              </span>
            </div>
            <p className="text-xs text-slate-600">{risk_score.explanation}</p>
          </div>

          {/* Current Disruption Details */}
          {current_disruption.is_active && (
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-6 space-y-3">
              <h3 className={`font-bold text-slate-900 border-b pb-2 ${easyAccess ? 'text-xl' : 'text-base'}`}>
                ⚡ Live Details
              </h3>
              <div className="text-sm space-y-2">
                <p><span className="font-bold text-slate-500 uppercase text-xs block">Zone</span> {current_disruption.affected_zone}</p>
                <p><span className="font-bold text-slate-500 uppercase text-xs block">Estimated Duration</span> {current_disruption.estimated_duration}</p>
                <p className="text-emerald-700 font-bold">✅ {current_disruption.verification_status}</p>
              </div>
            </div>
          )}

        </div>

        {/* Affected Delivery Zones */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className={`font-bold text-slate-900 flex items-center ${easyAccess ? 'text-2xl' : 'text-lg'}`}>
            <Map className="w-6 h-6 mr-2 text-red-600" />
            {t('affected_zone')}
          </h3>

          {affected_zones.map((zone: string, i: number) => (
            <div key={i} className="flex items-center p-4 rounded-xl border-2 border-red-200 bg-red-50 justify-between">
              <div>
                <h4 className="font-black text-red-950 text-lg">{zone}</h4>
                <p className="text-xs text-red-800">Impacted by {current_disruption.type}</p>
              </div>
              <span className="font-black text-red-700 text-xl">{worker_exposure.deliveries_affected} Deliveries</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className={`px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl transition-colors shadow-md ${
              easyAccess ? 'text-xl py-4' : 'text-base'
            }`}
          >
            📢 Report Disruption Case
          </button>
        </div>

      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 border-2 border-blue-500">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-extrabold text-slate-900">Report Disruption</h2>
              <button onClick={() => setIsReportModalOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            
            {reportSuccess ? (
              <p className="text-emerald-600 font-bold text-center py-6">✅ Disruption case successfully reported!</p>
            ) : (
              <form id="report-form" onSubmit={handleReportSubmit} className="space-y-4">
                {reportError && (
                  <p className="text-red-600 font-bold text-xs p-2 bg-red-50 rounded-md border border-red-200">{reportError}</p>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Disruption Type</label>
                  <select 
                    value={formData.penalty_type}
                    onChange={(e) => setFormData({...formData, penalty_type: e.target.value})}
                    className="w-full border-2 border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-900"
                    required
                  >
                    <option value="Severe Weather">Severe Weather (Rain/Flood)</option>
                    <option value="Extreme Traffic">Extreme Traffic / Road Closure</option>
                    <option value="Platform Glitch">Platform App Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location Zone</label>
                  <input 
                    type="text"
                    placeholder="e.g. Chennai Central"
                    value={formData.pickup_location}
                    onChange={(e) => setFormData({...formData, pickup_location: e.target.value})}
                    className="w-full border-2 border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Explain delay details..."
                    value={formData.complaint}
                    onChange={(e) => setFormData({...formData, complaint: e.target.value})}
                    className="w-full border-2 border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-900"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-5 py-2.5 border-2 border-slate-300 font-bold rounded-xl text-slate-700">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Resilience;
