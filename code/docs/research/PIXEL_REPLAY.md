# Pixel Replay Notes

The root page is built as a dense visual replay of the live Shopify Winter 2026 page.

- Source URL: `https://www.shopify.com/fr/editions/winter2026`
- Desktop capture: 1440 x 900, one screenshot every 450px of source scroll.
- Mobile capture: 390 x 844, one screenshot every 422px of source scroll.
- Replay speed: each captured frame occupies one viewport of cloned-page scroll, making the replay move at about half the source scroll speed.
- Cookie banner: dismissed before capture so the page content is not permanently obscured.
- Manifest: `docs/research/shopify.com/replay-manifest.json`
- Public frames: `public/reference/replay-desktop/` and `public/reference/replay-mobile/`

This route prioritizes visual fidelity at captured states. The editable React reconstruction is kept at `/rebuild`.
