import React from 'react';

export const CapabilityStrip: React.FC = () => {
  return (
    <section className="capability-strip" aria-label="Orbit capabilities">
      <div className="shell strip-inner">
        <p>
          One clear direction.
          <br />
          <strong>More momentum at every step.</strong>
        </p>
        <div className="strip-items">
          <span>
            <i className="strip-icon icon-plan">✳</i> Plan with context
          </span>
          <span>
            <i className="strip-icon icon-build">⌘</i> Build across your code
          </span>
          <span>
            <i className="strip-icon icon-check">✓</i> Verify what ships
          </span>
        </div>
      </div>
    </section>
  );
};
