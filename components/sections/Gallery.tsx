'use client';

import { useState } from 'react';
import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';
import gallery from '@/content/gallery.json';

const meta = sections.find((s) => s.id === 'gallery')!;

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const count = gallery.length;
  const g = gallery[index];

  // Wrap around at both ends.
  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  return (
    <section id="gallery" data-screen-label="Gallery" className="section">
      <Reveal className="wrap" style={{ maxWidth: 1120 }}>
        <div className="sec-head__title" style={{ marginBottom: 50 }}>
          <span className="eyebrow" style={{ color: meta.accent }}>
            {`PLANET ${meta.numeral} · ${meta.codename.toUpperCase()}`}
          </span>
          <h2 className="h-section">Gallery</h2>
        </div>

        <div className="carousel">
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => go(-1)}
            aria-label="Previous photo"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          {/* key={index} re-mounts the slide each step, replaying the fade-in */}
          <div key={index} className="glass gallery-slide">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.src} alt={g.alt} />
            {g.alt && <span className="gallery-slide__caption">{g.alt}</span>}
          </div>

          <button
            type="button"
            className="carousel__arrow"
            onClick={() => go(1)}
            aria-label="Next photo"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="carousel__dots">
          {gallery.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`carousel__dot${i === index ? ' active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
