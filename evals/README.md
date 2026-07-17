# Evaluations

Phase 1 fixtures define quality before the default canon is written. They are task specifications, not generated answers and not additional writing-rule sources.

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

Allowed categories are `ai_like`, `good_prose`, `personalized_voice`, `spoken_output`, `exemptions`, and `onboarding`. Allowed operations are `compose`, `rewrite`, `audit`, and `onboarding`. Allowed modes are `written`, `spoken`, `mixed`, and `onboarding`.

Write observable expectations without inventing a final rewrite. Assertions should protect meaning, factual details, required routing, exemptions, or onboarding state. A later phase may add approved outputs and human scores without changing the source fixture.

## Token-count method

Context budgets use a repository-stable token proxy because host agents and models tokenize Markdown differently. `scripts/validate.rb` counts each Unicode word, number, contraction, or non-whitespace punctuation mark as one lexical unit, then adds a 25 percent safety margin and rounds up.

Count the complete `SKILL.md`, including frontmatter, against a strict limit below 600 proxy tokens. Count each complete style bundle, including frontmatter, against a strict limit below 1,500 proxy tokens. The validator prints raw lexical units and guarded counts for review.

This proxy is the deterministic CI gate. Before a release, maintainers should also spot-check the same files with the tokenizers used by supported hosts and record material differences. A host-specific count may tighten a file but may not waive the repository gate.

## Validation

Run all Phase 1 checks with:

```sh
ruby scripts/validate.rb
```

The official Skill Creator `quick_validate.py` remains the preferred frontmatter check when its PyYAML dependency is already available. Do not install dependencies merely to run it. The repository validator uses Ruby's built-in Psych YAML parser and reproduces its Phase 1 naming, required-field, and frontmatter checks as the documented fallback.
