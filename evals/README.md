# Evaluations

Fixtures define observable quality for the default canon. They are task specifications, not generated answers and not additional writing-rule sources.

## Fixture format

Store one scenario per Markdown file in `fixtures/`. Start with YAML frontmatter:

```yaml
---
id: stable-kebab-case-id
category: ai_like
operation: rewrite
mode: written
expected_mutation: true
---
```

Use exactly these level-two sections in order:

1. `Context`
2. `Input`
3. `Expected behavior`
4. `Assertions`

Allowed categories are `ai_like`, `good_prose`, `personalized_voice`, `spoken_output`, `exemptions`, and `onboarding`. Allowed operations are `compose`, `rewrite`, `audit`, `profile`, `realtime`, and `onboarding`. Allowed modes are `written`, `spoken`, `mixed`, and `onboarding`.

Write observable expectations without inventing a final rewrite. Assertions should protect meaning, factual details, required routing, exemptions, or onboarding state. A later phase may add approved outputs and human scores without changing the source fixture.

## Default-canon coverage

Phase 2 maps each portable rule family to representative fixtures:

| Family | Fixtures |
| --- | --- |
| Confidence and directness | `warranted-uncertainty-control`, `plain-language-maintenance-note` |
| Plain language and vocabulary | `plain-language-maintenance-note` |
| Restraint and light humor | `already-good-field-note`, `dry-humor-control` |
| Punctuation and three-part padding | `punctuation-and-three-part-padding` |
| Banned framing and transitions | `ai-like-product-update`, `formulaic-community-update` |
| Rhythm and sentence shape | `repetitive-rhythm-report`, `already-good-field-note` |
| Spoken delivery | `spoken-service-delay`, `spoken-cadence-control` |
| Fixed-content exemptions | `exempt-fixed-content` |

The good-prose controls use `expected_mutation: false` to make unnecessary polishing an observable failure.

## Router coverage

Phase 3 fixtures make the runtime contract observable without adding a second rule source:

| Behavior | Fixture |
| --- | --- |
| Implicit written composition and clean output | `phase-3-compose-routing` |
| Implicit rewrite and silent second pass | `phase-3-rewrite-routing` |
| Audit without mutation | `phase-3-audit-routing` |
| Clearly spoken routing | `phase-3-spoken-routing` |
| Exact quotation exemption | `phase-3-exact-quote-exemption` |
| Code exemption | `phase-3-code-exemption` |
| Structured-data exemption | `phase-3-structured-data-exemption` |

The repository validator requires all seven fixtures and checks their operation, mode, mutation, task facts, protected literals, expected routing, and assertion semantics in their proper sections. Mutation tests weaken representative contracts and must make validation fail. Host evaluation remains responsible for judging generated content.

## Token-count method

Context budgets use a repository-stable token proxy because host agents and models tokenize Markdown differently. `scripts/validate.rb` counts each Unicode word, number, contraction, or non-whitespace punctuation mark as one lexical unit, then adds a 25 percent safety margin and rounds up.

Count the complete `SKILL.md`, including frontmatter, against a strict limit below 600 proxy tokens. Count each complete style bundle, including frontmatter, against a strict limit below 1,500 proxy tokens. The validator prints raw lexical units and guarded counts for review.

This proxy is the deterministic CI gate. Before a release, maintainers should also spot-check the same files with the tokenizers used by supported hosts and record material differences. A host-specific count may tighten a file but may not waive the repository gate.

## Validation

Run all repository contract checks with:

```sh
ruby scripts/validate.rb
```

The official Skill Creator `quick_validate.py` remains the preferred frontmatter check when its PyYAML dependency is already available. Do not install dependencies merely to run it. The repository validator uses Ruby's built-in Psych YAML parser and reproduces its naming, required-field, and frontmatter checks as the documented fallback.
