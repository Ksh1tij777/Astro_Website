import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';
import merch from '@/content/merch.json';

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
            Wear the void. Every purchase funds new optics for the club observatory.
          </p>
        </div>

        <div className="grid-cards grid-cards--4">
          {merch.map((m) => (
            <div key={m.name} className="glass product">
              <div className="ph product__media">{m.placeholder}</div>
              <div className="product__body">
                <div>
                  <h3 className="product__name">{m.name}</h3>
                  <p className="product__mat">{m.material}</p>
                </div>
                <span className="product__price" style={{ color: meta.accent }}>
                  {m.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
