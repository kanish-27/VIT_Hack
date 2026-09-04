export type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn';

export interface TranslationDictionary {
  // Navigation & Header
  app_title: string;
  dashboard: string;
  disputes: string;
  resilience: string;
  protection_history: string;
  easy_access_on: string;
  easy_access_off: string;
  narrate_page: string;
  stop_narration: string;
  speaking: string;

  // Common UI
  listen: string;
  stop: string;
  what_is_this: string;
  close: string;
  back: string;
  date: string;
  select_language: string;
  status: string;
  active: string;
  resolved: string;
  rejected: string;
  under_review: string;
  likely_unfair: string;
  protected: string;
  amount_at_risk: string;
  amount_recovered: string;
  total_protected: string;
  view_details: string;

  // Status Indicator
  api_status: string;
  online: string;
  offline: string;
  checking: string;

  // Dashboard
  welcome_title: string;
  welcome_subtitle: string;
  incentive_shield: string;
  incentive_shield_easy: string;
  active_disputes: string;
  active_disputes_easy: string;
  resolved_disputes: string;
  resolved_disputes_easy: string;
  protection_score: string;
  protection_score_easy: string;
  safe_to_spend: string;
  safe_to_spend_easy: string;
  doing_well: string;
  needs_attention: string;
  recent_activity: string;
  disruption_alert_title: string;
  disruption_alert_action: string;
  weekly_earnings_trend: string;

  // Disputes Page
  disputes_title: string;
  disputes_subtitle: string;
  search_placeholder: string;
  filter_all: string;
  new_dispute: string;
  no_disputes_found: string;

  // Dispute Detail Page
  dispute_detail_title: string;
  penalty_type: string;
  pickup_drop: string;
  customer_complaint: string;
  telemetry_evidence: string;
  verify_evidence_btn: string;
  verifying: string;
  restore_incentive_btn: string;
  restoring: string;
  verification_hash: string;
  confidence_score: string;
  decision: string;

  // Resilience Page
  resilience_title: string;
  resilience_subtitle: string;
  weather_disruption: string;
  worker_exposure: string;
  risk_level: string;
  high_risk: string;
  elevated_risk: string;
  low_risk: string;
  affected_zone: string;
  affected_deliveries: string;

  // Explainers
  explain_safe_to_spend_title: string;
  explain_safe_to_spend_body: string;
  explain_resilience_score_title: string;
  explain_resilience_score_body: string;
  explain_incentive_shield_title: string;
  explain_incentive_shield_body: string;
  explain_volatility_title: string;
  explain_volatility_body: string;

  // Spoken Summaries (TTS)
  page_summary_dashboard: string;
  page_summary_disputes: string;
  page_summary_resilience: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    app_title: 'GigShield',
    dashboard: 'Dashboard',
    disputes: 'Disputes',
    resilience: 'Resilience',
    protection_history: 'Protection History',
    easy_access_on: 'Easy Mode ON',
    easy_access_off: 'Easy Mode OFF',
    narrate_page: 'Read Out Screen',
    stop_narration: 'Stop Reading',
    speaking: 'Speaking...',

    listen: 'Listen',
    stop: 'Stop',
    what_is_this: 'What does this mean?',
    close: 'Close',
    back: 'Back',
    date: 'Date',
    select_language: 'Select Language',
    status: 'Status',
    active: 'Active',
    resolved: 'Resolved',
    rejected: 'Rejected',
    under_review: 'Under Review',
    likely_unfair: 'Likely Unfair',
    protected: 'Protected',
    amount_at_risk: 'Amount at Risk',
    amount_recovered: 'Amount Recovered',
    total_protected: 'Total Income Protected',
    view_details: 'View Details',

    api_status: 'API Status',
    online: 'Online',
    offline: 'Offline',
    checking: 'Checking',

    welcome_title: 'Dashboard Overview',
    welcome_subtitle: 'Welcome back. Here is your income protection summary.',
    incentive_shield: 'Incentive Shield',
    incentive_shield_easy: '🛡️ INCENTIVE PROTECTION',
    active_disputes: 'Active Disputes',
    active_disputes_easy: '⚠️ PENALTIES AT RISK',
    resolved_disputes: 'Resolved Disputes',
    resolved_disputes_easy: '✅ MONEY RESTORED',
    protection_score: 'Protection Score',
    protection_score_easy: '🟢 PROTECTION STATUS',
    safe_to_spend: 'Safe to Spend',
    safe_to_spend_easy: '💰 SAFE TO SPEND',
    doing_well: 'YOU ARE DOING WELL',
    needs_attention: 'ATTENTION NEEDED',
    recent_activity: 'Recent Activity',
    disruption_alert_title: 'Active Weather Alert',
    disruption_alert_action: 'View Disruption Details',
    weekly_earnings_trend: 'Weekly Earnings Trend',

    disputes_title: 'Delivery Disputes',
    disputes_subtitle: 'Track and verify unfair delivery penalties.',
    search_placeholder: 'Search delivery ID or location...',
    filter_all: 'All Statuses',
    new_dispute: 'File New Dispute',
    no_disputes_found: 'No disputes found matching your search.',

    dispute_detail_title: 'Dispute Case',
    penalty_type: 'Penalty Type',
    pickup_drop: 'Pickup & Drop Location',
    customer_complaint: 'Customer Complaint',
    telemetry_evidence: 'Telemetry & Evidence Checks',
    verify_evidence_btn: 'Verify Telemetry Evidence',
    verifying: 'Verifying Evidence...',
    restore_incentive_btn: 'Restore Incentive',
    restoring: 'Restoring Pay...',
    verification_hash: 'Verification Hash (SHA-256)',
    confidence_score: 'Confidence Score',
    decision: 'Decision',

    resilience_title: 'Income Resilience & Disruption',
    resilience_subtitle: 'Real-time weather monitoring & route disruption shield.',
    weather_disruption: 'Weather & Traffic Disruption',
    worker_exposure: 'Your Delivery Exposure',
    risk_level: 'Risk Level',
    high_risk: 'HIGH RISK',
    elevated_risk: 'ELEVATED RISK',
    low_risk: 'LOW RISK',
    affected_zone: 'Affected Zone',
    affected_deliveries: 'Affected Deliveries',

    explain_safe_to_spend_title: 'Safe to Spend',
    explain_safe_to_spend_body: 'This is the amount you can safely spend after accounting for essential expenses, fuel, upcoming commitments, and your emergency buffer.',
    explain_resilience_score_title: 'Resilience Score',
    explain_resilience_score_body: 'This score shows how prepared you are to handle changes in your income or unexpected delivery penalties.',
    explain_incentive_shield_title: 'Incentive Shield',
    explain_incentive_shield_body: 'Incentive Shield holds and protects your earnings during reviews or weather disruptions so you do not lose pay unfairly.',
    explain_volatility_title: 'Income Volatility',
    explain_volatility_body: 'This shows how much your delivery earnings change from week to week based on orders and weather.',

    page_summary_dashboard: 'Welcome to your GigShield dashboard. Your income protection score is active. You have incentive protection enabled and safe to spend money calculated.',
    page_summary_disputes: 'Delivery disputes list. You can view pending penalties, verify GPS evidence, and claim back deducted incentives.',
    page_summary_resilience: 'Income resilience and weather disruption monitor. Check active weather alerts and affected delivery zones.'
  },

  hi: {
    app_title: 'गिगशील्ड',
    dashboard: 'डैशबोर्ड',
    disputes: 'विवाद (पेनाल्टी)',
    resilience: 'मौसम और जोखिम',
    protection_history: 'सुरक्षा इतिहास',
    easy_access_on: 'आसान मोड चालू',
    easy_access_off: 'आसान मोड बंद',
    narrate_page: 'स्क्रीन पढ़कर सुनाएं',
    stop_narration: 'पढ़ना बंद करें',
    speaking: 'बोल रहा है...',

    listen: 'सुनें',
    stop: 'रोकें',
    what_is_this: 'इसका क्या मतलब है?',
    close: 'बंद करें',
    back: 'वापस',
    date: 'तारीख',
    select_language: 'भाषा चुनें',
    status: 'स्थिति',
    active: 'सक्रिय',
    resolved: 'हल हुआ (पैसा मिला)',
    rejected: 'अस्वीकृत',
    under_review: 'जांच जारी',
    likely_unfair: 'अनुचित कटौती की संभावना',
    protected: 'सुरक्षित',
    amount_at_risk: 'जोखिम में राशि',
    amount_recovered: 'वापस मिली राशि',
    total_protected: 'कुल सुरक्षित आय',
    view_details: 'विवरण देखें',

    api_status: 'सर्वर स्थिति',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    checking: 'जांच जारी',

    welcome_title: 'डैशबोर्ड विवरण',
    welcome_subtitle: 'आपका स्वागत है। यह आपकी आय सुरक्षा का सारांश है।',
    incentive_shield: 'इंसेंटिव शील्ड',
    incentive_shield_easy: '🛡️ इंसेंटिव सुरक्षा',
    active_disputes: 'सक्रिय पेनाल्टी',
    active_disputes_easy: '⚠️ कटौती के जोखिम में पैसा',
    resolved_disputes: 'हल हुए मामले',
    resolved_disputes_easy: '✅ वापस मिला पैसा',
    protection_score: 'सुरक्षा स्कोर',
    protection_score_easy: '🟢 सुरक्षा स्थिति',
    safe_to_spend: 'खर्च के लिए सुरक्षित राशि',
    safe_to_spend_easy: '💰 खर्च करने के लिए सुरक्षित',
    doing_well: 'आपकी स्थिति अच्छी है',
    needs_attention: 'ध्यान देने की आवश्यकता है',
    recent_activity: 'हाल की गतिविधियां',
    disruption_alert_title: 'मौसम चेतावनी',
    disruption_alert_action: 'विवरण देखें',
    weekly_earnings_trend: 'साप्ताहिक कमाई रुझान',

    disputes_title: 'डिलीवरी विवाद',
    disputes_subtitle: 'गलत पेनाल्टी और कटौती की जांच करें।',
    search_placeholder: 'डिलीवरी आईडी या स्थान खोजें...',
    filter_all: 'सभी स्थितियां',
    new_dispute: 'नया मामला दर्ज करें',
    no_disputes_found: 'कोई मामला नहीं मिला।',

    dispute_detail_title: 'मामले का विवरण',
    penalty_type: 'पेनाल्टी का प्रकार',
    pickup_drop: 'पिकअप और डिलीवरी स्थान',
    customer_complaint: 'ग्राहक की शिकायत',
    telemetry_evidence: 'जीपीएस और समय के सबूत',
    verify_evidence_btn: 'सबूतों की स्वचालित जांच करें',
    verifying: 'सबूतों की जांच हो रही है...',
    restore_incentive_btn: 'इंसेंटिव पैसा वापस पाएं',
    restoring: 'पैसा वापस मिल रहा है...',
    verification_hash: 'डिजिटल सबूत कोड (SHA-256)',
    confidence_score: 'विश्वास स्कोर',
    decision: 'निर्णय',

    resilience_title: 'मौसम और सड़क बाधाएं',
    resilience_subtitle: 'बारिश और ट्रैफिक में कमाई की सुरक्षा।',
    weather_disruption: 'मौसम संबंधी रुकावट',
    worker_exposure: 'आपकी डिलीवरी पर असर',
    risk_level: 'जोखिम का स्तर',
    high_risk: 'उच्च जोखिम',
    elevated_risk: 'मध्यम जोखिम',
    low_risk: 'कम जोखिम',
    affected_zone: 'प्रभावित क्षेत्र',
    affected_deliveries: 'प्रभावित डिलीवरी',

    explain_safe_to_spend_title: 'खर्च के लिए सुरक्षित राशि',
    explain_safe_to_spend_body: 'यह वह राशि है जिसे आप पेट्रोल, आवश्यक खर्चों और आपातकालीन बचत के बाद सुरक्षित रूप से खर्च कर सकते हैं।',
    explain_resilience_score_title: 'सुरक्षा स्कोर (रेजिलिएंस)',
    explain_resilience_score_body: 'यह स्कोर दिखाता है कि आप आय में अचानक गिरावट या गलत पेनाल्टी से कितने सुरक्षित हैं।',
    explain_incentive_shield_title: 'इंसेंटिव शील्ड',
    explain_incentive_shield_body: 'इंसेंटिव शील्ड खराब मौसम या गलत शिकायतों के दौरान आपकी बोनस कमाई को सुरक्षित रखती है।',
    explain_volatility_title: 'आय में उतार-चढ़ाव',
    explain_volatility_body: 'यह दिखाता है कि आपकी साप्ताहिक कमाई में कितना बदलाव आता है।',

    page_summary_dashboard: 'गिगशील्ड डैशबोर्ड में आपका स्वागत है। आपकी इंसेंटिव सुरक्षा सक्रिय है और आपकी खर्च करने योग्य सुरक्षित राशि उपलब्ध है।',
    page_summary_disputes: 'डिलीवरी मामलों की सूची। आप जीपीएस सबूतों की जांच कर सकते हैं और काटा गया पैसा वापस पा सकते हैं।',
    page_summary_resilience: 'मौसम और सड़क बाधा निगरानी। बारिश की चेतावनी और प्रभावित क्षेत्र देखें।'
  },

  ta: {
    app_title: 'கிக்பீல்டு',
    dashboard: 'முகப்பு',
    disputes: 'பிரச்சனைகள் (அபராதம்)',
    resilience: 'வானிலை மற்றும் பாதுகாப்பு',
    protection_history: 'பாதுகாப்பு வரலாறு',
    easy_access_on: 'எளிய முறை ஆன்',
    easy_access_off: 'எளிய முறை ஆஃப்',
    narrate_page: 'வாசித்து காட்டு',
    stop_narration: 'நிறுத்து',
    speaking: 'பேசுகிறது...',

    listen: 'கேட்க',
    stop: 'நிறுத்து',
    what_is_this: 'இதன் பொருள் என்ன?',
    close: 'மூடு',
    back: 'பின்செல்',
    date: 'தேதி',
    select_language: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    status: 'நிலை',
    active: 'செயலில் உள்ளது',
    resolved: 'தீர்க்கப்பட்டது (பணம் கிடைத்தது)',
    rejected: 'நிராகரிக்கப்பட்டது',
    under_review: 'ஆய்வில் உள்ளது',
    likely_unfair: 'தவறான அபராதம் போல தெரிகிறது',
    protected: 'பாதுகாக்கப்பட்டது',
    amount_at_risk: 'ஆபத்தில் உள்ள தொகை',
    amount_recovered: 'மீட்கப்பட்ட தொகை',
    total_protected: 'மொத்த பாதுகாக்கப்பட்ட வருமானம்',
    view_details: 'விவரங்களை காண்க',

    api_status: 'சர்வர் நிலை',
    online: 'ஆன்லைன்',
    offline: 'ஆஃப்லைன்',
    checking: 'சோதிக்கிறது',

    welcome_title: 'முகப்பு கண்ணோட்டம்',
    welcome_subtitle: 'நல்வரவு. இது உங்கள் வருமான பாதுகாப்பு விவரம்.',
    incentive_shield: 'இன்சென்டிவ் ஷீல்டு',
    incentive_shield_easy: '🛡️ போனஸ் பாதுகாப்பு',
    active_disputes: 'நிலுவை அபராதங்கள்',
    active_disputes_easy: '⚠️ ஆபத்தில் உள்ள பணம்',
    resolved_disputes: 'மீட்கப்பட்ட பணம்',
    resolved_disputes_easy: '✅ திரும்பி வந்த பணம்',
    protection_score: 'பாதுகாப்பு மதிப்பெண்',
    protection_score_easy: '🟢 பாதுகாப்பு நிலை',
    safe_to_spend: 'செலவழிக்க பாதுகாப்பான பணம்',
    safe_to_spend_easy: '💰 செலவழிக்கலாம்',
    doing_well: 'உங்கள் நிலை நன்றாக உள்ளது',
    needs_attention: 'கவனம் தேவை',
    recent_activity: 'சமீபத்திய நிகழ்வுகள்',
    disruption_alert_title: 'மழை எச்சரிக்கை',
    disruption_alert_action: 'விவரங்களை பார்க்க',
    weekly_earnings_trend: 'வாராந்திர வருமான விவரம்',

    disputes_title: 'டெலிவரி புகார்கள்',
    disputes_subtitle: 'தவறான அபராதங்களை சரிபார்க்கவும்.',
    search_placeholder: 'டெலிவரி ஐடி அல்லது இடத்தை தேடுக...',
    filter_all: 'அனைத்து நிலைகளும்',
    new_dispute: 'புதிய புகார் பதிவுசெய்',
    no_disputes_found: 'புகார்கள் எதுவும் கிடைக்கவில்லை.',

    dispute_detail_title: 'புகார் விவரம்',
    penalty_type: 'அபராத வகை',
    pickup_drop: 'பிக்அப் & டெலிவரி இடம்',
    customer_complaint: 'வாடிக்கையாளர் புகார்',
    telemetry_evidence: 'GPS மற்றும் நேர சான்றுகள்',
    verify_evidence_btn: 'GPS சான்றுகளை சரிபார்',
    verifying: 'சரிபார்க்கிறது...',
    restore_incentive_btn: 'பணத்தை திரும்பப்பெறு',
    restoring: 'பணம் மீட்கப்படுகிறது...',
    verification_hash: 'டிஜிட்டல் சான்று குறியீடு (SHA-256)',
    confidence_score: 'நம்பகத்தன்மை மதிப்பெண்',
    decision: 'முடிவு',

    resilience_title: 'வானிலை மற்றும் போக்குவரத்து',
    resilience_subtitle: 'மழை மற்றும் போக்குவரத்து நேரங்களில் பாதுகாப்பு.',
    weather_disruption: 'வானிலை பாதிப்பு',
    worker_exposure: 'உங்கள் டெலிவரி பாதிப்பு',
    risk_level: 'ஆபத்து நிலை',
    high_risk: 'அதிக ஆபத்து',
    elevated_risk: 'மிதமான ஆபத்து',
    low_risk: 'குறைந்த ஆபத்து',
    affected_zone: 'பாதிக்கப்பட்ட பகுதி',
    affected_deliveries: 'பாதிக்கப்பட்ட டெலிவரிகள்',

    explain_safe_to_spend_title: 'செலவழிக்க பாதுகாப்பான பணம்',
    explain_safe_to_spend_body: 'பெட்ரோல் மற்றும் அவசிய செலவுகள் போக நீங்கள் தைரியமாக செலவழிக்கக்கூடிய பணம் இது.',
    explain_resilience_score_title: 'பாதுகாப்பு மதிப்பெண்',
    explain_resilience_score_body: 'தவறான அபராதங்கள் மற்றும் மழைக்காலங்களில் உங்கள் வருமானம் எவ்வளவு பாதுகாப்பாக உள்ளது என்பதை இது காட்டுகிறது.',
    explain_incentive_shield_title: 'இன்சென்டிவ் ஷீல்டு',
    explain_incentive_shield_body: 'மழை அல்லது தவறான புகார்களால் உங்கள் போனஸ் பணம் கழியாமல் இது பாதுகாக்கிறது.',
    explain_volatility_title: 'வருமான மாற்றம்',
    explain_volatility_body: 'வாரம் தோறும் உங்கள் வருமானத்தில் ஏற்படும் மாற்றத்தை இது காட்டுகிறது.',

    page_summary_dashboard: 'கிக்பீல்டு முகப்பிற்கு நல்வரவு. உங்கள் இன்சென்டிவ் பாதுகாப்பு செயலில் உள்ளது.',
    page_summary_disputes: 'டெலிவரி புகார்கள் பட்டியல். ஜிபிஎஸ் சான்றுகளை சரிபார்த்து கழிக்கப்பட்ட பணத்தை திரும்ப பெறலாம்.',
    page_summary_resilience: 'வானிலை கண்காணிப்பு பக்கம். மழை எச்சரிக்கைகளை கவனிக்கவும்.'
  },

  te: {
    app_title: 'గిగ్‌షీల్డ్',
    dashboard: 'డాష్‌బోర్డ్',
    disputes: 'సమస్యలు (పెనాల్టీలు)',
    resilience: 'వాతావరణం & రక్షణ',
    protection_history: 'రక్షణ చరిత్ర',
    easy_access_on: 'సులభమైన మోడ్ ఆన్',
    easy_access_off: 'సులభమైన మోడ్ ఆఫ్',
    narrate_page: 'చదివి వినిపించు',
    stop_narration: 'ఆపివేయి',
    speaking: 'మాట్లాడుతోంది...',

    listen: 'వినండి',
    stop: 'ఆపు',
    what_is_this: 'దీని అర్థం ఏమిటి?',
    close: 'మూసివేయి',
    back: 'వెనుకకు',
    date: 'తేదీ',
    select_language: 'భాషను ఎంచుకోండి',
    status: 'స్థితి',
    active: 'యాక్టివ్',
    resolved: 'పరిష్కరించబడింది (డబ్బులు వచ్చాయి)',
    rejected: 'తిరస్కరించబడింది',
    under_review: 'పరిశీలనలో ఉంది',
    likely_unfair: 'అన్యాయమైన పెనాల్టీ కావచ్చు',
    protected: 'రక్షించబడింది',
    amount_at_risk: 'ప్రమాదంలో ఉన్న డబ్బు',
    amount_recovered: 'తిరిగి పొందిన డబ్బు',
    total_protected: 'మొత్తం రక్షించబడిన ఆదాయం',
    view_details: 'వివరాలు చూడండి',

    api_status: 'సర్వర్ స్థితి',
    online: 'ఆన్‌లైన్',
    offline: 'ఆఫ్‌లైన్',
    checking: 'తనిఖీ చేస్తోంది',

    welcome_title: 'డాష్‌బోర్డ్ వివరాలు',
    welcome_subtitle: 'స్వాగతం. ఇది మీ ఆదాయ రక్షణ సారాంశం.',
    incentive_shield: 'ఇన్సెంటివ్ షీల్డ్',
    incentive_shield_easy: '🛡️ బోనస్ రక్షణ',
    active_disputes: 'సమస్యలు',
    active_disputes_easy: '⚠️ కట్ అయ్యే ప్రమాదంలో ఉన్న డబ్బు',
    resolved_disputes: 'పరిష్కారమైనవి',
    resolved_disputes_easy: '✅ తిరిగి వచ్చిన డబ్బు',
    protection_score: 'రక్షణ స్కోర్',
    protection_score_easy: '🟢 రక్షణ స్థితి',
    safe_to_spend: 'ఖర్చు చేయడానికి సురక్షితమైన డబ్బు',
    safe_to_spend_easy: '💰 ఖర్చు చేసుకోవచ్చు',
    doing_well: 'మీ పరిస్థితి బాగుంది',
    needs_attention: 'శ్రద్ధ వహించండి',
    recent_activity: 'ఇటీవలి వివరాలు',
    disruption_alert_title: 'వర్షం హెచ్చరిక',
    disruption_alert_action: 'వివరాలు చూడండి',
    weekly_earnings_trend: 'వారపు సంపాదన',

    disputes_title: 'డెలివరీ ఫిర్యాదులు',
    disputes_subtitle: 'అన్యాయమైన పెనాల్టీలను సరిచూడండి.',
    search_placeholder: 'డెలివరీ ఐడీ లేదా లొకేషన్ వెతకండి...',
    filter_all: 'అన్ని స్థితులు',
    new_dispute: 'కొత్త ఫిర్యాదు నమోదు చేయండి',
    no_disputes_found: 'ఏ ఫిర్యాదులు లభించలేదు.',

    dispute_detail_title: 'ఫిర్యాదు వివరాలు',
    penalty_type: 'పెనాల్టీ రకం',
    pickup_drop: 'పికప్ & డెలివరీ స్థలం',
    customer_complaint: 'కస్టమర్ ఫిర్యాదు',
    telemetry_evidence: 'GPS & సమయం ఆధారాలు',
    verify_evidence_btn: 'GPS ఆధారాలను తనిఖీ చేయి',
    verifying: 'తనిఖీ జరుగుతోంది...',
    restore_incentive_btn: 'డబ్బులు తిరిగి పొందు',
    restoring: 'డబ్బులు వస్తున్నాయి...',
    verification_hash: 'డిజిటల్ కోడ్ (SHA-256)',
    confidence_score: 'నమ్మకం స్కోర్',
    decision: 'నిర్ణయం',

    resilience_title: 'వాతావరణం & ట్రాఫిక్',
    resilience_subtitle: 'వర్షం మరియు ట్రాఫిక్‌లో ఆదాయ రక్షణ.',
    weather_disruption: 'వాతావరణ సమస్య',
    worker_exposure: 'మీ డెలివరీ ప్రభావం',
    risk_level: 'ప్రమాద స్థాయి',
    high_risk: 'ఎక్కువ ప్రమాదం',
    elevated_risk: 'మధ్యస్థ ప్రమాదం',
    low_risk: 'తక్కువ ప్రమాదం',
    affected_zone: 'ప్రభావిత ప్రాంతం',
    affected_deliveries: 'ప్రభావిత డెలివరీలు',

    explain_safe_to_spend_title: 'ఖర్చుకు సురక్షితమైన డబ్బు',
    explain_safe_to_spend_body: 'పెట్రోల్ మరియు ముఖ్యమైన ఖర్చులు పోగా మీరు సురక్షితంగా ఖర్చు చేయగల డబ్బు ఇది.',
    explain_resilience_score_title: 'రక్షణ స్కోర్',
    explain_resilience_score_body: 'తప్పడు పెనాల్టీలు మరియు వర్షపు సమయంలో మీ ఆదాయం ఎంత సురక్షితంగా ఉందో ఇది చెబుతుంది.',
    explain_incentive_shield_title: 'ఇన్సెంటివ్ షీల్డ్',
    explain_incentive_shield_body: 'వర్షం లేదా తప్పుడు ఫిర్యాదుల వల్ల మీ బోనస్ డబ్బు కట్ కాకుండా ఇది కాపాడుతుంది.',
    explain_volatility_title: 'ఆదాయంలో మార్పులు',
    explain_volatility_body: 'వార వారం మీ సంపాదనలో ఎంత మార్పు వస్తుందో ఇది చూపిస్తుంది.',

    page_summary_dashboard: 'గిగ్‌షీల్డ్ డాష్‌బోర్డ్‌కు స్వాగతం. మీ బోనస్ రక్షణ ఆన్‌లో ఉంది.',
    page_summary_disputes: 'డెలివరీ ఫిర్యాదుల జాబితా. ఆధారాలను తనిఖీ చేసి కట్ అయిన డబ్బు పొందండి.',
    page_summary_resilience: 'వాతావరణ హెచ్చరికల పేజీ. వర్షపు ప్రభావం చూడండి.'
  },

  kn: {
    app_title: 'ಗಿಗ್‌ಷೀಲ್ಡ್',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    disputes: 'ಸಮಸ್ಯೆಗಳು (ದಂಡ)',
    resilience: 'ಹವಾಮಾನ & ರಕ್ಷಣೆ',
    protection_history: 'ರಕ್ಷಣೆಯ ಇತಿಹಾಸ',
    easy_access_on: 'ಸುಲಭ ಮೋಡ್ ಆನ್',
    easy_access_off: 'ಸುಲಭ ಮೋಡ್ ಆಫ್',
    narrate_page: 'ಓದಿ ಹೇಳು',
    stop_narration: 'ನಿಲ್ಲಿಸು',
    speaking: 'ಮಾತನಾಡುತ್ತಿದೆ...',

    listen: 'ಕೇಳಿ',
    stop: 'ನಿಲ್ಲಿಸಿ',
    what_is_this: 'ಇದರ ಅರ್ಥವೇನು?',
    close: 'ಮುಚ್ಚಿ',
    back: 'ಹಿಂದಕ್ಕೆ',
    date: 'ದಿನಾಂಕ',
    select_language: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    status: 'ಸ್ಥಿತಿ',
    active: 'ಸಕ್ರಿಯ',
    resolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ (ಹಣ ಸಿಕ್ಕಿದೆ)',
    rejected: 'ನಿರಾಕರಿಸಲಾಗಿದೆ',
    under_review: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    likely_unfair: 'ಅನ್ಯಾಯದ ಕಡಿತ ಇರಬಹುದು',
    protected: 'ರಕ್ಷಿಸಲಾಗಿದೆ',
    amount_at_risk: 'ಅಪಾಯದಲ್ಲಿರುವ ಹಣ',
    amount_recovered: 'ಹಿಂಪಡೆದ ಹಣ',
    total_protected: 'ಒಟ್ಟು ರಕ್ಷಿಸಿದ ಆದಾಯ',
    view_details: 'ವಿವರ ನೋಡಿ',

    api_status: 'ಸರ್ವರ್ ಸ್ಥಿತಿ',
    online: 'ಆನ್‌ಲೈನ್',
    offline: 'ಆಫ್‌ಲೈನ್',
    checking: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ',

    welcome_title: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ವಿವರಣೆ',
    welcome_subtitle: 'ಸ್ವಾಗತ. ಇದು ನಿಮ್ಮ ಆದಾಯ ರಕ್ಷಣೆಯ ಸಾರಾಂಶ.',
    incentive_shield: 'ಇನ್ಸೆಂಟಿವ್ ಶೀಲ್ಡ್',
    incentive_shield_easy: '🛡️ ಬೋನಸ್ ರಕ್ಷಣೆ',
    active_disputes: 'ಸಕ್ರಿಯ ದಂಡಗಳು',
    active_disputes_easy: '⚠️ ಅಪಾಯದಲ್ಲಿರುವ ಹಣ',
    resolved_disputes: 'ಹಿಂಪಡೆದ ಹಣ',
    resolved_disputes_easy: '✅ ಬಂದಿರುವ ಹಣ',
    protection_score: 'ರಕ್ಷಣೆಯ ಸ್ಕೋರ್',
    protection_score_easy: '🟢 ರಕ್ಷಣೆಯ ಸ್ಥಿತಿ',
    safe_to_spend: 'ಖರ್ಚು ಮಾಡಲು ಸುರಕ್ಷಿತ ಹಣ',
    safe_to_spend_easy: '💰 ಖರ್ಚು ಮಾಡಬಹುದು',
    doing_well: 'ನಿಮ್ಮ ಸ್ಥಿತಿ ಚೆನ್ನಾಗಿದೆ',
    needs_attention: 'ಗಮನ ಹರಿಸಿ',
    recent_activity: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',
    disruption_alert_title: 'ಮಳೆ ಮುನ್ನೆಚ್ಚರಿಕೆ',
    disruption_alert_action: 'ವಿವರ ನೋಡಿ',
    weekly_earnings_trend: 'ವಾರದ ಗಳಿಕೆ',

    disputes_title: 'ಡೆಲಿವರಿ ದೂರುಗಳು',
    disputes_subtitle: 'ಅನ್ಯಾಯದ ದಂಡಗಳನ್ನು ತಪಾಸಣೆ ಮಾಡಿ.',
    search_placeholder: 'ಡೆಲಿವರಿ ಐಡಿ ಅಥವಾ ಜಾಗ ಹುಡುಕಿ...',
    filter_all: 'ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು',
    new_dispute: 'ಹೊಸ ದೂರು ದಾಖಲಿಸಿ',
    no_disputes_found: 'ಯಾವ ದೂರುಗಳೂ ಸಿಗಲಿಲ್ಲ.',

    dispute_detail_title: 'ದೂರಿನ ವಿವರ',
    penalty_type: 'ದಂಡದ ಮಾದರಿ',
    pickup_drop: 'ಪಿಕ್ಅಪ್ & ಡೆಲಿವರಿ ಜಾಗ',
    customer_complaint: 'ಗ್ರಾಹಕರ ದೂರು',
    telemetry_evidence: 'GPS & ಸಮಯದ ಸಾಕ್ಷಿ',
    verify_evidence_btn: 'GPS ಸಾಕ್ಷಿ ತಪಾಸಣೆ ಮಾಡಿ',
    verifying: 'ತಪಾಸಣೆ ನಡೆಯುತ್ತಿದೆ...',
    restore_incentive_btn: 'ಹಣ ಹಿಂಪಡೆಯಿರಿ',
    restoring: 'ಹಣ ಬರುತ್ತದೆ...',
    verification_hash: 'ಡಿಜಿಟಲ್ ಕೋಡ್ (SHA-256)',
    confidence_score: 'ನಂಬಿಕೆಯ ಸ್ಕೋರ್',
    decision: 'ನಿರ್ಧಾರ',

    resilience_title: 'ಹವಾಮಾನ & ಟ್ರಾಫಿಕ್',
    resilience_subtitle: 'ಮಳೆ ಮತ್ತು ಟ್ರಾಫಿಕ್‌ನಲ್ಲಿ ಆದಾಯದ ರಕ್ಷಣೆ.',
    weather_disruption: 'ಹವಾಮಾನ ತೊಂದರೆ',
    worker_exposure: 'ನಿಮ್ಮ ಡೆಲಿವರಿ ಪರಿಣಾಮ',
    risk_level: 'ಅಪಾಯದ ಮಟ್ಟ',
    high_risk: 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
    elevated_risk: 'ಮಧ್ಯಮ ಅಪಾಯ',
    low_risk: 'ಕಡಿಮೆ ಅಪಾಯ',
    affected_zone: 'ಪರಿಣಾಮ ಬೀರಿದ ಪ್ರದೇಶ',
    affected_deliveries: 'ಪರಿಣಾಮ ಬೀರಿದ ಡೆಲಿವರಿಗಳು',

    explain_safe_to_spend_title: 'ಖರ್ಚಿಗೆ ಸುರಕ್ಷಿತ ಹಣ',
    explain_safe_to_spend_body: 'ಪೆಟ್ರೋಲ್ ಮತ್ತು ಮುಖ್ಯ ಖರ್ಚುಗಳ ನಂತರ ನೀವು ಧೈರ್ಯವಾಗಿ ಖರ್ಚು ಮಾಡಬಹುದಾದ ಹಣ ಇದು.',
    explain_resilience_score_title: 'ರಕ್ಷಣೆಯ ಸ್ಕೋರ್',
    explain_resilience_score_body: 'ತಪ್ಪು ದಂಡಗಳು ಮತ್ತು ಮಳೆಯ ಸಮಯದಲ್ಲಿ ನಿಮ್ಮ ಆದಾಯ ಎಷ್ಟು ಸುರಕ್ಷಿತವಾಗಿದೆ ಎಂದು ಇದು ತೋರಿಸುತ್ತದೆ.',
    explain_incentive_shield_title: 'ಇನ್ಸೆಂಟಿವ್ ಶೀಲ್ಡ್',
    explain_incentive_shield_body: 'ಮಳೆ ಅಥವಾ ತಪ್ಪು ದೂರುಗಳಿಂದ ನಿಮ್ಮ ಬೋನಸ್ ಹಣ ಕಡಿತವಾಗದಂತೆ ಇದು ಕಾಯುತ್ತದೆ.',
    explain_volatility_title: 'ಆದಾಯದ ಬದಲಾವಣೆ',
    explain_volatility_body: 'ವಾರದಿಂದ ವಾರಕ್ಕೆ ನಿಮ್ಮ ಗಳಿಕೆಯಲ್ಲಿ ఎంత ವ್ಯತ್ಯಾಸ ಬರುತ್ತದೆ ಎಂದು ಇದು ತೋರಿಸುತ್ತದೆ.',

    page_summary_dashboard: 'ಗಿಗ್‌ಷೀಲ್ಡ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಬೋನಸ್ ರಕ್ಷಣೆ ಸಕ್ರಿಯವಾಗಿದೆ.',
    page_summary_disputes: 'ಡೆಲಿವರಿ ದೂರುಗಳ ಪಟ್ಟಿ. ಸಾಕ್ಷಿ ತಪಾಸಣೆ ಮಾಡಿ ಕಡಿತಗೊಂಡ ಹಣ ಹಿಂಪಡೆಯಿರಿ.',
    page_summary_resilience: 'ಹವಾಮಾನ ಮುನ್ನೆಚ್ಚರಿಕೆ ಪುಟ. ಮಳೆಯ ಪರಿಣಾಮ ಗಮನಿಸಿ.'
  }
};
