import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';
import tools from '@/content/tools.json';

const meta = sections.find((s) => s.id === 'tools')!;

export default function Tools() {
  return (
    <section id="tools" data-screen-label="Tools" className="section section--tint">
      <Reveal className="wrap" style={{ maxWidth: 1000 }}>
        <div className="sec-head__title" style={{ marginBottom: 50 }}>
          <span className="eyebrow" style={{ color: meta.accent }}>
            {`PLANET ${meta.numeral} · ${meta.codename.toUpperCase()}`}
          </span>
          <h2 className="h-section">Tools &amp; Materials</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {tools.map((t) => (
            <div key={t.name} className="spec">
              <div>
                <h3 className="spec__name">{t.name}</h3>
                <p className="spec__desc">{t.desc}</p>
              </div>
              <span className="spec__tag">{t.tag}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
