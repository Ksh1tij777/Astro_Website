import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';

const meta = sections.find((s) => s.id === 'merch')!;

// To show artwork on the mockups later, drop images into public/ and set
// these to their paths (e.g. '/merch-front.png'). Transparent PNGs sized to
// the print area work best. Left null, a subtle "coming soon" label shows.
const FRONT_DESIGN: string | null = null;
const BACK_DESIGN: string | null = null;

function TeeMock({
  label,
  design,
  area,
}: {
  label: string;
  design: string | null;
  area: 'front' | 'back';
}) {
  return (
    <figure className="tee">
      <div className="tee__mock">
        <svg viewBox="0 0 200 220" className="tee__svg" aria-hidden>
          <path d="M70 20 L40 35 L15 70 L40 95 L58 82 L58 200 L142 200 L142 82 L160 95 L185 70 L160 35 L130 20 C120 42 80 42 70 20 Z" />
        </svg>
        <div className={`tee__print tee__print--${area}`}>
          {design ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={design} alt={`${label} design`} />
          ) : (
            <span>Design coming soon</span>
          )}
        </div>
      </div>
      <figcaption className="tee__label">{label}</figcaption>
    </figure>
  );
}

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
            Wear the void. Club apparel — front and back designs coming soon.
          </p>
        </div>

        <div className="tees">
          <TeeMock label="Front" design={FRONT_DESIGN} area="front" />
          <TeeMock label="Back" design={BACK_DESIGN} area="back" />
        </div>
      </Reveal>
    </section>
  );
}
