import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Mail, MousePointerClick, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { CampaignStats } from '../types';

interface DashboardProps {
  stats: CampaignStats;
}

const data = [
  { name: 'Mon', sent: 40, replies: 2 },
  { name: 'Tue', sent: 30, replies: 4 },
  { name: 'Wed', sent: 20, replies: 1 },
  { name: 'Thu', sent: 70, replies: 8 },
  { name: 'Fri', sent: 90, replies: 15 },
  { name: 'Sat', sent: 50, replies: 10 },
  { name: 'Sun', sent: 60, replies: 12 },
];

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; change: string; isGood?: boolean }> = ({ title, value, icon, change, isGood = true }) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-slate-700/50 rounded-lg text-indigo-400">
        {icon}
      </div>
    </div>
    <div className="flex items-center text-sm">
      <span className={`${isGood ? 'text-emerald-400' : 'text-rose-400'} flex items-center font-medium`}>
        {isGood ? '+' : ''}{change}%
        {isGood ? <TrendingUp size={14} className="ml-1" /> : <AlertCircle size={14} className="ml-1" />}
      </span>
      <span className="text-slate-500 ml-2">vs last week</span>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <div className="text-sm text-slate-400">Last updated: Just now</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Leads Hunted" 
          value={stats.totalLeads.toLocaleString()} 
          icon={<Users size={20} />} 
          change="12.5" 
        />
        <StatCard 
          title="Emails Sent" 
          value={stats.emailsSent.toLocaleString()} 
          icon={<Mail size={20} />} 
          change="8.2" 
        />
        <StatCard 
          title="Avg. Open Rate" 
          value={`${stats.openRate}%`} 
          icon={<MousePointerClick size={20} />} 
          change="2.1" 
        />
        <StatCard 
          title="Revenue Potential" 
          value="$12,450" 
          icon={<DollarSign size={20} />} 
          change="15.3" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6">Outreach Performance</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="sent" stroke="#6366f1" fillOpacity={1} fill="url(#colorSent)" />
                <Area type="monotone" dataKey="replies" stroke="#10b981" fillOpacity={1} fill="url(#colorReplies)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-700/50 last:border-0">
                <div className={`w-2 h-2 mt-2 rounded-full ${i % 2 === 0 ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                <div>
                  <p className="text-sm text-slate-200">
                    {i % 2 === 0 ? 'Client replied to proposal' : 'Automated follow-up sent'}
                  </p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;