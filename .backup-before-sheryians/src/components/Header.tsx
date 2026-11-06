import React, { useState } from 'react';

interface HeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onOpenWaitlist: () => void;
  onOpenAdmin: () => void;
  isAdminView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath = '/',
  onNavigate,
  onOpenWaitlist,
  onOpenAdmin,
  isAdminView,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const navLinks = [
    { label: 'Platform', path: '/platform' },
    { label: 'How it works', path: '/workflow' },
    { label: 'For builders', path: '/builders' },
    { label: 'Playground', path: '/playground', badge: '✳' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Docs', path: '/docs' },
  ];

  return (
    <header className="site-header">
      <div className="header-inner shell">
        <a
          className="brand"
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          aria-label="Orbit home"
        >
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" fill="none" width="32" height="32" style={{ maxWidth: '32px', maxHeight: '32px' }}>
              <circle cx="18" cy="18" r="12.5" stroke="currentColor" strokeWidth="1.7" />
              <ellipse cx="18" cy="18" rx="16" ry="6.3" transform="rotate(-34 18 18)" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="29.4" cy="8.2" r="2.6" fill="currentColor" />
            </svg>
          </span>
          <span>orbit</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
        </button>

        <nav className={`main-navigation ${isOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {!isAdminView ? (
            <>
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={(e) => handleLinkClick(e, link.path)}
                    style={{
                      color: isActive ? 'var(--violet-dark)' : undefined,
                      fontWeight: isActive ? 700 : 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {link.label}
                    {link.badge && (
                      <span style={{ fontSize: '10px', color: 'var(--violet)' }}>
                        {link.badge}
                      </span>
                    )}
                  </a>
                );
              })}

              <a
                href="/admin"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  onOpenAdmin();
                }}
                style={{
                  fontWeight: currentPath === '/admin' ? 700 : 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: currentPath === '/admin' ? 'var(--violet-dark)' : undefined,
                }}
              >
                <span>Console</span>
                <span style={{ fontSize: '9px', background: 'var(--lime)', color: '#171820', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
                  ◈
                </span>
              </a>

              <button
                type="button"
                className="nav-cta btn-open-waitlist"
                onClick={() => {
                  setIsOpen(false);
                  onOpenWaitlist();
                }}
              >
                Get started <span aria-hidden="true">↗</span>
              </button>
            </>
          ) : (
            <>
              <a
                href="/"
                className="nav-link"
                onClick={(e) => handleLinkClick(e, '/')}
              >
                ← Back to Website
              </a>
              <button
                type="button"
                className="nav-cta btn-open-waitlist"
                onClick={() => {
                  setIsOpen(false);
                  onOpenWaitlist();
                }}
              >
                Join Waitlist <span aria-hidden="true">↗</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
