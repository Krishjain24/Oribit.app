import React, { useState } from 'react';

interface QuickStartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickStartModal: React.FC<QuickStartModalProps> = ({ isOpen, onClose }) => {
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  return (
    <div
      className={`orbit-modal-overlay ${isOpen ? 'is-active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-quickstart-title"
    >
      <div className="orbit-modal" style={{ maxWidth: '620px' }}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        <div className="modal-header">
          <span className="eyebrow" style={{ color: 'var(--violet)' }}>
            LOCAL RUNTIME
          </span>
          <h3 id="modal-quickstart-title">One-Click Start for Windows & Mac</h3>
          <p style={{ marginBottom: '14px' }}>
            Run Orbit locally in one click. Automatically installs requirements and dependencies if not already present.
          </p>
        </div>

        {/* Isolation guarantee banner */}
        <div
          style={{
            background: 'var(--mint)',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#14532d',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>🛡️</span>
          <div>
            <strong>Strictly Isolated to Project:</strong> Dependencies are installed solely into this project's local{' '}
            <code style={{ background: 'rgba(255,255,255,0.7)', padding: '1px 5px', borderRadius: '4px' }}>
              node_modules
            </code>{' '}
            and Python{' '}
            <code style={{ background: 'rgba(255,255,255,0.7)', padding: '1px 5px', borderRadius: '4px' }}>
              .venv
            </code>
            . Nothing is installed globally on your machine or whole system.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {/* WINDOWS CARD */}
          <div
            style={{
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '18px',
              background: 'var(--paper)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>🪟</span>
                <strong style={{ fontSize: '15px' }}>Windows (One-Click)</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 12px', lineHeight: 1.5 }}>
                Double-click <code style={{ color: 'var(--ink)', fontWeight: 600 }}>start.bat</code> to verify Node.js,
                install local packages, and open the app in your browser.
              </p>
            </div>

            <div>
              <a
                href="/api/v1/download/start-windows"
                download="start.bat"
                className="button button-dark"
                style={{ width: '100%', minHeight: '40px', fontSize: '12px', marginBottom: '10px' }}
              >
                Download start.bat <span>↓</span>
              </a>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#171820',
                  color: '#e2e8f0',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  justifyContent: 'space-between',
                }}
              >
                <span>.\start.bat</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('.\\start.bat', 'win')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: copiedPlatform === 'win' ? 'var(--lime)' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  {copiedPlatform === 'win' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* MAC / LINUX CARD */}
          <div
            style={{
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '18px',
              background: 'var(--paper)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>🍎</span>
                <strong style={{ fontSize: '15px' }}>macOS / Linux (One-Click)</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 12px', lineHeight: 1.5 }}>
                Execute <code style={{ color: 'var(--ink)', fontWeight: 600 }}>start.sh</code> to automatically prepare
                the local virtual environment, install packages, and boot the server.
              </p>
            </div>

            <div>
              <a
                href="/api/v1/download/start-mac"
                download="start.sh"
                className="button button-dark"
                style={{ width: '100%', minHeight: '40px', fontSize: '12px', marginBottom: '10px' }}
              >
                Download start.sh <span>↓</span>
              </a>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#171820',
                  color: '#e2e8f0',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '6px' }}>
                  ./start.sh
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('chmod +x start.sh && ./start.sh', 'mac')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: copiedPlatform === 'mac' ? 'var(--lime)' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copiedPlatform === 'mac' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <small style={{ color: 'var(--muted)', fontSize: '12px' }}>
            Both scripts check dependencies automatically and start on{' '}
            <code style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: '4px' }}>
              http://localhost:3000
            </code>
          </small>
        </div>
      </div>
    </div>
  );
};
