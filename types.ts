export interface Lead {
  id: string;
  businessName: string;
  industry: string;
  location: string;
  website: string;
  email: string;
  contactPerson: string;
  status: 'New' | 'Analyzing' | 'Contacted' | 'Replied' | 'Converted' | 'Blacklisted';
  sentiment?: 'Positive' | 'Negative' | 'Neutral' | 'Question';
  aiAnalysis?: string;
  lastEmailContent?: string;
  createdAt: string;
  websiteScore: number; // 0-100
}

export interface CampaignStats {
  totalLeads: number;
  emailsSent: number;
  openRate: number;
  replyRate: number;
  activeLeads: number;
}

export interface SearchParams {
  keyword: string;
  location: string;
  serviceOffered: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  LEAD_FINDER = 'LEAD_FINDER',
  INBOX = 'INBOX',
  CAMPAIGN_CONFIG = 'CAMPAIGN_CONFIG'
}