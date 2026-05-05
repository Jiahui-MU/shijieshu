# Shopify Winter 2026 Clone

Standalone Next.js visual clone of `https://www.shopify.com/fr/editions/winter2026`.

The root route is the componentized interactive rebuild: fixed nav, editions menu, inline search, mobile menu, scroll-driven section state, Three.js outer/inner world hero, mouse parallax, and animated Sidekick/Retail/Developer scenes.

The dense pixel replay is kept at `/pixel-replay` as a visual calibration reference:

- Desktop: 124 frames at 1440 x 900.
- Mobile: 145 frames at 390 x 844.
- Playback advances at half the capture scroll speed, so intermediate content stays visible longer.
- The live cookie banner was dismissed before capture so it does not cover every replay frame.

The componentized React rebuild remains available at `/rebuild`.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Research Artifacts

- `docs/research/shopify.com/asset-manifest.json`
- `docs/research/shopify.com/section-map.json`
- `docs/research/shopify.com/replay-manifest.json`
- `docs/design-references/`
