import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';
import events from '@/content/events.json';

const meta = sections.find((s) => s.id === 'events')!;

export default function Events() {
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {events.map((e) => (
            <div key={e.title} className="glass event">
              <div className="event__left">
                <div className="event__date">
                  <span className="event__day">{e.day}</span>
                  <span className="event__mon" style={{ color: meta.accent }}>
                    {e.month}
                  </span>
                </div>
                <div>
                  <h3 className="event__title">{e.title}</h3>
                  <p className="event__meta">{e.meta}</p>
                </div>
              </div>
              <button type="button" className="btn-pill btn-ghost">
                Secure Slot
              </button>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
