# Meaning preservation rubric

## What it measures

Whether compose, rewrite, and audit output keeps every fact, number, name, date, qualifier, and protected span from the input, and adds no invented claim, benefit, or enthusiasm. This rubric checks content, not style. A stylistic miss belongs to [edit-restraint](edit-restraint.md) instead.

## Scoring scale

Score each generation 0 to 3.

- **0, critical loss.** A fact, number, name, date, or protected span (an exact quotation, code, structured data, or legally fixed wording) changed, dropped, or gained invented content.
- **1, meaning drift.** No invented fact, but a qualifier or hedge shifted strength (for example, "may" became "will," or a stated limitation disappeared).
- **2, meaning held.** Every fact, qualifier, and protected span is intact. Only wording changed.
- **3, meaning held with reduced ambiguity.** Same as 2, and the edit removes a plausible misreading that existed in the source, with no added claim.

## Pass and fail thresholds

A generation passes at 2 or 3. Any 0 blocks release. This maps directly to the Phase 6 exit criterion "no critical meaning loss occurs." A single 1 on one fixture is a note for the next cycle rather than a blocker, but a 1 that repeats across multiple fixtures in the same run should be treated as a pattern and blocks release until corrected.

## Fixtures that exercise this rubric

- `phase-3-compose-routing`
- `phase-3-rewrite-routing`
- `phase-3-audit-routing`
- `phase-3-spoken-routing`
- `phase-3-exact-quote-exemption`
- `phase-3-code-exemption`
- `phase-3-structured-data-exemption`
- `exempt-fixed-content`
- `ai-like-product-update`
- `formulaic-community-update`
- `plain-language-maintenance-note`
- `spoken-service-delay`

Score each fixture's `Assertions` section against the actual host generation. Record scores in a copy of the [blind comparison template](../results/blind-comparison-template.md) or an equivalent dated results file.
