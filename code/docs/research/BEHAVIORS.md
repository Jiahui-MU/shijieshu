# Shopify Winter 2026 Behavior Audit

## Captured Interactions

- Top `Editions` button opens a compact editions menu with prior edition links.
- Top `Rechercher` button opens a full-screen search overlay.
- Mobile `Menu` button opens a full-screen section menu.
- Left rail highlights the visible section through `IntersectionObserver`.
- Top bar and left rail switch between dark and light color themes by active section.
- Card hover lifts the card and subtly zooms media.
- CTA pills use a compact rounded rectangle with an arrow glyph.

## Original Site Behaviors Observed

- Hero is driven by a WebGL/canvas composition and SVG “Da Vinci” line overlays.
- Hero title and section list sit inside a thin white rectangular frame.
- Scrolling past the hero reveals a fixed left rail with roman numerals.
- Some sections change `data-sidebar-theme` to light, making navigation grey/black.
- Sidekick contains delayed/layered prompt cards and small looping videos.
- Retail contains a large POS hardware scene with architecture background and floating hardware.
- Multiple card grids include lazy-loaded images and video poster thumbnails.
- Mobile collapses the navigation into a menu while preserving the hero section list.

## Interactive Rebuild Status

- Root route now uses the componentized rebuild, not the screenshot replay.
- Dense screenshot replay moved to `/pixel-replay` for visual calibration.
- Hero uses a Three.js sticky stage: the outer Renaissance image is a shader plane that melts away as scroll reveals an inner 3D world.
- Sidekick, Retail, and Developer use Three.js scene variants with animated portals, panels, particles, and mouse-driven camera parallax.
- Search behaves as an inline nav search with live result filtering.
- Editions and mobile menus are interactive states with dismiss-on-Escape.

## Remaining Gap

- The original proprietary WebGL scene and private font files are not copied.
- Some product media still uses representative Shopify CDN assets instead of every original video state.
- Modal/video playback controls are not fully rebuilt yet.

## Current Verification

- `npm run lint` passes.
- `npm run build` passes.
- Desktop viewport checked at `1440x900`.
- Mobile viewport checked at `390x844`.
- Horizontal overflow check on mobile returned `false`.
