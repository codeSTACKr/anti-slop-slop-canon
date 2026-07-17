# Blind comparison template

Copy this file to `evals/results/blind-comparison-<fixture-id>-<date>.md` for each comparison. Fill every bracketed field. This copy of the file is a blank form. No comparison has been recorded here.

## Setup

- Fixture: `<fixture id from evals/fixtures/>`
- Date: `<YYYY-MM-DD>`
- Reviewer: `<name, kept blind to which sample is which until scoring is complete>`
- Host and version: `<Claude Code, Codex, or Cursor, with version>`
- Sample A source: `<active voice profile, or bundled defaults, hidden from the reviewer as "A">`
- Sample B source: `<the other of the two, hidden from the reviewer as "B">`
- Person who generated and labeled the samples: `<name, different from the reviewer>`

## Samples as shown to the reviewer

### Sample A

```
<paste generation A here, with no source label visible to the reviewer>
```

### Sample B

```
<paste generation B here, with no source label visible to the reviewer>
```

## Reviewer's blind judgment

Answer before the reveal below.

- Which sample reads more like a specific person wrote it, rather than a generic default, and why: `<A or B, with the concrete detail that decided it>`
- Meaning preservation score for A and B (0 to 3, see `evals/rubrics/meaning-preservation.md`): `<A: _, B: _>`
- Edit restraint score for A and B (0 to 3, see `evals/rubrics/edit-restraint.md`): `<A: _, B: _>`

## Reveal

- Sample A was: `<profiled or unprofiled>`
- Sample B was: `<the other>`
- Did the reviewer's pick match the profiled sample: `<yes or no>`

## Outcome

State plainly whether this comparison supports or contradicts the Phase 6 exit criterion that personalized output wins blind review over the unprofiled baseline. One comparison is one data point, not a release decision by itself. A release claim needs more than one comparison, across more than one fixture, with a consistent result.
