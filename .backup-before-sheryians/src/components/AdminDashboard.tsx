import React, { useState, useEffect } from 'react';
import { store } from '../services/orbitStore';
import { AgentService } from '../services/agentService';
import { WaitlistEntry, Inquiry, User, DashboardStats, AgentDemoResponse } from '../types';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
}

type AdminTab = 'overview' | 'waitlist' | 'inquiries' | 'database' | 'users' | 'agents';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToWebsite }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(store.getCurrentUser());
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    total_users: 3,
    total_waitlist: 5,
    pending_waitlist: 3,
    total_inquiries: 3,
    new_inquiries: 1,
    total_projects: 3,
    total_agent_tasks: 12,
    builder_role_breakdown: {},
    inquiry_type_breakdown: {},
  });

  // Waitlist tab state
  const [waitlistFilter, setWaitlistFilter] = useState('');
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);

  // Inquiries tab state
  const [inquiryFilter, setInquiryFilter] = useState('');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Users tab state
  const [users, setUsers] = useState<User[]>([]);

  // Database raw explorer state
  const [rawDbData, setRawDbData] = useState<any>(null);
  const [activeDbTable, setActiveDbTable] = useState<'waitlist' | 'inquiries' | 'subscribers' | 'users'>('waitlist');

  // Agent studio state
  const [agentPrompt, setAgentPrompt] = useState('Add an agent review check before running database migrations.');
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentResult, setAgentResult] = useState<AgentDemoResponse | null>(null);

  const refreshData = async () => {
    try {
      const [newStats, newWaitlist, newInquiries, newUsers, newRaw] = await Promise.all([
        store.getStats(),
        store.getWaitlist(waitlistFilter),
        store.getInquiries(inquiryFilter),
        store.getUsers(),
        store.getRawDatabase(),
      ]);
      setStats(newStats);
      setWaitlistEntries(newWaitlist);
      setInquiries(newInquiries);
      setUsers(newUsers);
      setRawDbData(newRaw);
    } catch (e) {
      console.error('Error refreshing admin data:', e);
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser, waitlistFilter, inquiryFilter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const user = await store.login(emailInput, passwordInput);
      setCurrentUser(user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setLoginError(message);
    }
  };

  const handleLogout = () => {
    store.logout();
    setCurrentUser(null);
  };

  const handleUpdateWaitlistStatus = async (
    id: number,
    status: 'pending' | 'approved' | 'invited' | 'rejected'
  ) => {
    await store.updateWaitlistStatus(id, status);
    await refreshData();
  };

  const handleUpdateInquiryStatus = async (
    id: number,
    status: 'new' | 'in_review' | 'contacted' | 'closed'
  ) => {
    await store.updateInquiryStatus(id, status);
    await refreshData();
  };

  const handleExportCsv = () => {
    window.location.href = '/api/v1/waitlist/export-csv';
  };

  const handleRunAgentStudio = () => {
    if (!agentPrompt.trim() || isAgentRunning) return;
    setIsAgentRunning(true);
    setTimeout(() => {
      const res = AgentService.simulateDemo(agentPrompt, 'fullstack');
      setAgentResult(res);
      setIsAgentRunning(false);
    }, 400);
  };

  // If not logged in, show Auth overlay
  if (!currentUser) {
    return (
      <div className="auth-overlay">
        <div className="auth-card">
          <div className="brand">
            <span className="brand-mark">◈</span>
            <h2>orbit admin</h2>
          </div>
          <p className="auth-subtitle">Sign in to access Orbit Workspace Console</p>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="admin-email">Email</label>
              <input
                type="email"
                id="admin-email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="admin-password">Password</label>
              <input
                type="password"
                id="admin-password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" id="btn-login">
              Authenticate <span>→</span>
            </button>
            {loginError && <p className="error-text">{loginError}</p>}
          </form>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onBackToWebsite}>
              ← Back to Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">◈</span>
          <span>orbit</span>
          <span className="admin-badge" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}>
            ● ONLINE
          </span>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`nav-item ${activeTab === 'waitlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('waitlist')}
          >
            Waitlist <span className="badge">{stats.pending_waitlist}</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            Inquiries <span className="badge">{stats.new_inquiries}</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'database' ? 'active' : ''}`}
            onClick={() => setActiveTab('database')}
            style={{ fontWeight: activeTab === 'database' ? 700 : 500 }}
          >
            Data Explorer <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>DATA</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`nav-item ${activeTab === 'agents' ? 'active' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            Agent Studio
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="avatar">A</div>
            <div>
              <strong>{currentUser.full_name || 'Administrator'}</strong>
              <small>{currentUser.email}</small>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div>
            <h1>
              {activeTab === 'overview' && 'Mission Overview'}
              {activeTab === 'waitlist' && 'Waitlist Queue Management'}
              {activeTab === 'inquiries' && 'Inquiries & Demo Requests'}
              {activeTab === 'database' && 'Data Explorer & Records'}
              {activeTab === 'users' && 'Registered User Accounts'}
              {activeTab === 'agents' && 'Interactive Agent Studio'}
            </h1>
            <p className="page-subtitle">
              Workspace administration, verified applicant queues, and system telemetry.
            </p>
          </div>
          <div className="top-actions">
            <button onClick={handleExportCsv} className="btn btn-secondary">
              Export Waitlist CSV
            </button>
            <button onClick={onBackToWebsite} className="btn btn-ghost">
              View Live Website ↗
            </button>
          </div>
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-label">TOTAL WAITLIST</span>
                <strong className="metric-value">{stats.total_waitlist}</strong>
                <span className="metric-trend">{stats.pending_waitlist} pending review</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">CUSTOMER INQUIRIES</span>
                <strong className="metric-value">{stats.total_inquiries}</strong>
                <span className="metric-trend">{stats.new_inquiries} unread requests</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">REGISTERED BUILDERS</span>
                <strong className="metric-value">{stats.total_users}</strong>
                <span className="metric-trend">{stats.total_projects} active workspaces</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">SYSTEM STATUS</span>
                <strong className="metric-value" style={{ fontSize: '24px', color: '#10b981' }}>
                  99.98%
                </strong>
                <span className="metric-trend highlight">All systems operational</span>
              </div>
            </div>

            <div className="breakdown-grid">
              <div className="card">
                <h3>Builder Roles Distribution</h3>
                <div className="role-bars">
                  {Object.entries(stats.builder_role_breakdown).map(([role, count]) => {
                    const total = Object.values(stats.builder_role_breakdown).reduce((a, b) => a + b, 0) || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={role} className="bar-row">
                        <span style={{ width: '90px', textTransform: 'capitalize' }}>{role}</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span style={{ fontWeight: 600 }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card">
                <h3>Inquiry Types Breakdown</h3>
                <div className="role-bars">
                  {Object.entries(stats.inquiry_type_breakdown).map(([type, count]) => {
                    const total = Object.values(stats.inquiry_type_breakdown).reduce((a, b) => a + b, 0) || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={type} className="bar-row">
                        <span style={{ width: '90px', textTransform: 'capitalize' }}>{type}</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${pct}%`, background: 'var(--lime)' }}></div>
                        </div>
                        <span style={{ fontWeight: 600 }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WAITLIST TAB */}
        {activeTab === 'waitlist' && (
          <div className="table-card">
            <div className="table-header">
              <h3>Waitlist Queue ({waitlistEntries.length} applicants)</h3>
              <div className="filters">
                <select
                  value={waitlistFilter}
                  onChange={(e) => setWaitlistFilter(e.target.value)}
                  className="admin-select"
                  style={{ width: 'auto' }}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="invited">Invited</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Queue #</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Builder Role</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {waitlistEntries.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: '30px' }}>
                      No entries registered yet.
                    </td>
                  </tr>
                ) : (
                  waitlistEntries.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <strong>#{index + 1}</strong>
                      </td>
                      <td>
                        <strong>{item.email}</strong>
                      </td>
                      <td>{item.full_name || '—'}</td>
                      <td>
                        <span className="badge" style={{ textTransform: 'capitalize' }}>
                          {item.builder_role}
                        </span>
                      </td>
                      <td>{item.company || '—'}</td>
                      <td>
                        <span className={`status-pill status-${item.status}`}>{item.status}</span>
                      </td>
                      <td>
                        <small>{new Date(item.created_at).toLocaleDateString()}</small>
                      </td>
                      <td>
                        {item.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleUpdateWaitlistStatus(item.id, 'approved')}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleUpdateWaitlistStatus(item.id, 'invited')}
                            >
                              Invite
                            </button>
                          </div>
                        ) : (
                          <small style={{ color: 'var(--muted)' }}>Complete</small>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div className="table-card">
            <div className="table-header">
              <h3>Customer & Partner Inquiries ({inquiries.length} received)</h3>
              <select
                value={inquiryFilter}
                onChange={(e) => setInquiryFilter(e.target.value)}
                className="admin-select"
                style={{ width: 'auto' }}
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="in_review">In Review</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: '30px' }}>
                      No inquiries received yet.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                      </td>
                      <td>{item.email}</td>
                      <td>{item.company || '—'}</td>
                      <td>
                        <span className="badge" style={{ textTransform: 'uppercase' }}>
                          {item.inquiry_type}
                        </span>
                      </td>
                      <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.message}
                      </td>
                      <td>
                        <span className={`status-pill status-${item.status}`}>{item.status}</span>
                      </td>
                      <td>
                        {item.status === 'new' ? (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleUpdateInquiryStatus(item.id, 'contacted')}
                          >
                            Mark Contacted
                          </button>
                        ) : (
                          <small style={{ color: 'var(--muted)' }}>{item.status}</small>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* DATABASE (SQLITE) TAB */}
        {activeTab === 'database' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button
                type="button"
                className={`btn btn-sm ${activeDbTable === 'waitlist' ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setActiveDbTable('waitlist')}
              >
                Table: waitlist ({rawDbData?.waitlist?.length || 0})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeDbTable === 'inquiries' ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setActiveDbTable('inquiries')}
              >
                Table: inquiries ({rawDbData?.inquiries?.length || 0})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeDbTable === 'subscribers' ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setActiveDbTable('subscribers')}
              >
                Table: subscribers ({rawDbData?.subscribers?.length || 0})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeDbTable === 'users' ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setActiveDbTable('users')}
              >
                Table: users ({rawDbData?.users?.length || 0})
              </button>
            </div>

            <div className="table-card">
              <div className="table-header">
                <h3>
                  Record View: <span style={{ color: 'var(--violet)', textTransform: 'capitalize' }}>{activeDbTable}</span>
                </h3>
                <small style={{ color: 'var(--muted)' }}>Verified system records & schema</small>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    {activeDbTable === 'waitlist' && (
                      <tr>
                        <th>id</th>
                        <th>email</th>
                        <th>full_name</th>
                        <th>builder_role</th>
                        <th>company</th>
                        <th>status</th>
                        <th>priority_score</th>
                        <th>created_at</th>
                      </tr>
                    )}
                    {activeDbTable === 'inquiries' && (
                      <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>email</th>
                        <th>company</th>
                        <th>inquiry_type</th>
                        <th>message</th>
                        <th>status</th>
                        <th>created_at</th>
                      </tr>
                    )}
                    {activeDbTable === 'subscribers' && (
                      <tr>
                        <th>id</th>
                        <th>email</th>
                        <th>source</th>
                        <th>is_active</th>
                        <th>created_at</th>
                      </tr>
                    )}
                    {activeDbTable === 'users' && (
                      <tr>
                        <th>id</th>
                        <th>email</th>
                        <th>full_name</th>
                        <th>role</th>
                        <th>is_active</th>
                        <th>created_at</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {rawDbData?.[activeDbTable]?.map((row: any) => (
                      <tr key={row.id}>
                        {Object.keys(row).map((col) => (
                          <td key={col}>
                            {typeof row[col] === 'boolean'
                              ? String(row[col])
                              : row[col] === null || row[col] === undefined
                              ? 'NULL'
                              : String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="table-card">
            <div className="table-header">
              <h3>Registered Accounts</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>
                      <strong>{u.email}</strong>
                    </td>
                    <td>{u.full_name || '—'}</td>
                    <td>
                      <span className="badge" style={{ textTransform: 'uppercase' }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${u.is_active ? 'status-approved' : 'status-rejected'}`}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <small>{new Date(u.created_at).toLocaleDateString()}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AGENTS TAB */}
        {activeTab === 'agents' && (
          <div className="card">
            <h3>Interactive Agent Studio</h3>
            <p className="auth-subtitle">Simulate and test Orbit multi-agent task execution in real time.</p>
            <div className="agent-tester">
              <input
                type="text"
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                placeholder="Enter an agent goal prompt (e.g. Add dark theme support or Build user authentication)..."
                className="prompt-input"
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleRunAgentStudio}
                disabled={isAgentRunning}
              >
                {isAgentRunning ? 'Orchestrating...' : 'Run Agent Plan ✳'}
              </button>
            </div>

            {agentResult && (
              <div className="agent-preview-box">
                <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                  <strong>Project:</strong> {agentResult.project_name} | <strong>Branch:</strong> {agentResult.branch}
                  <br />
                  <strong>Files Affected:</strong> {agentResult.files_affected.join(', ')}
                  <br />
                  <strong>Diff:</strong> {agentResult.diff_summary}
                </div>

                <div>
                  {agentResult.steps.map((step) => (
                    <div key={step.step_number} className="agent-step-item">
                      <div className="step-dot">{step.step_number}</div>
                      <div>
                        <strong>{step.title}</strong> —{' '}
                        <small style={{ color: 'var(--lime)' }}>{step.status.toUpperCase()}</small>
                        <br />
                        <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{step.description}</span>
                        <br />
                        {step.details && <small style={{ color: '#94a3b8' }}>{step.details}</small>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
