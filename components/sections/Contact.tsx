'use client';

import { useState } from 'react';
import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';

const meta = sections.find((s) => s.id === 'contact')!;
const CLUB_EMAIL = 'astronomyclub@lnmiit.ac.in';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Website enquiry from ${name || 'a visitor'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    // Open a pre-filled Gmail compose window addressed to the club.
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${CLUB_EMAIL}&su=${subject}&body=${body}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
            <a href={`mailto:${CLUB_EMAIL}`}>{CLUB_EMAIL}</a>
            <span>LNMIIT · Jaipur · Rajasthan</span>
          </div>
        </div>

        <form className="glass contact__form" onSubmit={handleSubmit}>
          <input
            className="field"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="field"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            className="field"
            rows={4}
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="btn-pill contact__submit">
            Transmit
          </button>
        </form>
      </Reveal>
    </section>
  );
}
