import React, { useState } from 'react';
import { LayoutDashboard, Globe, Mail, Settings, Menu, X, Rocket } from 'lucide-react';
import Dashboard from './components/Dashboard';
import LeadFinder from './components/LeadFinder';
import Inbox from './components/Inbox';
import CampaignConfig from './components/CampaignConfig';
import { AppView, Lead, CampaignStats } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global State (lifted up to share between components)
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats] = useState<CampaignStats>({
    totalLeads: 1240,
    emailsSent: 850,
    openRate: 42,
    replyRate: 12,
    activeLeads: 45
  });

  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-200">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
            <Rocket size={18} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            HuntFlow AI
          </h1>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={AppView.LEAD_FINDER} icon={Globe} label="Lead Finder" />
          <NavItem view={AppView.INBOX} icon={Mail} label="Intelligent Inbox" />
          <NavItem view={AppView.CAMPAIGN_CONFIG} icon={Settings} label="Campaign Settings" />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                    <span className="font-bold text-white">JD</span>
                </div>
                <div>
                    <p className="text-sm font-medium text-white">John Doe</p>
                    <p className="text-xs text-emerald-400">Pro Plan Active</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header (Mobile Only) */}
        <header className="lg:hidden p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Rocket size={16} className="text-white" />
                </div>
                <span className="font-bold text-white">HuntFlow AI</span>
             </div>
             <button onClick={() => setMobileMenuOpen(true)} className="text-white">
                 <Menu size={24} />
             </button>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 bg-slate-900 relative">
           {/* Background decorative elements */}
           <div className="absolute top-0 left-0 w-full h-96 bg-indigo-900/10 rounded-full blur-3xl -z-10 transform -translate-y-1/2 pointer-events-none"></div>

          {currentView === AppView.DASHBOARD && <Dashboard stats={stats} />}
          {currentView === AppView.LEAD_FINDER && <LeadFinder leads={leads} setLeads={setLeads} />}
          {currentView === AppView.INBOX && <Inbox leads={leads} />}
          {currentView === AppView.CAMPAIGN_CONFIG && <CampaignConfig />}
        </div>
      </main>
    </div>
  );
};

export default App;