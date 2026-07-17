# Model-judge policy

A model judge is an automated call to a language model that scores a generation against the rubrics in `evals/rubrics/`, standing in for a first pass of human review. This document states what it is for, who runs it, and the one boundary that must never move.

## The boundary

A model judge is optional, opt-in, and never a release prerequisite by itself. No fixture, rubric, or exit criterion in this repository requires a model-judge result to pass. A release can proceed on human rubric scoring and the cross-agent matrix alone. If a model judge disagrees with a human reviewer, the human reviewer's score stands.

## Who runs it and with what

A model judge requires a maintainer's own API configuration, including their own account, their own API key, and their own choice of judge model. This repository ships no API key, no hosted judge endpoint, and no default judge model. Nothing in `skills/anti-slop-slop-canon/` calls a model judge, and nothing in the distributed skill depends on one existing. This keeps the judge entirely inside repository development tooling, never in the runtime a user installs.

## What it is for

A maintainer with their own API access may use a model judge to:

- Pre-screen a batch of fixture generations before spending human review time, flagging likely rubric failures for closer look.
- Get a second opinion on a borderline score where a human reviewer is uncertain.
- Re-check a large full-matrix run (see `evals/cross-agent-matrix.md`) for regressions between two versions of `defaults.md` or the router, before committing to a full human pass.

## What it must not be used for

- Replacing the human rubric scoring described in `evals/rubrics/`.
- Replacing a blind comparison recorded with `evals/results/blind-comparison-template.md`. A model judge that already knows which sample is personalized is not blind, and its verdict cannot substitute for a human blind pick.
- Replacing Jesse's editorial approval of representative output. That approval is a specific person's judgment call, not a score.
- Standing as the sole evidence in a release-gate status artifact. Any status file that cites a model-judge result must also cite the human rubric scores it supplements.

## If a maintainer chooses to run one

Record, alongside any model-judge result used to inform a release decision:

- The judge model name and version.
- The exact prompt or rubric text given to the judge.
- The date the judge was run and against which commit.
- A note that the result is advisory, not a pass or fail determination on its own.

Do not commit API keys, judge transcripts containing user sample text, or any other credential material to this repository. Model-judge output that repeats private profile content from a user's local `voice-profile.md` should not be recorded here at all, since that file is explicitly excluded from repository tracking.
