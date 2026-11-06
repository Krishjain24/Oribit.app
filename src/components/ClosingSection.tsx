import React from 'react';
import { RollingText } from './RollingText';

interface ClosingSectionProps {
  onOpenWaitlist: () => void;
  onOpenInquiry: () => void;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ onOpenWaitlist, onOpenInquiry }) => {
  return (
    <section className="closing-section" id="get-started" aria-labelledby="closing-title">
      <div className="shell closing-inner">
        <div className="closing-orbit" aria-hidden="true">
          <span></span>
          <i></i>
        </div>
        <p className="eyebrow eyebrow-light">THE NEXT MOVE IS YOURS</p>
        <h2 id="closing-title">
          Give your ideas
          <br />
          room to <span>move.</span>
        </h2>
        <p>Bring your next project into focus with a workspace built around the way you think.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="button button-lime btn-open-waitlist roll-btn" type="button" onClick={onOpenWaitlist}>
            <RollingText text="Join Early Access" suffix={<span aria-hidden="true">↗</span>} />
          </button>
          <button className="button button-light btn-open-inquiry roll-btn" type="button" onClick={onOpenInquiry}>
            <RollingText text="Request Team Demo" suffix={<span aria-hidden="true">→</span>} />
          </button>
        </div>
      </div>
    </section>
  );
};
