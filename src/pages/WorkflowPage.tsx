import React, { useState } from 'react';

interface WorkflowPageProps {
  onOpenWaitlist: () => void;
  onNavigate: (path: string) => void;
}

export const WorkflowPage: React.FC<WorkflowPageProps> = ({ onOpenWaitlist, onNavigate }) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [activeExample, setActiveExample] = useState<'checkout' | 'auth' | 'theme'>('checkout');

  const examples = {
    checkout: {
      title: 'Stripe One-Click Checkout Subsystem',
      brief: 'Implement a Stripe Elements payment flow with webhooks, coupon discount support, and optimistic order updates.',
      step1Output: {
        title: 'Step 1: Synthesis & Contract Definition',
        summary: 'Analyzed repository structure, detected Express + Vite SPA stack, created schema for Stripe webhook events and order line-items.',
        files: ['/src/types/payment.ts', '/server/routes/checkout.ts', '/src/components/CheckoutDrawer.tsx'],
        decisions: [
          'Use idempotent payment intent tokens to prevent duplicate charges',
          'Store webhook signing secrets in environment variables (.env.example)',
          'Create fallback optimistic UI state while webhook confirmation processes',
        ],
      },
      step2Output: {
        title: 'Step 2: Recursive AST Code Synthesis',
        summary: 'Generated 3 files and updated router with zero breaking changes to existing cart context.',
        diffs: '+184 lines added, -12 lines modified',
        codeSnippet: `// server/routes/checkout.ts
router.post('/api/checkout/session', async (req, res) => {
  const { cartItems, customerEmail } = req.body;
  const lineItems = cartItems.map(item => ({
    price_data: { currency: 'usd', unit_amount: item.priceCents },
    quantity: item.qty
  }));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    customer_email: customerEmail,
    mode: 'payment',
  });
  return res.json({ sessionId: session.id, url: session.url });
});`,
      },
      step3Output: {
        title: 'Step 3: Runtime & Browser Verification',
        summary: 'Dev server compiled in 210ms. Headless Playwright spawned and navigated to /checkout. Verified responsive rendering, zero console errors, and successful mock checkout trigger.',
        checks: [
          { name: 'TypeScript strict compilation', status: 'PASS', time: '140ms' },
          { name: 'ESLint and stylistic formatting', status: 'PASS', time: '85ms' },
          { name: 'Headless browser viewport test (1280x800)', status: 'PASS', time: '320ms' },
          { name: 'Mobile viewport test (390x844)', status: 'PASS', time: '290ms' },
        ],
      },
    },
    auth: {
      title: 'Enterprise Multi-Factor Authentication',
      brief: 'Implement TOTP authenticator app verification with recovery backup codes and session revocation.',
      step1Output: {
        title: 'Step 1: Synthesis & Contract Definition',
        summary: 'Identified session model and designed RFC 6238 compliant TOTP flow with encrypted secret seeds in SQLite.',
        files: ['/server/auth/totp.ts', '/src/components/MfaModal.tsx', '/src/types/auth.ts'],
        decisions: [
          'Enforce constant-time timing safe string comparison for verification codes',
          'Provide 10 single-use emergency recovery codes hashed with bcrypt',
        ],
      },
      step2Output: {
        title: 'Step 2: Recursive AST Code Synthesis',
        summary: 'Generated QR code generator handler and updated auth middleware.',
        diffs: '+240 lines added across 3 files',
        codeSnippet: `// server/auth/totp.ts
export function verifyTotpToken(userSecret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret: userSecret,
    encoding: 'base32',
    token: token.trim(),
    window: 1 // allow 30s clock drift
  });
}`,
      },
      step3Output: {
        title: 'Step 3: Runtime & Browser Verification',
        summary: 'Automated test simulated valid 6-digit code, expired tokens, and recovery code consumption.',
        checks: [
          { name: 'Cryptographic timing resistance check', status: 'PASS', time: '120ms' },
          { name: 'QR Code rendering & SVG validity', status: 'PASS', time: '90ms' },
          { name: 'Invalid token rejection behavior', status: 'PASS', time: '150ms' },
        ],
      },
    },
    theme: {
      title: 'Dynamic Design Token Engine',
      brief: 'Build a zero-runtime CSS variables dark/light/system theme provider with smooth transitions.',
      step1Output: {
        title: 'Step 1: Synthesis & Contract Definition',
        summary: 'Mapped current color palette tokens in index.css into semantic CSS custom properties.',
        files: ['/src/context/ThemeContext.tsx', '/src/index.css', '/src/components/ThemeToggle.tsx'],
        decisions: [
          'Sync theme choice with localStorage and prefers-color-scheme listener',
          'Prevent flash of unstyled content (FOUC) via blocking root script in index.html',
        ],
      },
      step2Output: {
        title: 'Step 2: Recursive AST Code Synthesis',
        summary: 'Extracted 28 color rules into semantic variables (--bg-primary, --text-secondary, etc.).',
        diffs: '+68 lines added, -14 lines modified',
        codeSnippet: `:root[data-theme='dark'] {
  --paper: #0e0f14;
  --white: #171820;
  --ink: #f7f8fa;
  --muted: #94a3b8;
  --line: #272833;
  --violet: #8e7eff;
}`,
      },
      step3Output: {
        title: 'Step 3: Runtime & Browser Verification',
        summary: 'Verified contrast ratio meets WCAG AAA standards across all views in headless browser.',
        checks: [
          { name: 'WCAG AAA contrast audit', status: 'PASS', time: '110ms' },
          { name: 'System theme change event dispatch', status: 'PASS', time: '80ms' },
          { name: 'Storage persistence check', status: 'PASS', time: '60ms' },
        ],
      },
    },
  };

  const curr = examples[activeExample];

  return (
    <div className="workflow-page shell" style={{ paddingTop: '40px', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px' }}>
        <p className="eyebrow" style={{ justifyContent: 'center' }}>
          <span className="live-dot"></span> OUTCOME-DRIVEN EXECUTION
        </p>
        <h1 style={{ font: '500 clamp(42px, 5.5vw, 72px)/1.05 var(--font-display)', letterSpacing: '-0.07em', margin: '16px 0 24px' }}>
          How Orbit turns intent into <span style={{ color: 'var(--violet)' }}>verified software</span>.
        </h1>
        <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'var(--muted)', maxWidth: '640px', margin: '0 auto 30px' }}>
          Say goodbye to copy-pasting code snippets from a chat window. Orbit operates like a senior engineering lead: plan, build across repositories, verify in a real browser, and present pristine outcomes.
        </p>

        {/* Example Selector */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', alignSelf: 'center', marginRight: '6px' }}>CHOOSE SPEC:</span>
          {(['checkout', 'auth', 'theme'] as const).map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setActiveExample(ex)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: activeExample === ex ? '1px solid var(--violet)' : '1px solid var(--line)',
                background: activeExample === ex ? 'var(--ink)' : '#fff',
                color: activeExample === ex ? '#fff' : 'var(--ink)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {examples[ex].title}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Step Interactive Workflow Engine */}
      <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid var(--line)', padding: '36px', boxShadow: '0 20px 50px rgba(22,23,29,0.05)', marginBottom: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '36px' }}>
          {[
            { step: 1 as const, num: '01', title: 'Synthesize & Plan', tag: 'CONTRACT FIRST', desc: 'Analyzes brief, files, and architectural dependencies.' },
            { step: 2 as const, num: '02', title: 'Recursive Synthesis', tag: 'SURGICAL EDITS', desc: 'Transforms code with Tree-sitter AST preservation.' },
            { step: 3 as const, num: '03', title: 'Verify in Browser', tag: 'HEADLESS TESTED', desc: 'Validates runtime, styles, tests, and user preview.' },
          ].map((item) => (
            <div
              key={item.step}
              onClick={() => setActiveStep(item.step)}
              style={{
                padding: '20px',
                borderRadius: '16px',
                border: activeStep === item.step ? '2px solid var(--violet)' : '1px solid #e5e7eb',
                background: activeStep === item.step ? 'rgba(238, 235, 255, 0.4)' : '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ font: '700 18px var(--font-display)', color: activeStep === item.step ? 'var(--violet-dark)' : '#9ca3af' }}>{item.num}</span>
                <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: activeStep === item.step ? 'var(--violet)' : '#e5e7eb', color: activeStep === item.step ? '#fff' : '#6b7280' }}>
                  {item.tag}
                </span>
              </div>
              <h3 style={{ font: '600 18px var(--font-display)', margin: '0 0 6px', color: 'var(--ink)' }}>{item.title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Step Detail Content */}
        <div style={{ background: '#171820', borderRadius: '18px', padding: '28px', color: '#fff' }}>
          {activeStep === 1 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--lime)', fontWeight: 700, letterSpacing: '0.1em' }}>STAGE 01 / SPECIFICATION</span>
                  <h3 style={{ font: '600 22px var(--font-display)', margin: '4px 0 0' }}>{curr.step1Output.title}</h3>
                </div>
                <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '6px', color: '#cbd5e1' }}>
                  Target: {curr.title}
                </span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#e2e8f0', marginBottom: '20px' }}>{curr.step1Output.summary}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '16px' }}>
                  <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'var(--lime)', marginBottom: '10px', letterSpacing: '0.08em' }}>
                    PLANNED FILE MUTATIONS
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {curr.step1Output.files.map((f, i) => (
                      <li key={i} style={{ fontSize: '12px', color: '#93c5fd', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📄</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '16px' }}>
                  <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'var(--lime)', marginBottom: '10px', letterSpacing: '0.08em' }}>
                    ARCHITECTURAL DECISIONS
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {curr.step1Output.decisions.map((d, i) => (
                      <li key={i} style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ color: 'var(--lime)' }}>✓</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--lime)', fontWeight: 700, letterSpacing: '0.1em' }}>STAGE 02 / CODE GENERATION</span>
                  <h3 style={{ font: '600 22px var(--font-display)', margin: '4px 0 0' }}>{curr.step2Output.title}</h3>
                </div>
                <span style={{ fontSize: '11px', background: 'rgba(74, 222, 128, 0.2)', padding: '4px 10px', borderRadius: '6px', color: '#4ade80', fontWeight: 600 }}>
                  {curr.step2Output.diffs}
                </span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#e2e8f0', marginBottom: '16px' }}>{curr.step2Output.summary}</p>
              <div style={{ background: '#0b0c10', borderRadius: '10px', padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: '#a7f3d0', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.08)' }}>
                <pre style={{ margin: 0 }}>{curr.step2Output.codeSnippet}</pre>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--lime)', fontWeight: 700, letterSpacing: '0.1em' }}>STAGE 03 / HEADLESS AUDIT</span>
                  <h3 style={{ font: '600 22px var(--font-display)', margin: '4px 0 0' }}>{curr.step3Output.title}</h3>
                </div>
                <span style={{ fontSize: '10px', background: 'var(--terracotta)', padding: '4px 10px', borderRadius: '4px', color: '#fff', fontWeight: 700, letterSpacing: '0.06em' }}>
                  ALL CHECKS GREEN
                </span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#e2e8f0', marginBottom: '20px' }}>{curr.step3Output.summary}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {curr.step3Output.checks.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--juniper)', color: '#fff', fontSize: '10px', display: 'grid', placeItems: 'center', fontWeight: 700 }}>✓</span>
                      <span style={{ fontSize: '13px', color: '#f1f5f9' }}>{c.name}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{c.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation CTA banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--mint)', padding: '30px 36px', borderRadius: '20px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h3 style={{ font: '600 24px var(--font-display)', margin: '0 0 6px', color: '#064e3b' }}>
            Want to see how Orbit works for your role?
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#047857' }}>
            Explore tailored workflows for Frontend Developers, Full-Stack Engineers, and Product Teams.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" className="button button-dark" onClick={() => onNavigate('/builders')}>
            Explore Roles <span>→</span>
          </button>
          <button type="button" className="button button-lime" onClick={onOpenWaitlist}>
            Join Waitlist <span>↗</span>
          </button>
        </div>
      </div>
    </div>
  );
};
