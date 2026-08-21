'use client';
const INSTAGRAM = 'https://www.instagram.com/astronomylnmiit/';
const LINKEDIN = 'https://in.linkedin.com/company/astronomy-club-lnmiit';

const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  alert('#Fourth Part Of Golden Disc "records"');
};

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__col">
          <span className="site-footer__heading">Explore</span>
          <nav className="site-footer__links">
            <a href="#home">Home</a>
            <a href="#events">Events</a>
            <a href="#gallery">Gallery</a>
            <a href="#about">Our Team</a>
            <a href="#contact">Contact</a>
            <a onClick={(e) => handleClick(e)} href="#about">About</a>
          </nav>
        </div>

        <div className="site-footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ASTRONOMY-logo.png" alt="Astronomy Club" className="site-footer__logo" />
          <span className="site-footer__name">Astronomy Club · LNMIIT</span>
        </div>

        <div className="site-footer__col site-footer__col--right">
          <span className="site-footer__heading">Follow Us</span>
          <div className="site-footer__icons">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.6 4.76 5.98V21H17v-5.3c0-1.26-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9V9Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="site-footer__bar">© 2026 Astronomy Club, LNMIIT · All rights reserved.</div>
    </footer>
  );
}
