# Page Shell Blueprint

## Target Files

- `components/shopify-winter2026/shopify-winter2026-page.tsx`
- `components/shopify-winter2026/shopify-winter2026.module.css`

## Structure

- Fixed topbar.
- Optional Editions dropdown.
- Optional Search overlay.
- Optional mobile menu overlay.
- Fixed desktop left rail.
- Full-screen hero.
- Twelve themed feature sections.

## Theme Tokens

- Black: `#050505`
- Ink: `#292919`
- Paper: `#dcdcce`
- Cream: `#f7f7ee`
- Muted grey: `#909083`
- Purple accent from source UI: `rgb(128, 81, 255)`

## Current Implementation Decisions

- The hero uses a cleaned screenshot background captured from the target page with original navigation/text hidden.
- Complex scene sections use captured reference images as low-opacity backdrops plus rebuilt cards.
- Product cards use authentic CDN images from the extracted asset manifest.
- The left rail is hidden on the hero and fades in after approximately 72% of one viewport height.

## Next Precision Pass

- Replace scene screenshots with separated image layers where feasible.
- Add section-specific scroll progress effects.
- Tighten spacing/typography against reference screenshots one section at a time.
