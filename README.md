# anti-slop-slop-canon

Sound like yourself.

`anti-slop-slop-canon` is an open-source Agent Skill that removes recognizable AI-writing habits from your prose, then goes further by learning your actual voice through a short, adaptive onboarding session. One profile governs both written output and spoken output, such as scripts, narration, and voice-agent responses. The skill runs on the model and tools your host agent already has. It carries no runtime package, script, API key, hosted inference service, or telemetry.

**Status:** This repository is pre-release. The writing canon, router, adaptive onboarding, and profile lifecycle are implemented and covered by local fixtures, but the skill is not yet published to a registry. The install commands below describe the plan. Running them today will not find anything to install.

## Before and after

Default cleanup removes hype, canned framing, and ornamental punctuation without inventing a claim the source did not make.

Input:

> We're thrilled to announce a groundbreaking update that unlocks a seamless, robust, and transformative experience. Here's the thing: Smart Filters arrive on August 12, and early tests show a 17% drop in time spent sorting results. This isn't just an update; it's a game-changer for every workflow!

Output:

> Smart Filters arrive on August 12. Early tests show a 17% drop in time spent sorting results.

Same facts, same date, same number. No invented benefit, no exclamation point, no "here's the thing," no manufactured contrast. The full scenario and its assertions live in [evals/fixtures/ai-like-product-update.md](evals/fixtures/ai-like-product-update.md).

That cleanup is the floor every user gets. Once you complete onboarding, output shifts to your approved voice instead of a neutral default. [evals/fixtures/personalized-maker-update.md](evals/fixtures/personalized-maker-update.md) composes the same kind of update from an onboarded profile that favors clipped first-person sentences and a fixed sign-off, and reads nothing like the default.

## Install

Global scope, active in every project on the machine:

```sh
npx skills add codeSTACKr/anti-slop-slop-canon -g
```

Project scope, active only inside the current repository:

```sh
npx skills add codeSTACKr/anti-slop-slop-canon
```

A project copy reads and writes only its own project state and never falls back to the global copy. See [docs/installation.md](docs/installation.md) for scope details, the manual-install fallback, and optional extraction helpers.

## How it works

- The skill activates automatically on prose you compose or revise: messages, documents, scripts, narration, and voice-agent responses. It infers spoken guidance only when the text is meant to be heard rather than read, and defaults to written otherwise.
- On the first task in a scope with no saved state, it asks one question: personalize now, use the defaults, or defer. Choosing defaults or defer resumes the original task immediately using the built-in voice. See [docs/onboarding.md](docs/onboarding.md).
- Local state lives outside the installed skill folder, one scope at a time: `~/.config/anti-slop-slop-canon/` globally, or `<project-root>/.anti-slop-slop-canon/` inside a project. See [docs/profiles.md](docs/profiles.md).
- Every rule the skill applies is a plain Markdown file. Open `voice-profile.md` or the bundled `defaults.md` and edit it directly. The skill treats a direct edit as your explicit intent and does not normalize or regenerate the file because it changed.
- Normal output is clean content. Ask for an audit, an explanation, or a diff when you want to see the reasoning instead of just the result.

## Supported operations

| Ask for | The skill does |
| --- | --- |
| Nothing explicit | Composes or rewrites mutable prose with the active bundle |
| An audit | Reports concrete violations without changing your text |
| Onboarding | Runs, or reruns, the adaptive interview |
| Your profile | Shows the active bundle, its scope, and its versions |
| A refresh | Recompiles your profile against the current defaults, previews the result, and waits for your approval |
| The realtime prompt | Returns your personalized style prompt, or the bundled default if you have not onboarded |

Full operation definitions live in [skills/anti-slop-slop-canon/references/operations.md](skills/anti-slop-slop-canon/references/operations.md).

## Privacy

The skill does not retain samples, pasted text, URLs, downloads, transcripts, or its own analysis by default. After onboarding, your state directory holds only three small files: `voice-profile.md`, `realtime-voice-prompt.md`, and `settings.md`. Details are in [docs/onboarding.md](docs/onboarding.md).

## The realtime voice prompt

A realtime voice agent needs its style guidance compressed into the system prompt, not loaded as a reference file. Ask the skill for the realtime prompt and it returns your personalized module if you have onboarded, or the bundled default otherwise. Paste the returned text into the section of your voice agent's system prompt that governs delivery style.

The module covers delivery only: word choice, sentence shape, pacing, and first-listen clarity. It defines no tools, facts, safety policy, conversation flow, or handoff logic, so it sits alongside your agent's own instructions rather than replacing them. See [docs/realtime-voice.md](docs/realtime-voice.md).

## What this does not do

This skill will not help you evade AI-detection tools, and it makes no claim that its output is undetectable. Its purpose is to remove habits that make writing sound generic and to help you sound like yourself. A request framed around beating a detector gets a plain rewrite or audit instead.

## Repository

- `skills/anti-slop-slop-canon/` is the canonical Agent Skill, installed as-is with no per-tool variants.
- `docs/` holds this documentation.
- `evals/` holds the public fixtures, rubrics, and the evaluation contract.
- `scripts/validate.rb` checks schemas, routing and lifecycle fixtures, links, exact runtime contents, realtime policy boundaries, and context budgets.
- `site/` is the static Astro showcase, a single page whose every example is real output from the bundled rules, deployed at [useantislop.com](https://useantislop.com).

## Development

Run the repository checks with:

```sh
ruby scripts/validate.rb
```

The check uses Ruby's standard-library YAML parser and needs no installed packages. See [evals/README.md](evals/README.md) for the fixture format and token-count method, and [docs/contributing-rules.md](docs/contributing-rules.md) for the writing-rule pull request policy.

## License

MIT
