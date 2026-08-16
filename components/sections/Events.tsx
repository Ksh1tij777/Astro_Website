'use client';

import { useState } from 'react';
import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';
import events from '@/content/events.json';

const meta = sections.find((s) => s.id === 'events')!;

export default function Events() {
  const [index, setIndex] = useState(0);
  const count = events.length;
  const e = events[index];

  // Wrap around: next past the end returns to the first, prev past the start
  // returns to the last.
  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  return (
    <section id="events" data-screen-label="Events" className="section section--tint">
      <Reveal className="wrap" style={{ maxWidth: 1120 }}>
        <div className="sec-head">
          <div className="sec-head__title">
            <span className="eyebrow" style={{ color: meta.accent }}>
              {`PLANET ${meta.numeral} · ${meta.codename.toUpperCase()}`}
            </span>
            <h2 className="h-section">Our Events</h2>
          </div>
          <p className="sec-head__intro">
            Synchronized observation runs, imaging clinics, and star parties across the desert nights of Rajasthan.
          </p>
        </div>

        <div className="carousel">
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => go(-1)}
            aria-label="Previous event"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          {/* key={e.title} re-mounts the card each step, replaying the fade-in */}
          <div key={e.title} className="glass carousel__card">
            <div className="carousel__media">
              {e.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.image} alt={e.title} />
              ) : (
                <div className="ph carousel__ph">EVENT IMAGE</div>
              )}
            </div>

            <div className="carousel__body">
              <h3 className="carousel__title">{e.title}</h3>
              <p className="carousel__meta">{e.meta}</p>

              {e.title === 'Club Recruitments' && (
                <a
                  href="https://forms.gle/ateF5jHtf3He5Lh39"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="carousel__cta"
                >
                  <button type="button" className="btn-pill btn-ghost">
                    Secure Slot
                  </button>
                </a>
              )}
            </div>
          </div>

          <button
            type="button"
            className="carousel__arrow"
            onClick={() => go(1)}
            aria-label="Next event"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="carousel__dots">
          {events.map((ev, i) => (
            <button
              key={ev.title}
              type="button"
              className={`carousel__dot${i === index ? ' active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to ${ev.title}`}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
