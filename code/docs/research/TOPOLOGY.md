# Shopify Winter 2026 Topology

Target: `https://www.shopify.com/fr/editions/winter2026`

Extraction pace used for the current pass: viewport `1440x900`, smooth scroll to each section anchor, approximately 2.6 seconds settle time before capture.

## Global Shell

- Fixed top navigation at 50px height.
- First viewport is a full-screen Renaissance image/canvas composition.
- Desktop content uses a fixed left rail after leaving the hero.
- The left rail changes color by section theme: white on dark scenes, grey/black on light scenes.
- Primary page rhythm alternates dark theatrical image scenes and warm paper sections.
- Most section content is scroll-driven, not click-driven.

## Main Sections

| Order | ID | Theme | Extracted height | Interaction model | Current implementation |
|---|---|---|---:|---|---|
| Hero | `hero` | dark | 1350px intro area | time/scroll visual composition | rebuilt with cleaned static hero background and framed nav |
| I | `sidekick` | light | 8844px | scroll-driven product story, video/card layers | representative scene + feature cards |
| II | `agentic` | dark | 2735px | static/video story | split cards with authentic assets |
| III | `online` | light | 6075px | card grid + long list | feature card grid |
| IV | `retail` | dark | 8259px | large immersive POS Hub scene | scene backdrop + retail cards |
| V | `marketing` | light | 4229px | video/card grid | feature cards |
| VI | `checkout` | dark | 2207px | compact product cards | feature cards |
| VII | `operations` | light | 3108px | card grid | feature cards |
| VIII | `shop-app` | dark | 2456px | card grid | feature cards |
| IX | `b2b` | light | 3043px | card grid | feature cards |
| X | `finance` | dark | 2542px | card grid | feature cards |
| XI | `shipping` | light | 2327px | card grid | feature cards |
| XII | `developer` | light | 8886px | long developer story, several media cards | scene backdrop + feature cards |

## Fidelity Notes

- The current build is a full-page first pass, not pixel-perfect.
- The target’s hardest parts are the hero canvas, Sidekick prompt field, Retail POS Hub scene, and Developer section scroll states.
- Local route is `/` in this standalone repo.
- Reference files live in `docs/design-references/`.
- Raw extraction lives in `docs/research/shopify.com/`.
