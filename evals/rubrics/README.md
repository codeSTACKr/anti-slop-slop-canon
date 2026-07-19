# Evaluation rubrics

These five rubrics are the human scoring layer of the Phase 6 release gates. `scripts/validate.ts` checks that the repository's contracts, fixtures, and budgets are structurally sound. It cannot judge whether an actual model generation, in an actual host, is good writing. That judgment is what these rubrics standardize.

| Rubric | What it scores | Exit criterion it maps to |
| --- | --- | --- |
| [Meaning preservation](meaning-preservation.md) | Facts, numbers, names, qualifiers, and protected spans survive compose, rewrite, and audit output | No critical meaning loss occurs |
| [Edit restraint](edit-restraint.md) | Clean prose stays untouched, and only the necessary edit happens | Good-writing controls do not regress |
| [Personal fidelity](personal-fidelity.md) | A profiled generation reflects approved traits and beats the unprofiled baseline blind | Personalized output wins blind review over the unprofiled baseline |
| [Written versus spoken choice](written-vs-spoken.md) | The router picks the right mode without asking, with no cross-contamination | Written/spoken routing... pass |
| [First-listen clarity](first-listen-clarity.md) | Spoken output parses correctly on one hearing, with no rereading | Written/spoken routing... pass (spoken delivery half) |

## How to use these rubrics

1. Generate output from a fixture in `evals/fixtures/` using a real host (Claude Code, Codex, or Cursor). See [the cross-agent matrix](../cross-agent-matrix.md) for which fixtures to run per host.
2. Score the generation against every rubric that lists that fixture, using the 0 to 3 scale defined in each rubric file.
3. Record scores in a dated copy of the [blind comparison template](../results/blind-comparison-template.md), or in an equivalent results file under `evals/results/`.
4. A release blocks if any fixture scores 0 on its applicable rubric, or if personal fidelity has not been confirmed through at least one completed blind comparison.

## Boundaries

These rubrics are scored by a human reviewer reading or listening to real output. An optional, maintainer-run model judge can pre-screen candidates before human scoring, but it never replaces these rubrics and is never a release prerequisite by itself. See [the model-judge policy](../model-judge.md) for that boundary.

Jesse's own editorial approval of representative output is a separate, final exit criterion. Passing every rubric above is necessary for that approval but is not a substitute for it.
