import React from 'react';

interface MarqueeTickerProps {
  speed?: 'normal' | 'slow';
  direction?: 'left' | 'right';
  className?: string;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  className = '',
}) => {
  const items = [
    { label: 'AST TREE-SITTER PARSING', tag: 'SYNTAX', icon: '✳' },
    { label: 'HEADLESS BROWSER AUDIT', tag: 'PLAYWRIGHT', icon: '◉' },
    { label: 'MULTI-FILE ATOMIC COMMITS', tag: 'GIT SAFE', icon: '⌘' },
    { label: 'SUB-SECOND LINT CHECK', tag: 'ZERO ERROR', icon: '✓' },
    { label: 'DAG INTENT DECOMPOSITION', tag: 'PLANNER', icon: '▤' },
    { label: 'DETERMINISTIC ROLLBACK', tag: 'ISOLATION', icon: '◈' },
    { label: 'ACCESSIBILITY WCAG AA', tag: 'STANDARDS', icon: '✦' },
  ];

  return (
    <div className={`orbit-marquee-ribbon ${className}`} aria-hidden="true">
      <div className="marquee-track">
        {/* Render 2 identical sets for seamless continuous loop */}
        {[...items, ...items].map((item, idx) => (
          <div key={idx} className="marquee-item">
            <span className="marquee-icon">{item.icon}</span>
            <span className="marquee-text">{item.label}</span>
            <span className="marquee-tag">{item.tag}</span>
            <span className="marquee-sep">/</span>
          </div>
        ))}
      </div>
    </div>
  );
};
