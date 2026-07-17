# Cross-agent test matrix

`scripts/validate.rb` checks the repository's source contracts. It does not run the skill. Whether `SKILL.md` and its references actually produce correct behavior depends on the host model reading and following them, and that varies by host. This matrix is how a human confirms real behavior in Claude Code, Codex, and Cursor before a release.

## What counts as a host here

- **Claude Code**: the CLI or IDE extension, with the skill installed at project or global scope as documented in the root README.
- **Codex**: the OpenAI Codex CLI or IDE integration, using the generated `agents/openai.yaml` interface metadata.
- **Cursor**: the Cursor editor, with the skill installed at project or global scope.

Record the exact host version alongside every result. Behavior can change between host releases independent of any change in this repository.

## Core matrix, required for every release

Run each fixture below against each host by pasting or referencing its `Input` into a fresh session with the skill installed, then compare the response against `Expected behavior` and `Assertions`. Score applicable rubrics from `evals/rubrics/` at the same time.

| Fixture | Category | Claude Code | Codex | Cursor |
| --- | --- | --- | --- | --- |
| `phase-3-compose-routing` | ai_like | | | |
| `phase-3-rewrite-routing` | ai_like | | | |
| `phase-3-audit-routing` | ai_like | | | |
| `phase-3-spoken-routing` | spoken_output | | | |
| `phase-3-exact-quote-exemption` | exemptions | | | |
| `phase-3-code-exemption` | exemptions | | | |
| `phase-3-structured-data-exemption` | exemptions | | | |
| `exempt-fixed-content` | exemptions | | | |
| `already-good-field-note` | good_prose | | | |
| `personalized-maker-update` | personalized_voice | | | |
| `phase-4-first-use-choice` | onboarding | | | |
| `phase-4-preview-before-save` | onboarding | | | |
| `phase-5-mismatch-notice` | personalized_voice | | | |
| `spoken-service-delay` | spoken_output | | | |

Leave a cell blank until it has been run. Fill each cell with one of `PASS`, `FAIL`, or `BLOCKED`, the date, and the reviewer's initials, for example `PASS 2026-07-17 jh`. A blank cell means "not yet run," never "assumed passing."

## Full matrix, required before a tagged release or a schema or defaults version bump

Run every fixture in `evals/fixtures/` against every host using the same procedure. Use one dated file per run, copied from this file's table structure, named `evals/results/cross-agent-<date>.md`, so the core matrix above stays a living checklist rather than an accumulating log.

## Recording a result

For each cell:

1. Start a fresh host session with no prior conversation state, so cached instructions from an earlier task cannot influence the result.
2. Provide the fixture's `Input` under the fixture's stated `Context`.
3. Compare the response against `Expected behavior` and every line in `Assertions`.
4. Mark `PASS` only if every assertion holds. Mark `FAIL` if any assertion is violated, and record which one. Mark `BLOCKED` if the host cannot complete the fixture at all, for example because it refuses to install the skill, and record why.
5. Where a fixture also appears in a rubric's fixture list, score that rubric and link the score in the notes column or an attached results file.

## Documenting a host-specific limitation

A limitation entry is a claim that a host cannot do something the contract requires, not a stylistic quirk or a single bad generation. Before adding one:

- Reproduce the behavior at least twice in a fresh session each time.
- Confirm the same fixture passes in at least one other host, so the limitation is host-specific rather than a defect in this repository's contract.
- Record the host name and exact version, the fixture id, the literal observed output or behavior, and the specific assertion it violates.
- State whether the limitation is a host capability gap (for example, no persistent file state between sessions) or a genuine contract defect that happens to surface first on that host. A contract defect belongs in an issue against `skills/anti-slop-slop-canon/`, not in this list, once confirmed.

Do not add a limitation from a single run, a guess about host behavior, or a difference that has not been reproduced. This list starts empty and only grows from evidence gathered by running the matrix above.

### Confirmed host-specific limitations

None recorded yet. The core matrix above has not been run against any host as part of Phase 6.
