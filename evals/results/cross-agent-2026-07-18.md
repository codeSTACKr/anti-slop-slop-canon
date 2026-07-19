# Cross-agent core matrix run, Claude Code, 2026-07-18

## Provenance and how to read this

This is a model-orchestrated run of the core matrix's Claude Code column. An orchestrating Claude session prepared isolated workspaces, ran each fixture in a fresh headless Claude Code session, and scored the responses against each fixture's assertions. Under `evals/model-judge.md` this counts as maintainer-run model evidence, not the human gate. Every verdict below is provisional until Jesse reviews the quoted evidence and ratifies or overturns the cell. Raw outputs live in `host-runs/cc-2026-07-18/` at the workspace root, outside this repository.

- Host: Claude Code CLI 2.1.214, headless `claude -p`, permission mode `acceptEdits`.
- Model: default resolution, `claude-opus-4-8[1m]` with a `claude-haiku-4-5` helper.
- Skill install: project scope, `.claude/skills/anti-slop-slop-canon/`, one isolated workspace per fixture.
- Codex and Cursor columns were not run.

## Harness findings that affect anyone testing this skill

1. **Project skills do not load in a non-git directory.** The first full batch ran in plain directories and the skill was silently absent from every session, confirmed by a skill-list probe. After `git init` in each workspace the same probe found the skill. Anyone scripting headless checks of this skill must run inside a git repository or the results measure the bare model.
2. That accidental first batch doubles as a defaults-off baseline. Without the skill the model produced trailing chat offers, Markdown and stage directions in spoken output, an invented apology in the service announcement, and no first-use gate. The contrast against the with-skill runs below is large and consistently in the skill's favor.

## How each fixture's Context was realized

- Defaults-active fixtures got `.anti-slop-slop-canon/settings.md` containing `setup: defaults`.
- `personalized-maker-update` got a complete valid project profile compiled for the fixture's stated traits, including the exact sign-off `Back to the bench.`
- `phase-5-mismatch-notice` ran as a version analog. The shipped router declares defaults `0.1.0`, so the profile recorded `defaults_version: "0.0.1"` instead of the fixture's literal `0.1.0` against `0.2.0` pair.
- Multi-line Inputs (`phase-3-exact-quote-exemption`, `phase-3-code-exemption`, `phase-3-structured-data-exemption`, `exempt-fixed-content`) were referenced from an `input.md` in the workspace, which the matrix procedure allows.
- Two schematic Inputs that say "from the supplied facts" without supplying facts (`phase-4-first-use-choice`, `phase-5-mismatch-notice`) had two neutral facts appended to the prompt.
- `already-good-field-note` has no instruction in its Input, so the passage was framed with the same `Polish this:` prefix the rewrite-routing fixture uses.
- `phase-4-preview-before-save` was run as a real three-turn interview in a fresh workspace. The preview appeared unprompted the moment the interview became decision-complete, so the fixture's Input line was never needed.

## Verdicts

| Fixture | Verdict | Evidence summary |
| --- | --- | --- |
| `phase-3-compose-routing` | PASS, marginal | Facts preserved, nothing invented, clean prose. One trailing offer, "Want me to save this to a file or adjust the tone," which is chat chrome around the output rather than a banned label, explanation, checklist, or diff. |
| `phase-3-rewrite-routing` | PASS | Returned only `Room 12 reopens at 2 PM, once the window repair is done.` Facts kept, hype and exclamation gone, no preamble or reasoning. |
| `phase-3-audit-routing` | PASS | Named the canned opener, the mid-sentence colon, the hype word, and the exclamation point, mapped each to bundle rules, supplied no rewrite. Note that the report's own prose used an em dash once. |
| `phase-3-spoken-routing` | PASS | Plain spoken narration, no Markdown, no stage directions, switch facts and the closed-guard condition intact. Adds mild illustrative elaboration beyond the supplied facts, which no assertion here bans. |
| `phase-3-exact-quote-exemption` | FAIL | Inner quote content survived byte for byte, including the colon, em dash, and exclamation point, but the enclosing curly quotation marks came back as straight marks, and an unrequested explanation followed the output. Two assertions violated. |
| `phase-3-code-exemption` | PASS | Returned the direct one-line explanation plus the code block byte for byte. The `input.md` on disk kept its original content. |
| `phase-3-structured-data-exemption` | PASS | `Here's the configuration.` plus both data blocks exact, no explanation, no diff. Cleanest response of the run. |
| `exempt-fixed-content` | PASS | Quote, code, JSON, and legal line preserved byte for byte including the curly quotes, intro edited with restraint, explanation present but not banned by this fixture. |
| `already-good-field-note` | PASS, marginal | Passage returned unchanged and no-mutation treated as success. The response also explained the decision unprompted and floated one optional tweak, which the edit-restraint rubric should dock even though every assertion holds. |
| `personalized-maker-update` | PASS, marginal | All four facts present, clipped fragments, dry understatement, exact `Back to the bench.` sign-off, nothing invented. No explicit first-person pronoun appears, so the first-person assertion is satisfied only implicitly. |
| `phase-4-first-use-choice` | FAIL, reproduced twice | With no state present, both fresh sessions wrote the update immediately, never offered personalize, defaults, or defer, and wrote no `settings.md`. The first-use gate did not fire on an implicit writing task in headless Claude Code. Output prose itself was clean. |
| `phase-4-preview-before-save` | PASS | Preview showed the complete ten-section profile with valid frontmatter, the complete realtime module, one written and one spoken example, then offered approve, revise one trait, or continue the interview, and wrote nothing to disk. The state directory stayed absent through the preview. |
| `phase-5-mismatch-notice` | FAIL | The task completed first in the profile voice and the notice appeared after the content, correctly placed and non-blocking. But `settings.md` still contains only `setup: personalized`, so the shown notice state was never recorded, and the notice offered refresh with only an implicit keep and no later option. |
| `spoken-service-delay` | PASS | All five facts preserved, delay stated before the ticket alternative, `6:30 this evening` spoken naturally, no Markdown, no apology padding, no cancellation implication. |

## Interview notes for `phase-4-preview-before-save`

Turn 1 asked for writing kinds, desired sound, and an optional sample in a single message, which stretches the one-question-per-turn rule even though it was framed as one composite question. Turn 2 correctly isolated the single genuinely ambiguous trait, contractions, after receiving a sample. Turn 3 produced the full preview at decision-complete without waiting for the user to ask. The realtime module's guarded-unit count was not measured in this run.

## Follow-ups this run motivates

1. The `phase-4-first-use-choice` failure is the serious one. It reproduced twice in fresh sessions, but the limitation protocol requires a second host before calling it host-specific rather than a contract defect. Run the same fixture in Codex or Cursor. If it fails there too, the first-use gate language in `SKILL.md` likely needs strengthening, since a mundane writing prompt may not activate the skill at all.
2. The `phase-5-mismatch-notice` settings write and the missing later option should be re-tested interactively before treating them as defects, since headless sessions may end before housekeeping writes.
3. The exact-quote failure is narrow, outer quotation glyphs plus an unrequested explanation, and looks fixable by contract wording if it recurs.
4. Jesse should ratify or overturn each cell above, then initial the core matrix in `evals/cross-agent-matrix.md`. Blank Codex and Cursor columns remain the next matrix work.
