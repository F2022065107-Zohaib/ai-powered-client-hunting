import React, { useState } from 'react';
import { Lead } from '../types';
import { analyzeSentiment } from '../services/gemini';
import { Send, User, Bot, ThumbsUp, ThumbsDown, HelpCircle, Loader2 } from 'lucide-react';

interface InboxProps {
  leads: Lead[];
}

const Inbox: React.FC<InboxProps> = ({ leads }) => {
  // Filter only replied leads for demo or add dummy data if none
  const activeConversations = leads.filter(l => l.status === 'Replied' || l.status === 'Contacted');
  
  // Dummy conversation data for the demo if leads are empty
  const demoLeads: Lead[] = activeConversations.length > 0 ? activeConversations : [
    {
      id: 'demo-1',
      businessName: 'Apex Gym London',
      industry: 'Fitness',
      location: 'London',
      website: 'apex.com',
      email: 'mark@apex.com',
      contactPerson: 'Mark Smith',
      status: 'Replied',
      websiteScore: 60,
      createdAt: '',
      lastEmailContent: "Sounds interesting. What is your pricing structure for a full redesign?"
    },
    {
        id: 'demo-2',
        businessName: 'Smile Dental',
        industry: 'Health',
        location: 'Manchester',
        website: 'smile.co.uk',
        email: 'sarah@smile.co.uk',
        contactPerson: 'Sarah Jones',
        status: 'Replied',
        websiteScore: 85,
        createdAt: '',
        lastEmailContent: "Please remove me from your list. We have an in-house team."
    }
  ];

  const [selectedThread, setSelectedThread] = useState<Lead>(demoLeads[0]);
  const [replyText, setReplyText] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [sentiment, setSentiment] = useState<'Positive' | 'Negative' | 'Question' | null>(null);

  const handleSelectThread = async (lead: Lead) => {
      setSelectedThread(lead);
      setReplyText('');
      setAiSuggestion(null);
      setSentiment(null);
      
      // Auto analyze when selecting a thread
      if (lead.lastEmailContent) {
          setAnalyzing(true);
          const result = await analyzeSentiment(lead.lastEmailContent);
          setSentiment(result.sentiment as any);
          setAiSuggestion(result.suggestedReply);
          setAnalyzing(false);
      }
  };

  const useSuggestion = () => {
      if (aiSuggestion) setReplyText(aiSuggestion);
  };

  return (
    <div className="flex h-full bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50">
           <h3 className="font-semibold text-white">Intelligent Inbox</h3>
           <p className="text-xs text-slate-400">AI auto-categorizes replies</p>
        </div>
        <div className="overflow-y-auto flex-1">
           {demoLeads.map(lead => (
               <div 
                key={lead.id}
                onClick={() => handleSelectThread(lead)}
                className={`p-4 border-b border-slate-700 cursor-pointer hover:bg-slate-700/50 transition-colors ${selectedThread.id === lead.id ? 'bg-slate-700/80 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
               >
                   <div className="flex justify-between items-start mb-1">
                       <h4 className="font-medium text-slate-200">{lead.businessName}</h4>
                       <span className="text-xs text-slate-500">10m ago</span>
                   </div>
                   <p className="text-sm text-slate-400 truncate">{lead.contactPerson}: {lead.lastEmailContent}</p>
                   {selectedThread.id === lead.id && sentiment && (
                       <div className="mt-2">
                           <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold tracking-wider
                             ${sentiment === 'Positive' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                               sentiment === 'Negative' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 
                               'bg-amber-500/20 text-amber-400 border-amber-500/30'}
                           `}>
                               {sentiment}
                           </span>
                       </div>
                   )}
               </div>
           ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col bg-slate-900/30">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
            <div>
                <h3 className="font-bold text-white">{selectedThread.contactPerson}</h3>
                <p className="text-xs text-slate-400">{selectedThread.email} • {selectedThread.businessName}</p>
            </div>
            <div className="flex gap-2">
                <button className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition-colors">View CRM Profile</button>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* My previous email */}
            <div className="flex justify-end">
                <div className="bg-indigo-600/20 border border-indigo-500/30 text-slate-200 p-4 rounded-2xl rounded-tr-none max-w-[80%]">
                    <p className="text-sm">Hi {selectedThread.contactPerson}, I noticed your website loading speed is affecting your SEO ranking...</p>
                </div>
            </div>

            {/* Client Reply */}
            <div className="flex justify-start">
                 <div className="bg-slate-800 border border-slate-700 text-white p-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-lg">
                    <p className="text-sm">{selectedThread.lastEmailContent}</p>
                </div>
            </div>

            {/* AI Analysis Block */}
            <div className="flex justify-center my-4">
                <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-600 p-1 rounded-xl shadow-lg max-w-lg w-full">
                    <div className="bg-slate-900/80 backdrop-blur rounded-lg p-3">
                         <div className="flex items-center gap-2 mb-2">
                            <Bot size={16} className="text-indigo-400" />
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">HuntFlow AI Analysis</span>
                         </div>
                         
                         {analyzing ? (
                             <div className="flex items-center gap-2 text-slate-400 text-sm p-2">
                                 <Loader2 className="animate-spin" size={14} /> Analyzing sentiment...
                             </div>
                         ) : (
                             <div className="space-y-3">
                                 <div className="flex items-center gap-4 text-sm">
                                     <span className="text-slate-400">Detected Intent:</span>
                                     <div className="flex items-center gap-1 font-medium text-white">
                                         {sentiment === 'Positive' ? <ThumbsUp size={14} className="text-emerald-500"/> : 
                                          sentiment === 'Negative' ? <ThumbsDown size={14} className="text-rose-500"/> :
                                          <HelpCircle size={14} className="text-amber-500"/>}
                                          {sentiment}
                                     </div>
                                 </div>
                                 
                                 {aiSuggestion && (
                                     <div className="bg-slate-800 p-3 rounded border border-slate-700">
                                         <p className="text-xs text-slate-400 mb-2 uppercase font-bold">Recommended Reply</p>
                                         <p className="text-sm text-slate-300 italic mb-2">"{aiSuggestion}"</p>
                                         <button 
                                            onClick={useSuggestion}
                                            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition-colors w-full"
                                         >
                                             Use this Draft
                                         </button>
                                     </div>
                                 )}
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-700 bg-slate-800">
            <div className="relative">
                <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply or use AI draft..."
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 pr-12 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24 text-sm"
                />
                <button className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors shadow-lg">
                    <Send size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;