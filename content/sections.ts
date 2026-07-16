// ─────────────────────────────────────────────────────────────
// THE single source of truth for section order + planet config.
//
// Add / remove / reorder a section HERE and it propagates to:
//   • page.tsx     — must render sections in this same order
//   • Nav.tsx      — builds its links from this list
//   • CelestialGauge.tsx — one tick per entry
//   • SpaceBackground.tsx — derives its planet array from this list
//
// There is NO second hand-maintained planet array anywhere.
// ─────────────────────────────────────────────────────────────

export const SEP = 90; // world-space distance between adjacent planets along -Z

export type PlanetConfig = {
  color: number; // hex as 0x…
  size: number; // sphere radius
  xOffset: number; // horizontal placement so it reads beside the text, not over it
  yOffset: number; // base vertical placement (a small sine sway is added at runtime)
  ring?: boolean;
  ringColor?: number;
  earth?: boolean; // adds emissive + translucent atmosphere shell
};

export type SectionMeta = {
  id: string; // DOM id + anchor target
  label: string; // nav label
  numeral: string; // roman numeral shown in the "PLANET N · NAME" eyebrow
  codename: string; // planet name
  accent: string; // hex string used for the section eyebrow / accent text
  planet: PlanetConfig;
};

export const sections: SectionMeta[] = [
  {
    id: 'home',
    label: 'Home',
    numeral: 'I',
    codename: 'Aurelia',
    accent: '#d0a060',
    planet: { color: 0xd0a060, size: 6.5, xOffset: 0, yOffset: -1, ring: true, ringColor: 0xd8b98a },
  },
  {
    id: 'events',
    label: 'Events',
    numeral: 'II',
    codename: 'Nereus',
    accent: '#4a90e2',
    planet: { color: 0x4a90e2, size: 4.2, xOffset: 22, yOffset: 3 },
  },
  {
    id: 'gallery',
    label: 'Gallery',
    numeral: 'III',
    codename: 'Veil',
    accent: '#9b59b6',
    planet: { color: 0x9b59b6, size: 5.0, xOffset: -24, yOffset: -4 },
  },
  {
    id: 'projects',
    label: 'Projects',
    numeral: 'IV',
    codename: 'Rubicon',
    accent: '#c0603a',
    planet: { color: 0xc0603a, size: 4.6, xOffset: 24, yOffset: 5, ring: true, ringColor: 0x9c5638 },
  },
  {
    id: 'merch',
    label: 'Merch',
    numeral: 'V',
    codename: 'Halcyon',
    accent: '#2fa8a0',
    planet: { color: 0x2fa8a0, size: 4.0, xOffset: -22, yOffset: -3 },
  },
  {
    id: 'tools',
    label: 'Tools',
    numeral: 'VI',
    codename: 'Ferron',
    accent: '#8a8a92',
    planet: { color: 0x8a8a92, size: 3.6, xOffset: 20, yOffset: 4 },
  },
  {
    id: 'contact',
    label: 'Contact',
    numeral: 'VII',
    codename: 'Elara',
    accent: '#3fa86a',
    planet: { color: 0x3fa86a, size: 4.4, xOffset: -24, yOffset: -5 },
  },
  {
    id: 'about',
    label: 'About',
    numeral: 'VIII',
    codename: 'Terra',
    accent: '#4d8fff',
    planet: { color: 0x2a5fd0, size: 8.5, xOffset: 0, yOffset: -2, earth: true },
  },
];
