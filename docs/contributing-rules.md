# Contributing writing rules

The normative default canon lives in one file, [../skills/anti-slop-slop-canon/references/defaults.md](../skills/anti-slop-slop-canon/references/defaults.md). Do not copy its rules into documentation, fixtures, tool-specific rule files, or the router. Everything else in the repository describes or tests that one source.

## What a rule change must include

Every pull request that adds or changes a writing rule must include:

- The pattern and why it harms the reader.
- A bad example and an improved example.
- At least one failing evaluation fixture in `evals/fixtures/`, following the format in [../evals/README.md](../evals/README.md).
- A good-writing control fixture, with `expected_mutation: false`, showing that the change does not flatten prose that was already clean.
- The change in context-budget cost, reported from `ruby scripts/validate.rb`.

Fixtures describe observable behavior, such as what must be preserved and what must be removed. They are task specifications, not a second copy of the rule text and not a pre-written answer key.

## Before you open the pull request

Run the repository checks locally:

```sh
ruby scripts/validate.rb
```

This confirms frontmatter, required schema sections, banned literal patterns, fixture format, local links, and context budgets. It does not judge whether generated output actually reads well. That judgment happens through the human rubrics in [../evals/rubrics/](../evals/rubrics/) and Jesse's own editorial review.

## Editorial authority

Jesse Hall is the final editorial authority for the default canon. Community input shapes and improves the canon, but a taste decision is not settled by a vote.

## Out of scope

Do not propose detector-evasion features, detector benchmarks, hidden or undisclosed voice profiles, hosted tracking or telemetry, or new runtime dependencies. See [../README.md](../README.md) for the product boundary this repository holds to.
