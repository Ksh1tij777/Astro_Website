import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';

const meta = sections.find((s) => s.id === 'merch')!;

export default function Merch() {
  return (
    <section id="merch" data-screen-label="Merch" className="section">
      <Reveal className="wrap" style={{ maxWidth: 1120 }}>
        <div className="sec-head">
          <div className="sec-head__title">
            <span className="eyebrow" style={{ color: meta.accent }}>
              {`PLANET ${meta.numeral} · ${meta.codename.toUpperCase()}`}
            </span>
            <h2 className="h-section">Merch</h2>
          </div>
          <p className="sec-head__intro">
            Wear the void. Official club apparel — front and back.
          </p>
        </div>

        <div className="merch-showcase">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/merch-final.png" alt="Astronomy Club apparel — front and back" />
        </div>
        <p className="merch-caption">Front &amp; Back · Coming soon</p>
      </Reveal>
    </section>
  );
}
