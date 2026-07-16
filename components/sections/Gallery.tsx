import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';
import gallery from '@/content/gallery.json';

const meta = sections.find((s) => s.id === 'gallery')!;

export default function Gallery() {
  return (
    <section id="gallery" data-screen-label="Gallery" className="section">
      <Reveal className="wrap" style={{ maxWidth: 1120 }}>
        <div className="sec-head__title" style={{ marginBottom: 50 }}>
          <span className="eyebrow" style={{ color: meta.accent }}>
            {`PLANET ${meta.numeral} · ${meta.codename.toUpperCase()}`}
          </span>
          <h2 className="h-section">Gallery</h2>
        </div>

        <div className="masonry">
          {gallery.map((g, i) => (
            <div key={i} className="glass masonry__item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt={g.alt} />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
