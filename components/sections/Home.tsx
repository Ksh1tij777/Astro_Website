'use client';

import { useState } from 'react';
import Reveal from '@/components/Reveal';
import CoordinateModal from '@/components/cli/CoordinateModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="home" data-screen-label="Home" className="section section--center">
      <Reveal className="hero">
        <span className="eyebrow hero__eyebrow">LNMIIT</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ASTRONOMY-logo.png" alt="Astronomy Club" className="hero__logo" />
        <h1 className="h-display hero__title">Astronomy Club</h1>
        <p className="hero__sub">&ldquo;Where calculation meets the infinite wonder of the dark.&rdquo;</p>
        <button
          type="button"
          className="btn-pill hero__cta"
          onClick={() => setIsModalOpen(true)}
        >
          Begin the Voyage
        </button>
      </Reveal>

      <CoordinateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="hero__hint">
        <span className="eyebrow" style={{ fontSize: 10, letterSpacing: '0.25em' }}>
          Scroll to ascend
        </span>
        <span className="material-symbols-outlined" style={{ animation: 'bounceDown 1.8s ease-in-out infinite' }}>
          expand_more
        </span>
      </div>
    </section>
  );
}

