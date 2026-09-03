import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FC } from 'react';
import Layout from '../components/Layout';
import { getResilienceData } from '../services/api';
import { ShieldAlert, Map, AlertTriangle, ShieldCheck, CheckCircle2, History, IndianRupee, CloudLightning, Activity, X } from 'lucide-react';
import { createDispute } from '../services/api';

const Resilience: FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Unable to load disruption data</h2>
          <p className="text-slate-500 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
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
        worker_name: 'Rahul Kumar', // Using mock default worker
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

  const { current_disruption, worker_exposure, risk_score, historical_disruptions, affected_zones } = data;

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high impact':
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'elevated':
        return 'text-amber-600 bg-amber-100 border-amber-200';
      default:
        return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  const getExposureColor = (level: string) => {
    if (level === 'HIGH') return 'text-red-600';
    if (level === 'ELEVATED') return 'text-amber-600';
    return 'text-blue-600';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Disruption Intelligence</h1>
          <p className="text-slate-500 mt-1">Real-time tracking of conditions affecting your deliveries.</p>
        </div>

        {current_disruption.is_active ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm mb-6 flex items-start">
            <ShieldAlert className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 flex items-center">
                ACTIVE DISRUPTION: {current_disruption.type.toUpperCase()}
                <span className="ml-3 text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded border border-red-200">
                  {current_disruption.severity.toUpperCase()}
                </span>
              </h3>
              <p className="text-red-800 text-sm mt-1">{current_disruption.delivery_impact}</p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl shadow-sm mb-6 flex items-start">
            <ShieldCheck className="h-6 w-6 text-emerald-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-emerald-900">No Active Disruptions</h3>
              <p className="text-emerald-800 text-sm mt-1">Delivery conditions are normal in your active zones.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Worker Exposure Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-50 border-b border-slate-100 p-4">
              <h3 className="font-semibold text-slate-800 flex items-center">
                <IndianRupee className="w-5 h-5 mr-2 text-slate-500" />
                Worker Exposure
              </h3>
            </div>
            <div className="p-5 flex-1 flex flex-col space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-sm text-slate-500">Deliveries Potentially Affected</span>
                <span className="font-bold text-slate-900">{worker_exposure.deliveries_affected}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-sm text-slate-500">Earnings at Risk</span>
                <span className={`font-bold ${getExposureColor(worker_exposure.exposure_level)}`}>
                  ₹{worker_exposure.earnings_at_risk.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-sm text-slate-500">Protection Available</span>
                <span className="font-bold text-emerald-600">₹{worker_exposure.protection_available.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-sm text-slate-500">Exposure Level</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${getSeverityColor(worker_exposure.exposure_level)}`}>
                  {worker_exposure.exposure_level}
                </span>
              </div>
            </div>
          </div>

          {/* Risk Score Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-50 border-b border-slate-100 p-4">
              <h3 className="font-semibold text-slate-800 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-slate-500" />
                Resilience Risk Score
              </h3>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-end mb-4">
                <span className="text-4xl font-bold text-slate-900 leading-none">{risk_score.score}</span>
                <span className="text-slate-500 ml-1 mb-1">/ 100</span>
                <span className={`ml-auto text-xs font-bold px-2 py-1 rounded ${getSeverityColor(risk_score.level)}`}>
                  {risk_score.level}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-4">{risk_score.explanation}</p>
              
              <div className="mt-auto space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk Factors</h4>
                <ul className="space-y-1.5">
                  {risk_score.factors.map((factor: string, i: number) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1 mr-2 flex-shrink-0"></div>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Current Disruption Details */}
          {current_disruption.is_active && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-slate-50 border-b border-slate-100 p-4">
                <h3 className="font-semibold text-slate-800 flex items-center">
                  <CloudLightning className="w-5 h-5 mr-2 text-slate-500" />
                  Disruption Details
                </h3>
              </div>
              <div className="p-5 flex-1 flex flex-col space-y-3">
                <div>
                  <span className="text-xs text-slate-500 block">Status</span>
                  <span className="text-sm font-medium text-slate-900">{current_disruption.status}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Detection Time</span>
                  <span className="text-sm font-medium text-slate-900">{new Date(current_disruption.detection_time).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Estimated Duration</span>
                  <span className="text-sm font-medium text-slate-900">{current_disruption.estimated_duration}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Verification</span>
                  <span className="text-sm font-medium text-emerald-600 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {current_disruption.verification_status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Affected Delivery Zones */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Map className="w-5 h-5 mr-2 text-slate-500" />
              Affected Delivery Zones
            </h3>
            {affected_zones.length > 0 ? (
              <div className="space-y-4">
                {affected_zones.map((zone: string, i: number) => (
                  <div key={i} className="flex items-center p-3 rounded-lg border border-red-200 bg-red-50">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{zone}</h4>
                      <p className="text-xs text-slate-500">Currently impacted by {current_disruption.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm font-bold text-red-600">{worker_exposure.deliveries_affected}</span>
                      <span className="text-xs text-slate-500">deliveries</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No zones currently affected.</p>
            )}
          </div>

          {/* Protection Response Flow */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-slate-500" />
              GigShield Protection Response
            </h3>
            
            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-blue-100">
              
              <div className="relative flex items-center">
                <div className="absolute -left-[1.35rem] w-3 h-3 rounded-full bg-blue-600 border-4 border-blue-100 ring-2 ring-white"></div>
                <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <h4 className="text-sm font-medium text-slate-900">Disruption Detected</h4>
                  <p className="text-xs text-slate-500">{current_disruption.is_active ? 'Active' : 'Standby'}</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute -left-[1.35rem] w-3 h-3 rounded-full bg-blue-600 border-4 border-blue-100 ring-2 ring-white"></div>
                <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <h4 className="text-sm font-medium text-slate-900">Worker Exposure Calculated</h4>
                  <p className="text-xs text-slate-500">{worker_exposure.deliveries_affected} deliveries checked</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute -left-[1.35rem] w-3 h-3 rounded-full bg-amber-400 border-4 border-amber-100 ring-2 ring-white"></div>
                <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <h4 className="text-sm font-medium text-slate-900 flex justify-between">
                    Evidence Verification
                    <span className="text-xs font-semibold text-amber-600">In Progress</span>
                  </h4>
                  <p className="text-xs text-slate-500">Cross-referencing signals</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute -left-[1.35rem] w-3 h-3 rounded-full bg-slate-300 border-4 border-slate-100 ring-2 ring-white"></div>
                <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100 opacity-70">
                  <h4 className="text-sm font-medium text-slate-900 flex justify-between">
                    Protection Eligibility
                    <span className="text-xs font-semibold text-slate-500">Pending</span>
                  </h4>
                </div>
              </div>
              
              <div className="relative flex items-center">
                <div className="absolute -left-[1.35rem] w-3 h-3 rounded-full bg-emerald-500 border-4 border-emerald-100 ring-2 ring-white"></div>
                <div className="flex-1 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <h4 className="text-sm font-medium text-emerald-900 flex justify-between">
                    Incentive Shield
                    <span className="text-xs font-semibold text-emerald-700">Ready</span>
                  </h4>
                  <p className="text-xs text-emerald-700/80">Up to ₹{worker_exposure.protection_available.toLocaleString()} protection available</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Historical Disruptions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <History className="w-5 h-5 mr-2 text-slate-500" />
              Historical Disruptions
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Disruption</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Severity</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Deliveries</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Earnings Impact</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historical_disruptions.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">{item.date}</td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-900">{item.type}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${getSeverityColor(item.severity)}`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{item.affected_deliveries}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-slate-900">₹{item.earnings_impact.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="flex items-center text-emerald-600">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        {item.verification_result}
                      </span>
                    </td>
                  </tr>
                ))}
                {historical_disruptions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                      No historical disruptions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Link to="/disputes" className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm">
            View Disputes
          </Link>
          <Link to="/protection-history" className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm">
            View Protection History
          </Link>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            Report Disruption
          </button>
        </div>

      </div>

      {/* Report Disruption Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                Report Disruption
              </h2>
              <button onClick={() => !isSubmitting && setIsReportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {reportSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">Report Submitted</h3>
                  <p className="mt-2 text-sm text-slate-500">Your disruption report has been successfully filed for review.</p>
                </div>
              ) : (
                <form id="report-form" onSubmit={handleReportSubmit} className="space-y-4">
                  {reportError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200 flex items-start">
                      <ShieldAlert className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      {reportError}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Disruption Type</label>
                    <select 
                      value={formData.penalty_type}
                      onChange={(e) => setFormData({...formData, penalty_type: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
                      required
                    >
                      <option value="Disruption Reported">General Disruption</option>
                      <option value="Severe Weather">Severe Weather</option>
                      <option value="Extreme Traffic">Extreme Traffic / Road Closure</option>
                      <option value="Platform Glitch">Platform Issue / App Glitch</option>
                      <option value="Restaurant Delay">Severe Merchant Delay</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input 
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location / Zone</label>
                    <input 
                      type="text"
                      placeholder="e.g. Chennai Central"
                      value={formData.pickup_location}
                      onChange={(e) => setFormData({...formData, pickup_location: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Reference (Optional)</label>
                    <input 
                      type="text"
                      placeholder="e.g. DEL-12345"
                      value={formData.delivery_id}
                      onChange={(e) => setFormData({...formData, delivery_id: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Impact / Amount (₹)</label>
                    <input 
                      type="number"
                      min="0"
                      value={formData.amount_at_risk}
                      onChange={(e) => setFormData({...formData, amount_at_risk: Number(e.target.value)})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea 
                      rows={3}
                      placeholder="Describe how the disruption impacted your deliveries..."
                      value={formData.complaint}
                      onChange={(e) => setFormData({...formData, complaint: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                      required
                    ></textarea>
                  </div>
                </form>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsReportModalOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>
              {!reportSuccess && (
                <button 
                  type="submit" 
                  form="report-form"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-75 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Resilience;
