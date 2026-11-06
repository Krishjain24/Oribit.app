import React, { useEffect, useState, useRef } from 'react';

export const CursorFollower: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'inspect'>('default');
  const [cursorLabel, setCursorLabel] = useState<string>('');

  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Check what element is under the cursor
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, select, textarea, [role="button"]');
      const inspectable = target.closest('.hover-expand, .hero-window, .preview-float, .feature-card');

      if (inspectable && !interactive) {
        setCursorType('inspect');
        setCursorLabel('INSPECT');
      } else if (interactive) {
        setCursorType('pointer');
        setCursorLabel('');
      } else {
        setCursorType('default');
        setCursorLabel('');
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    // Smooth lerp loop
    const animate = () => {
      const ease = 0.18; // smooth spring lag
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={cursorRef}
      className={`orbit-cursor-follower cursor-${cursorType}`}
      aria-hidden="true"
    >
      <div className="cursor-dot"></div>
      <div className="cursor-ring">
        {cursorLabel && <span className="cursor-text">{cursorLabel}</span>}
      </div>
    </div>
  );
};
