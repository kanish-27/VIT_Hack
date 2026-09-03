import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getDisputes } from '../services/api';
import { AlertCircle, CheckCircle2, ShieldCheck, Clock, ShieldAlert } from 'lucide-react';

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
  
  const totalProtected = disputes.reduce((sum, d) => sum + d.amount_at_risk, 0); // Simplified calculation

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dispute Center</h1>
          <p className="text-slate-500 mt-1">Review, challenge, and track penalties affecting your gig income.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Disputes</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{activeDisputes.length}</h3>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Under Review</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{activeDisputes.filter(d => d.status === 'Under Review').length}</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Resolved</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{resolvedDisputes.length}</h3>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Incentive Amount Protected</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">₹{totalProtected.toLocaleString('en-IN')}</h3>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <ShieldAlert className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
            <button onClick={fetchDisputes} className="text-sm font-medium underline">Retry</button>
          </div>
        )}

        {/* Active Disputes Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Active Disputes</h2>
          {loading ? (
            <div className="text-center py-8 text-slate-500">Loading disputes...</div>
          ) : activeDisputes.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
              No active disputes.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {activeDisputes.map(dispute => (
                <div key={dispute.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full md:w-auto">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Dispute ID</p>
                      <p className="font-medium text-slate-900">{dispute.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Delivery ID / Date</p>
                      <p className="font-medium text-slate-900">{dispute.delivery_id}</p>
                      <p className="text-xs text-slate-500">{dispute.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Penalty / Amount</p>
                      <p className="font-medium text-slate-900 text-sm">{dispute.penalty_type}</p>
                      <p className="text-sm text-red-600 font-medium">₹{dispute.amount_at_risk.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Status / Shield</p>
                      <p className="font-medium text-slate-900 text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${dispute.status === 'Likely Unfair' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {dispute.status}
                        </span>
                      </p>
                      <p className="text-xs text-emerald-600 flex items-center mt-1">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        {dispute.incentive_shield_status}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <Link to={`/disputes/${dispute.id}`} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-center">
                      View Details
                    </Link>
                    <Link to={`/disputes/${dispute.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center whitespace-nowrap shadow-sm">
                      Challenge Penalty
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resolved Disputes Section */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Resolved Disputes</h2>
          {!loading && resolvedDisputes.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
              No resolved disputes yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {resolvedDisputes.map(dispute => (
                <div key={dispute.id} className="bg-white border border-slate-200 rounded-xl p-6 opacity-75 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full md:w-auto">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Dispute ID</p>
                      <p className="font-medium text-slate-900">{dispute.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Delivery ID / Date</p>
                      <p className="font-medium text-slate-900">{dispute.delivery_id}</p>
                      <p className="text-xs text-slate-500">{dispute.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Penalty / Amount</p>
                      <p className="font-medium text-slate-900 text-sm">{dispute.penalty_type}</p>
                      <p className="text-sm font-medium line-through">₹{dispute.amount_at_risk.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Status</p>
                      <p className="font-medium text-emerald-700 text-sm flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Resolved
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 w-full md:w-auto">
                    <Link to={`/disputes/${dispute.id}`} className="block w-full px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-center">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Disputes;
