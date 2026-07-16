'use client';

import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';

const meta = sections.find((s) => s.id === 'contact')!;

export default function Contact() {
  return (
    <section id="contact" data-screen-label="Contact" className="section">
      <Reveal className="wrap contact" style={{ maxWidth: 1000 }}>
        <div className="contact__col">
          <span className="eyebrow" style={{ color: meta.accent }}>
            {`PLANET ${meta.numeral} · ${meta.codename.toUpperCase()}`}
          </span>
          <h2 className="h-section">Contact</h2>
          <p className="contact__lead">
            Questions, collaborations, or a night at the dome? Send a signal and our crew will respond within one
            rotation.
          </p>
          <div className="contact__info">
            <span>astronomylnmiit@lnmiit.ac.in</span>
            <span>LNMIIT · Jaipur · Rajasthan</span>
          </div>
        </div>

        <form className="glass contact__form" onSubmit={(e) => e.preventDefault()}>
          <input className="field" placeholder="Your name" />
          <input className="field" type="email" placeholder="Your email" />
          <textarea className="field" rows={4} placeholder="Your message" />
          <button type="submit" className="btn-pill contact__submit">
            Transmit
          </button>
        </form>
      </Reveal>
    </section>
  );
}
