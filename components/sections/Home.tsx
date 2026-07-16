import Reveal from '@/components/Reveal';

export default function Home() {
  return (
    <section id="home" data-screen-label="Home" className="section section--center">
      <Reveal className="hero">
        <span className="eyebrow hero__eyebrow">LNMIIT</span>
        <h1 className="h-display hero__title">Astronomy Club</h1>
        <p className="hero__sub">&ldquo;Where calculation meets the infinite wonder of the dark.&rdquo;</p>
        <button type="button" className="btn-pill hero__cta">
          Begin the Voyage
        </button>
      </Reveal>

      <div className="hero__hint">
        <span className="eyebrow" style={{ fontSize: 10, letterSpacing: '0.25em' }}>
          Scroll to ascend
        </span>
        <span className="material-symbols-outlined" style={{ animation: 'bounceDown 1.8s ease-in-out infinite' }}>
          expand_more
        </span>
      </div>
    </section>
  );
}
