'use client';
import Reveal from '@/components/Reveal';
import { sections } from '@/content/sections';
import team from '@/content/team.json';
import { useFragments } from '@/components/fragments/FragmentContext';

const meta = sections.find((s) => s.id === 'about')!;

export default function About() {
  const { collect } = useFragments();
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

        <div className="mentor">
          <span className="eyebrow" style={{ color: meta.accent }}>
            FACULTY MENTOR
          </span>
          <div className="glass team__card mentor__card">
            <div className="team__avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/FourthPart-records.jpg" alt="Prof. Anupam Singh" />
            </div>
            <div>
              <h4 className="team__name">Prof. Anupam Singh</h4>
              <p className="team__role">Faculty Mentor</p>
            </div>
            <p className="team__bio">
              With deep experience across astronomy and astrophysics, Prof. Anupam Singh guides the
              Astronomy Club as our faculty mentor — steering its scientific pursuits and inspiring
              every voyage into the cosmos.
            </p>
          </div>
        </div>

        <h3 className="team-label">Coordinators</h3>

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

       <div className="credits">
  <span className="eyebrow" style={{ color: meta.accent }}>
    DEVELOPED BY
  </span>
  <div className="credits__names">
    {[
      'Kshitij Verma',
      'Ayush Agarwal',
      'Achal Shrivastava',
      'Yuvika Jain',
      'Harsh Kumar',
      'Lakshit Patira',
    ].map((name) => (
      <span
        key={name}
        className="credits__name"
        title={name === 'Kshitij Verma' ? '⟟ the one who began it — knock twice' : undefined}
        style={name === 'Kshitij Verma' ? { cursor: 'help' } : undefined}
        onDoubleClick={
          name === 'Kshitij Verma'
            ? () => collect('second')
            : undefined
        }
      >
        {name}
      </span>
    ))}
  </div>
</div>
      </Reveal>
    </section>
  );
}
