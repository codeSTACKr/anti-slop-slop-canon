# anti-slop-slop-canon showcase

The one-page public site for the [anti-slop-slop-canon](../README.md) Agent
Skill. Static Astro, dark terminal design. Every example on the page is real
output from the project's own bundled rules.

## Commands

```sh
pnpm install
pnpm dev
pnpm build
```

## Constraints

- Self-contained: system fonts only, inline SVG and CSS only, no raster
  images, no network or third-party asset, no analytics.
- Usable with JavaScript disabled. The interactive explorers run on native
  radio inputs and CSS. The only client script is a small progressive
  clipboard handler for the install command.
- The page follows the writing canon it demonstrates.

Design decisions and their history are in [DESIGN-NOTES.md](DESIGN-NOTES.md).
