---
name: Celestial Immersion
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c7c5cc'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#919096'
  outline-variant: '#46464c'
  surface-tint: '#c5c5d4'
  primary: '#c5c5d4'
  on-primary: '#2e303b'
  primary-container: '#0b0d17'
  on-primary-container: '#797a87'
  inverse-primary: '#5c5e6a'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#c3c6d4'
  on-tertiary: '#2c303b'
  tertiary-container: '#090d17'
  on-tertiary-container: '#777a87'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e1f0'
  primary-fixed-dim: '#c5c5d4'
  on-primary-fixed: '#191b26'
  on-primary-fixed-variant: '#444652'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#dfe2f0'
  tertiary-fixed-dim: '#c3c6d4'
  on-tertiary-fixed: '#171b26'
  on-tertiary-fixed-variant: '#434752'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 60px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The brand personality is awe-inspiring, scholarly, and ethereal. It is designed for an astronomy club that views the cosmos as both a scientific frontier and a source of profound beauty. The UI should evoke a sense of weightlessness and vastness, making the user feel as though they are navigating through a star-charting interface.

The design style is **Glassmorphism mixed with High-Contrast Editorial**. By utilizing translucent layers and deep background blurs, the interface mimics the layered depth of gaseous nebulae. Subtle, soft-glowing edges on containers suggest light reflecting off telescope optics or distant stellar events.

## Colors
The palette is rooted in the depth of the night sky.
- **Primary (#0B0D17):** A "Deep Space" midnight blue used for the base canvas and deep structural elements.
- **Secondary (#8B5CF6):** A "Nebula Purple" used for interactive highlights, active states, and radiant accents.
- **Tertiary (#C2C5D3):** "Cosmic Silver" for secondary text and borders, providing a metallic, instrumentation-like feel.
- **Surface:** Surfaces are derived from the Primary color at 40-60% opacity with a 20px backdrop blur.
- **Accents:** Use Brilliant White (#FFFFFF) for high-priority information and primary typography to ensure maximum legibility against the dark void.

## Typography
The typography system balances classical elegance with technical precision. 
- **Headlines:** Use **Playfair Display**. It provides a sophisticated, editorial feel reminiscent of star catalogs and historical astronomical journals. Large titles should use tighter letter spacing to maintain a commanding presence.
- **Body:** Use **Inter**. Its neutral, systematic nature ensures high legibility against complex, blurred backgrounds.
- **Labels/Data:** Use **Geist**. This monospaced-adjacent sans-serif is used for coordinates, dates, and technical metadata, evoking the feel of modern astronomical software.

## Layout & Spacing
The layout philosophy centers on **Vastness**. Content is placed within a 12-column fluid grid, but with generous margins to allow the background celestial imagery to "breathe."

- **Desktop:** 12 columns, 24px gutters, 64px side margins. Large sections of whitespace are encouraged between thematic content blocks to prevent visual clutter.
- **Tablet:** 8 columns, 16px gutters, 40px side margins.
- **Mobile:** 4 columns, 16px gutters, 20px side margins.

Vertical rhythm is strictly based on 8px increments. Components should utilize internal padding of 16px (2 units) or 24px (3 units) to maintain a spacious, premium feel.

## Elevation & Depth
Depth is achieved through **Optical Layering** rather than traditional shadows.
- **Level 1 (Base):** Deep Space Blue solid background.
- **Level 2 (Containers):** Semi-transparent (40% opacity) surfaces with a `backdrop-filter: blur(24px)`. Borders are 1px thick, using a linear gradient of Cosmic Silver at 20% opacity to 50% opacity to simulate light hitting an edge.
- **Level 3 (Popovers/Modals):** Higher opacity (70%) with a subtle outer glow using the Secondary Nebula Purple at 10% opacity.
- **Interaction:** On hover, elements should increase their border opacity and slightly brighten the background blur, creating a "shimmer" effect.

## Shapes
The shape language is **Refined and Geometric**. 
- Standard components (Cards, Input Fields) use a **0.5rem (8px)** corner radius to feel modern but structured.
- Interactive elements like buttons and "Quick Action" chips use **1.5rem (24px)** or full pill-shaping to distinguish them from informational containers.
- Decorative elements, such as star-map markers, should use perfect circles.

## Components
- **Buttons:** Primary buttons feature a subtle gradient from Nebula Purple to a slightly darker shade, with a white label. Secondary buttons are "Ghost" style with a thin Silver border and a backdrop blur.
- **Cards:** Use the Glassmorphism specification from Elevation & Depth. Titles within cards should always use Playfair Display.
- **Inputs:** Dark, recessed backgrounds (5% opacity white) with a 1px bottom-border that glows Nebula Purple when focused.
- **Chips/Badges:** Small, pill-shaped elements with a low-opacity Nebula Purple fill and high-contrast Silver text for technical tags like "Galaxy," "Nebula," or "Magnitude."
- **Lists:** Clean, borderless rows separated by a faint 1px Silver line at 10% opacity. Icons used in lists should be thin-stroke (1px) to maintain the sophisticated aesthetic.
- **Celestial Navigation:** A custom component—a vertical "timeline" or "altitude" gauge on the right side of the screen to help users navigate long-form astronomical data.