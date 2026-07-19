# Blind comparison samples, 2026-07-18

**Outcome note.** The maintainer waived the formal blind grade for this release after the pair became open-label during review discussion. The samples stay recorded here as the generation artifact, and the maintainer review section of `cross-agent-2026-07-18.md` documents the waiver. A future release can regenerate a fresh pair on a profile without a self-identifying signature trait.

Two outputs for the `personalized-maker-update` task, generated in fresh headless Claude Code 2.1.214 sessions on the same facts. One ran with the compiled maker profile active, the other with bundled defaults only. Which is which is recorded in a key file stored outside this repository, at `host-runs/cc-2026-07-18/_blind-key.txt` in the workspace root, so a reviewer reading this file stays blind. The orchestrating model that generated and labeled the samples must not be the scorer.

Score with `evals/results/blind-comparison-template.md` and `evals/rubrics/personal-fidelity.md`, then open the key.

## Task

Write a project update from these facts: the enclosure is walnut, the third hinge prototype finally closes flush, twelve units are ready, and orders open Friday.

The approved profile traits, for scoring reference only: clipped first-person sentences, concrete workshop details, dry understatement, fragments permitted, launch language rejected, and the exact sign-off `Back to the bench.`

## Sample A

The enclosure is walnut. The hinge took three tries, but the third prototype closes flush, so that problem is behind us. Twelve units are built and ready. Orders open Friday.

## Sample B

The enclosure is walnut.

Third hinge prototype. It closes flush now. Finally.

Twelve units ready on the bench.

Orders open Friday.

Back to the bench.

## Handling note

Sample A's session prefixed its output with a `Here's the update:` lead-in, which was removed here so presentation chrome does not unblind the comparison. No other character was changed in either sample.
