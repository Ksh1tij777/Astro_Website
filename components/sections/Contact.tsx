'use client';

import { useState } from 'react';
import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';
import { useFragments } from '@/components/fragments/FragmentContext';

const meta = sections.find((s) => s.id === 'contact')!;
const CLUB_EMAIL = 'astronomyclub@lnmiit.ac.in';

export default function Contact() {
  const { collect } = useFragments();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'bad'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Secret: the Golden Record's actual English greeting → reveals a fragment.
    const normalized = message.toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim();
    if (normalized === 'hello from the children of planet earth') {
      collect('third');
      setStatus('ok');
    } else {
      setStatus('bad');
    }
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
          <p className="contact__whisper">
            ⟟ Some transmissions carry more than words. The Golden Record opened with a greeting from Earth&rsquo;s
            children — send that very message, and something will answer.
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
          {status === 'ok' && (
            <p className="contact__status contact__status--ok">Signal received.</p>
          )}
          {status === 'bad' && (
            <p className="contact__status contact__status--bad">Incorrect message. Try again.</p>
          )}
        </form>
      </Reveal>
    </section>
  );
}
