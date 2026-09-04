import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getDispute, verifyDispute, resolveDispute } from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { ArrowLeft, ShieldCheck, FileText, CheckCircle2, Activity, ShieldAlert, Download, CheckCircle, Volume2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface EvidenceCheck {
  id: string;
  name: string;
  status: string;
  explanation: string;
  score: number;
}

interface VerificationResult {
  confidence_score: number;
  decision: string;
  explanation: string;
  evidence_checks: EvidenceCheck[];
  verification_hash?: string;
  timestamp?: string;
}

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
  verification?: VerificationResult;
}

const DisputeDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { t, easyAccess, speak } = useAccessibility();

  useEffect(() => {
    if (id) {
      fetchDispute(id);
    }
  }, [id]);

  const fetchDispute = async (disputeId: string) => {
    try {
      setLoading(true);
      const data = await getDispute(disputeId);
      setDispute(data);
      setError(null);
    } catch (err) {
      setError('Dispute not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!id) return;
    try {
      setVerifying(true);
      await verifyDispute(id);
      await fetchDispute(id);
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResolve = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await resolveDispute(id);
      await fetchDispute(id);
    } catch (err) {
      setError('Resolution failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAppeal = () => {
    if (!dispute || !dispute.verification) return;
    
    const doc = new jsPDF();
    const v = dispute.verification;
    
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text('GigShield / Algorithmic Appeal Record', 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    doc.text(`Dispute ID: ${dispute.id}`, 14, 32);
    doc.text(`Worker: ${dispute.worker_name}`, 14, 38);
    doc.text(`Delivery ID: ${dispute.delivery_id}`, 14, 44);
    
    autoTable(doc, {
      startY: 50,
      head: [['Field', 'Value']],
      body: [
        ['Penalty', dispute.penalty_type],
        ['Complaint', dispute.complaint],
        ['Customer Rating', dispute.customer_rating ? `${dispute.customer_rating} / 5` : 'N/A'],
        ['Amount at Risk', `Rs. ${dispute.amount_at_risk.toLocaleString('en-IN')}`],
        ['Pickup Time', dispute.pickup_time],
        ['Delivery Time', dispute.delivery_time],
        ['Pickup Location', dispute.pickup_location],
        ['Delivery Location', dispute.delivery_location],
      ],
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85] },
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 130;
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Verification Results', 14, finalY + 10);
    
    doc.setFontSize(11);
    doc.text(`Decision: ${v.decision}`, 14, finalY + 18);
    doc.text(`Confidence Score: ${v.confidence_score} / 100`, 14, finalY + 24);
    doc.text(`Incentive Shield Status: ${dispute.incentive_shield_status}`, 14, finalY + 30);
    
    const evidenceData = v.evidence_checks.map(check => [
      check.name,
      check.status,
      check.explanation,
      check.score.toString()
    ]);
    
    autoTable(doc, {
      startY: finalY + 35,
      head: [['Check', 'Status', 'Explanation', 'Score']],
      body: evidenceData,
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85] },
    });
    
    const secondFinalY = (doc as any).lastAutoTable.finalY || 200;
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Verification Timestamp: ${v.timestamp || new Date().toISOString()}`, 14, secondFinalY + 15);
    
    const hashText = `SHA-256 Hash: ${v.verification_hash || 'N/A'}`;
    doc.text(hashText, 14, secondFinalY + 22, { maxWidth: 180 });
    
    doc.setFontSize(8);
    doc.text('AUDIT-READY DISCLAIMER: This record is generated algorithmically from deterministic platform telemetry.', 14, secondFinalY + 35);
    
    doc.save(`gigshield-appeal-${dispute.id}.pdf`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64 text-slate-500 font-bold">Loading case...</div>
      </Layout>
    );
  }

  if (error || !dispute) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto space-y-6">
          <Link to="/disputes" className="flex items-center font-bold text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-5 w-5 mr-1" />
            {t('back')}
          </Link>
          <div className="bg-red-50 border-2 border-red-300 text-red-900 p-8 rounded-2xl text-center">
            <ShieldAlert className="h-12 w-12 mx-auto mb-3 text-red-600" />
            <h2 className="text-2xl font-bold mb-2">Dispute not found</h2>
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const shieldActive = dispute.verification && dispute.verification.confidence_score >= 90;

  return (
    <Layout>
      <div className={`max-w-5xl mx-auto space-y-6 pb-10 ${easyAccess ? 'space-y-8' : ''}`}>
        
        {/* Back Link */}
        <Link to="/disputes" className="flex items-center font-bold text-slate-600 hover:text-slate-900 w-fit">
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t('back')}
        </Link>

        {/* Case Header */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-black text-slate-900 ${easyAccess ? 'text-3xl' : 'text-2xl'}`}>
                {t('dispute_detail_title')}: {dispute.id}
              </h1>
              <button
                onClick={() => speak(`Dispute ${dispute.id}. Penalty: ${dispute.penalty_type}. Complaint: ${dispute.complaint}. Amount at risk: ${dispute.amount_at_risk} rupees.`, 'detail_header')}
                className="p-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100"
              >
                <Volume2 className="h-6 w-6" />
              </button>
            </div>
            <p className="text-slate-500 mt-1">Delivery: {dispute.delivery_id} • {dispute.date}</p>
          </div>

          <span className={`px-4 py-1.5 rounded-full font-black text-sm ${
            dispute.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {dispute.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Incentive Shield Status */}
            {shieldActive && (
              <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="flex items-center text-emerald-800 font-extrabold text-lg mb-2">
                  <ShieldCheck className="h-6 w-6 mr-2 text-emerald-600" />
                  INCENTIVE SHIELD
                </div>
                <h3 className="text-3xl font-black text-emerald-900">₹{dispute.amount_at_risk.toLocaleString('en-IN')} PROTECTED</h3>
                <p className="text-sm font-bold text-emerald-700 mt-1">{dispute.incentive_shield_status}</p>
              </div>
            )}

            {/* Summary */}
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-4">
              <h3 className={`font-bold text-slate-900 border-b pb-2 ${easyAccess ? 'text-xl' : 'text-base'}`}>
                📌 Case Summary
              </h3>
              
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">{t('penalty_type')}</p>
                <p className="font-extrabold text-slate-900">{dispute.penalty_type}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">{t('customer_complaint')}</p>
                <p className="font-medium text-slate-800">"{dispute.complaint}"</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">{t('amount_at_risk')}</p>
                <p className="font-black text-red-600 text-xl">₹{dispute.amount_at_risk.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-4">
              <h3 className={`font-bold text-slate-900 border-b pb-2 ${easyAccess ? 'text-xl' : 'text-base'}`}>
                📍 {t('pickup_drop')}
              </h3>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Pickup Location</p>
                <p className="font-bold text-slate-900">{dispute.pickup_location} ({dispute.pickup_time})</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Delivery Location</p>
                <p className="font-bold text-slate-900">{dispute.delivery_location} ({dispute.delivery_time})</p>
              </div>
            </div>

          </div>

          {/* Right Column - Evidence Checks Engine */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
              
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className={`font-black text-slate-900 ${easyAccess ? 'text-2xl' : 'text-xl'}`}>
                    ⚡ {t('telemetry_evidence')}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">GPS, Timestamp, Route & Delivery Verification</p>
                </div>

                {!dispute.verification && (
                  <button 
                    onClick={handleVerify} 
                    disabled={verifying}
                    className={`px-6 py-3 bg-blue-600 text-white rounded-xl font-extrabold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 ${easyAccess ? 'text-lg' : 'text-sm'}`}
                  >
                    {verifying ? t('verifying') : t('verify_evidence_btn')}
                  </button>
                )}

                {dispute.verification && (
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase">{t('confidence_score')}</p>
                    <p className="text-3xl font-black text-emerald-600">
                      {dispute.verification.confidence_score} / 100
                    </p>
                  </div>
                )}
              </div>

              {!dispute.verification ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Activity className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="font-bold text-slate-800 text-lg">Ready for Verification</p>
                  <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                    Click "{t('verify_evidence_btn')}" to run algorithmic GPS and telemetry checks.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Evidence Checks */}
                  <div className="space-y-3">
                    {dispute.verification.evidence_checks.map((check, i) => (
                      <div key={i} className={`p-4 rounded-xl border-2 ${check.status === 'VERIFIED' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'} flex items-start justify-between`}>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className={`h-6 w-6 mt-0.5 ${check.status === 'VERIFIED' ? 'text-emerald-600' : 'text-amber-600'}`} />
                          <div>
                            <h4 className={`font-bold text-slate-900 ${easyAccess ? 'text-lg' : 'text-sm'}`}>{check.name}</h4>
                            <p className={`text-slate-700 ${easyAccess ? 'text-base font-medium' : 'text-xs'}`}>{check.explanation}</p>
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-md text-xs font-black ${check.status === 'VERIFIED' ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'}`}>
                          {check.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Decision Explanation */}
                  <div className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-200">
                    <h4 className="font-bold text-blue-950 mb-1">{t('decision')}: {dispute.verification.decision}</h4>
                    <p className="text-blue-900 text-sm leading-relaxed">{dispute.verification.explanation}</p>
                  </div>

                  {/* PDF Download Appeal */}
                  <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-emerald-400" />
                        Algorithmic Appeal Record
                      </h4>
                      <button 
                        onClick={handleDownloadAppeal}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Record (PDF)
                      </button>
                    </div>

                    <div className="text-xs font-mono break-all text-slate-400">
                      <p>SHA-256 Hash: <span className="text-emerald-400">{dispute.verification.verification_hash}</span></p>
                    </div>
                  </div>

                  {/* Resolve Button */}
                  {dispute.status === 'Likely Unfair' && (
                    <div className="pt-4 border-t border-slate-200 text-center">
                      <button 
                        onClick={handleResolve}
                        className={`w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xl transition-all shadow-md flex items-center justify-center`}
                      >
                        <CheckCircle className="h-7 w-7 mr-3" />
                        {t('restore_incentive_btn')} (₹{dispute.amount_at_risk})
                      </button>
                    </div>
                  )}

                  {dispute.status === 'Resolved' && (
                    <div className="p-4 bg-emerald-100 border-2 border-emerald-300 rounded-2xl text-center">
                      <h4 className="text-xl font-black text-emerald-900">✅ {t('resolved')} — {t('incentive_shield_easy')} RESTORED</h4>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default DisputeDetail;
