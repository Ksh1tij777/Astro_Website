'use client';
import { useState, useRef } from 'react';
import { useFragments } from '@/components/fragments/FragmentContext';

export default function AstronautWalker() {
  const { collect } = useFragments();
  const [falling, setFalling] = useState(false);
  const [visible, setVisible] = useState(true);
  const [fallPos, setFallPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  // A plain double-click reveals the fragment; the astronaut then falls once
  // and is gone. There is no single-click behaviour, so nothing triggers by
  // accident and it never randomly respawns/glitches.
  const handleDoubleClick = () => {
    if (falling || !visible) return;
    collect('first');
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setFallPos({ x: rect.left, y: rect.top });
    setFalling(true);
    setTimeout(() => setVisible(false), 900);
  };

  if (!visible) return null;

  return (
    <div
      ref={ref}
      className={`astronaut-walker${falling ? ' astronaut-walker--falling' : ''}`}
      style={falling ? { left: fallPos.x, top: fallPos.y } : undefined}
      onDoubleClick={handleDoubleClick}
      role="button"
      aria-label="Dark astronaut easter egg"
      title="⟟ a lost wanderer — knock twice"
    >
      <div className="astronaut-walker__bounce">
  <svg viewBox="0 0 64 72" className="astronaut-walker__svg" xmlns="http://www.w3.org/2000/svg">
    {/* Flowing Cape */}
    <path d="M 16 38 Q 8 58 10 70 L 54 70 Q 56 58 48 38 Z" fill="#08080a" />

    {/* Left Arm & Glove */}
    <line x1="23" y1="40" x2="14" y2="48" stroke="#111115" strokeWidth="6" strokeLinecap="round" className="astronaut-walker__arm-l" />
    <circle cx="14" cy="49" r="4" fill="#050507" />

    {/* Legs & Boots */}
    <line x1="26" y1="56" x2="20" y2="68" stroke="#15151a" strokeWidth="7" strokeLinecap="round" className="astronaut-walker__leg-l" />
    <line x1="38" y1="56" x2="44" y2="68" stroke="#15151a" strokeWidth="7" strokeLinecap="round" className="astronaut-walker__leg-r" />
    <ellipse cx="19" cy="69" rx="5.5" ry="3" fill="#050507" />
    <ellipse cx="45" cy="69" rx="5.5" ry="3" fill="#050507" />

    {/* Torso & Inner Robe */}
    <rect x="20" y="36" width="24" height="24" rx="6" fill="#18181f" />
    {/* Belt */}
    <rect x="20" y="54" width="24" height="4" fill="#0d0d12" />
    <rect x="30" y="53" width="4" height="6" rx="1" fill="#b0b0b8" />
    
    {/* Chest Control Box */}
    <rect x="25" y="40" width="14" height="11" rx="2" fill="#09090c" stroke="#2b2b36" strokeWidth="1" />
    {/* Control Buttons (Red / Blue / Gray) */}
    <rect x="27" y="42" width="3" height="3" rx="0.5" fill="#e02424" />
    <rect x="31" y="42" width="3" height="3" rx="0.5" fill="#3cc7ff" />
    <rect x="35" y="42" width="2" height="3" rx="0.5" fill="#9ca3af" />
    <rect x="27" y="46.5" width="10" height="2" fill="#374151" />

    {/* Right Arm & Red Lightsaber */}
    <g className="astronaut-walker__arm-r">
      <line x1="41" y1="40" x2="50" y2="48" stroke="#111115" strokeWidth="6" strokeLinecap="round" />
      <circle cx="50" cy="49" r="4" fill="#050507" />
      {/* Lightsaber Hilt */}
      <line x1="50" y1="46" x2="55" y2="40" stroke="#71717a" strokeWidth="2.5" strokeLinecap="round" />
      {/* Red Blade with Glow */}
      <line x1="55" y1="40" x2="62" y2="18" stroke="#ff2244" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="40" x2="62" y2="18" stroke="#ff8899" strokeWidth="1" strokeLinecap="round" />
    </g>

    {/* Vader Helmet Outer Flare / Dome */}
    <path d="M 17 25 C 17 9, 47 9, 47 25 C 50 30, 48 34, 43 34 L 21 34 C 16 34, 14 30, 17 25 Z" fill="#09090d" />
    <path d="M 23 13 C 27 10, 37 10, 41 13" stroke="#2e2e38" strokeWidth="1.5" fill="none" strokeLinecap="round" />

    {/* Mask Faceplate & Triangular Grill */}
    <polygon points="32,23 25,32 39,32" fill="#14141a" />
    <polygon points="32,27 28,32 36,32" fill="#3f3f4e" />
    
    {/* Angular Eyes / Lenses */}
    <polygon points="25,20 30,22 26,24" fill="#000000" stroke="#22222a" strokeWidth="0.8" />
    <polygon points="39,20 34,22 38,24" fill="#000000" stroke="#22222a" strokeWidth="0.8" />
  </svg>
</div>
    </div>
  );
}