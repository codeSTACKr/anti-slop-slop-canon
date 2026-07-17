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
- **Enrichment** — none (typography only). The strongest hero for a writing tool is a
  typographic one; no invented screenshots, no stock imagery, no fabricated metrics.
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

Every example is drawn from committed sources in the repo:

- The **default-cleanup before/after** pairs are the verbatim input and the curated
  output from `evals/fixtures/ai-like-product-update.md` (output as published in
  `repo/README.md`) and `evals/fixtures/punctuation-and-three-part-padding.md`.
- The **spoken example** uses `evals/fixtures/spoken-service-delay.md`.
- The **profile excerpt** is the committed `assets/voice-profile.template.md` schema.
- The **realtime prompt** is the committed `assets/realtime-voice-prompt.md` verbatim.
- The **personalized-output** panel is composed to the exact spec of
  `evals/fixtures/personalized-maker-update.md` (its supplied facts and approved
  traits: clipped first person, the `Back to the bench.` sign-off, no invented price,
  date, quote, or quality claim). It is labeled as an illustrative composition to that
  fixture's rules, not a golden output committed to the repo, so the page never
  overclaims. Fixture assertions were followed literally.
- The **pre-release status note** matches `repo/README.md`: the install command
  describes the plan and will not find anything to install today.

No metric, testimonial, logo, or benefit was invented. No arbitrary-text input box,
account, analytics, hosted inference, or third-party script appears on the page.

## Performance approach

- Astro static output, zero server runtime.
- System fonts (no font transfer), single small CSS bundle, one tiny inline script.
- shadcn components rendered to HTML, not hydrated.
- Lighthouse CI wired at `.github/workflows/lighthouse.yml` against the built `dist/`.

See the end of this build's report for which budgets were verified locally versus which
still need a real mobile Lighthouse run.
