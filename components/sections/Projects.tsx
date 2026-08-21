import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';

const meta = sections.find((s) => s.id === 'projects')!;

export default function Projects() {
  return (
    <section id="projects" data-screen-label="Projects" className="section section--tint">
      <Reveal className="wrap" style={{ maxWidth: 1120 }}>
        <div className="sec-head__title" style={{ marginBottom: 50 }}>
          <span className="eyebrow" style={{ color: meta.accent }}>
            {`PLANET ${meta.numeral} · ${meta.codename.toUpperCase()}`}
          </span>
          <h2 className="h-section">Projects</h2>
        </div>

        <div className="coming-soon glass">
          <span className="coming-soon__label" style={{ color: meta.accent }}>
            Coming Soon
          </span>
          <p className="coming-soon__text">
            New missions are being charted. Check back as our projects launch.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
