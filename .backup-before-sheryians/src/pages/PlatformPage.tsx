import React, { useState } from 'react';

interface PlatformPageProps {
  onOpenWaitlist: () => void;
  onNavigate: (path: string) => void;
}

export const PlatformPage: React.FC<PlatformPageProps> = ({ onOpenWaitlist, onNavigate }) => {
  const [selectedLayer, setSelectedLayer] = useState<'orchestration' | 'ast' | 'sandbox' | 'memory'>('orchestration');
  const [simulatedAgents, setSimulatedAgents] = useState([
    { id: 'agent-1', role: 'Architect Agent', task: 'Deconstructing user brief into contract schemas', progress: 100, status: 'complete' },
    { id: 'agent-2', role: 'Frontend Builder', task: 'Synthesizing responsive React component hierarchy', progress: 78, status: 'active' },
    { id: 'agent-3', role: 'Backend Agent', task: 'Generating REST controllers and SQLite migrations', progress: 65, status: 'active' },
    { id: 'agent-4', role: 'QA & Verifier', task: 'Waiting for build artifacts to run headless DOM audit', progress: 15, status: 'queued' },
  ]);

  const layers = {
    orchestration: {
      title: 'Hierarchical Agent Constellation',
      badge: 'LAYER 01 / ORCHESTRATION',
      desc: 'Unlike single-stream chat models that lose focus across large files, Orbit decomposes assignments into specialized sub-agents with dedicated tools, roles, and authoritative boundaries.',
      stats: [{ label: 'Concurrent Agents', value: 'Up to 16' }, { label: 'Token Efficiency', value: '4.2x' }, { label: 'Autonomous Recovery', value: '99.4%' }],
      details: [
        'Deterministic state machine preventing agent loops',
        'Automatic task hand-offs with typed structured JSON contracts',
        'Human-in-the-loop escalation checkpoints before irreversible actions',
      ],
    },
    ast: {
      title: 'Semantic Code Graph & AST Engine',
      badge: 'LAYER 02 / CODE SYNTHESIS',
      desc: 'Orbit indexes your entire repository into a high-speed Abstract Syntax Tree (AST) graph. Agents understand imports, type signatures, and dependency cascades before proposing a single line of code.',
      stats: [{ label: 'Index Latency', value: '< 180ms' }, { label: 'Cross-file Accuracy', value: '98.8%' }, { label: 'Diff Cleanliness', value: '100% Surgical' }],
      details: [
        'Incremental Tree-sitter parsing across TypeScript, Python, Rust, and Go',
        'Zero-hallucination import and export resolution',
        'Automatic format preservation and stylistic linting compliance',
      ],
    },
    sandbox: {
      title: 'Isolated Headless Sandbox & Browser Review',
      badge: 'LAYER 03 / RUNTIME VERIFICATION',
      desc: 'Every code modification executes inside a secure, containerized sandbox with a live Node.js runtime and automated headless browser verification. If something breaks, agents catch and fix it before you ever see it.',
      stats: [{ label: 'Cold Boot', value: '1.2s' }, { label: 'Network Isolation', value: 'Complete' }, { label: 'Visual Check Time', value: '450ms' }],
      details: [
        'Autonomous Playwright browser testing with screenshot diffing',
        'Console log monitoring and automated runtime error capture',
        'Hot-reloading live preview URL for zero-friction human inspection',
      ],
    },
    memory: {
      title: 'Long-Horizon Memory & Decision Journal',
      badge: 'LAYER 04 / PERSISTENCE',
      desc: 'Orbit maintains an append-only decision journal recording architectural trade-offs, tech debt items, and user preferences. Future tasks build on previous context without re-explaining requirements.',
      stats: [{ label: 'Context Horizon', value: 'Unlimited' }, { label: 'Decision Recall', value: '100%' }, { label: 'Drift Prevention', value: 'Active' }],
      details: [
        'Vector + keyword hybrid retrieval over commit history and ADRs',
        'Cross-session preference learning for code style and library preferences',
        'Transparent reasoning trails visible in the Mission Control Console',
      ],
    },
  };

  const current = layers[selectedLayer];

  return (
    <div className="platform-page shell" style={{ paddingTop: '40px', paddingBottom: '100px' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 60px' }}>
        <p className="eyebrow" style={{ justifyContent: 'center' }}>
          <span className="live-dot"></span> ARCHITECTURE & FOUNDATIONS
        </p>
        <h1 style={{ font: '500 clamp(44px, 5.5vw, 76px)/1.05 var(--font-display)', letterSpacing: '-0.07em', margin: '16px 0 24px' }}>
          The engine behind <span style={{ color: 'var(--violet)' }}>agent-first</span> software creation.
        </h1>
        <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'var(--muted)', maxWidth: '640px', margin: '0 auto 32px' }}>
          Traditional coding tools plug AI into an old editor. Orbit re-architects the entire development stack around collaborative multi-agent execution, continuous verification, and visual outcomes.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" className="button button-dark" onClick={onOpenWaitlist}>
            Request Early Access <span>↗</span>
          </button>
          <button type="button" className="button button-lime" onClick={() => onNavigate('/playground')}>
            Launch Live Studio <span>✳</span>
          </button>
        </div>
      </div>

      {/* Interactive Architecture Selector */}
      <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid var(--line)', padding: '36px', boxShadow: '0 20px 50px rgba(22,23,29,0.05)', marginBottom: '70px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '24px', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--violet)' }}>ORBIT SYSTEM TOPOLOGY</span>
            <h2 style={{ font: '600 28px/1.2 var(--font-display)', margin: '6px 0 0', letterSpacing: '-0.04em' }}>Explore Architectural Layers</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['orchestration', 'ast', 'sandbox', 'memory'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedLayer(key)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '999px',
                  border: selectedLayer === key ? '1px solid var(--violet)' : '1px solid #e2e4ea',
                  background: selectedLayer === key ? 'var(--lilac)' : '#fafafa',
                  color: selectedLayer === key ? 'var(--violet-dark)' : '#5a5c66',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {key === 'orchestration' && '01 / Multi-Agent'}
                {key === 'ast' && '02 / AST Engine'}
                {key === 'sandbox' && '03 / Sandboxing'}
                {key === 'memory' && '04 / Memory Graph'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '40px', alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', background: 'var(--mint)', color: '#166534', marginBottom: '16px' }}>
              {current.badge}
            </span>
            <h3 style={{ font: '600 32px/1.2 var(--font-display)', letterSpacing: '-0.04em', margin: '0 0 16px' }}>
              {current.title}
            </h3>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--muted)', marginBottom: '24px' }}>
              {current.desc}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: 'var(--paper)', padding: '20px', borderRadius: '14px', marginBottom: '24px' }}>
              {current.stats.map((s, idx) => (
                <div key={idx}>
                  <small style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {s.label}
                  </small>
                  <strong style={{ font: '700 20px var(--font-display)', color: 'var(--ink)' }}>
                    {s.value}
                  </strong>
                </div>
              ))}
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {current.details.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--ink)' }}>
                  <span style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'var(--juniper-soft)', color: 'var(--juniper)', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Live Agent Constellation Art */}
          <div className="hover-expand" style={{ background: '#16191B', border: '1px solid #24292E', borderRadius: '12px', padding: '24px', color: '#fff', position: 'relative', overflow: 'hidden', minHeight: '380px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--lime)', boxShadow: '0 0 8px rgba(212, 91, 52, 0.5)' }}></span>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#8F959E' }}>CONSTELLATION RUNTIME</span>
              </div>
              <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: 'var(--terracotta)', color: '#fff', fontWeight: 700 }}>
                4 AGENTS SYNCHRONIZED
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {simulatedAgents.map((ag) => (
                <div
                  key={ag.id}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: ag.status === 'complete' ? '#4ade80' : ag.status === 'active' ? 'var(--lime)' : '#94a3b8', fontSize: '12px' }}>
                        {ag.status === 'complete' ? '●' : ag.status === 'active' ? '✳' : '○'}
                      </span>
                      <strong style={{ fontSize: '12px', fontWeight: 600 }}>{ag.role}</strong>
                    </div>
                    <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {ag.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '0 0 8px' }}>{ag.task}</p>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${ag.progress}%`, height: '100%', background: ag.status === 'complete' ? '#4ade80' : 'var(--lime)', transition: 'width 0.4s ease' }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '10px', color: '#64748b' }}>AST Graph Nodes: 1,482 verified</span>
              <button
                type="button"
                onClick={() => {
                  setSimulatedAgents((prev) =>
                    prev.map((a) => ({
                      ...a,
                      progress: a.status === 'complete' ? 100 : Math.min(100, a.progress + 15),
                      status: a.progress >= 85 ? 'complete' : a.status,
                    }))
                  );
                }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Trigger Pulse ↻
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Matrix: Orbit vs The World */}
      <div style={{ marginBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>WHY ORBIT IS DIFFERENT</p>
          <h2 style={{ font: '600 36px/1.1 var(--font-display)', letterSpacing: '-0.05em', margin: '8px 0' }}>
            Built for outcomes, not just auto-complete.
          </h2>
        </div>

        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '18px', border: '1px solid var(--line)', padding: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--line)' }}>
                <th style={{ padding: '16px', color: 'var(--muted)', fontWeight: 600 }}>CAPABILITY</th>
                <th style={{ padding: '16px', color: 'var(--violet-dark)', fontWeight: 700, background: 'var(--lilac)', borderRadius: '8px 8px 0 0' }}>
                  ◈ ORBIT WORKSPACE
                </th>
                <th style={{ padding: '16px', color: 'var(--muted)', fontWeight: 600 }}>Copilot / Inline Chat</th>
                <th style={{ padding: '16px', color: 'var(--muted)', fontWeight: 600 }}>Autonomous PR Bots</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cap: 'Multi-Agent Decomposition', orbit: 'Yes — Hierarchical coordinator + workers', copilot: 'No — Single linear completion', bot: 'Partial — Background batch only' },
                { cap: 'Live Headless Browser Review', orbit: 'Yes — Automated visual + DOM inspection', copilot: 'No — Text diffs only', bot: 'No — Relies on external CI run' },
                { cap: 'Surgical Multi-File Editing', orbit: 'Yes — Preserves imports, tokens & style', copilot: 'Limited to open tabs', bot: 'Prone to conflicts across branches' },
                { cap: 'Mission Control Observability', orbit: 'Yes — Live telemetry, queue, and logs', copilot: 'No dashboard', bot: 'Minimal webhook status' },
                { cap: 'Local SQLite & VPC Isolation', orbit: 'Yes — Ephemeral, zero data leaks', copilot: 'Cloud dependent', bot: 'Requires third-party access' },
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '16px', fontWeight: 600, color: 'var(--ink)' }}>{row.cap}</td>
                  <td style={{ padding: '16px', fontWeight: 700, color: 'var(--ink)', background: 'rgba(238, 235, 255, 0.35)' }}>
                    <span style={{ color: '#15803d', marginRight: '6px' }}>✓</span> {row.orbit}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--muted)' }}>{row.copilot}</td>
                  <td style={{ padding: '16px', color: 'var(--muted)' }}>{row.bot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Call to Action */}
      <div style={{ background: 'var(--ink)', color: '#fff', borderRadius: '24px', padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <span className="live-dot" style={{ margin: '0 auto 16px' }}></span>
        <h2 style={{ font: '600 clamp(32px, 4vw, 52px)/1.1 var(--font-display)', letterSpacing: '-0.05em', margin: '0 0 16px' }}>
          Ready to experience the agent workspace?
        </h2>
        <p style={{ fontSize: '16px', color: '#a1a1aa', maxWidth: '520px', margin: '0 auto 32px' }}>
          Join thousands of developers turning ambitious briefs into verified software with Orbit.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button type="button" className="button button-lime" onClick={onOpenWaitlist}>
            Join Priority Waitlist <span>↗</span>
          </button>
          <button type="button" className="button button-light" onClick={() => onNavigate('/workflow')}>
            See Workflow in Action <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
