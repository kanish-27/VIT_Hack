import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getDispute, verifyDispute } from '../services/api';
import { ArrowLeft, ShieldCheck, AlertCircle, FileText, CheckCircle2, Activity, ShieldAlert, Download, CheckCircle } from 'lucide-react';
import { resolveDispute } from '../services/api';
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
      // Re-fetch to get updated state
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
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('GigShield / Algorithmic Appeal Record', 14, 22);
    
    // Primary Details
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105); // slate-500
    doc.text(`Dispute ID: ${dispute.id}`, 14, 32);
    doc.text(`Worker: ${dispute.worker_name}`, 14, 38);
    doc.text(`Delivery ID: ${dispute.delivery_id}`, 14, 44);
    
    // Details Table
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
    
    // Verification Results
    const finalY = (doc as any).lastAutoTable.finalY || 130;
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Verification Results', 14, finalY + 10);
    
    doc.setFontSize(11);
    doc.text(`Decision: ${v.decision}`, 14, finalY + 18);
    doc.text(`Confidence Score: ${v.confidence_score} / 100`, 14, finalY + 24);
    doc.text(`Incentive Shield Status: ${dispute.incentive_shield_status}`, 14, finalY + 30);
    
    // Evidence Checks Table
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
    
    // Footer / Cryptographic Info
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
        <div className="flex justify-center items-center h-64 text-slate-500">Loading dispute details...</div>
      </Layout>
    );
  }

  if (error || !dispute) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto space-y-6">
          <Link to="/disputes" className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Disputes
          </Link>
          <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-xl text-center">
            <ShieldAlert className="h-10 w-10 mx-auto mb-3 text-red-500" />
            <h2 className="text-xl font-bold mb-2">Dispute not found</h2>
            <p className="text-sm">{error}</p>
            <Link to="/disputes" className="mt-6 inline-block px-4 py-2 bg-white text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
              Return to Center
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const steps = [
    { label: 'Submitted', active: true },
    { label: 'Evidence Verification', active: dispute.status === 'Under Review' || dispute.status === 'Likely Unfair' || dispute.status === 'Resolved' },
    { label: 'Under Review', active: dispute.status === 'Under Review' || dispute.status === 'Likely Unfair' || dispute.status === 'Resolved' },
    { label: 'Likely Unfair', active: dispute.status === 'Likely Unfair' || dispute.status === 'Resolved' },
    { label: 'Resolved', active: dispute.status === 'Resolved' }
  ];

  const shieldActive = dispute.verification && dispute.verification.confidence_score >= 90;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6 pb-10">
        
        {/* Navigation */}
        <Link to="/disputes" className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Disputes
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dispute {dispute.id}</h1>
            <p className="text-slate-500 mt-1">Delivery: {dispute.delivery_id} • {dispute.date}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${dispute.status === 'Likely Unfair' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {dispute.status}
            </span>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <div className="flex items-center min-w-max">
            {steps.map((step, index) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step.active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
                    {step.active ? <CheckCircle2 className="h-5 w-5" /> : <span>{index + 1}</span>}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step.active ? 'text-blue-700' : 'text-slate-500'}`}>{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 mb-6 ${steps[index + 1].active ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Incentive Shield Card */}
            {shieldActive && (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck className="h-24 w-24 text-emerald-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center text-emerald-700 font-bold mb-2">
                    <ShieldCheck className="h-5 w-5 mr-2" />
                    INCENTIVE SHIELD
                  </div>
                  <h3 className="text-3xl font-black text-emerald-800 mb-1">₹{dispute.amount_at_risk.toLocaleString('en-IN')} PROTECTED</h3>
                  <p className="text-sm font-medium text-emerald-700 mb-3">Status: {dispute.incentive_shield_status}</p>
                  <p className="text-xs text-emerald-600 leading-relaxed">
                    Your incentive amount is protected by GigShield's algorithmic verification.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-slate-400" />
                Dispute Summary
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500">Penalty</p>
                  <p className="font-medium text-slate-900">{dispute.penalty_type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Customer Complaint</p>
                  <p className="font-medium text-slate-900">"{dispute.complaint}"</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Customer Rating</p>
                  <div className="flex items-center mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < (dispute.customer_rating || 0) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Amount at Risk</p>
                  <p className="font-medium text-red-600">₹{dispute.amount_at_risk.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Current Status</p>
                  <p className="font-medium text-slate-900">{dispute.status}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-slate-400" />
                Delivery Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Pickup Time</p>
                    <p className="font-medium text-slate-900 text-sm">{dispute.pickup_time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Delivery Time</p>
                    <p className="font-medium text-slate-900 text-sm">{dispute.delivery_time}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Pickup Location</p>
                  <p className="font-medium text-slate-900 text-sm">{dispute.pickup_location}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Delivery Location</p>
                  <p className="font-medium text-slate-900 text-sm">{dispute.delivery_location}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Completion Status</p>
                  <p className="font-medium text-emerald-600 text-sm flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {dispute.completion_status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Evidence Engine */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Automated Evidence Verification</h2>
                  <p className="text-sm text-slate-500 mt-1">Deterministic telemetry analysis</p>
                </div>
                {!dispute.verification && (
                  <button 
                    onClick={handleVerify} 
                    disabled={verifying}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 flex items-center"
                  >
                    {verifying ? 'Verifying...' : 'Verify Dispute'}
                  </button>
                )}
                {dispute.verification && (
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confidence Score</p>
                    <p className={`text-2xl font-black ${dispute.verification.confidence_score >= 90 ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {dispute.verification.confidence_score} / 100
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {!dispute.verification ? (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">Ready for Verification</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                      Click the "Verify Dispute" button to run the GigShield deterministic engine against the platform telemetry data for this delivery.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      {dispute.verification.evidence_checks.map((check, i) => (
                        <div key={i} className={`p-4 rounded-lg border ${check.status === 'VERIFIED' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'} flex items-start`}>
                          <div className={`mt-0.5 mr-3 ${check.status === 'VERIFIED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {check.status === 'VERIFIED' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-semibold text-slate-900 text-sm">{check.name}</h4>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${check.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                {check.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">{check.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">Why was this dispute flagged?</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {dispute.verification.explanation}
                      </p>
                    </div>

                    {/* Algorithmic Appeal Record */}
                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 text-slate-300 mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-white flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Algorithmic Appeal Record
                        </h4>
                        <button 
                          onClick={handleDownloadAppeal}
                          className="text-xs flex items-center bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download Record
                        </button>
                      </div>
                      <div className="text-xs font-mono break-all mb-4">
                        <p className="text-slate-400 mb-1">SHA-256 Verification Hash:</p>
                        <p className="text-emerald-400">{dispute.verification.verification_hash}</p>
                      </div>
                      <div className="text-xs font-mono break-all">
                        <p className="text-slate-400 mb-1">Generated At:</p>
                        <p>{dispute.verification.timestamp}</p>
                      </div>
                    </div>
                    
                    {dispute.status === 'Likely Unfair' && (
                      <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <h4 className="text-lg font-bold text-slate-900 mb-2">Verification Complete</h4>
                        <p className="text-slate-600 text-sm mb-4">The algorithmic analysis strongly indicates an unfair penalty. You can now resolve this dispute to restore the incentive.</p>
                        <button 
                          onClick={handleResolve}
                          className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center mx-auto"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Resolve Dispute
                        </button>
                      </div>
                    )}
                    
                    {dispute.status === 'Resolved' && (
                      <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
                          <CheckCircle className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h4 className="text-xl font-bold text-emerald-700 mb-2">Dispute Resolved Successfully</h4>
                        <p className="text-emerald-600 text-sm mb-2">Your incentive has been fully restored.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default DisputeDetail;
