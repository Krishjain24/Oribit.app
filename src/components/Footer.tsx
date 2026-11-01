import React, { useState } from 'react';
import { store } from '../services/orbitStore';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenQuickStart?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenQuickStart }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      store.subscribeNewsletter(email);
      setStatus({
        type: 'success',
        message: '✓ Subscribed! You will receive future Orbit product updates.',
      });
      setEmail('');
    } catch {
      setStatus({
        type: 'error',
        message: 'Could not subscribe. Please try again.',
      });
    }
  };

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-newsletter-box">
          <div className="newsletter-info">
            <h4>Stay ahead with Orbit updates</h4>
            <p>Get release notes, agent templates, and early beta access in your inbox.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              required
              aria-label="Work email for newsletter"
            />
            <button type="submit">Subscribe</button>
          </form>
          {status && (
            <div
              style={{
                width: '100%',
                fontSize: '13px',
                marginTop: '8px',
                color: status.type === 'success' ? '#10b981' : '#ef4444',
                fontWeight: 500,
              }}
            >
              {status.message}
            </div>
          )}
        </div>
      </div>
      <div className="shell footer-main">
        <a className="brand footer-brand" href="#top" aria-label="Orbit home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" fill="none" width="32" height="32" style={{ maxWidth: '32px', maxHeight: '32px' }}>
              <circle cx="18" cy="18" r="12.5" stroke="currentColor" strokeWidth="1.7" />
              <ellipse cx="18" cy="18" rx="16" ry="6.3" transform="rotate(-34 18 18)" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="29.4" cy="8.2" r="2.6" fill="currentColor" />
            </svg>
          </span>
          <span>orbit</span>
        </a>
        <p>Move from idea to impact.</p>
        <nav aria-label="Footer navigation">
          <a href="#platform">Platform</a>
          <a href="#workflow">How it works</a>
          <a href="#for-builders">For builders</a>
          {onOpenQuickStart && (
            <button
              type="button"
              onClick={onOpenQuickStart}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#059669',
                fontWeight: 600,
                padding: 0,
                fontSize: '10px',
              }}
            >
              Start Locally ⚡
            </button>
          )}
          <a
            href="/admin"
            onClick={(e) => {
              e.preventDefault();
              onOpenAdmin();
            }}
            style={{
              color: 'var(--violet)',
              fontWeight: 600,
              fontSize: '10px',
            }}
          >
            Mission Control (Admin) ◈
          </a>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 Orbit Studio</span>
        <span>
          Built for what’s next <i>✳</i>
        </span>
      </div>
    </footer>
  );
};
