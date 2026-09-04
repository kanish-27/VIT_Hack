import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import { Shield, Home, AlertTriangle, CloudRain, Globe, Volume2, VolumeX, Eye, Menu, X, History } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import type { Language } from '../utils/translations';

interface LayoutProps {
  children: ReactNode;
}

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

const Layout: FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const { language, setLanguage, easyAccess, setEasyAccess, t, speak, stopSpeech, speakingId } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isNarrating = speakingId === 'page_summary';

  const handleNarratePage = () => {
    if (isNarrating) {
      stopSpeech();
    } else {
      let textToRead = t('page_summary_dashboard');
      if (path.startsWith('/disputes')) {
        textToRead = t('page_summary_disputes');
      } else if (path === '/resilience') {
        textToRead = t('page_summary_resilience');
      }
      speak(textToRead, 'page_summary');
    }
  };

  const navItems = [
    { path: '/', label: t('dashboard'), icon: Home },
    { path: '/disputes', label: t('disputes'), icon: AlertTriangle },
    { path: '/resilience', label: t('resilience'), icon: CloudRain },
    { path: '/protection-history', label: t('protection_history'), icon: History },
  ];

  return (
    <div className={`flex h-screen bg-slate-50 text-slate-900 ${easyAccess ? 'text-lg' : 'text-base'}`}>
      
      {/* Desktop Sidebar */}
      <aside className={`${easyAccess ? 'w-72' : 'w-64'} bg-white border-r border-slate-200 hidden md:flex flex-col shadow-sm`}>
        <div className={`h-20 flex items-center px-6 border-b border-slate-200`}>
          <Shield className={`${easyAccess ? 'h-10 w-10' : 'h-8 w-8'} text-blue-600 mr-3 flex-shrink-0`} />
          <span className={`${easyAccess ? 'text-2xl' : 'text-xl'} font-extrabold text-slate-900 tracking-tight`}>
            {t('app_title')}
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = path === item.path || (item.path !== '/' && path.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3.5 rounded-xl font-bold transition-all ${
                  active
                    ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                } ${easyAccess ? 'text-xl py-4' : 'text-base'}`}
              >
                <Icon className={`${easyAccess ? 'h-7 w-7 mr-4' : 'h-5 w-5 mr-3'} ${active ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer: Mode info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>GigShield Access v2.0</span>
            <span className="font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
              {language.toUpperCase()}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-xs z-10">
          
          {/* Mobile Logo & Toggle */}
          <div className="flex items-center md:hidden">
            <Shield className="h-7 w-7 text-blue-600 mr-2" />
            <span className="text-xl font-extrabold text-slate-900">{t('app_title')}</span>
          </div>

          {/* Controls Right Side */}
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-end">

            {/* Narrate Page Button */}
            <button
              onClick={handleNarratePage}
              className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl font-bold transition-all shadow-xs ${
                isNarrating
                  ? 'bg-amber-500 text-white hover:bg-amber-600 animate-pulse'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              } ${easyAccess ? 'text-lg px-5 py-3' : 'text-sm'}`}
              title={t('narrate_page')}
            >
              {isNarrating ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              <span className="hidden sm:inline">{isNarrating ? t('stop_narration') : t('narrate_page')}</span>
            </button>

            {/* Easy Access Mode Toggle */}
            <button
              onClick={() => setEasyAccess(!easyAccess)}
              className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl font-bold transition-all border ${
                easyAccess
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                  : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
              } ${easyAccess ? 'text-lg px-4' : 'text-sm'}`}
            >
              <Eye className="h-5 w-5" />
              <span>{easyAccess ? t('easy_access_on') : t('easy_access_off')}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative flex items-center">
              <Globe className="h-5 w-5 text-slate-500 absolute left-3 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className={`pl-9 pr-8 py-2 md:py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs cursor-pointer ${
                  easyAccess ? 'text-lg py-3 pl-10 pr-9' : 'text-sm'
                }`}
                aria-label={t('select_language')}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>

          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 z-20 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = path === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl font-bold ${
                    active ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-6 w-6 mr-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
