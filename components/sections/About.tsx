import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';
import team from '@/content/team.json';

const meta = sections.find((s) => s.id === 'about')!;

export default function About() {
  return (
    <section
      id="about"
      data-screen-label="About"
      className="section section--tint"
      style={{ padding: '140px 20px 100px' }}
    >
      <Reveal className="wrap" style={{ maxWidth: 1120 }}>
        <div className="about-head">
          <span className="eyebrow" style={{ color: meta.accent }}>
            {`PLANET ${meta.numeral} · ${meta.codename.toUpperCase()}`}
          </span>
          <h2 className="h-section">About the Crew</h2>
          <p className="about-head__lead">
            Astronomy Club is LNMIIT&rsquo;s astronomy collective — part scientific frontier, part reverence for the
            dark. Four coordinators steer the voyage.
          </p>
        </div>

        <div className="team">
          {team.map((m) => (
            <div key={m.name} className="glass team__card">
              <div className="team__avatar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.photo} alt={m.name} />
              </div>
              <div>
                <h4 className="team__name">{m.name}</h4>
                <p className="team__role">{m.role}</p>
              </div>
              <p className="team__bio">{m.bio}</p>
            </div>
          ))}
        </div>

        <footer className="footer">
          <span className="footer__brand">ASTRONOMY CLUB</span>
          <span className="footer__meta">© 2026 · Astronomy Club</span>
        </footer>
      </Reveal>
    </section>
  );
}
