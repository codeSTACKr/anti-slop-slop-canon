# Personal fidelity rubric

## What it measures

Whether output produced under an active voice profile reflects that profile's approved traits rather than the bundled defaults, and whether profile lifecycle behavior (mismatch notice, keep, later, refresh) matches the documented contract without ever loading two bundles into one task.

## Scoring scale

Score each generation 0 to 3.

- **0, fidelity failure.** Output matches the bundled defaults instead of the active profile, an approved trait is contradicted, or two bundles load or blend in one task.
- **1, partial fidelity.** Output reflects some profile traits but drops an explicit approved trait, or a lifecycle state (notice, keep, later, refresh) diverges from the contract.
- **2, fidelity held.** Output consistently reflects every approved profile trait, and lifecycle state matches the documented contract exactly.
- **3, fidelity held and preferred blind.** Same as 2, and in a blinded side-by-side a reviewer who does not know which sample is personalized picks the profiled sample as more like the person it was built from.

## Pass and fail thresholds

A generation passes at 2 or 3. For release, score 3 must be demonstrated at least once through a completed [blind comparison](../results/blind-comparison-template.md), where the personalized sample wins against the unprofiled baseline. This maps to the Phase 6 exit criterion "personalized output wins blind review over the unprofiled baseline." A 0 or 1 on any lifecycle fixture (mismatch, keep, later, refresh) blocks release regardless of the blind-comparison outcome, because lifecycle correctness is a contract requirement, not a preference.

## Fixtures that exercise this rubric

- `personalized-maker-update`
- `phase-4-profile-compilation`
- `phase-5-mismatch-notice`
- `phase-5-profile-edit-stability`
- `phase-5-refresh-preview`
- `phase-5-keep-choice`
- `phase-5-later-cooldown`

Run `personalized-maker-update` twice for the blind step, once against a profile-driven generation and once against a bundled-defaults generation of the same input, with both labels hidden from the reviewer until after scoring.
