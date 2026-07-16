import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';
import projects from '@/content/projects.json';

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

        <div className="grid-cards grid-cards--3">
          {projects.map((p) => (
            <div key={p.title} className="glass card">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.title} />
              ) : (
                <div className="ph card__media">{p.placeholder}</div>
              )}
              <div className="card__body">
                <span className="card__tag" style={{ color: meta.accent }}>
                  {p.tag}
                </span>
                <h3 className="card__title">{p.title}</h3>
                <p className="card__desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
