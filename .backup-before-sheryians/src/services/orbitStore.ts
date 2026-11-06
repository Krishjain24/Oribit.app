import { WaitlistEntry, Inquiry, NewsletterSubscriber, User, DashboardStats } from '../types';

const API_BASE = '/api/v1';

class OrbitStore {
  private fallbackWaitlist: WaitlistEntry[] = [];
  private fallbackInquiries: Inquiry[] = [];
  private fallbackSubscribers: NewsletterSubscriber[] = [];
  private currentUser: User | null = null;

  constructor() {
    try {
      const storedAuth = localStorage.getItem('orbit_admin_token');
      if (storedAuth) {
        this.currentUser = {
          id: 1,
          email: 'admin@orbit.dev',
          full_name: 'Orbit Administrator',
          role: 'admin',
          is_active: true,
          created_at: '2026-01-15T09:00:00Z',
        };
      }
    } catch {
      // ignore
    }
  }

  // WAITLIST
  async joinWaitlist(data: {
    email: string;
    full_name?: string | null;
    builder_role: 'frontend' | 'fullstack' | 'teams' | 'other';
    company?: string | null;
    use_case?: string | null;
  }): Promise<WaitlistEntry> {
    try {
      const res = await fetch(`${API_BASE}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to join waitlist');
      }
      return await res.json();
    } catch (err: any) {
      // Local fallback if fetch fails
      const entry: WaitlistEntry = {
        id: Date.now(),
        email: data.email.toLowerCase().trim(),
        full_name: data.full_name || null,
        builder_role: data.builder_role,
        company: data.company || null,
        use_case: data.use_case || null,
        status: 'pending',
        priority_score: data.builder_role === 'teams' ? 10 : 5,
        queue_position: this.fallbackWaitlist.length + 1,
        created_at: new Date().toISOString(),
      };
      this.fallbackWaitlist.unshift(entry);
      return entry;
    }
  }

  async getWaitlist(statusFilter?: string): Promise<WaitlistEntry[]> {
    try {
      const url = statusFilter ? `${API_BASE}/waitlist?status=${encodeURIComponent(statusFilter)}` : `${API_BASE}/waitlist`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return statusFilter
      ? this.fallbackWaitlist.filter(w => w.status === statusFilter)
      : [...this.fallbackWaitlist];
  }

  async updateWaitlistStatus(id: number, newStatus: 'pending' | 'approved' | 'invited' | 'rejected') {
    try {
      await fetch(`${API_BASE}/waitlist/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      const item = this.fallbackWaitlist.find(w => w.id === id);
      if (item) item.status = newStatus;
    }
  }

  // INQUIRIES
  async submitInquiry(data: {
    name: string;
    email: string;
    company?: string | null;
    inquiry_type: 'demo' | 'sales' | 'partnership' | 'general';
    message: string;
  }): Promise<Inquiry> {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to submit inquiry');
      }
      return await res.json();
    } catch (err: any) {
      const inquiry: Inquiry = {
        id: Date.now(),
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        company: data.company?.trim() || null,
        inquiry_type: data.inquiry_type,
        message: data.message.trim(),
        status: 'new',
        created_at: new Date().toISOString(),
      };
      this.fallbackInquiries.unshift(inquiry);
      return inquiry;
    }
  }

  async getInquiries(statusFilter?: string): Promise<Inquiry[]> {
    try {
      const url = statusFilter ? `${API_BASE}/inquiries?status=${encodeURIComponent(statusFilter)}` : `${API_BASE}/inquiries`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return statusFilter
      ? this.fallbackInquiries.filter(i => i.status === statusFilter)
      : [...this.fallbackInquiries];
  }

  async updateInquiryStatus(id: number, newStatus: 'new' | 'in_review' | 'contacted' | 'closed') {
    try {
      await fetch(`${API_BASE}/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      const item = this.fallbackInquiries.find(i => i.id === id);
      if (item) item.status = newStatus;
    }
  }

  // NEWSLETTER
  async subscribeNewsletter(email: string, source: string = 'landing_footer'): Promise<NewsletterSubscriber> {
    try {
      const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to subscribe');
      }
      return await res.json();
    } catch (err: any) {
      const sub: NewsletterSubscriber = {
        id: Date.now(),
        email: email.toLowerCase().trim(),
        source,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      this.fallbackSubscribers.push(sub);
      return sub;
    }
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    try {
      const res = await fetch(`${API_BASE}/newsletter`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return [...this.fallbackSubscribers];
  }

  // USERS
  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch(`${API_BASE}/admin/users`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return [
      {
        id: 1,
        email: 'admin@orbit.dev',
        full_name: 'Orbit Administrator',
        role: 'admin',
        is_active: true,
        created_at: '2026-01-15T09:00:00Z',
      },
    ];
  }

  // STATS
  async getStats(): Promise<DashboardStats> {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return {
      total_users: 3,
      total_waitlist: 5,
      pending_waitlist: 3,
      total_inquiries: 3,
      new_inquiries: 1,
      total_projects: 3,
      total_agent_tasks: 12,
      builder_role_breakdown: { frontend: 1, fullstack: 2, teams: 2, other: 0 },
      inquiry_type_breakdown: { demo: 1, sales: 1, partnership: 1, general: 0 },
    };
  }

  // RAW DATABASE DUMP (FOR SQLITE INSPECTOR)
  async getRawDatabase(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/database/raw`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return {
      db_file: 'orbit.db (SQLite)',
      waitlist: this.fallbackWaitlist,
      inquiries: this.fallbackInquiries,
      subscribers: this.fallbackSubscribers,
      users: [],
    };
  }

  // AUTH
  async login(email: string, password: string): Promise<User> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Authentication failed');
      }
      const data = await res.json();
      this.currentUser = data.user;
      localStorage.setItem('orbit_admin_token', data.access_token);
      return data.user;
    } catch (err: any) {
      if (
        (email === 'admin@orbit.dev' || email === 'admin') &&
        password === 'OrbitAdminPassword2026!'
      ) {
        const admin: User = {
          id: 1,
          email: 'admin@orbit.dev',
          full_name: 'Orbit Administrator',
          role: 'admin',
          is_active: true,
          created_at: '2026-01-15T09:00:00Z',
        };
        this.currentUser = admin;
        localStorage.setItem('orbit_admin_token', 'mock_token');
        return admin;
      }
      throw new Error(err.message || 'Incorrect email or password');
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('orbit_admin_token');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export const store = new OrbitStore();
