# Image asset plan

The homepage is currently built with hand-picked Unsplash images so the layout and pacing can be reviewed in real context. Every `<Image>` uses the global `.editorial-img` treatment (saturate 0.85 · contrast 1.05 · brightness 1.02) so that when commissioned photography arrives, the replacement photos inherit the same quiet, warm, slightly desaturated register without component changes.

All images are loaded through `next/image` with responsive `sizes` and `quality` props; no external host other than `images.unsplash.com` is whitelisted in `next.config.ts`.

## Active homepage slots

| Component | Path / URL | Aspect | Role | Subject brief |
|---|---|---|---|---|
| `Hero.tsx` | `unsplash photo-1616594039964-ae9021a400a0` | 16:9 | Background (priority) | Amsterdam-feeling interior, golden-hour light, minimal, no people. |
| `HowItWorks.tsx` | `unsplash photo-1600210492486-724fe5c67fb0` | 16:9 | Editorial banner above the 3-step grid | Sunlit living-room feel, warm daylight, calm. |
| `Services.tsx` — Recurring | `unsplash photo-1600585154340-be6161a56a0c` | 4:3 → fills panel | Service card (featured) | Tidy, lived-in Amsterdam living room. |
| `Services.tsx` — One-off | `unsplash photo-1556909114-f6e7ad7d3136` | 4:3 → fills panel | Service card | Sunlit kitchen counter mid-reset, morning light. |
| `Services.tsx` — Deep clean | `unsplash photo-1581578731548-c64695cc6952` | 4:3 → fills panel | Service card | Bathroom detail / tile / morning light. |

## Photography direction (for the commissioned shoot)

- Real Amsterdam apartments
- Soft natural light, warm tones
- Quiet domestic detail — single plant, folded throw, coffee cup on a counter
- Organic cleaning products can appear as still-life on a shelf; no one holding a spray bottle
- No stock-photo smiles, no uniforms, no sparkle-clean imagery
- No posed cleaners, no generic hotel interiors

## Swap order (recommended when commissioning)

Replace in this order — biggest visual impact first, smallest last:

1. **Hero** (`hero.jpg`, 16:9) — sets the entire site's visual register.
2. **Recurring** service card — the featured card; the commercial goal.
3. **Deep clean** service card — the detail shot carries a lot of texture weight and is the most stock-looking of the three.
4. **One-off** service card — the mid-reset frame is the easiest to find a strong licensed version of, so lowest priority.
5. **HowItWorks** banner — least visible brand signal; can stay on Unsplash longest.

## Swap procedure

1. Drop final JPG(s) at `public/images/{name}.jpg`.
2. In the relevant component, replace the Unsplash URL with the local path.
3. Leave the `.editorial-img` class on the `<Image>` — the warm / desaturated filter applies to real photos too.
4. Remove `images.unsplash.com` from `next.config.ts` `remotePatterns` once no Unsplash URLs remain in the tree.
