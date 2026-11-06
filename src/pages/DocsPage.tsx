import React, { useState } from 'react';

interface DocsPageProps {
  onOpenWaitlist: () => void;
  onNavigate: (path: string) => void;
}

export const DocsPage: React.FC<DocsPageProps> = ({ onOpenWaitlist, onNavigate }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="docs-page shell" style={{ paddingTop: '40px', paddingBottom: '100px' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
        <p className="eyebrow" style={{ justifyContent: 'center' }}>
          <span className="live-dot"></span> DEVELOPER SPECIFICATION & QUICKSTART
        </p>
        <h1 style={{ font: '500 clamp(42px, 5.5vw, 68px)/1.05 var(--font-display)', letterSpacing: '-0.07em', margin: '16px 0 20px' }}>
          Orbit Documentation & <span style={{ color: 'var(--violet)' }}>Guides</span>
        </h1>
        <p style={{ fontSize: '17px', lineHeight: 1.7, color: 'var(--muted)', maxWidth: '640px', margin: '0 auto 24px' }}>
          Complete manual for running Orbit full-stack, deploying local SQLite instances, configuring Mission Control, and interacting with REST APIs.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button type="button" className="button button-lime" onClick={onOpenWaitlist}>
            Join Priority Waitlist <span>↗</span>
          </button>
          <button type="button" className="button button-dark" onClick={() => onNavigate('/playground')}>
            Launch Agent Studio <span>✳</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '40px' }}>
        {/* Sidebar Nav */}
        <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--line)', padding: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>
              DOCUMENTATION
            </span>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <a href="#quickstart" style={{ color: 'var(--violet-dark)', fontWeight: 600 }}>1. 1-Click Launchers</a>
              <a href="#manual-run" style={{ color: '#4b5563' }}>2. Manual Development</a>
              <a href="#architecture" style={{ color: '#4b5563' }}>3. SQLite Schema</a>
              <a href="#api-reference" style={{ color: '#4b5563' }}>4. REST API Endpoints</a>
              <a href="#admin-credentials" style={{ color: '#4b5563' }}>5. Mission Control Auth</a>
            </nav>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
              <button
                type="button"
                className="button button-dark"
                onClick={() => onNavigate('/admin')}
                style={{ width: '100%', minHeight: '38px', fontSize: '11px' }}
              >
                Open Console ◈
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Quickstart Section */}
          <div id="quickstart" style={{ background: '#fff', borderRadius: '20px', border: '1px solid var(--line)', padding: '32px' }}>
            <h2 style={{ font: '600 24px var(--font-display)', margin: '0 0 12px', color: 'var(--ink)' }}>
              1. 1-Click Startup Launchers (Strictly Isolated)
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)', margin: '0 0 20px' }}>
              The repository includes automated launch scripts for Windows and macOS/Linux. These verify Node.js runtime, configure local dependencies inside the project folder (zero global pollution), and boot the server at <code>http://localhost:3000</code>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--paper)', padding: '20px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                <strong style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Windows (start.bat)</strong>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 12px' }}>Double-click start.bat in the root folder or execute via Command Prompt:</p>
                <div style={{ background: '#171820', color: '#a7f3d0', padding: '10px 14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>.\start.bat</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('.\\start.bat', 'bat')}
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '11px' }}
                  >
                    {copiedSection === 'bat' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <a href="/api/v1/download/start-windows" download style={{ display: 'inline-block', marginTop: '12px', fontSize: '12px', color: 'var(--violet-dark)', fontWeight: 600 }}>
                  Download start.bat ⬇
                </a>
              </div>

              <div style={{ background: 'var(--paper)', padding: '20px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                <strong style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>macOS / Linux (start.sh)</strong>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 12px' }}>Make executable and run via terminal:</p>
                <div style={{ background: '#171820', color: '#a7f3d0', padding: '10px 14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>chmod +x start.sh && ./start.sh</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('chmod +x start.sh && ./start.sh', 'sh')}
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '11px' }}
                  >
                    {copiedSection === 'sh' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <a href="/api/v1/download/start-mac" download style={{ display: 'inline-block', marginTop: '12px', fontSize: '12px', color: 'var(--violet-dark)', fontWeight: 600 }}>
                  Download start.sh ⬇
                </a>
              </div>
            </div>
          </div>

          {/* Manual Run */}
          <div id="manual-run" style={{ background: '#fff', borderRadius: '20px', border: '1px solid var(--line)', padding: '32px' }}>
            <h2 style={{ font: '600 24px var(--font-display)', margin: '0 0 12px', color: 'var(--ink)' }}>
              2. Manual Execution with npm
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)', margin: '0 0 16px' }}>
              Orbit runs a unified Express full-stack architecture with Vite mounted as middleware in development.
            </p>
            <div style={{ background: '#171820', color: '#f8fafc', padding: '16px', borderRadius: '10px', fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.6 }}>
              <div><span style={{ color: '#64748b' }}># 1. Install dependencies</span></div>
              <div>npm install</div>
              <div style={{ marginTop: '8px' }}><span style={{ color: '#64748b' }}># 2. Boot development server (Express + Vite)</span></div>
              <div>npm run dev</div>
              <div style={{ marginTop: '8px' }}><span style={{ color: '#64748b' }}># 3. Production build</span></div>
              <div>npm run build</div>
            </div>
          </div>

          {/* Architecture & SQLite */}
          <div id="architecture" style={{ background: '#fff', borderRadius: '20px', border: '1px solid var(--line)', padding: '32px' }}>
            <h2 style={{ font: '600 24px var(--font-display)', margin: '0 0 12px', color: 'var(--ink)' }}>
              3. Local SQLite Schema (orbit.db)
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)', margin: '0 0 16px' }}>
              All applications and inquiries are persisted into a local SQLite database file at <code>./orbit.db</code>. It contains 5 key tables:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
              <div style={{ padding: '12px', background: 'var(--paper)', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--violet-dark)' }}>waitlist</strong>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
                  Stores priority queue registrations, builder roles, and contact info.
                </p>
              </div>
              <div style={{ padding: '12px', background: 'var(--paper)', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--violet-dark)' }}>inquiries</strong>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
                  Enterprise and team demo requests with status workflow tracking.
                </p>
              </div>
              <div style={{ padding: '12px', background: 'var(--paper)', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--violet-dark)' }}>subscribers</strong>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
                  Newsletter subscriptions captured from the footer.
                </p>
              </div>
              <div style={{ padding: '12px', background: 'var(--paper)', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--violet-dark)' }}>users</strong>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
                  Administrator and developer accounts authorized for Mission Control.
                </p>
              </div>
            </div>
          </div>

          {/* REST API Reference */}
          <div id="api-reference" style={{ background: '#fff', borderRadius: '20px', border: '1px solid var(--line)', padding: '32px' }}>
            <h2 style={{ font: '600 24px var(--font-display)', margin: '0 0 12px', color: 'var(--ink)' }}>
              4. REST API Specifications
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { method: 'POST', path: '/api/v1/waitlist', desc: 'Register an early access user with role priority' },
                { method: 'GET', path: '/api/v1/waitlist', desc: 'Fetch waitlist entries with optional ?status= filter' },
                { method: 'PATCH', path: '/api/v1/waitlist/:id/status', desc: 'Update applicant status (approved / invited)' },
                { method: 'GET', path: '/api/v1/waitlist/export-csv', desc: 'Stream download orbit_waitlist.csv' },
                { method: 'POST', path: '/api/v1/inquiries', desc: 'Submit enterprise team demo request' },
                { method: 'GET', path: '/api/v1/admin/stats', desc: 'Telemetry metrics and breakdown counts' },
                { method: 'GET', path: '/api/v1/database/raw', desc: 'Raw table inspector for SQLite tables' },
              ].map((api, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--paper)', borderRadius: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: api.method === 'POST' ? '#dcfce7' : api.method === 'PATCH' ? '#fef3c7' : '#e0e7ff', color: api.method === 'POST' ? '#15803d' : api.method === 'PATCH' ? '#b45309' : '#3730a3' }}>
                      {api.method}
                    </span>
                    <code style={{ fontFamily: 'monospace', fontWeight: 600 }}>{api.path}</code>
                  </div>
                  <span style={{ color: 'var(--muted)' }}>{api.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Control Credentials */}
          <div id="admin-credentials" style={{ background: 'var(--ink)', color: '#fff', borderRadius: '20px', padding: '32px' }}>
            <h2 style={{ font: '600 24px var(--font-display)', margin: '0 0 12px' }}>
              5. Mission Control Console Auth
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#94a3b8', margin: '0 0 16px' }}>
              To access Mission Control, navigate to <code>/admin</code> and sign in with the pre-seeded administrator credentials:
            </p>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>EMAIL:</span>
                <strong style={{ fontSize: '14px', fontFamily: 'monospace', color: '#fff' }}>admin@orbit.dev</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>PASSWORD:</span>
                <strong style={{ fontSize: '14px', fontFamily: 'monospace', color: 'var(--lime)' }}>OrbitAdminPassword2026!</strong>
              </div>
              <button
                type="button"
                className="button button-lime"
                onClick={() => onNavigate('/admin')}
                style={{ padding: '0 20px', minHeight: '40px', fontSize: '12px' }}
              >
                Sign In to Console ↗
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
