/**
 * Orbit Client SDK — Connects frontend interactions to FastAPI Backend.
 */
const ORBIT_CONFIG = {
  // Automatically defaults to relative API path or backend server
  apiBase: window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? `${window.location.origin}/api/v1`
    : '/api/v1'
};

const OrbitAPI = {
  /**
   * Submit email to early access waitlist
   */
  async joinWaitlist(data) {
    const res = await fetch(`${ORBIT_CONFIG.apiBase}/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to join waitlist');
    }
    return await res.json();
  },

  /**
   * Submit demo or sales inquiry
   */
  async submitInquiry(data) {
    const res = await fetch(`${ORBIT_CONFIG.apiBase}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to submit inquiry');
    }
    return await res.json();
  },

  /**
   * Subscribe email to newsletter
   */
  async subscribeNewsletter(email, source = 'landing_footer') {
    const res = await fetch(`${ORBIT_CONFIG.apiBase}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to subscribe');
    }
    return await res.json();
  },

  /**
   * Execute interactive AI agent demo
   */
  async runAgentDemo(prompt, builderRole = 'fullstack') {
    const res = await fetch(`${ORBIT_CONFIG.apiBase}/agents/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, builder_role: builderRole })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Agent execution failed');
    }
    return await res.json();
  }
};

window.OrbitAPI = OrbitAPI;
