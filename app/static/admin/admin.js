let authToken = localStorage.getItem('orbit_admin_token') || null;

const API_BASE = '/api/v1';

// Elements
const authOverlay = document.getElementById('auth-overlay');
const dashboardApp = document.getElementById('dashboard-app');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const btnLogout = document.getElementById('btn-logout');

// Initial check
if (authToken) {
  checkAuthAndLoad();
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.style.display = 'none';
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Authentication failed');
    }

    const data = await res.json();
    authToken = data.access_token;
    localStorage.setItem('orbit_admin_token', authToken);
    checkAuthAndLoad();
  } catch (err) {
    loginError.textContent = err.message;
    loginError.style.display = 'block';
  }
});

btnLogout.addEventListener('click', () => {
  localStorage.removeItem('orbit_admin_token');
  authToken = null;
  authOverlay.style.display = 'flex';
  dashboardApp.style.display = 'none';
});

async function checkAuthAndLoad() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (!res.ok) throw new Error('Session expired');
    const user = await res.json();
    if (user.role !== 'admin') {
      throw new Error('Access denied. Administrator privileges required.');
    }

    document.getElementById('current-user-name').textContent = user.full_name || 'Admin';
    document.getElementById('current-user-email').textContent = user.email;

    authOverlay.style.display = 'none';
    dashboardApp.style.display = 'flex';

    loadStats();
    loadWaitlist();
    loadInquiries();
    loadUsers();
  } catch (err) {
    localStorage.removeItem('orbit_admin_token');
    authToken = null;
    authOverlay.style.display = 'flex';
    dashboardApp.style.display = 'none';
    loginError.textContent = err.message;
    loginError.style.display = 'block';
  }
}

// Navigation Tabs
document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const target = btn.dataset.tab;
    document.getElementById(target).classList.add('active');
  });
});

async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.ok) return;
    const stats = await res.json();

    document.getElementById('stat-waitlist').textContent = stats.total_waitlist;
    document.getElementById('stat-pending-waitlist').textContent = stats.pending_waitlist;
    document.getElementById('waitlist-badge').textContent = stats.pending_waitlist;

    document.getElementById('stat-inquiries').textContent = stats.total_inquiries;
    document.getElementById('stat-new-inquiries').textContent = stats.new_inquiries;
    document.getElementById('inquiries-badge').textContent = stats.new_inquiries;

    document.getElementById('stat-users').textContent = stats.total_users;
    document.getElementById('stat-projects').textContent = stats.total_projects;
    document.getElementById('stat-tasks').textContent = stats.total_agent_tasks;

    renderBarChart('role-bars', stats.builder_role_breakdown);
    renderBarChart('inquiry-bars', stats.inquiry_type_breakdown);
  } catch (e) {
    console.error('Error loading stats', e);
  }
}

function renderBarChart(containerId, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  const total = Object.values(data).reduce((acc, v) => acc + v, 0) || 1;

  for (const [key, count] of Object.entries(data)) {
    const pct = Math.round((count / total) * 100);
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `
      <span style="width: 90px; text-transform: capitalize;">${key}</span>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${pct}%"></div>
      </div>
      <span style="font-weight: 600;">${count}</span>
    `;
    container.appendChild(row);
  }
}

async function loadWaitlist() {
  const statusFilter = document.getElementById('waitlist-status-filter').value;
  const url = statusFilter ? `${API_BASE}/admin/waitlist?status=${statusFilter}` : `${API_BASE}/admin/waitlist`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const items = await res.json();
    const tbody = document.getElementById('waitlist-rows');
    tbody.innerHTML = '';

    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--muted); padding: 30px;">No entries registered yet.</td></tr>';
      return;
    }

    items.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>#${index + 1}</strong></td>
        <td><strong>${item.email}</strong></td>
        <td>${item.full_name || '—'}</td>
        <td><span class="badge" style="text-transform: capitalize;">${item.builder_role}</span></td>
        <td>${item.company || '—'}</td>
        <td><span class="status-pill status-${item.status}">${item.status}</span></td>
        <td><small>${new Date(item.created_at).toLocaleDateString()}</small></td>
        <td>
          ${item.status === 'pending' ? `
            <button class="btn btn-ghost btn-sm" onclick="updateWaitlistStatus(${item.id}, 'approved')">Approve</button>
            <button class="btn btn-secondary btn-sm" onclick="updateWaitlistStatus(${item.id}, 'invited')">Invite</button>
          ` : `<small style="color: var(--muted);">Complete</small>`}
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error('Waitlist load failed', e);
  }
}

window.updateWaitlistStatus = async function(id, newStatus) {
  try {
    const res = await fetch(`${API_BASE}/admin/waitlist/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      loadWaitlist();
      loadStats();
    }
  } catch (e) {
    alert('Failed to update status');
  }
};

document.getElementById('waitlist-status-filter').addEventListener('change', loadWaitlist);

async function loadInquiries() {
  const statusFilter = document.getElementById('inquiry-status-filter').value;
  const url = statusFilter ? `${API_BASE}/admin/inquiries?status=${statusFilter}` : `${API_BASE}/admin/inquiries`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const items = await res.json();
    const tbody = document.getElementById('inquiries-rows');
    tbody.innerHTML = '';

    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--muted); padding: 30px;">No inquiries received yet.</td></tr>';
      return;
    }

    items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td>${item.email}</td>
        <td>${item.company || '—'}</td>
        <td><span class="badge">${item.inquiry_type}</span></td>
        <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.message}</td>
        <td><span class="status-pill status-${item.status}">${item.status}</span></td>
        <td>
          ${item.status === 'new' ? `
            <button class="btn btn-ghost btn-sm" onclick="updateInquiryStatus(${item.id}, 'contacted')">Mark Contacted</button>
          ` : `<small style="color: var(--muted);">${item.status}</small>`}
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error('Inquiries load failed', e);
  }
}

window.updateInquiryStatus = async function(id, newStatus) {
  try {
    const res = await fetch(`${API_BASE}/admin/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      loadInquiries();
      loadStats();
    }
  } catch (e) {
    alert('Failed to update status');
  }
};

document.getElementById('inquiry-status-filter').addEventListener('change', loadInquiries);

async function loadUsers() {
  try {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const users = await res.json();
    const tbody = document.getElementById('users-rows');
    tbody.innerHTML = '';

    users.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#${u.id}</td>
        <td><strong>${u.email}</strong></td>
        <td>${u.full_name || '—'}</td>
        <td><span class="badge">${u.role}</span></td>
        <td><span class="status-pill ${u.is_active ? 'status-approved' : 'status-rejected'}">${u.is_active ? 'Active' : 'Disabled'}</span></td>
        <td><small>${new Date(u.created_at).toLocaleDateString()}</small></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error('Users load failed', e);
  }
}

// Agent Studio Tester
document.getElementById('btn-run-agent').addEventListener('click', async () => {
  const prompt = document.getElementById('agent-test-prompt').value.trim();
  if (!prompt) return;

  const btn = document.getElementById('btn-run-agent');
  btn.textContent = 'Orchestrating...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/agents/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, builder_role: 'fullstack' })
    });

    const data = await res.json();
    const container = document.getElementById('agent-steps-view');
    container.innerHTML = `
      <div style="margin-bottom: 16px; padding: 12px; background: rgba(255,255,255,0.06); border-radius: 6px;">
        <strong>Project:</strong> ${data.project_name} | <strong>Branch:</strong> ${data.branch}<br>
        <strong>Files Affected:</strong> ${data.files_affected.join(', ')}<br>
        <strong>Diff:</strong> ${data.diff_summary}
      </div>
    `;

    data.steps.forEach(step => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'agent-step-item';
      stepDiv.innerHTML = `
        <div class="step-dot">${step.step_number}</div>
        <div>
          <strong>${step.title}</strong> — <small style="color: var(--lime);">${step.status.toUpperCase()}</small><br>
          <span style="font-size: 13px; color: #cbd5e1;">${step.description}</span><br>
          <small style="color: #94a3b8;">${step.details || ''}</small>
        </div>
      `;
      container.appendChild(stepDiv);
    });

    document.getElementById('agent-test-results').style.display = 'block';
  } catch (e) {
    alert('Agent execution failed: ' + e.message);
  } finally {
    btn.textContent = 'Run Agent Plan ✳';
    btn.disabled = false;
  }
});
