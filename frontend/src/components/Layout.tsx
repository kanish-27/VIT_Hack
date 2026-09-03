import { Link, useLocation } from 'react-router-dom';
import type { FC, ReactNode } from 'react';
import { Shield, Home, Activity, IndianRupee, Menu } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Shield className="h-8 w-8 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-slate-800">GigShield</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${path === '/' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}>
            <Home className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </Link>
          <Link to="/disputes" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${path.startsWith('/disputes') ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}>
            <Activity className="h-5 w-5 mr-3" />
            <span>Disputes</span>
          </Link>
          <Link to="#" className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors font-medium">
            <IndianRupee className="h-5 w-5 mr-3" />
            <span>Resilience</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center md:hidden">
            <Shield className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-lg font-bold text-slate-800">GigShield</span>
          </div>
          <button className="md:hidden text-slate-500 hover:text-slate-700">
            <Menu className="h-6 w-6" />
          </button>
          <div className="hidden md:flex items-center">
            {/* Header placeholder for actions / user profile */}
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
