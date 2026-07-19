# Phase 6 evaluation gates status

Date: 2026-07-17

**Superseded in part.** This is a dated snapshot of gate construction. The evaluation runs it lists as open were partly performed on 2026-07-18. See [cross-agent-2026-07-18.md](cross-agent-2026-07-18.md) for the Claude Code core-matrix run, the maintainer's ratification, and the blind-grade waiver.

Base commit: `fe7db99526d472f18fe6b2747467861b985a60d1` (Phase 5 lifecycle review)

## What this artifact is

Phase 6 of the build plan asks for the evaluation and release gates themselves, not a full release sign-off. This status artifact records what those gates now consist of, confirms the deterministic half is green, and states plainly which exit criteria remain open pending human and editorial work that this session did not perform.

This is a status report on gate construction, not an independent audit of someone else's commit, and not a claim that a release has been approved. No fixture generation was scored, no blind comparison was recorded, no cross-agent matrix cell was filled, and Jesse has not reviewed representative output as part of this work.

## New artifacts

- `evals/rubrics/meaning-preservation.md`, `edit-restraint.md`, `personal-fidelity.md`, `written-vs-spoken.md`, `first-listen-clarity.md`, and a rewritten `evals/rubrics/README.md` index.
- `evals/cross-agent-matrix.md`, a core and full fixture matrix for Claude Code, Codex, and Cursor, currently unfilled.
- `evals/model-judge.md`, the optional maintainer-run model-judge policy and its boundary.
- `evals/results/blind-comparison-template.md`, a blank template for recording one blinded personalized-versus-default comparison.
- This status artifact and its index entry in `evals/results/README.md`.

No file under `skills/anti-slop-slop-canon/` changed. `scripts/validate.rb` was not extended, since the deterministic checks the Phase 6 build-plan bullet describes, frontmatter, required schema sections, version parity, fixture coverage, broken links, and context budgets, were already built incrementally across Phases 1 through 5 and remain in place.

## The deterministic gate is automated and green

`scripts/validate.rb` already covers every deterministic check the Phase 6 bullet list names:

| Deterministic check | Where it lives in `scripts/validate.rb` |
| --- | --- |
| Frontmatter shape and required fields | `Validation#frontmatter`, skill and bundle metadata checks |
| Required schema sections, present and in order | `REQUIRED_BUNDLE_SECTIONS`, `REQUIRED_FIXTURE_SECTIONS` |
| Version parity across schema, defaults, profile, and router | the `bundle_data` and `schema_doc_version` checks |
| Banned literal patterns and canon coverage | the bundled `Patterns to avoid` section check, plus Phase 3 through 5 fixture-contract snippets |
| Missing fixtures and required categories | `REQUIRED_CATEGORIES`, `PHASE_3_FIXTURE_CONTRACTS` through `PHASE_5_FIXTURE_CONTRACTS` |
| Broken local links | `local_markdown_links` and its glob check |
| Context and token budgets | the `budgets` hash and the realtime guarded-unit range |

Current results, run from this commit's working tree:

- `ruby scripts/validate.rb`: pass. The router's guarded count is 583 against a limit under 600. Defaults reach 1,447 against a limit under 1,500. The profile template reaches 277. The realtime module reaches 299, inside the required 250 to 400 range.
- `ruby scripts/test_validate.rb`: 50 runs, 150 assertions, 0 failures, 0 errors, 0 skips.

This satisfies the Phase 6 exit criterion "repository checks pass."

## The human and editorial gates remain open

The remaining four Phase 6 exit criteria depend on a human reading or hearing actual model output. Nothing in this session generated, scored, or reviewed that output. Each is listed with what infrastructure now exists to run it and what running it would require.

1. **No critical meaning loss occurs.** Infrastructure: `evals/rubrics/meaning-preservation.md`. Status: no fixture has been scored against a real host generation. Open.
2. **Good-writing controls do not regress.** Infrastructure: `evals/rubrics/edit-restraint.md`. Status: no `good_prose` fixture has been scored against a real host generation. Open.
3. **Personalized output wins blind review over the unprofiled baseline.** Infrastructure: `evals/rubrics/personal-fidelity.md` and `evals/results/blind-comparison-template.md`. Status: zero blind comparisons have been recorded. Open.
4. **Written/spoken routing, context budgets, and scope isolation pass.** The context-budget and scope-isolation portions of this criterion are checked deterministically and already pass, per the table above. The routing portion, as observed in real host behavior rather than in the router's source text, depends on `evals/cross-agent-matrix.md` and the `evals/rubrics/written-vs-spoken.md` and `evals/rubrics/first-listen-clarity.md` rubrics. Status: no matrix cell has been filled for Claude Code, Codex, or Cursor. Open.
5. **Jesse approves representative output editorially.** Status: not sought as part of this work. Open.

The optional model-judge path described in `evals/model-judge.md` was not used and is not a substitute for any of the five items above. The policy document states that boundary directly.

## Residual risks

- A deterministic pass proves the contract is internally consistent. It does not prove a given host will read `SKILL.md` and its references correctly, or that the resulting prose is actually good. That gap is exactly what the human rubrics and cross-agent matrix exist to close, and closing it requires running them against live hosts.
- The core cross-agent matrix lists 14 fixtures as the required minimum per release. It was scoped from the six required fixture categories plus the Phase 3 through 5 lifecycle and routing contracts, not from any prior execution data, since none exists yet. A maintainer who finds this set too broad or too narrow once real runs begin should adjust it and note why in `evals/cross-agent-matrix.md`.
- The blind-comparison template assumes a reviewer who does not already know which sample came from which source. Whoever generates and labels the two samples must not also be the reviewer who scores them, or the blind step is void.

## Validation and integrity

- `ruby scripts/validate.rb`: pass, output above.
- `ruby scripts/test_validate.rb`: pass, 50 runs, 150 assertions, no failures, errors, or skips.
- Self-audit of every new file in `evals/rubrics/`, `evals/cross-agent-matrix.md`, `evals/model-judge.md`, and `evals/results/` for em dashes, en dashes, semicolons, exclamation points, and mid-sentence colons found none outside code spans and fixture-id references.
- No file under `skills/anti-slop-slop-canon/` was touched. No git commit was made. Changes remain in the working tree for the orchestrating session to review and commit.

## Blockers

None for gate construction. The gates themselves are built and the deterministic half is green. Release, however, remains blocked on the five open items above. None of them can be marked passing until a human actually runs the rubrics, fills the cross-agent matrix, and Jesse reviews representative output. This artifact does not authorize a release.
