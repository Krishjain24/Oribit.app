import React, { useState } from 'react';

interface PricingPageProps {
  onOpenWaitlist: () => void;
  onOpenInquiry: () => void;
  onNavigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onOpenWaitlist, onOpenInquiry, onNavigate }) => {
  const [teamSize, setTeamSize] = useState<number>(8);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const hoursSavedPerDev = 24; // 24 hours saved per dev per month
  const avgHourlyRate = 85;
  const totalHoursSaved = teamSize * hoursSavedPerDev;
  const totalDollarsSaved = totalHoursSaved * avgHourlyRate;

  const faqs = [
    {
      q: 'How does Orbit differ from GitHub Copilot or Cursor?',
      a: 'Copilot and Cursor are inline autocomplete tools inside an existing text editor. Orbit is an autonomous agent workspace that coordinates multi-step tasks across polyglot microservices, runs headless browser audits, and enforces surgical verification before changes land.',
    },
    {
      q: 'Where is our code and data stored?',
      a: 'In local development, Orbit uses an isolated SQLite database (orbit.db) and never transmits source code to third-party model training sets. In enterprise mode, Orbit deploys inside your private AWS/GCP VPC with zero-retention data agreements.',
    },
    {
      q: 'Can we self-host Orbit on our own servers?',
      a: 'Yes! The repository includes 1-click startup scripts (start.sh for macOS/Linux and start.bat for Windows) that install dependencies strictly into the project folder without system pollution.',
    },
    {
      q: 'How do priority scores work in the early access waitlist?',
      a: 'When you sign up for early access, product teams and multi-engineer squads receive elevated priority scores (10 pts vs 5 pts) for batch onboarding into the Orbit Mission Control cloud console.',
    },
    {
      q: 'What LLM models power Orbit agents?',
      a: 'Orbit uses a hybrid routing layer: high-speed Tree-sitter parsers for local AST indexing, and frontier reasoning models (including Gemini 2.5 Flash and Pro) for architecture planning and verification.',
    },
  ];

  return (
    <div className="pricing-page shell" style={{ paddingTop: '40px', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px' }}>
        <p className="eyebrow" style={{ justifyContent: 'center' }}>
          <span className="live-dot"></span> TRANSPARENT VALUE
        </p>
        <h1 style={{ font: '500 clamp(42px, 5.5vw, 72px)/1.05 var(--font-display)', letterSpacing: '-0.07em', margin: '16px 0 24px' }}>
          Predictable plans for <span style={{ color: 'var(--violet)' }}>every builder</span>.
        </h1>
        <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'var(--muted)', maxWidth: '640px', margin: '0 auto 24px' }}>
          Start for free locally with our open architecture, then scale across your organization with Mission Control coordination.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button type="button" className="button button-lime" onClick={onOpenWaitlist}>
            Join Waitlist <span>↗</span>
          </button>
          <button type="button" className="button button-dark" onClick={() => onNavigate('/playground')}>
            Test Agent Studio <span>✳</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '70px' }}>
        {/* Tier 1: Developer */}
        <div className="hover-expand" style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--line-solid)', padding: '36px 30px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>
            SOLO BUILDER
          </span>
          <h2 style={{ font: '600 28px var(--font-display)', margin: '8px 0 4px', color: 'var(--ink)' }}>Developer</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 24px', minHeight: '38px' }}>
            Ideal for solo founders and open-source contributors testing agent workflows.
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
            <strong style={{ font: '700 48px var(--font-display)', color: 'var(--ink)' }}>$0</strong>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>/ forever free</span>
          </div>
          <button type="button" className="button button-dark" onClick={onOpenWaitlist} style={{ width: '100%', marginBottom: '28px' }}>
            Start Free <span>→</span>
          </button>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#4b5563' }}>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> Local SQLite database (orbit.db)</li>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> 2 concurrent local agents</li>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> 1-Click start.sh / start.bat scripts</li>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> AST Tree-sitter code indexing</li>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> Local browser verification</li>
          </ul>
        </div>

        {/* Tier 2: Pro Teams (Highlighted) */}
        <div className="hover-expand" style={{ background: '#fff', borderRadius: '16px', border: '2px solid var(--violet)', padding: '36px 30px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 20px 50px rgba(0, 72, 187, 0.12)' }}>
          <div style={{ position: 'absolute', top: '-12px', right: '24px', background: 'var(--terracotta)', color: '#ffffff', fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '4px', letterSpacing: '0.08em' }}>
            MOST POPULAR
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--violet-dark)', textTransform: 'uppercase' }}>
            SCALE & VELOCITY
          </span>
          <h2 style={{ font: '600 28px var(--font-display)', margin: '8px 0 4px', color: 'var(--ink)' }}>Pro Team</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 24px', minHeight: '38px' }}>
            For high-growth software engineering teams running coordinated multi-agent sprints.
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
            <strong style={{ font: '700 48px var(--font-display)', color: 'var(--ink)' }}>$29</strong>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>/ dev / month</span>
          </div>
          <button type="button" className="button button-lime" onClick={onOpenWaitlist} style={{ width: '100%', marginBottom: '28px' }}>
            Join Team Waitlist <span>↗</span>
          </button>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#334155' }}>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span> Everything in Developer, plus:</li>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> Mission Control Console (/admin)</li>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> Up to 16 concurrent agents per project</li>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> Shared team decision journal</li>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> Automated PR review batches</li>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> Priority waitlist allocation (10 pts)</li>
          </ul>
        </div>

        {/* Tier 3: Enterprise Dedicated */}
        <div className="hover-expand" style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--line-solid)', padding: '36px 30px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>
            SECURITY & ISOLATION
          </span>
          <h2 style={{ font: '600 28px var(--font-display)', margin: '8px 0 4px', color: 'var(--ink)' }}>Enterprise</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 24px', minHeight: '38px' }}>
            For enterprises requiring self-hosted VPC deployments, custom SLA, and strict compliance.
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
            <strong style={{ font: '700 48px var(--font-display)', color: 'var(--ink)' }}>Custom</strong>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>/ annual contract</span>
          </div>
          <button type="button" className="button button-dark" onClick={onOpenInquiry} style={{ width: '100%', marginBottom: '28px' }}>
            Request Enterprise Demo <span>↗</span>
          </button>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#4b5563' }}>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> Private AWS / GCP / Azure VPC</li>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> Zero-data retention training guarantees</li>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> Custom LLM models and fine-tunes</li>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> SOC2 Type II compliance reports</li>
            <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#16a34a' }}>✓</span> Dedicated 24/7 solutions engineer</li>
          </ul>
        </div>
      </div>

      {/* Interactive ROI Calculator */}
      <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid var(--line)', padding: '36px', boxShadow: '0 20px 50px rgba(0,0,0,0.03)', marginBottom: '70px' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 30px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--violet)' }}>
            INTERACTIVE IMPACT CALCULATOR
          </span>
          <h2 style={{ font: '600 32px var(--font-display)', margin: '6px 0 10px', color: 'var(--ink)' }}>
            Calculate engineering hours saved with Orbit
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
            Adjust team size to see estimated developer productivity uplift based on automated synthesis and browser review loops.
          </p>
        </div>

        <div style={{ maxWidth: '520px', margin: '0 auto 36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Engineering Team Size:</strong>
            <span style={{ font: '700 20px var(--font-display)', color: 'var(--violet-dark)' }}>{teamSize} engineers</span>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            value={teamSize}
            onChange={(e) => setTeamSize(parseInt(e.target.value, 10))}
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--violet)' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', background: 'var(--paper)', padding: '24px', borderRadius: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              HOURS SAVED / MONTH
            </span>
            <strong style={{ font: '700 36px var(--font-display)', color: 'var(--ink)' }}>{totalHoursSaved}h</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              ESTIMATED VALUE CREATED
            </span>
            <strong style={{ font: '700 36px var(--font-display)', color: '#16a34a' }}>
              ${totalDollarsSaved.toLocaleString()}
            </strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              SPRINT CYCLE REDUCTION
            </span>
            <strong style={{ font: '700 36px var(--font-display)', color: 'var(--violet)' }}>3.8x faster</strong>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ font: '600 32px var(--font-display)', textAlign: 'center', margin: '0 0 32px', color: 'var(--ink)' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                style={{
                  background: '#fff',
                  borderRadius: '14px',
                  border: '1px solid var(--line)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    font: '600 16px var(--font-display)',
                    color: 'var(--ink)',
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '18px', color: 'var(--violet)', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>
                    +
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 24px 20px', fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
