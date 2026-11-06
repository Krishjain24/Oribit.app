import React, { useState } from 'react';
import { AgentService } from '../services/agentService';
import { AgentDemoResponse, AgentStep } from '../types';

interface PlaygroundPageProps {
  onOpenWaitlist: () => void;
  onNavigate: (path: string) => void;
}

export const PlaygroundPage: React.FC<PlaygroundPageProps> = ({ onOpenWaitlist, onNavigate }) => {
  const [prompt, setPrompt] = useState('Build an enterprise Stripe billing portal with invoices, webhook verification, and SQLite persistence.');
  const [agentRole, setAgentRole] = useState<'frontend' | 'fullstack' | 'teams'>('fullstack');
  const [executionMode, setExecutionMode] = useState<'collaborative' | 'speed' | 'strict'>('collaborative');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'diff' | 'terminal' | 'preview'>('diff');
  const [selectedFile, setSelectedFile] = useState<string>('server/routes/billing.ts');

  const [result, setResult] = useState<AgentDemoResponse>({
    prompt: 'Build an enterprise Stripe billing portal with invoices, webhook verification, and SQLite persistence.',
    project_name: 'orbit / billing-engine',
    branch: 'feat/stripe-billing',
    steps: [
      { step_number: 1, title: 'Contract & Schema mapped', description: 'Defined SQLite invoices schema, customer ID mapping, and webhook secrets', status: 'done', time_label: '1m', details: 'Validated Stripe API keys and idempotency keys to prevent double charges.' },
      { step_number: 2, title: 'Synthesized router & client portal', description: 'Generated /api/v1/billing endpoints and BillingPortal.tsx', status: 'done', time_label: '30s', details: 'Added customer portal redirect session and webhook signature verification.' },
      { step_number: 3, title: 'Headless browser & runtime checks', description: 'Mounted in dev server and ran Playwright audit against /billing', status: 'active', time_label: 'now', details: 'Verified responsive layout, error banners, and loading state skeletons.' },
    ],
    files_affected: ['server/routes/billing.ts', 'src/components/BillingPortal.tsx', 'src/types/billing.ts'],
    diff_summary: '+214 lines, -18 lines across 3 files',
    status: 'ready',
  });

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '◈ [Orbit Agent Orchestrator v2.4] Initializing workspace session...',
    '✔ AST Index: 1,482 symbol nodes loaded from repository in 142ms',
    '✔ Decomposing prompt into contract boundaries...',
    '✔ Agent-1 (Planner): Generated architecture specification doc',
    '✔ Agent-2 (Coder): Performing Tree-sitter transformations on server/routes/billing.ts',
    '✔ Agent-2 (Coder): Generated src/components/BillingPortal.tsx',
    '✔ Agent-3 (Verifier): Running tsx compilation check -> 0 errors',
    '✔ Agent-3 (Verifier): Running headless browser review at http://localhost:3000/billing',
    '✔ Verification PASSED: 0 layout shifts, 0 console errors, WCAG AAA compliant',
  ]);

  const handleRun = () => {
    if (!prompt.trim() || isRunning) return;
    setIsRunning(true);
    setTerminalLogs((prev) => [...prev, `\n◈ [Run Triggered] Running goal: "${prompt.slice(0, 50)}..."`]);

    setTimeout(() => {
      const demo = AgentService.simulateDemo(prompt, agentRole);
      setResult(demo);
      setSelectedFile(demo.files_affected[0] || 'src/App.tsx');
      setTerminalLogs((prev) => [
        ...prev,
        `✔ Goal mapped to branch: ${demo.branch}`,
        `✔ Synthesized ${demo.files_affected.length} files (${demo.diff_summary})`,
        `✔ Automated browser review completed with exit code 0`,
      ]);
      setIsRunning(false);
    }, 600);
  };

  const samplePrompts = [
    { label: 'Stripe Billing Portal', text: 'Build an enterprise Stripe billing portal with invoices, webhook verification, and SQLite persistence.' },
    { label: 'JWT Auth & Refresh Tokens', text: 'Implement JWT login with refresh tokens, password reset, and session storage in SQLite.' },
    { label: 'Storefront Refresh', text: 'Give the product page a calmer layout and make the gallery feel more immersive.' },
    { label: 'Dark Mode Engine', text: 'Build a zero-runtime CSS variable theme switcher with system preference detection.' },
    { label: 'REST API & Telemetry', text: 'Create /api/v1/admin/telemetry endpoints with memory usage and SQLite query timings.' },
  ];

  return (
    <div className="playground-page shell" style={{ paddingTop: '30px', paddingBottom: '90px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--violet)' }}>
            INTERACTIVE AGENT STUDIO
          </span>
          <h1 style={{ font: '600 32px/1.2 var(--font-display)', margin: '4px 0 0', letterSpacing: '-0.04em' }}>
            Simulate and test Orbit multi-agent runs
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="button button-dark" onClick={() => onNavigate('/admin')}>
            Mission Control ◈
          </button>
          <button type="button" className="button button-lime" onClick={onOpenWaitlist}>
            Join Waitlist ↗
          </button>
        </div>
      </div>

      {/* Input Box & Presets */}
      <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid var(--line)', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>ROLE:</span>
            <select
              value={agentRole}
              onChange={(e) => setAgentRole(e.target.value as any)}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '12px', fontWeight: 600, background: '#fafafa' }}
            >
              <option value="fullstack">Full-Stack Engineer</option>
              <option value="frontend">Frontend Architect</option>
              <option value="teams">Product Team Lead</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>MODE:</span>
            <select
              value={executionMode}
              onChange={(e) => setExecutionMode(e.target.value as any)}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '12px', fontWeight: 600, background: '#fafafa' }}
            >
              <option value="collaborative">Collaborative (Multi-Agent)</option>
              <option value="speed">Speed Fast-Path</option>
              <option value="strict">Strict Browser Verification</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className="live-dot"></span>
            <span style={{ fontSize: '11px', color: 'var(--juniper)', fontWeight: 700 }}>ORCHESTRATOR READY</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRun()}
            placeholder="Describe any engineering outcome you want Orbit agents to build..."
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: '10px',
              border: '1px solid var(--line-solid)',
              fontSize: '14px',
              outline: 'none',
              background: 'var(--paper)',
              color: 'var(--ink)',
            }}
          />
          <button
            type="button"
            className="button button-lime"
            onClick={handleRun}
            disabled={isRunning}
            style={{ padding: '0 28px', whiteSpace: 'nowrap' }}
          >
            {isRunning ? 'Orchestrating...' : 'Run Agent ✳'}
          </button>
        </div>

        {/* Sample Prompt Chips */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>TRY SAMPLE:</span>
          {samplePrompts.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setPrompt(p.text);
              }}
              style={{
                background: prompt === p.text ? 'var(--lilac)' : '#fafafa',
                border: prompt === p.text ? '1px solid var(--violet)' : '1px solid var(--line)',
                color: prompt === p.text ? 'var(--violet-dark)' : '#52525b',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Console Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
        {/* Left Column: Agent Steps & Metadata */}
        <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid var(--line)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em' }}>ACTIVE SPECIFICATION</span>
            <h3 style={{ font: '600 16px var(--font-display)', margin: '4px 0 2px' }}>{result.project_name}</h3>
            <span style={{ fontSize: '11px', color: 'var(--violet-dark)', fontWeight: 600, fontFamily: 'monospace' }}>
              branch: {result.branch}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em' }}>AGENT EXECUTION TIMELINE</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {result.steps.map((st: AgentStep) => (
                <div
                  key={st.step_number}
                  style={{
                    background: st.status === 'active' ? 'rgba(238, 235, 255, 0.5)' : '#fafafa',
                    border: st.status === 'active' ? '1px solid var(--violet)' : '1px solid var(--line)',
                    borderRadius: '10px',
                    padding: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink)' }}>
                      #{st.step_number} {st.title}
                    </span>
                    <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: st.status === 'done' ? '#dcfce7' : st.status === 'active' ? 'var(--lilac)' : '#f1f5f9', color: st.status === 'done' ? '#15803d' : st.status === 'active' ? 'var(--violet-dark)' : '#64748b' }}>
                      {st.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4 }}>{st.description}</p>
                  {st.details && <small style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>{st.details}</small>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '14px', marginTop: 'auto' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em' }}>FILES AFFECTED ({result.files_affected.length})</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              {result.files_affected.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setSelectedFile(f);
                    setActiveTab('diff');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: selectedFile === f ? '1px solid var(--violet)' : '1px solid transparent',
                    background: selectedFile === f ? 'var(--lilac)' : 'transparent',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: selectedFile === f ? 'var(--violet-dark)' : 'var(--ink)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>📄</span> {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Diff / Terminal / Preview Tabs */}
        <div style={{ background: '#171820', borderRadius: '18px', border: '1px solid #272833', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '520px' }}>
          {/* Top Bar Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#1c1d27' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('diff')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTab === 'diff' ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: activeTab === 'diff' ? '#fff' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Code Diff ({selectedFile.split('/').pop()})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('terminal')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTab === 'terminal' ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: activeTab === 'terminal' ? '#fff' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Virtual Terminal ({terminalLogs.length} events)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTab === 'preview' ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: activeTab === 'preview' ? '#fff' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Live Preview ↗
              </button>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--lime)', fontWeight: 600 }}>
              {result.diff_summary}
            </span>
          </div>

          {/* View Content */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {activeTab === 'diff' && (
              <div style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.6 }}>
                <div style={{ color: '#94a3b8', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  --- a/{selectedFile}
                  <br />
                  +++ b/{selectedFile}
                </div>
                <div style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.08)', padding: '2px 8px', borderRadius: '4px', margin: '4px 0' }}>
                  + import &#123; Stripe &#125; from 'stripe';
                </div>
                <div style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.08)', padding: '2px 8px', borderRadius: '4px', margin: '4px 0' }}>
                  + const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');
                </div>
                <div style={{ color: '#cbd5e1', padding: '2px 8px' }}>
                  &nbsp;&nbsp;router.get('/api/v1/health', (req, res) =&gt; res.json(&#123; status: 'ok' &#125;));
                </div>
                <div style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.08)', padding: '2px 8px', borderRadius: '4px', margin: '4px 0' }}>
                  + router.post('/api/v1/billing/create-portal-session', async (req, res) =&gt; &#123;
                </div>
                <div style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.08)', padding: '2px 8px', borderRadius: '4px', margin: '4px 0' }}>
                  + &nbsp;&nbsp;const portal = await stripe.billingPortal.sessions.create(&#123; customer: req.body.customerId, return_url: 'http://localhost:3000' &#125;);
                </div>
                <div style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.08)', padding: '2px 8px', borderRadius: '4px', margin: '4px 0' }}>
                  + &nbsp;&nbsp;return res.json(&#123; url: portal.url &#125;);
                </div>
                <div style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.08)', padding: '2px 8px', borderRadius: '4px', margin: '4px 0' }}>
                  + &#125;);
                </div>
              </div>
            )}

            {activeTab === 'terminal' && (
              <div style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.7, color: '#38bdf8' }}>
                {terminalLogs.map((log, idx) => (
                  <div key={idx} style={{ color: log.startsWith('✔') ? '#4ade80' : log.startsWith('◈') ? 'var(--lime)' : '#e2e8f0' }}>
                    {log}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'preview' && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', color: '#171820', minHeight: '380px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
                    <strong style={{ fontSize: '13px' }}>Simulated Browser Viewport (1280x800)</strong>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>localhost:3000/billing</span>
                </div>

                <div style={{ maxWidth: '480px', margin: '20px auto', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--violet)' }}>ORBIT ENTERPRISE BILLING</span>
                  <h3 style={{ font: '600 22px var(--font-display)', margin: '6px 0 12px' }}>Workspace Subscription</h3>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 16px' }}>Manage billing details, invoices, and seat allocation for your team.</p>
                  <div style={{ padding: '12px', background: 'var(--lilac)', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--violet-dark)' }}>Pro Tier Active (12 seats)</span>
                    <strong style={{ fontSize: '12px', color: 'var(--violet-dark)' }}>$348/mo</strong>
                  </div>
                  <button type="button" className="button button-dark" style={{ width: '100%', minHeight: '42px', fontSize: '12px' }}>
                    Open Stripe Customer Portal ↗
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
