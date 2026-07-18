# Redesign report — lane 2 (dark atmospheric terminal)

## Lane

Lane 2 of three parallel Hallmark redesigns of the `anti-slop-slop-canon` showcase
page. This folder (`site-redesign-2/`) is a standalone working copy of `site/`;
no other lane folder or the original `site/` was touched. No git commands were run.

## Picks

- **Genre:** atmospheric
- **Macrostructure:** Component Playground — the page's interactive examples
  (diff explorer, state explorer, two-modes diagram, voice-shift panel) are treated
  as preview-and-flip blocks, a real developer's component gallery rather than a
  marketing poster. Differs categorically from the prior stamp on this file
  (Poster/Manifesto).
- **Theme:** Terminal (catalog, atmospheric cluster) — cool slate paper
  `oklch(15% 0.014 235)`, three lightness steps for elevation (`paper` /
  `paper-2` / `paper-3`), near-white ink, one phosphor-green accent
  `oklch(78% 0.16 152)`. Never pure black.
- **Nav:** N8 Terminal command — the wordmark and links are formatted as a CLI
  prompt (`> anti-slop-slop-canon --install --source▮`); the blinking caret is
  used only here, per Hallmark's rule. This is real navigation markup, not a
  re-drawn terminal window — no title bar, no traffic-light dots.
- **Footer:** Ft4 Dense colophon — a single dense monospace block (`$ anti-slop-slop-canon`
  + labelled rows), replacing the four-column card-grid footer.
- **Diversification:** differs from the previous stamp on this file on all three
  axes — paper band (light → dark), display style (heavy-grotesque roman → mono),
  accent hue (warm acid-yellow → phosphor green).
- **Typography:** two families only — a system monospace stack leads (headings,
  labels, nav, buttons, code) and a system sans carries body prose. No web font
  request; the page stays fully self-contained/offline. All declared weights are
  400/500/700 — nothing above what the stacks can render (the previous file's
  weight-800-on-a-700-max-stack bug is not repeated).
- **Corner language:** one uniform small radius (`--radius-sm: 6px`, `--radius-md/lg`
  a touch larger for bigger panels), applied to every box on the page, including
  the inline SVG in `TwoModes.astro` (`rx="6"` — the rect radius now actually
  matches the system, instead of the previous mismatch).
- **Elevation:** lightness steps only (`paper` → `paper-2` → `paper-3`), no glow
  or hard-offset shadows anywhere. All hard-offset "brutalist" box-shadows from
  the source file were removed.
- **Motion:** the three named easings only; the nav caret blink is the only
  looping animation, and it has a `prefers-reduced-motion` fallback.

## Audit fixes applied

1. **Eyebrows removed entirely.** All seven sections dropped their `01`–`07`
   numeral + label; each section head is now just an `<h2>`. Zero eyebrows on
   the page (the hero's small "Open source" kicker is not a section eyebrow).
2. **Font weights corrected.** No `font-weight: 800` remains anywhere (verified
   by grep across the built output). Every heading declares 700, which both the
   mono and sans system stacks render natively.
3. **Section rhythm varied.** The Proof section (`#proof`) widens to a `70rem`
   column instead of the page's standard `60rem`; the Onboarding section
   (`#onboarding`) gets deliberately deeper `padding-block` (5.5rem vs. the
   default 3.75rem); the profile file-card in `#profile` bleeds `1rem` past the
   text column on each side, a genuine grid-break element.
4. **Curly apostrophes/quotes.** Fixed every straight quote in rendered copy:
   hero sub-line, the Written/Spoken "before" example, the realtime-prompt lead
   paragraph, `TellsRemoved`'s "What's left" label, and the quoted phrases inside
   `voice-profile.sample.md`. Deliberate "before" examples (the hype paragraphs
   that showcase bad em dash/semicolon/exclamation usage) were left untouched in
   substance — only apostrophe glyphs were normalized, not the punctuation being
   critiqued.
5. **Touch targets ≥ 44px.** Nav brand link, both nav flags, and every footer
   link are individually sized to a 44px minimum height (the footer links were
   restructured from one inline run-on paragraph into discrete flex items so
   each link gets its own padded hit target, with plain `·` separators kept
   outside the clickable area).
6. **Uniform corner language, including inline SVG.** `TwoModes.astro`'s rect
   `rx` now matches the page's `--radius-sm` (6), and the comment documents that
   the value is intentional, not a leftover mismatch.
7. **`theme-color` matches the paper token.** `Layout.astro`'s meta now reads
   `#060c10`, the exact sRGB conversion of `--color-paper`'s OKLCH value
   (`oklch(15% 0.014 235)`), verified with a script rather than eyeballed.
8. **Unused shadcn files deleted.** `src/components/ui/{alert,badge,button,card,separator}.tsx`
   were verified (grep across the whole tree) to be imported nowhere, then removed.
9. **Stale component comments updated.** `TwoModes.astro`, `VoiceShift.astro`,
   and `TellsRemoved.astro` no longer describe the old "warm-paper / ink-blue"
   Canon system — their doc comments now describe the Terminal system (dark
   slate cards, hairline rules, phosphor-green accent).

## Contrast

Computed WCAG ratios for every body-text pair (script-verified, not eyeballed):
ink/paper 16.5:1, ink-2/paper 8.0:1, ink/paper-2 15.4:1, ink-2/paper-2 7.5:1,
ink-2/paper-3 6.6:1, brand/paper 10.5:1, brand-ink/brand 10.5:1. All comfortably
clear the 4.5:1 body-text floor.

## Slop test

Ran the 58-gate sweep. Notable fixes made during the pass (not just a pass/fail
readout):

- Found and fixed one raw `oklch(...)` value inline in a component style
  (`.btn:hover`) that bypassed the token block — lifted into a new named token
  `--color-brand-hover` in `global.css` (gate 48).
- Found and fixed the hero's `padding-block` ratio (was 3.5rem/4rem ≈ 1.14×,
  under the 1.3× floor) — now 3rem/4.25rem ≈ 1.42× (gate 44).
- Added `white-space: nowrap` to the nav brand link and footer links as a
  defensive measure against two-line clickable text at narrow viewports (gate 49).
- Added explicit `:active` states to the primary/ghost buttons (gate 26).

Result: **58 / 58 pass** after the above fixes. Full detail of the gate-by-gate
reasoning (contrast math, nav/footer fingerprint check, mobile-collapse review,
etc.) was worked through inline during the build rather than reproduced in full
here.

## Visual verification

Built the project, served the static output, and captured browser screenshots
at 1440×900 (full page) and 375×812 (mobile nav + hero) — both confirmed against
the actual served URL (`http://localhost:4323/`, this project's own preview
port) before capture. Both render as intended: dark slate canvas, phosphor
accent used sparingly (nav caret, active tab, CTA, small chips), no eyebrows, no
horizontal overflow (`document.body.scrollWidth === window.innerWidth` at
375px). Note: the local browser automation is a **shared Chrome instance also
driven by a concurrent sibling lane's agent**, and the session twice drifted to
the other lane's tab/port between commands — I did not attempt a full
multi-viewport screenshot sweep after catching this, to avoid interfering with
the other lane's browser session. The two screenshots taken were verified
correct (URL checked immediately before and after capture) before I stopped.

## Changed files

- `src/styles/global.css` — full token/theme rewrite + Hallmark stamp
- `src/styles/typeset.css` — retint, weight fix (800→700), code/pre elevation via lightness
- `src/layouts/Layout.astro` — `theme-color`, `color-scheme`, favicon
- `src/pages/index.astro` — nav (N8) + footer (Ft4) rebuilt, all section eyebrows
  removed, section rhythm varied, curly-quote fixes, styles fully retinted
- `src/components/DiffExplorer.astro` — retint, radius, shadow removed
- `src/components/StateExplorer.astro` — retint, radius, shadow removed
- `src/components/CopyCommand.astro` — retint, radius
- `src/components/TellsRemoved.astro` — retint, radius, comment + apostrophe fix
- `src/components/TwoModes.astro` — retint, comment update, radius alignment note
- `src/components/VoiceShift.astro` — retint, radius, shadow removed, comment update
- `src/content/voice-profile.sample.md` — curly quotes
- `.hallmark/log.json` — created
- Deleted: `src/components/ui/alert.tsx`, `badge.tsx`, `button.tsx`, `card.tsx`, `separator.tsx`

## Build status

`pnpm build` succeeds (`astro build`, 1 page built, static output in `dist/`).

## Unresolved / disclosed gaps

- Spacing values are hand-picked rem values rather than drawn from a single
  named `--space-*` scale. This matches the original file's own convention
  (it never used a formal spacing scale either) — not a regression introduced
  by this redesign, but also not newly fixed. Would be a good follow-up if the
  three lanes get unified later.
- No automated Lighthouse/axe run was performed; verification was contrast math,
  grep-based gate checks, a build, and two confirmed screenshots (desktop full
  page + mobile nav/hero), not an exhaustive per-breakpoint visual sweep, for
  the browser-session reason noted above.
