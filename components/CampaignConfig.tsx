import React from 'react';
import { Settings, Shield, Mail, Zap, Server } from 'lucide-react';

const CampaignConfig: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Campaign & Outreach Settings</h2>

      {/* SMTP Rotation */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Server size={24} />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white">SMTP Rotation Logic</h3>
                <p className="text-slate-400 text-sm">Manage multiple email accounts to distribute load and prevent spam flagging.</p>
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <div>
                        <p className="text-white font-medium">primary@agency.com</p>
                        <p className="text-xs text-slate-500">Google Workspace • 45/500 sent today</p>
                    </div>
                </div>
                <button className="text-xs text-rose-400 hover:text-rose-300">Remove</button>
            </div>

             <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <div>
                        <p className="text-white font-medium">outreach@agency-growth.io</p>
                        <p className="text-xs text-slate-500">Outlook SMTP • 12/200 sent today</p>
                    </div>
                </div>
                <button className="text-xs text-rose-400 hover:text-rose-300">Remove</button>
            </div>

            <button className="w-full py-3 border border-dashed border-slate-600 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white hover:border-slate-500 transition-all text-sm font-medium">
                + Add New SMTP Account
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Warmup Mode */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
             <div className="flex items-center gap-3 mb-4">
                 <Shield className="text-emerald-400" size={20} />
                 <h3 className="text-lg font-semibold text-white">Warm-up Mode</h3>
             </div>
             <p className="text-sm text-slate-400 mb-6">Automatically increase sending volume gradually to build domain reputation.</p>
             
             <div className="space-y-4">
                 <div className="flex justify-between items-center">
                     <span className="text-slate-300">Status</span>
                     <span className="text-emerald-400 text-sm font-bold bg-emerald-400/10 px-2 py-1 rounded">Active</span>
                 </div>
                 <div>
                     <div className="flex justify-between text-xs text-slate-400 mb-1">
                         <span>Current Daily Limit</span>
                         <span>50 Emails</span>
                     </div>
                     <div className="w-full bg-slate-700 rounded-full h-2">
                         <div className="bg-emerald-500 h-2 rounded-full w-[25%]"></div>
                     </div>
                 </div>
                 <div className="pt-2">
                     <label className="flex items-center gap-2 cursor-pointer">
                         <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500" checked readOnly />
                         <span className="text-sm text-slate-300">Simulate human delay (3-12 min)</span>
                     </label>
                 </div>
             </div>
          </div>

          {/* Drip Campaign */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
             <div className="flex items-center gap-3 mb-4">
                 <Zap className="text-amber-400" size={20} />
                 <h3 className="text-lg font-semibold text-white">Auto Follow-up</h3>
             </div>
             <p className="text-sm text-slate-400 mb-6">Configure sequence for non-responsive leads.</p>
             
             <div className="space-y-3 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-700">
                 <div className="relative pl-8">
                     <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-300">1</div>
                     <p className="text-sm text-white font-medium">Initial Pitch</p>
                     <p className="text-xs text-slate-500">Sent immediately after analysis</p>
                 </div>
                 <div className="relative pl-8">
                     <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-300">2</div>
                     <p className="text-sm text-white font-medium">Gentle Bump</p>
                     <p className="text-xs text-slate-500">If no reply after 2 days</p>
                 </div>
                 <div className="relative pl-8">
                     <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-300">3</div>
                     <p className="text-sm text-white font-medium">Break-up Email</p>
                     <p className="text-xs text-slate-500">If no reply after 5 days</p>
                 </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default CampaignConfig;