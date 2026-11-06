export interface WaitlistEntry {
  id: number;
  email: string;
  full_name?: string | null;
  builder_role: 'frontend' | 'fullstack' | 'teams' | 'other';
  company?: string | null;
  use_case?: string | null;
  status: 'pending' | 'approved' | 'invited' | 'rejected';
  priority_score: number;
  queue_position?: number;
  created_at: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  company?: string | null;
  inquiry_type: 'demo' | 'sales' | 'partnership' | 'general';
  message: string;
  status: 'new' | 'in_review' | 'contacted' | 'closed';
  created_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  source: string;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
}

export interface AgentStep {
  step_number: number;
  title: string;
  description: string;
  status: 'done' | 'active' | 'pending';
  time_label: string;
  details?: string;
}

export interface AgentDemoResponse {
  prompt: string;
  project_name: string;
  branch: string;
  steps: AgentStep[];
  files_affected: string[];
  diff_summary: string;
  status: string;
}

export interface DashboardStats {
  total_users: number;
  total_waitlist: number;
  pending_waitlist: number;
  total_inquiries: number;
  new_inquiries: number;
  total_projects: number;
  total_agent_tasks: number;
  builder_role_breakdown: Record<string, number>;
  inquiry_type_breakdown: Record<string, number>;
}
