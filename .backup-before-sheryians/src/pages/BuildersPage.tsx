import React, { useState } from 'react';

interface BuildersPageProps {
  onOpenWaitlist: () => void;
  onNavigate: (path: string) => void;
  onSelectRole?: (role: 'frontend' | 'fullstack' | 'teams') => void;
}

export const BuildersPage: React.FC<BuildersPageProps> = ({ onOpenWaitlist, onNavigate, onSelectRole }) => {
  const [activeRole, setActiveRole] = useState<'frontend' | 'fullstack' | 'teams'>('fullstack');

  const personas = {
    frontend: {
      title: 'For Frontend Developers & UI Architects',
      tagline: 'Iterate on design fidelity without the endless boilerplate loop.',
      quote: '"Orbit lets me focus on pixel-perfect micro-interactions and motion while agents generate responsive variants, accessibility attributes, and test specs."',
      author: 'David Kim — Principal Design Technologist',
      capabilities: [
        { title: 'Live Browser Verification', desc: 'Inspect layout shifts, font weights, and CSS variables in real browser preview windows.' },
        { title: 'Design Token Synchronizer', desc: 'Converts Figma tokens into strict Tailwind or CSS custom properties automatically.' },
        { title: 'Component Library Scaffolding', desc: 'Generates accessible primitives (Radix, Headless, shadcn) adhering to your company design system.' },
        { title: 'Responsive Headless Audit', desc: 'Simulates mobile, tablet, and desktop viewports simultaneously.' },
      ],
      codeSample: `// Generated with Orbit Frontend Agent
export const AdaptiveHero = ({ headline, ctaText }: HeroProps) => {
  const { theme } = useTheme();
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          {headline}
        </h1>
      </div>
    </section>
  );
};`,
    },
    fullstack: {
      title: 'For Full-Stack Engineers & Solo Founders',
      tagline: 'Trace changes seamlessly from database schemas to client components.',
      quote: '"Orbit gives me the velocity of an entire engineering squad. I describe an API contract and it writes the SQLite migration, the Express router, and the React UI."',
      author: 'Elena Rostova — Solo Founder & CTO at NexusLabs',
      capabilities: [
        { title: 'Full-System Context Awareness', desc: 'Agents read backend controllers, client stores, and schemas before proposing mutations.' },
        { title: 'Safe DB Migrations', desc: 'Generates non-destructive SQL migrations with automatic fallback and rollback handlers.' },
        { title: 'End-to-End Contract Generation', desc: 'Maintains TypeScript types across client and server with zero sync drift.' },
        { title: 'Local 1-Click Launchers', desc: 'Generates start.sh and start.bat scripts with zero system pollution.' },
      ],
      codeSample: `// Full-stack contract generated across /server and /src
app.post('/api/v1/orders', async (req, res) => {
  const order = await db.transaction(async (tx) => {
    const newOrder = await tx.insert(orders).values(req.body).returning();
    await tx.insert(auditLogs).values({ event: 'ORDER_CREATED', orderId: newOrder[0].id });
    return newOrder[0];
  });
  return res.status(201).json(order);
});`,
    },
    teams: {
      title: 'For Product Teams & Engineering Leads',
      tagline: 'Coordinate multi-agent sprints with transparent review cycles.',
      quote: '"We turned a 3-week sprint backlog into a 2-day reviewed batch. The Mission Control dashboard gave us total visibility into what agents executed."',
      author: 'Amara Okafor — VP of Engineering at HyperFlow',
      capabilities: [
        { title: 'Mission Control Telemetry', desc: 'Real-time overview of waitlists, inquiries, active agent tasks, and workspace status.' },
        { title: 'Role-Based Access Control', desc: 'Strict admin credentialing with JWT tokens and security guardrails.' },
        { title: 'Asynchronous PR Batches', desc: 'Agents propose atomic commits with markdown rationale for human review.' },
        { title: 'CSV & Audit Data Export', desc: '1-click export of system data, waitlist applications, and telemetry.' },
      ],
      codeSample: `// Mission Control telemetry hook
export const useWorkspaceTelemetry = () => {
  const { data: stats } = useQuery('/api/v1/admin/stats');
  return {
    activeWorkspaces: stats.total_projects,
    totalQueuedTasks: stats.total_agent_tasks,
    systemUptime: '99.98%'
  };
};`,
    },
  };

  const curr = personas[activeRole];

  return (
    <div className="builders-page shell" style={{ paddingTop: '40px', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px' }}>
        <p className="eyebrow" style={{ justifyContent: 'center' }}>
          <span className="live-dot"></span> TAILORED ARCHITECTURE
        </p>
        <h1 style={{ font: '500 clamp(42px, 5.5vw, 72px)/1.05 var(--font-display)', letterSpacing: '-0.07em', margin: '16px 0 24px' }}>
          Built for every way you <span style={{ color: 'var(--violet)' }}>craft software</span>.
        </h1>
        <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'var(--muted)', maxWidth: '640px', margin: '0 auto 30px' }}>
          Orbit does not force a generic one-size-fits-all chat prompt. It adapts its agent orchestration to your exact role, codebase scale, and technical constraints.
        </p>

        {/* Persona Tabs */}
        <div style={{ display: 'inline-flex', padding: '6px', background: '#fff', border: '1px solid var(--line)', borderRadius: '999px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          {(['frontend', 'fullstack', 'teams'] as const).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                setActiveRole(role);
                if (onSelectRole) onSelectRole(role);
              }}
              style={{
                padding: '10px 24px',
                borderRadius: '999px',
                border: 'none',
                background: activeRole === role ? 'var(--ink)' : 'transparent',
                color: activeRole === role ? '#fff' : 'var(--muted)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {role === 'frontend' && 'Frontend Architects'}
              {role === 'fullstack' && 'Full-Stack Builders'}
              {role === 'teams' && 'Product Teams'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Persona Showcase */}
      <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid var(--line)', padding: '40px', boxShadow: '0 20px 50px rgba(22,23,29,0.05)', marginBottom: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '50px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--violet)', textTransform: 'uppercase' }}>
              PERSONA DEEP-DIVE
            </span>
            <h2 style={{ font: '600 36px/1.15 var(--font-display)', letterSpacing: '-0.04em', margin: '8px 0 16px', color: 'var(--ink)' }}>
              {curr.title}
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '24px' }}>
              {curr.tagline}
            </p>

            <blockquote style={{ margin: '0 0 28px', padding: '16px 20px', background: 'var(--paper)', borderLeft: '3px solid var(--violet)', borderRadius: '0 12px 12px 0', fontSize: '14px', fontStyle: 'italic', color: '#334155' }}>
              {curr.quote}
              <footer style={{ marginTop: '8px', fontSize: '12px', fontWeight: 700, fontStyle: 'normal', color: 'var(--ink)' }}>
                — {curr.author}
              </footer>
            </blockquote>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              {curr.capabilities.map((c, i) => (
                <div key={i} style={{ background: '#fafafa', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                  <strong style={{ display: 'block', fontSize: '13px', color: 'var(--ink)', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--violet)', marginRight: '6px' }}>✓</span> {c.title}
                  </strong>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{c.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                type="button"
                className="button button-lime"
                onClick={() => {
                  if (onSelectRole) onSelectRole(activeRole);
                  onOpenWaitlist();
                }}
              >
                Join as {activeRole === 'frontend' ? 'Frontend Dev' : activeRole === 'fullstack' ? 'Full-Stack Dev' : 'Engineering Team'} <span>↗</span>
              </button>
              <button type="button" className="button button-dark" onClick={() => onNavigate('/playground')}>
                Test in Live Studio <span>✳</span>
              </button>
            </div>
          </div>

          {/* Interactive Code Preview Box */}
          <div style={{ background: '#171820', borderRadius: '18px', padding: '24px', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                {activeRole === 'frontend' ? 'Component.tsx' : activeRole === 'fullstack' ? 'server.ts' : 'telemetry.ts'}
              </span>
            </div>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.6, color: '#e2e8f0', overflowX: 'auto', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px' }}>
              {curr.codeSample}
            </pre>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#4ade80' }}>● Formatted & Validated by Tree-sitter</span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>0 errors, 0 lints</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {[
          { role: 'frontend' as const, name: 'Frontend Focus', desc: 'Visual iteration, zero FOUC, responsive testing, and design system adherence.' },
          { role: 'fullstack' as const, name: 'Full Stack Power', desc: 'Trace data models from client forms through API gateways down to SQLite tables.' },
          { role: 'teams' as const, name: 'Team Orchestration', desc: 'Mission Control dashboard, queue priorities, audit logs, and verified PR generation.' },
        ].map((c) => (
          <div
            key={c.role}
            style={{
              background: '#fff',
              borderRadius: '16px',
              border: activeRole === c.role ? '2px solid var(--violet)' : '1px solid var(--line)',
              padding: '24px',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onClick={() => setActiveRole(c.role)}
          >
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--violet)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {c.role}
            </span>
            <h3 style={{ font: '600 20px var(--font-display)', margin: '6px 0 8px', color: 'var(--ink)' }}>{c.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
