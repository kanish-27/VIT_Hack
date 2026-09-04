import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FC } from 'react';
import Layout from '../components/Layout';
import { checkHealth, getDashboardData, getResilienceData } from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { Activity, AlertTriangle, ShieldCheck, CheckCircle2, ShieldAlert, Volume2, VolumeX, HelpCircle, Wallet } from 'lucide-react';
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
  const [resilienceData, setResilienceData] = useState<any>(null);

  const { t, easyAccess, speak, speakingId, openExplainer } = useAccessibility();

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
    getResilienceData().then(data => setResilienceData(data)).catch(console.error);
  }, []);

  const activeDisputes = dashboardData?.active_disputes || 0;
  const protectionScore = dashboardData?.protection_score || 0;
  const shieldAmount = dashboardData?.shield?.amount || 0;
  const safeToSpendAmount = 2200; // Calculated safe-to-spend buffer

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
      <div className={`max-w-7xl mx-auto space-y-6 ${easyAccess ? 'space-y-8' : ''}`}>
        
        {/* Header & Status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className={`font-extrabold text-slate-900 ${easyAccess ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
              {t('welcome_title')}
            </h1>
            <p className={`text-slate-600 mt-1 ${easyAccess ? 'text-xl font-medium' : 'text-base'}`}>
              {t('welcome_subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Pill */}
            <div className={`flex items-center bg-white px-4 py-2 rounded-full border border-slate-200 shadow-xs ${easyAccess ? 'text-lg font-bold py-2.5 px-5' : 'text-sm font-medium'}`}>
              <div className={`h-3 w-3 rounded-full mr-2 ${apiStatus === 'online' ? 'bg-emerald-500' : apiStatus === 'checking' ? 'bg-amber-400' : 'bg-red-500'}`}></div>
              <span className="text-slate-800">
                {t('api_status')}: {t(apiStatus as any)}
              </span>
            </div>

            {/* Read Out Header */}
            <button
              onClick={() => speak(`${t('welcome_title')}. ${t('welcome_subtitle')}. ${t('protection_score')}: ${protectionScore}. ${t('safe_to_spend')}: ${safeToSpendAmount} rupees.`, 'dash_header')}
              className={`p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors ${speakingId === 'dash_header' ? 'bg-amber-500 text-white' : ''}`}
              title={t('listen')}
            >
              {speakingId === 'dash_header' ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Active Disruption Banner */}
        {resilienceData?.current_disruption?.is_active && (
          <Link to="/resilience" className="block bg-red-50 border-2 border-red-300 p-5 rounded-2xl shadow-sm hover:bg-red-100 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <ShieldAlert className="h-8 w-8 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className={`font-bold text-red-950 flex items-center gap-2 ${easyAccess ? 'text-2xl' : 'text-lg'}`}>
                    <span>☔ {t('disruption_alert_title')}</span>
                    <span className="text-xs font-black px-2.5 py-1 bg-red-600 text-white rounded-full">
                      {resilienceData.current_disruption.severity}
                    </span>
                  </h3>
                  <p className={`text-red-900 mt-1 ${easyAccess ? 'text-xl font-medium' : 'text-sm'}`}>
                    {resilienceData.current_disruption.delivery_impact}
                  </p>
                  <div className="font-extrabold text-red-700 mt-3 flex items-center hover:underline">
                    {t('disruption_alert_action')} &rarr;
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  speak(`${t('disruption_alert_title')}. ${resilienceData.current_disruption.delivery_impact}`, 'alert_banner');
                }}
                className="p-2 text-red-700 hover:bg-red-200/60 rounded-xl"
              >
                <Volume2 className="h-6 w-6" />
              </button>
            </div>
          </Link>
        )}

        {/* Core Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Safe to Spend */}
          <div className="bg-white p-6 rounded-2xl border-2 border-emerald-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className={`font-bold ${easyAccess ? 'text-xl text-emerald-800' : 'text-sm text-slate-600'}`}>
                    {easyAccess ? t('safe_to_spend_easy') : t('safe_to_spend')}
                  </p>
                  <button
                    onClick={() => openExplainer('explain_safe_to_spend_title', 'explain_safe_to_spend_body')}
                    className="text-slate-400 hover:text-blue-600"
                    title={t('what_is_this')}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </div>
                <h3 className={`font-black text-slate-900 mt-2 ${easyAccess ? 'text-4xl text-emerald-600' : 'text-3xl'}`}>
                  ₹{safeToSpendAmount.toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <Wallet className="h-7 w-7 text-emerald-600" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                ✅ {t('doing_well')}
              </span>
              <button
                onClick={() => speak(`${t('safe_to_spend')}: ${safeToSpendAmount} rupees. ${t('explain_safe_to_spend_body')}`, 'card_safe')}
                className="text-slate-500 hover:text-blue-600 p-1"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Card 2: Incentive Shield */}
          <div className="bg-white p-6 rounded-2xl border-2 border-blue-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className={`font-bold ${easyAccess ? 'text-xl text-blue-800' : 'text-sm text-slate-600'}`}>
                    {easyAccess ? t('incentive_shield_easy') : t('incentive_shield')}
                  </p>
                  <button
                    onClick={() => openExplainer('explain_incentive_shield_title', 'explain_incentive_shield_body')}
                    className="text-slate-400 hover:text-blue-600"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </div>
                <h3 className={`font-black text-slate-900 mt-2 ${easyAccess ? 'text-4xl text-blue-600' : 'text-3xl'}`}>
                  ₹{shieldAmount.toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <ShieldCheck className="h-7 w-7 text-blue-600" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                🛡️ {dashboardData?.shield?.status || t('protected')}
              </span>
              <button
                onClick={() => speak(`${t('incentive_shield')}: ${shieldAmount} rupees. ${dashboardData?.shield?.explanation || ''}`, 'card_shield')}
                className="text-slate-500 hover:text-blue-600 p-1"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Card 3: Active Disputes / Penalties */}
          <div className="bg-white p-6 rounded-2xl border-2 border-amber-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className={`font-bold ${easyAccess ? 'text-xl text-amber-800' : 'text-sm text-slate-600'}`}>
                  {easyAccess ? t('active_disputes_easy') : t('active_disputes')}
                </p>
                <h3 className={`font-black text-slate-900 mt-2 ${easyAccess ? 'text-4xl text-amber-600' : 'text-3xl'}`}>
                  {activeDisputes}
                </h3>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <AlertTriangle className="h-7 w-7 text-amber-600" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                {activeDisputes > 0 ? `⚠️ ${activeDisputes} ${t('under_review')}` : `✅ All clear`}
              </span>
              <button
                onClick={() => speak(`${t('active_disputes')}: ${activeDisputes}`, 'card_disputes')}
                className="text-slate-500 hover:text-blue-600 p-1"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Card 4: Protection Score */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className={`font-bold ${easyAccess ? 'text-xl text-slate-800' : 'text-sm text-slate-600'}`}>
                    {easyAccess ? t('protection_score_easy') : t('protection_score')}
                  </p>
                  <button
                    onClick={() => openExplainer('explain_resilience_score_title', 'explain_resilience_score_body')}
                    className="text-slate-400 hover:text-blue-600"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </div>
                <h3 className={`font-black text-slate-900 mt-2 ${easyAccess ? 'text-4xl text-emerald-600' : 'text-3xl'}`}>
                  {protectionScore}/100
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <ShieldCheck className="h-7 w-7 text-emerald-600" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                🟢 {protectionScore >= 70 ? t('doing_well') : t('needs_attention')}
              </span>
              <button
                onClick={() => speak(`${t('protection_score')}: ${protectionScore} out of 100. ${dashboardData?.score_explanation || ''}`, 'card_score')}
                className="text-slate-500 hover:text-blue-600 p-1"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Protection Factors & Earnings Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Protection Factors */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className={`font-bold text-slate-900 ${easyAccess ? 'text-2xl' : 'text-lg'}`}>
                🛡️ Protection Factors
              </h3>
              <button
                onClick={() => speak(`Protection factors. Positive factors include verified delivery evidence.`, 'factors')}
                className="text-slate-500 hover:text-blue-600 p-1"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-emerald-700 mb-2 flex items-center text-base">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Positive Verification Signals
                </h4>
                <ul className={`space-y-2 pl-7 list-disc ${easyAccess ? 'text-lg font-medium text-slate-800' : 'text-sm text-slate-600'}`}>
                  {(dashboardData?.protection_factors?.positive || []).map((factor: string, i: number) => (
                    <li key={i}>{factor}</li>
                  ))}
                  {(!dashboardData?.protection_factors?.positive || dashboardData.protection_factors.positive.length === 0) && (
                    <li className="text-slate-400 italic">No specific positive factors identified.</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-amber-700 mb-2 flex items-center text-base">
                  <AlertTriangle className="w-5 h-5 mr-2" /> Factors Requiring Review
                </h4>
                <ul className={`space-y-2 pl-7 list-disc ${easyAccess ? 'text-lg font-medium text-slate-800' : 'text-sm text-slate-600'}`}>
                  {(dashboardData?.protection_factors?.review || []).map((factor: string, i: number) => (
                    <li key={i}>{factor}</li>
                  ))}
                  {(!dashboardData?.protection_factors?.review || dashboardData.protection_factors.review.length === 0) && (
                    <li className="text-slate-400 italic">No review factors identified. All clean!</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className={`font-bold text-slate-900 ${easyAccess ? 'text-2xl' : 'text-lg'}`}>
                💰 Earnings Breakdown
              </h3>
              <button
                onClick={() => speak(`Total income protected: ${dashboardData?.earnings_breakdown?.total_protected || 0} rupees. Amount recovered: ${dashboardData?.earnings_breakdown?.amount_recovered || 0} rupees.`, 'earnings_breakdown')}
                className="text-slate-500 hover:text-blue-600 p-1"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>

            <div className={`space-y-4 ${easyAccess ? 'text-xl font-bold' : 'text-sm'}`}>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600">{t('total_protected')}</span>
                <span className="font-extrabold text-slate-900">₹{(dashboardData?.earnings_breakdown?.total_protected || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600">{t('amount_recovered')}</span>
                <span className="font-extrabold text-emerald-600">₹{(dashboardData?.earnings_breakdown?.amount_recovered || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600">{t('amount_at_risk')}</span>
                <span className="font-extrabold text-amber-600">₹{(dashboardData?.earnings_breakdown?.amount_at_risk || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Disruptions Protected</span>
                <span className="font-extrabold text-slate-900">{dashboardData?.earnings_breakdown?.protected_disruptions || 0}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Charts & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
            <h3 className={`font-bold text-slate-900 mb-4 ${easyAccess ? 'text-2xl' : 'text-lg'}`}>
              📈 {t('weekly_earnings_trend')}
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockIncomeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: easyAccess ? 16 : 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: easyAccess ? 16 : 12}} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Income']} />
                  <Line type="monotone" dataKey="income" stroke="#2563EB" strokeWidth={4} dot={{r: 6, fill: '#2563EB'}} activeDot={{r: 8}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className={`font-bold text-slate-900 mb-4 ${easyAccess ? 'text-2xl' : 'text-lg'}`}>
                📋 {t('recent_activity')}
              </h3>
              <div className="space-y-4">
                {recentActivity.slice(0, 4).map((act: any, i: number) => {
                  const Icon = act.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-full ${act.bg} flex-shrink-0 mt-0.5`}>
                        <Icon className="h-5 w-5 text-slate-800" />
                      </div>
                      <div>
                        <p className={`font-bold text-slate-900 ${easyAccess ? 'text-lg' : 'text-sm'}`}>{act.title}</p>
                        <p className="text-xs text-slate-500">{act.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link
              to="/disputes"
              className={`mt-6 w-full text-center py-3 rounded-xl font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors ${easyAccess ? 'text-lg py-4' : 'text-sm'}`}
            >
              {t('view_details')} &rarr;
            </Link>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
