import React, { useState } from 'react';
import { Search, MapPin, Globe, Mail, ChevronRight, Zap, Loader2, CheckCircle2, AlertCircle, PlayCircle } from 'lucide-react';
import { Lead } from '../types';
import { simulateLeadScraping, analyzeLeadAndGeneratePitch } from '../services/gemini';

interface LeadFinderProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

const LeadFinder: React.FC<LeadFinderProps> = ({ leads, setLeads }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [service, setService] = useState('Web Development');
  const [isHunting, setIsHunting] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  // Modal State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [generatedPitch, setGeneratedPitch] = useState<{ analysis: string, emailDraft: string } | null>(null);

  const handleHunt = async () => {
    if (!keyword || !location) return;
    setIsHunting(true);
    // Simulate steps
    await new Promise(r => setTimeout(r, 1000)); // Google Maps
    await new Promise(r => setTimeout(r, 800)); // Web Crawl
    
    const newLeads = await simulateLeadScraping(keyword, location);
    setLeads(prev => [...newLeads, ...prev]);
    setIsHunting(false);
  };

  const handleAnalyze = async (lead: Lead) => {
    setAnalyzingId(lead.id);
    setSelectedLead(lead);
    setGeneratedPitch(null);
    
    const result = await analyzeLeadAndGeneratePitch(lead, service);
    
    setGeneratedPitch(result);
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'Analyzing', aiAnalysis: result.analysis } : l));
    setAnalyzingId(null);
  };

  const sendEmail = (leadId: string) => {
     setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'Contacted' } : l));
     setSelectedLead(null); // Close modal
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Search Header */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="text-indigo-400" />
            Lead Scraping & Discovery
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Business Type (e.g. Dentists)" 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Location (e.g. New York)" 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="relative">
             <input 
              type="text" 
              placeholder="Your Service (e.g. SEO)" 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
          </div>
          <button 
            onClick={handleHunt}
            disabled={isHunting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isHunting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Hunting...
              </>
            ) : (
              <>
                <Zap size={20} fill="currentColor" />
                Start Auto-Hunt
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="flex-1 overflow-hidden bg-slate-800 rounded-xl border border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-white">Discovered Leads ({leads.length})</h3>
            <div className="flex gap-2">
                 <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">Emails Verified</span>
                 <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded border border-amber-500/20">Duplicate Check</span>
            </div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-0">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/50 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-slate-400 font-medium text-sm">Business</th>
                <th className="p-4 text-slate-400 font-medium text-sm">Website Score</th>
                <th className="p-4 text-slate-400 font-medium text-sm">Contact</th>
                <th className="p-4 text-slate-400 font-medium text-sm">Status</th>
                <th className="p-4 text-slate-400 font-medium text-sm text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {leads.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                        No leads found yet. Start a hunt above.
                    </td>
                </tr>
              ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-700/30 transition-colors group">
                      <td className="p-4">
                        <div className="font-medium text-white">{lead.businessName}</div>
                        <a href={`https://${lead.website}`} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                            {lead.website} <Globe size={10} />
                        </a>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                           <div className="w-full max-w-[80px] h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${lead.websiteScore > 70 ? 'bg-emerald-500' : lead.websiteScore > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                                    style={{ width: `${lead.websiteScore}%` }} 
                                />
                           </div>
                           <span className="text-xs text-slate-400">{lead.websiteScore}/100</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-200">{lead.contactPerson}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                            {lead.email} <CheckCircle2 size={10} className="text-emerald-500" />
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium border
                          ${lead.status === 'New' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                            lead.status === 'Contacted' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                            lead.status === 'Replied' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            'bg-slate-700 text-slate-400 border-slate-600'}
                        `}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                            onClick={() => handleAnalyze(lead)}
                            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
                            title="AI Analyze & Draft"
                        >
                          <Zap size={16} className={analyzingId === lead.id ? 'text-amber-400 animate-pulse' : ''} />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Analysis Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                  <h3 className="text-xl font-bold text-white">AI Outreach Generator</h3>
                  <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white">&times;</button>
              </div>
              
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                 <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-800 p-4 rounded-lg">
                         <h4 className="text-sm font-medium text-slate-400 mb-1">Target</h4>
                         <p className="text-white font-semibold">{selectedLead.businessName}</p>
                     </div>
                     <div className="bg-slate-800 p-4 rounded-lg">
                         <h4 className="text-sm font-medium text-slate-400 mb-1">Decision Maker</h4>
                         <p className="text-white font-semibold">{selectedLead.contactPerson}</p>
                     </div>
                 </div>

                 {!generatedPitch ? (
                     <div className="flex flex-col items-center justify-center py-12 space-y-4">
                         <Loader2 className="animate-spin text-indigo-500" size={48} />
                         <p className="text-slate-400 animate-pulse">Analyzing website structure...</p>
                         <p className="text-slate-500 text-sm">Identifying pain points for {service}...</p>
                     </div>
                 ) : (
                     <>
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                            <h4 className="text-amber-400 font-medium text-sm mb-2 flex items-center gap-2">
                                <Zap size={14} /> AI Insight
                            </h4>
                            <p className="text-slate-300 text-sm italic">"{generatedPitch.analysis}"</p>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-3 flex items-center justify-between">
                                Generated Email Draft
                                <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Tone: Professional yet Friendly</span>
                            </h4>
                            <textarea 
                                className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm leading-relaxed"
                                value={generatedPitch.emailDraft}
                                readOnly
                            />
                        </div>
                     </>
                 )}
              </div>

              <div className="p-6 border-t border-slate-700 bg-slate-800 flex justify-end gap-3">
                  <button 
                    onClick={() => setSelectedLead(null)}
                    className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                      Cancel
                  </button>
                  <button 
                    onClick={() => sendEmail(selectedLead.id)}
                    disabled={!generatedPitch}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      <Mail size={16} /> Send Email
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LeadFinder;