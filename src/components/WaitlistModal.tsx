import React, { useState } from 'react';
import { store } from '../services/orbitStore';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
  onSuccess?: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [builderRole, setBuilderRole] = useState<'frontend' | 'fullstack' | 'teams' | 'other'>('fullstack');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string; position?: number } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const entry = await store.joinWaitlist({
        email,
        full_name: fullName.trim() || null,
        builder_role: builderRole,
        company: company.trim() || null,
      });

      setStatus({
        type: 'success',
        message: `You're on the list! Position #${entry.queue_position || '1'} reserved for early access. Record stored in SQLite (orbit.db).`,
        position: entry.queue_position,
      });
      setEmail('');
      setFullName('');
      setCompany('');
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setStatus({
        type: 'error',
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`orbit-modal-overlay ${isOpen ? 'is-active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-waitlist-title"
    >
      <div className="orbit-modal">
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        <div className="modal-header">
          <span className="eyebrow" style={{ color: 'var(--violet)' }}>
            EARLY ACCESS
          </span>
          <h3 id="modal-waitlist-title">Join the Orbit Waitlist</h3>
          <p>Get prioritized access to the agent-first workspace as we open new builder cohorts.</p>
        </div>
        <form className="orbit-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="wl-email">Work Email *</label>
            <input
              type="email"
              id="wl-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="wl-name">Full Name</label>
            <input
              type="text"
              id="wl-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ada Lovelace"
            />
          </div>
          <div className="form-field">
            <label htmlFor="wl-role">Builder Role</label>
            <select
              id="wl-role"
              value={builderRole}
              onChange={(e) => setBuilderRole(e.target.value as 'frontend' | 'fullstack' | 'teams' | 'other')}
            >
              <option value="frontend">Frontend Developer</option>
              <option value="fullstack">Full Stack Builder</option>
              <option value="teams">Engineering / Product Team</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="wl-company">Company / Organization</label>
            <input
              type="text"
              id="wl-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
          <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Reserving...' : 'Reserve Your Spot'} <span>↗</span>
          </button>
          {status && (
            <div className={`form-status ${status.type}`}>
              <p style={{ margin: 0 }}>{status.message}</p>
              {status.type === 'success' && onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  style={{
                    marginTop: '8px',
                    background: 'var(--ink)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  View entry in Mission Control (Admin) ◈
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
