# Showcase design notes

This file records the design and engineering decisions made autonomously while
building the `anti-slop-slop-canon` public showcase (build-plan Phase 8). Wherever
Hallmark or a CLI would normally ask a human, a default was chosen here and recorded
below, and the build kept going.

## Hallmark design-context gate (answered by inference)

- **Audience** — developers, writers, and editors evaluating an open-source Agent
  Skill. Technically literate, privacy-conscious, skeptical of hype (the product's
  whole premise is removing hype).
- **Use case** — demonstrate the product itself: show what default cleanup and a
  personalized voice actually do, and explain how it works. There is no hosted model
  and no text is sent anywhere. The one forward action is reading and copying the
  install command, framed honestly as pre-release.
- **Tone** — technical / editorial, restrained. The page has to *practice* what the
  skill preaches: no exclamation points, no manufactured contrast, no ornamental
  punctuation, plain verbs. If the showcase read like slop it would refute itself.

## Hallmark structural picks

- **Genre** — editorial (the silent default; correct for a writing/typography tool).
- **Macrostructure** — 02 Long Document. The page reads like a well-set document
  about the product, which is itself a demonstration of the output the skill produces.
  Section heads emerge from the flow; hairlines and negative space are the dividers.
- **Nav** — masthead-lite (editorial N6 register, trimmed for a single page): wordmark
  + status + in-page anchor links.
- **Footer** — Ft4 dense colophon (repository links + honest status), newsprint voice.
- **Theme** — "Canon", a catalog-spirit editorial theme constructed for the brief
  (light warm-paper band · roman/system-serif display · cool ink-blue accent used
  under 5% of any viewport). Diversification rule: first Hallmark run in this project,
  no prior stamp, no constraint.
- **Enrichment** — originally none (typography only). Two hairline diagrams were added
  later at the owner's request; see the Graphics section below. Still no invented
  screenshots, no stock imagery, no fabricated metrics.
- **shadcn visual preset** — `radix-nova` base selected at `shadcn init` (base `radix`,
  preset `nova`), then re-skinned to the Canon palette. The preset is the starting
  primitive set, not the design, per the plan.

## Typography (no external network requests)

Google Fonts / Fontsource would be a third-party or bundled-font request. The install
`shadcn init` pulled in `@fontsource-variable/geist`; that import was removed. The page
uses **system font stacks only** (serif for display + prose, sans for UI labels, mono
for code and diffs). This keeps font transfer at zero, keeps the page fully offline,
and matches the editorial "not Inter/Geist" guidance while respecting the hard perf and
privacy budgets. Trade-off recorded: we give up a bespoke display face to protect the
< 300 KB / no-third-party-request budget. This is the right call for this product.

## Interaction model — JS budget

Everything is legible and useful with JavaScript disabled.

- **Three-state explorer** (generic input / default cleanup / personalized output) and
  the **before/after diff explorer** are built with native `<input type="radio">` +
  CSS `:checked` sibling selectors. No framework, no hydration, zero shipped JS for
  the core interaction.
- The **word-level diff** is computed at **build time** in the Astro component
  frontmatter (a small LCS word-diff in plain JS) and emitted as static marked-up HTML.
  No client-side diff library, no client Markdown parser.
- **shadcn React components** (Button, Badge, Card, Separator, Alert) are rendered to
  static HTML by Astro's React integration with **no `client:*` directive**, so they
  ship as HTML with no React runtime.
- The only client script is a tiny (~0.4 KB) vanilla clipboard handler for the install
  command's copy button, added progressively — the command is always visible and
  selectable without it. **No React island was needed**, so none was added; if one had
  been, it would be justified here. The interaction did not materially improve with
  hydration, so per the plan we stayed with native controls.

## Markdown compiled at build time

Curated excerpts (voice-profile template, defaults rules, realtime prompt) live as
`.md` files in `src/content/` and are compiled by Astro at build time via glob import.
No client-side Markdown parser is shipped. Rendered Markdown is styled by the owned
`src/styles/typeset.css` (the `shadcn/typeset` role), which sets context-specific size,
leading, and flow variables for profile and rules excerpts.

## Honesty of examples

Every example applies the committed rules to real facts. Raw fixture filenames were
removed from the reading flow (owner feedback): citations are now phrased for a human
("the bundled defaults", "a voice-agent reply"), while the profile / rules / realtime
excerpts keep their short `From ...template.md` / `defaults.md` captions because those
cards render the actual shipped files.

- The **default-cleanup before/after** pairs are the verbatim slop input and the curated
  output for a product-update rewrite and a punctuation rewrite (the latter is the
  `Short examples` line in the bundled `defaults.md`).
- The **three-state release note** (input / default / personalized) replaces the earlier
  walnut/maker example so the demo lands with a developer and content-creator audience.
  The input is plain facts (a v2.4 release note). The default panel cleans those exact
  facts strictly per `defaults.md`: no em/en dash, semicolon, exclamation point, or
  mid-sentence colon, no hype, no invented claim. The personalized panel restates the
  same facts in one illustrative voice (clipped first person, dry understatement, a fixed
  `Ship it.` sign-off) and is labeled as illustrative of a sample profile, not a real
  person's output. No fact, number, date, or claim is added in any panel.
- The **spoken example** is a transit voice-agent reply: the delay is stated before the
  ticket alternative, every route and time is preserved, and nothing relies on visual
  notation.
- The **profile excerpt** is the committed `assets/voice-profile.template.md` schema.
- The **realtime prompt** is the committed `assets/realtime-voice-prompt.md` verbatim.

The pre-release framing was removed entirely (owner feedback): no hero or install
caveat, no masthead badge, no footer pre-release line. The install commands stayed as
they are. No metric, testimonial, logo, or benefit was invented. No arbitrary-text input
box, account, analytics, or third-party script appears on the page.

## Copy audit (owner feedback)

Every line was reviewed and any copy about the page's own plumbing was cut, since a
reader cares about what they get, not how the page renders:

- Removed the hero claim about hosted models and text never leaving the page. Kept one
  short credibility line: the examples are real output from the project's own rules.
- Removed "The diff is computed at build time and needs no JavaScript to read."
- Removed raw fixture paths from the body copy; kept human-phrased credibility signals.
- Trimmed the footer column to `MIT licensed` + a source link (dropped the no-trackers,
  no-text-leaves-the-page, and pre-release lines); renamed it `License`.
- Fixed one em dash in the page `<title>` to the middle-dot separator the page already
  uses, so the showcase does not violate its own canon.

## Graphics (owner feedback)

The page was all typography. Two diagrams were added, built to fit the Canon system
(warm paper, system serif, ink-blue accent under 5% of the viewport) and to hold the
hard budgets: inline SVG or CSS only, no raster, no external or network asset, no web
font, no client JavaScript, and fully legible with JS off. Both reference Canon tokens
by name (`var(--color-rule)`, `var(--color-primary)`, `var(--font-ui)`); no raw colour
or font value is inlined.

- **`ResolutionFlow.astro`** — a hairline stepper in the hero (it fills the space left
  by the removed pre-release alert). Four nodes, `Active scope → One bundle → Written or
  spoken → Clean output`, connected by CSS-drawn chevrons (rotated border corners, no
  image). It stacks vertically on mobile and becomes a row at 46rem; the chevrons rotate
  from down to right with the layout. The ink-blue accent appears only on the final node
  and the chevrons.
- **`TwoModes.astro`** — a compact "one profile, two modes" mark in the Written & spoken
  section. One `Profile` node branches through orthogonal hairline connectors to a
  `Written` node and a `Spoken` node. Pure inline SVG; text uses the system UI stack via
  the font token; the SVG carries `role="img"` and an `aria-label` so the meaning
  survives without sight of the mark. It scales fluidly and needs no JavaScript.

Both are decorative-but-labeled and add negligible transfer (inline markup + a few CSS
rules). The performance budget below is unchanged.

## Performance approach

- Astro static output, zero server runtime.
- System fonts (no font transfer), single small CSS bundle, one tiny inline script.
- shadcn components rendered to HTML, not hydrated.
- Lighthouse CI wired at `.github/workflows/lighthouse.yml` against the built `dist/`.

See the end of this build's report for which budgets were verified locally versus which
still need a real mobile Lighthouse run.
