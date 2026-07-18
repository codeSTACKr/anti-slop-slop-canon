# Showcase design notes

## ADOPTED — dark atmospheric terminal ("Terminal"), 2026-07-18

This is the shipped design, chosen from three parallel Hallmark redesign lanes
(quiet literary editorial serif / dark atmospheric terminal / Swiss-grid
modern-minimal). It supersedes the Broadsheet poster documented below; the
sections beneath this one are kept as history. Full lane details, contrast
math, and the changed-file list are in `REDESIGN-REPORT.md`.

- **Genre** atmospheric · **macrostructure** Component Playground · **theme**
  Terminal (catalog, atmospheric cluster) · **nav** N8 terminal command ·
  **footer** Ft4 dense colophon.
- Cool slate paper `oklch(15% 0.014 235)` (tinted, never pure black), three
  lightness steps for elevation (no glow, no offset shadows), near-white ink,
  one phosphor-green accent `oklch(78% 0.16 152)`. A monospace stack leads
  (headings, labels, nav, buttons); a system sans carries body prose. System
  font stacks only — no web fonts, the page stays fully offline.
- All nine fixes from the Broadsheet audit are applied: zero section eyebrows,
  only real font weights (max 700), varied section rhythm, curly apostrophes,
  ≥ 44px touch targets, uniform 6px corner language including the TwoModes SVG,
  `theme-color` matched to the paper token, unused shadcn ui components
  deleted, stale component comments rewritten.
- Owner feedback applied after selection: the Written / Spoken before-after
  pairs now separate visually. The After copy sits on a raised `paper-3` panel
  and its caption carries the phosphor accent — the same "cleaned output"
  signal the diff explorer uses — while the Before stays flat, dimmed, and
  struck through.
- Contrast script-verified (all body pairs ≥ 6.6:1) · slop test 58/58 ·
  `pnpm build` passes.

## Superseded — Site-3 redesign — Neo-brutalist editorial poster ("Broadsheet")

Site-3 is one of three parallel redesigns of the showcase. Its assigned lane is a
neo-brutalist editorial poster: massive display type at poster scale, stark ink-on-paper
contrast, thick hard rules, hard-edged borders, hard offset shadows, inverted dark blocks,
oversized numerals, and one loud saturated accent used with confidence. It is meant to look
clearly different from the current warm-paper editorial site and from the other two lanes
(Swiss-grid minimalism and a monospace terminal). All content, messaging, and every section
from the current site are preserved verbatim; only the visual and interaction layer changed.

### Style direction

- **Theme "Broadsheet" (custom, brutalist register).** Near-white paper
  `oklch(0.973 0.006 100)` and near-black ink `oklch(0.185 0.009 95)` (neither pure white nor
  pure black, both faintly tinted, so the neutrals never read flat). Every neutral is tinted
  toward the warm anchor hue (~95, in the paper/accent family): there is no blue or purple
  hue anywhere on the page. ONE loud accent, an acid-yellow `oklch(0.875 0.195 103)` at hue
  ~103 that shares nothing with the current site's ink-blue and amber. The accent is used
  with confidence but disciplined: it appears only as a background block with ink text
  (highlights, tags, chips, active-tab fills, the footer accent bar) or as text on ink
  surfaces. It is never yellow text on paper (1.33:1, unreadable), so accent footprint stays
  well under 5% of any viewport.
- **Hard edges everywhere.** `--radius` and all derived radii are `0`. Borders are 2-3px
  solid ink; section dividers are 3-5px. The brutalist signature is the hard OFFSET shadow
  (`4-7px 4-7px 0 0` ink, no blur, no spread) on cards, buttons, and the hero mark.
- **Type at poster scale.** System fonts only, no web fonts: a heavy grotesque
  (Helvetica Neue / Helvetica / Arial) for display AND body at weight 800, uppercase with
  tight tracking on headlines, plus a mono stack for labels, numerals captions, and code.
  Two families total. The hero headline runs `clamp(3.1rem, 13vw, 8.5rem)`; the footer
  restates "Sound like yourself." as a giant statement. All-caps display heads sit at
  `line-height >= 1.0` to avoid cap-collision on wrap.
- **Oversized outlined numerals.** Each section (01-07) opens with a huge outlined numeral
  (`-webkit-text-stroke`, transparent fill), a mono section label, and a heavy uppercase
  title, stacked in a single column (never the banned tag-left / heading-right pattern).
- **Light bodies, dark bars only.** Content bodies sit on light paper for readability. Dark
  ink is used only on small card HEADERS / title bars, sparingly: the voice-profile file bar,
  the realtime-module title bar, plus the command chips and the ink buttons/active-tab fills
  (code and control affordances). There are no full-bleed dark content slabs. (An earlier
  cut used an inverted guardrail section and a dark footer and realtime body; those were
  converted to light bodies per owner feedback.)
- **Nav N7 (brutal slab):** heavy wordmark, thick 5px bottom rule, hard-edged "Star on
  GitHub" slab button with an offset shadow (no invented star count, no network fetch).
  **Footer Ft7 (brutal statement)** on a light body, with a heavy top rule and one small
  brand accent bar.

### What was reskinned, not rebuilt

The interaction model and honesty guarantees are unchanged from the current site. Every
component (DiffExplorer, StateExplorer, CopyCommand, TellsRemoved, TwoModes, VoiceShift)
keeps its markup, its build-time word-diff, and its native-radio `:checked` CSS mechanism
(zero shipped framework JS); only their visual styling moved to the brutalist system. The
shadcn Card / Separator / Button usages in the page were replaced with hard-edged native
markup so the aesthetic is fully controlled; the Tailwind + shadcn base imports remain for
the token plumbing. Every colour and font references a named token; the only raw values live
in the `:root` token block of `global.css`.

### Owner feedback round (applied)

1. Hero lede now ends "One profile for written and spoken content."
2. The habits-removed panel lists 10 tells (added "in conclusion", a canned closer from
   the bundled defaults). The count label reads 10.
3. Removed all purple/blue hue: neutrals retinted from hue 264 to the warm ~95 family.
   Card and panel bodies are light. Dark ink is limited to small card headers / title bars
   (voice-profile bar, realtime title bar) plus code and control affordances. The inverted
   guardrail section, the dark realtime card body, and the dark footer were converted to
   light bodies.
4. The Spoken card is now a Before / After pair parallel to the Written card: the "before"
   is the written numbered list with the number markers struck through (real strikethrough,
   with a visually hidden "removed:" prefix for assistive tech), and the "after" is the
   flowing read-aloud sentence. Order preserved, numbers dropped for speech.
5. The guardrails section was reframed to be about the skill, not a mechanical narration of
   three panels: eyebrow "Guardrails", heading "From a raw draft to your own voice", and a
   lead that describes what the defaults and a profile do. The three panels and their tab
   labels are unchanged.
6. The realtime voice module now reads as a considered block: a light body with a comfortable
   measure, roomy leading, and a hairline rule between each instruction (no longer a dense
   paragraph wall).
7. The two install cards were combined into one card holding both scopes, each as a labeled
   row (Global / Project) with its scope note and copy button. The supported-hosts note and
   the detector-evasion boundary line are retained.

### Constraints held

Self-contained: system fonts only, inline SVG/CSS only, no raster, no external or network
asset, static Astro output. Shipped JS to the browser is only the tiny inline clipboard
handler (the page is fully usable with JS off). Contrast verified (all body pairs >= 7.3:1;
gates 40-41 pass). No fabricated metrics, no invented GitHub star count. Slop test: the
58-gate sweep passed after fixing hero fold padding, the hero measure, two all-caps
line-heights, and lifting two stray inline colours into named tokens.

---

## Original build notes (current warm-editorial "Canon" design)

The notes below document the ORIGINAL showcase build and are kept for reference. The
site-3 redesign above supersedes the visual direction; the content and engineering
decisions still describe the shared substrate.

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

## Hallmark design elevation pass

A later visual pass raised the craft of the page without touching the approved copy,
content, examples, section order, or any prior product decision. It took inspiration
from the sibling Hallmark product site (the anti-slop skill for design) for energy and
structure only, and copied none of its typeface, colours, layout, focal graphic, or
wording. The Canon system (warm paper, system serif display, ink-blue accent) is
preserved and, per the inverted diversification rule for a system-managed project, the
pass stays inside Canon rather than diverging from it. What changed:

- **Numbered spec-sheet eyebrows (01–07).** Each section now opens with a mono tabular
  number in ink-blue, a short accent rule, and the existing kicker label in UI caps,
  stacked directly above the heading. This gives the walkthrough a confident editorial
  rhythm and reads as a sequence. The number/rule/label stack is vertical only (never
  the banned tag-left / heading-right two-column pattern). The eyebrow labels are the
  existing copy, unchanged.
- **Wider typographic scale and vertical rhythm.** The hero headline steps up to
  `clamp(3rem, 9.5vw, 6rem)` with tighter tracking; section headings step up to
  `clamp(1.9rem, 5vw, 3rem)`; section padding and hero rhythm are more generous. The
  hero kicker gained a short accent rule to tie into the numbered-eyebrow system.
- **One selective warm highlight pop.** A single new pair of tokens (`--highlight`,
  `--highlight-strong`, honey-amber at hue ~63) drives a `.mark` highlighter utility.
  The hue harmonizes with the warm paper and plays warm-against-cool with the ink-blue
  accent, so the palette stays cohesive. It is drawn as a low band behind the text (a
  highlighter-pen effect), so foreground ink keeps full contrast over it and legibility
  in the light theme is unchanged. It is used on exactly two phrases: `real output` in
  the hero credibility line and `your own voice.` in the hero specimen mark. Ink-blue
  remains the primary structural accent.
- **Signature hero mark elevated.** `TellsRemoved.astro` (the approved "AI tells, struck
  out" graphic) is now a stronger focal object: a larger, softly lifted panel, larger
  struck specimens, a mono spec-count in the header derived from the real number of
  tells (honest, not fabricated), and a larger resolve line carrying the amber marker.
  Its meaning is unchanged: each removed habit is a real `<del>` with a real line-through
  and a visually hidden `removed:` prefix, and it resolves to `your point, in your own
  voice.`

All hard constraints held: inline SVG/CSS only, system fonts only, no raster or network
asset, no added client JavaScript, no whole-page hydration, and every element stays
legible with JavaScript off. Verified at 375 px with no horizontal scroll. New colour
values are lifted into named tokens and referenced by name; no raw values are inlined in
component styles.

## Performance approach

- Astro static output, zero server runtime.
- System fonts (no font transfer), single small CSS bundle, one tiny inline script.
- shadcn components rendered to HTML, not hydrated.
- Lighthouse CI wired at `.github/workflows/lighthouse.yml` against the built `dist/`.

See the end of this build's report for which budgets were verified locally versus which
still need a real mobile Lighthouse run.
