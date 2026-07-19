# Showcase design notes

## The shipped design: dark atmospheric terminal ("Terminal")

Adopted 2026-07-18, chosen from three parallel redesign lanes (quiet literary
editorial serif, dark atmospheric terminal, Swiss-grid modern-minimal).

- **Genre** atmospheric · **macrostructure** Component Playground · **theme**
  Terminal · **nav** N8 terminal command · **footer** Ft4 dense colophon.
- Cool slate paper `oklch(15% 0.014 235)` (tinted, never pure black), three
  lightness steps for elevation (no glow, no offset shadows), near-white ink,
  one phosphor-green accent `oklch(78% 0.16 152)`. A monospace stack leads
  (headings, labels, nav, buttons) and a system sans carries body prose.
- The interactive examples read as a component playground: preview blocks the
  reader can flip through, each one a small, real, working thing. Not a fake
  terminal window. No re-drawn chrome, no title-bar dots.
- The Written and Spoken before-after pairs separate visually. The After copy
  sits on a raised `paper-3` panel and its caption carries the phosphor
  accent, the same "cleaned output" signal the diff explorer uses, while the
  Before stays flat, dimmed, and struck through.
- Contrast script-verified (all body pairs at or above 6.6 to 1), slop test
  58 of 58, `pnpm build` passes.

The showcase has carried three visual systems: a warm-paper editorial design
("Canon"), a neo-brutalist poster ("Broadsheet"), and the current Terminal.
Content, messaging, section order, and every honesty guarantee survived each
redesign unchanged. Only the visual and interaction layer moved.

## Design-context gate

- **Audience.** Developers, writers, and editors evaluating an open-source
  Agent Skill. Technically literate, privacy-conscious, skeptical of hype.
- **Use case.** Demonstrate the product itself: show what default cleanup and
  a personalized voice actually do, and explain how it works. There is no
  hosted model and no text is sent anywhere. The one forward action is
  reading and copying the install command.
- **Tone.** Technical, restrained. The page has to practice what the skill
  preaches: no exclamation points, no manufactured contrast, no ornamental
  punctuation, plain verbs. If the showcase read like slop it would refute
  itself.

## Typography and assets

No web font and no third-party request. The page uses system font stacks
only, which keeps font transfer at zero and the page fully offline. All
imagery is inline SVG or CSS. No raster, no external asset.

## Interaction model and JS budget

Everything is legible and useful with JavaScript disabled.

- The three-state explorer and the before-after diff explorer are built with
  native `<input type="radio">` plus CSS `:checked` sibling selectors. No
  framework, no hydration, zero shipped JS for the core interaction.
- The word-level diff is computed at build time in the Astro component
  frontmatter (a small LCS word-diff in plain JS) and emitted as static
  marked-up HTML. No client-side diff library.
- Every component is native Astro markup. An earlier build rendered shadcn
  React components to static HTML. The Terminal redesign replaced them with
  hand-built markup, and the React integration and its dependencies were
  removed entirely.
- The only client script is a tiny vanilla clipboard handler for the install
  command's copy button, added progressively. The command is always visible
  and selectable without it.

## Markdown compiled at build time

Curated excerpts (voice-profile sample, realtime prompt) live as `.md` files
in `src/content/` and are compiled by Astro at build time. No client-side
Markdown parser is shipped. Rendered Markdown is styled by the project-owned
`src/styles/typeset.css`.

## Honesty of examples

Every example applies the committed rules to real facts.

- The default-cleanup before-after pairs are the verbatim slop input and the
  curated output for a product-update rewrite and a punctuation rewrite.
- The three-state release note frames its panels as levels of guardrail on
  the same release. All three panels are output. Panel one is a deliberate
  before, what an assistant writes with no help. Panel two cleans it strictly
  per the bundled defaults. Panel three restates the same facts in one
  illustrative sample voice and is labeled as such. The facts are identical
  across all three.
- The spoken example is a straight before-after: a numbered written list and
  the same content spoken naturally with the numbers removed, so a listener
  never hears them counted out.
- The onboarding section demonstrates personalization with detected traits
  sorted into kept voice versus set-aside subject matter, then one neutral
  sentence in the default and personalized voices. Both are labeled
  illustrative.
- The profile excerpt and the realtime prompt render the actual shipped
  files. No metric, testimonial, logo, or GitHub star count is invented
  anywhere on the page.

## Performance approach

- Astro static output, zero server runtime.
- System fonts, a single small CSS bundle, one tiny inline script.
- Lighthouse CI wired at `.github/workflows/lighthouse.yml` against the
  built `dist/`.
