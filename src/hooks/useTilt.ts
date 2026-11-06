import { useEffect, useRef } from 'react';

interface TiltOptions {
  maxTilt?: number; // max tilt degrees (e.g. 5)
  perspective?: number; // perspective in px (e.g. 1000)
  scale?: number; // slight scale on hover (e.g. 1.02)
  speed?: number; // transition speed ms
  glare?: boolean;
}

export function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const {
    maxTilt = 6,
    perspective = 1000,
    scale = 1.015,
    speed = 400,
    glare = false,
  } = options;

  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Respect user's reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPercent = (x / rect.width) * 2 - 1; // -1 to 1
      const yPercent = (y / rect.height) * 2 - 1; // -1 to 1

      const rotateX = -yPercent * maxTilt;
      const rotateY = xPercent * maxTilt;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.transform = `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
        el.style.transition = 'transform 80ms ease-out';
      });
    };

    const handleMouseLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      el.style.transition = `transform ${speed}ms cubic-bezier(0.23, 1, 0.32, 1)`;
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt, perspective, scale, speed, glare]);

  return elementRef;
}
