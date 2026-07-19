# Phase 2 blind restraint review

Date: 2026-07-17

Target commit: `3f6297a29e59a3d18f224edf64d01760fe0a0669`

## Verdict

Pass. The default canon does not flatten clean human writing merely to satisfy its rules. The fresh reviewer left all four clean-prose controls unchanged, including the field note, dry joke, spoken announcement, and warranted hedge.

The blinded pass matched the expected mutation state in 10 of 11 cases. Seven cases fully aligned with their fixture assertions after reveal. Two were partial, and two disagreed. One disagreement resulted solely from hiding the compose operation and spoken context. The other disagreements were review choices or depended on context that the blinded packet intentionally withheld. None establishes a canon or fixture defect.

## Method and integrity controls

A separate packet preparer created an anonymous packet and a separate mapping. The fresh reviewer had not seen fixture names, categories, metadata, mappings, expected mutation states, expected behavior, or assertions.

Before reveal, the fresh reviewer read only the default canon and the anonymous B01 through B11 packet. It saved a complete first pass to a temporary file, verified that every label occurred exactly once, checked the file for reveal contamination, and froze it. The reviewer did not inspect repository history, fixture files, mapping data, or another agent's output during that pass.

After the user opened the reveal boundary, the reviewer read the mapping and each mapped fixture in full, then compared the frozen decisions and proposed rewrites with the operation, mode, expected mutation state, expected behavior, and every assertion. The frozen file was not edited.

## Scope and exclusions

The blind review covered the 11 mapped Phase 2 default-canon cases. It included AI-like prose, already-clean written prose, spoken prose, fixed-content exemptions, humor, uncertainty, punctuation, rhythm, and composition.

The personalized maker and onboarding fixtures were not in the blinded packet. They depend on profile and onboarding behavior assigned to later phases, so they are excluded from the Phase 2 verdict. They were read after reveal only to confirm the repository's fixture scope. This review did not start router, onboarding, profile lifecycle, promotion, publishing, deployment, or cross-host evaluation work.

## Blinded case decisions

| Case | Frozen decision | Frozen proposal |
| --- | --- | --- |
| B01 | Change | Use the existing inspection form for a full check and retain the approximate eight-minute duration. |
| B02 | Leave untouched | No change. |
| B03 | Change | Keep the 38 translations and Monday review date. |
| B04 | Change | Revise only the intro and preserve every protected line exactly. |
| B05 | Leave untouched | No change. |
| B06 | Leave untouched | No change. |
| B07 | Change | Keep the entrance and count, but also retain faster and friendlier. |
| B08 | Change | Combine the three north-sensor events into one coordinated sentence. |
| B09 | Leave untouched | No change. |
| B10 | Change | Keep Smart Filters, August 12, and the 17% early-test result. |
| B11 | Leave untouched | No change. |

## Reveal comparison

| Case | Fixture | Mutation | Assertion alignment | Comparison and reason |
| --- | --- | --- | --- | --- |
| B01 | `plain-language-maintenance-note` | Aligned | Partial | The frozen rewrite preserved the form, approximate duration, and `about`. It removed all named jargon, but `full check` restated the unsupported quality claim behind `comprehensive checks`. The revealed fixture required that claim to be removed. |
| B02 | `already-good-field-note` | Aligned | Full | No change preserved all three sentences, their order, the second mile, creek, north ridge, image, and cadence. |
| B03 | `formulaic-community-update` | Aligned | Full | The rewrite preserved the translation count and Monday review, removed every named formula and unsupported uplift, and added no prompt or recap. |
| B04 | `exempt-fixed-content` | Aligned | Full | Only the mutable intro changed. The quote, code, JSON, and legal line remained byte for byte exact, including punctuation that the mutable-prose rules prohibit. |
| B05 | `dry-humor-control` | Aligned | Full | No change preserved the latch result, four prototypes, irregular rhythm, entire second sentence, and single understated joke. |
| B06 | `spoken-cadence-control` | Aligned | Full | No change preserved all three sentences in order, Route 4, Bay C, ticket guidance, and the repeated bay reference needed on first hearing. |
| B07 | `punctuation-and-three-part-padding` | Aligned | No | The rewrite kept the entrance and daily range and removed all banned punctuation. It incorrectly retained `faster` and `friendlier`, which the revealed context marks as unsupported. |
| B08 | `repetitive-rhythm-report` | Aligned | Partial | All events, times, order, and backup status were preserved, and the repeated opening was removed. Combining the three north-sensor events into a polished coordinated clause pressed against the fixture's instruction not to turn them into a three-part sequence. |
| B09 | `spoken-service-delay` | Disagreed | No | The packet hid that the input was a compose instruction for a one-hearing station announcement. The reviewer treated the instruction itself as clean prose. This is a blinding-method limitation, not evidence against the spoken canon. |
| B10 | `ai-like-product-update` | Aligned | Full | The rewrite preserved the feature, date, and `17%` exactly, retained the early-test qualification, and removed hype, formulaic framing, unsupported generalization, and distracting punctuation. |
| B11 | `warranted-uncertainty-control` | Aligned | Full | No change preserved `may be leaking`, the wet-corner and dry-frame distinction, both sentence lengths, and the boundary between observation and diagnosis. |

Mutation alignment was 10 of 11 cases. Full case-level assertion alignment was 7 of 11, with 2 partial cases and 2 disagreements. All four `expected_mutation: false` controls passed without edits.

## Disagreements and resolutions

### B01 meaning preservation and unsupported praise

The frozen reviewer treated `comprehensive checks` as substance and replaced it with `full check`. The fixture treats it as unsupported quality language. The better result is `The workflow uses the existing inspection form and takes about eight minutes per unit.`

This is a reviewer error. The canon already says to preserve substance, remove broad praise, and avoid inventing benefits. The fixture is also explicit. No rule or fixture change is justified.

### B07 factual comparison and banned contrast framing

The frozen reviewer read `faster` as a factual comparison, which the canon permits, and preserved `friendlier` to avoid deleting meaning. The revealed context says the adjective trio is unsupported padding. The better result is `Keep the east entrance open. It serves 240 to 260 people daily.`

The missing context materially affected the judgment. This mismatch is primarily a blinding-method limitation. The canon permits factual comparison but also requires claims to be grounded and broad praise to be replaced with evidence. The fixture supplies the decisive unsupported-status context after reveal. Both are adequate, so no correction is warranted.

### B08 deliberate repetition and rule-of-three restraint

The original repetition is mechanical rather than deliberate, so a change is appropriate. The frozen rewrite used only required events, which the canon allows, but it made the timeline sound more polished than the fixture asks. A more restrained option is `The north sensor failed at 9:10 and restarted at 9:14. It sent its next reading at 9:16. The backup sensor stayed online throughout.`

This is an edit-choice disagreement, not a canon defect. The fixture's expected behavior provides enough guidance after reveal.

### B09 composition, spoken delivery, and hidden operation

The input is a compose request, not prose to preserve. A compliant announcement is `Route 6 is delayed about 15 minutes because a disabled vehicle is blocking Oak Street. Valid tickets are accepted on Route 9 until 6:30 PM.` It states the delay first, retains every required fact and hedge, avoids visual formatting and stage directions, and does not imply cancellation.

The operation, mode, and station context were intentionally hidden. This mismatch therefore measures packet design more than canon behavior. Future blinded reviews of composition should expose the user operation and delivery setting while continuing to hide fixture identity and expected outcomes.

## Restraint and hard-rule findings

| Requirement | Finding |
| --- | --- |
| Preserve meaning, facts, uncertainty, intent, and protected literals | Present as a non-negotiable rule. B04 and B11 passed. B01 and B07 show why contextual support still matters in review. |
| Leave clean prose alone | Explicit. B02, B05, B06, and B11 all passed unchanged. |
| No hype or marketing jargon | Explicit in vocabulary and anti-pattern sections, with a factual replacement example. |
| No em dash or en dash in mutable prose | Explicit. Protected-literal exemptions are also explicit. |
| No semicolon, exclamation point, or mid-sentence colon | Explicit, including the allowed block, list, label, and code-introduction exception. |
| No manufactured rule of three | Explicit, while allowing the number of points the material actually requires. |
| No `here's the thing` | Explicit. |
| No formulaic contrast framing | Explicit, while allowing supported factual comparison. |
| Spoken delivery | Covers main-point order, first-hearing clarity, contractions, pronounceability, concrete names and quantities, ambiguous pronouns, filler, visual notation, and read-aloud review. |
| Neutral high-risk examples | Present for hype, plain language, punctuation, three-part padding, contrast formulas, and restraint. |
| Context budget | `defaults.md` measured 1,157 raw lexical units and 1,447 guarded units, below the strict 1,500 limit. |

The canon scan found no LiveKit terminology, SEO policy, biography, affiliation, branded voice, product opinion, company claim, social-platform rule, or channel-specific residue. Generic words such as `marketing` appear only to define prohibited jargon, not to carry a brand or campaign policy.

## Corrections

No canon or fixture defect was confirmed, so the default content version remains `0.1.0` and no version links change. The only repository changes are this review artifact and honest index entries in the evaluation results and changelog.

## Validation

- `ruby scripts/validate.rb` passed repository contracts, fixtures, links, runtime contents, and context budgets.
- `ruby scripts/test_validate.rb` passed 5 runs and 15 assertions with no failures, errors, or skips.
- Both Ruby scripts passed syntax checks.
- Ruby Psych parsed every YAML file and every Markdown frontmatter block.
- Whitespace checks passed, and the repository has no configured remote.
- The optional Skill Creator Python validator could not run because PyYAML is not installed. No dependency was installed. The documented Psych-based fallback passed.

## Remaining risks

- A fully anonymous prose-only packet cannot fairly test composition when the operation and delivery setting determine the task. Future packets should reveal those task parameters without revealing expected outcomes.
- `Factual comparison is allowed` can be misread when support exists only in hidden context. The surrounding grounding and restraint rules resolve the issue, but future reviews should track this ambiguity.
- The guarded count leaves 53 units below the 1,500 threshold. Any later default-canon change will need tight budget review.
- This Phase 2 review used one fresh reviewer session. Cross-host behavior and personalized-profile preference are later release-gate work and were not inferred from this result.
