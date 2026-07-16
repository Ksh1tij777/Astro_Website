'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Fade + rise on scroll-in. Wrap a section's content in this.
 * Fires once (no reset on scroll-up), matching the prototype.
 */
export default function Reveal({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal${seen ? ' in' : ''} ${className}`} style={style}>
      {children}
    </div>
  );
}
