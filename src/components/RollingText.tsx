import React from 'react';

interface RollingTextProps {
  text: string;
  className?: string;
  suffix?: React.ReactNode;
}

export const RollingText: React.FC<RollingTextProps> = ({
  text,
  className = '',
  suffix,
}) => {
  return (
    <span className={`roll-text-wrap ${className}`}>
      <span className="roll-text-inner">
        <span className="roll-primary">{text}</span>
        <span className="roll-secondary" aria-hidden="true">{text}</span>
      </span>
      {suffix && <span className="roll-suffix">{suffix}</span>}
    </span>
  );
};
