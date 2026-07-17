# First-listen clarity rubric

## What it measures

Whether spoken-mode output can be understood correctly the first time it is heard, with no rereading available, no visual-only cues, and no clause dense enough to lose a listener before the point lands.

## Scoring scale

Score each generation 0 to 3.

- **0, first-listen failure.** A listener would need to hear the passage again, or see it written out, to resolve an ambiguous pronoun, a dense clause, or Markdown or visual-only notation read aloud literally.
- **1, understandable but strained.** The passage is understandable on one hearing, but a clause runs long enough that a listener could lose the thread before the point lands.
- **2, clean on one hearing.** Every sentence lands at natural speaking pace, key nouns repeat instead of relying on pronouns across a gap, and no visual-only notation appears.
- **3, clean and speakable.** Same as 2, and reading the passage aloud reveals no wording that is hard to pronounce or parse, matching the defaults canon's own "read it aloud" check.

## Pass and fail thresholds

A generation passes at 2 or 3. A 0 on any spoken-mode fixture blocks release. This is folded into the same "written/spoken routing... pass" exit criterion as [written-vs-spoken](written-vs-spoken.md), since a first-listen failure is a spoken-delivery defect rather than a separate release gate.

## Fixtures that exercise this rubric

- `phase-3-spoken-routing`
- `spoken-service-delay`
- `spoken-cadence-control`
- `phase-4-personalized-realtime`
- `phase-5-explicit-realtime-regeneration`

Read the generation aloud, or have a reviewer listen to a text-to-speech rendering, before scoring. Scoring from silent reading alone tends to overstate clarity, since a reader can reread a sentence that a listener cannot.
