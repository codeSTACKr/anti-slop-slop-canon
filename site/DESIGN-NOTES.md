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
- The **three-state release note** now frames the three panels as levels of guardrail on
  the same v2.4 release, not as an input turning into output (the earlier version wrongly
  opened panel one with a `Write a release note:` instruction that never appears in real
  output). All three panels are output. Panel one, `No guardrails`, is a deliberate before:
  what an assistant writes with no help, so the AI tells (hype, an em dash, exclamation
  points, `here's the thing`) belong there. Panel two, `With our defaults`, cleans the same
  release strictly per `defaults.md`: no em/en dash, semicolon, exclamation point, or
  mid-sentence colon, no hype, no invented claim, defensible line by line. Panel three,
  `With your profile`, restates the same facts in one illustrative voice (clipped first
  person, dry understatement, a fixed `Ship it.` sign-off) and is labeled illustrative of a
  sample profile, not a real person's output. The facts are identical across all three
  (ships Thursday, `--watch` flag, cold start 4.2s to 1.8s, the Windows env-var bug fixed).
- The **spoken example** is now a straight before/after, parallel to the Written card, not
  a request. The `Written` side is a set of deploy steps as a real numbered `<ol>`; the
  `Read aloud` side is the same content spoken naturally with the numbers removed, so a
  listener never hears them counted out. The source line explains that list markers are
  dropped as a reader benefit. The read-aloud form obeys the canon (it is good spoken
  output).
- The **onboarding section** now demonstrates personalization instead of only listing the
  three first-use choices. `VoiceShift.astro` shows detected traits separated into stable
  voice versus set-aside subject matter and one-off quirks, then the same neutral sentence
  in the default and personalized voices. The traits and both sentences are labeled
  illustrative of one sample profile. The honest points are kept in the body copy (one
  question at a time, preview before saving, nothing retained by default), and the three
  first-use choices remain as a smaller secondary block below the demonstration. Rewriting
  that block also removed a stray semicolon the earlier copy had, so the section obeys the
  canon it describes.
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

- **`TellsRemoved.astro`** — the hero mark (it replaced `ResolutionFlow.astro`, which was
  deleted with the stepper concept). A designed typographic panel that names the writing
  habits the skill removes, each specimen shown as a `<del>` with a real line-through, and
  resolves to a single accented line, `your point, in your own voice.` The strike is a
  real line, not color alone, and each specimen carries a visually hidden `removed:` prefix
  so assistive tech reads "removed game-changer" without seeing the strike. The list has
  its own group label. The punctuation tells are named in words (`the em dash`, `the
  semicolon`, `exclamation points`) rather than shown as glyphs, so no forbidden character
  appears on the page. Pure HTML + CSS.
- **`VoiceShift.astro`** — the onboarding demonstration. Two static steps: detected voice
  traits sorted into `Kept as your voice` versus set-aside subject matter and one-off
  quirks, then the same neutral sentence rendered in the default voice and the personalized
  voice so the tone shift is visible. The `Kept` lane and the `Your voice` panel carry the
  ink-blue accent; the connector is a CSS-drawn chevron (rotated border corner) that points
  down when stacked and right at 46rem. Pure HTML + CSS, legible with JS off. The traits are
  labeled illustrative of one sample profile, not a real person's writing.
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
