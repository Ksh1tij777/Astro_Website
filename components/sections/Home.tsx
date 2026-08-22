'use client';

import { useState } from 'react';
import Reveal from '@/components/Reveal';
import CoordinateModal from '@/components/cli/CoordinateModal';
import { FRAGMENTS, useFragments } from '@/components/fragments/FragmentContext';

// true = "Begin the Voyage" only opens once all four disc fragments are found.
// Set false to unlock the button for testing / outside the event.
const REQUIRE_FULL_DISC = true;

export default function Home() {
  const { collected } = useFragments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lockMsg, setLockMsg] = useState(false);

  const discComplete = collected.length >= FRAGMENTS.length;

  const handleBegin = () => {
    if (REQUIRE_FULL_DISC && !discComplete) {
      setLockMsg(true);
      return;
    }
    setIsModalOpen(true);
  };

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
          className={`btn-pill hero__cta${REQUIRE_FULL_DISC && !discComplete ? ' hero__cta--locked' : ''}`}
          onClick={handleBegin}
        >
          {REQUIRE_FULL_DISC && !discComplete ? (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 15, verticalAlign: '-3px', marginRight: 6 }}>
                lock
              </span>
              Begin the Voyage
            </>
          ) : (
            'Begin the Voyage'
          )}
        </button>

        {lockMsg && !discComplete && (
          <p className="hero__lockmsg">
            ⟟ The disc is incomplete — {collected.length}/{FRAGMENTS.length} fragments recovered. Assemble all four to
            chart your voyage.
          </p>
        )}
      </Reveal>

      <CoordinateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

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
