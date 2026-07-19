# Phase 4 onboarding and privacy review

Date: 2026-07-17

Target commit: `7303f657b31c00600ae1d943df099e4fefcbd750`

## Verdict

Pass after narrow corrections. The Phase 4 runtime contract satisfies the approved first-use, adaptive onboarding, profile compilation, preview, persistence, privacy, and realtime boundaries. The review confirmed two contract defects and four proof gaps. Personalized realtime exclusions used broad labels that did not name every prohibited variant. Pair persistence did not state clearly enough that both staged artifacts must validate before either current file is replaced. Existing fixtures did not section-check first-use task resumption after personalization, all guaranteed and native-first input paths, changed-profile rerun versioning, failed-rerun rollback, or the exact personalized realtime exclusions.

The corrections are limited to the onboarding reference, four existing fixtures, validator contracts, mutation tests, one realtime user-doc sentence, this review, and its indexes. Frozen `defaults.md`, frozen `profile-schema.md`, their versions, the profile template versions, and prior review artifacts are unchanged.

## Baseline and method

An independent reviewer session performed this audit. Before editing, `HEAD` was exactly the target commit, the worktree was clean, branch `main` had no configured remote, and history ended at the Phase 4 implementation.

The reviewer read the Skill Creator instructions, project handoff, complete build plan and decision log, the full target commit and patch, every changed file, the current router, operations and onboarding references, frozen schema and defaults, profile template, realtime asset, metadata, all Phase 4 and foundational fixtures, both validators, all mutation tests, prior Phase 2 and Phase 3 review artifacts, evaluation documentation, and user documentation. Passing tests and implementation claims were treated as evidence to challenge, not as proof.

Review consisted of requirement-by-requirement source tracing, section-scoped fixture checks, manual state-machine walks, negative-domain scans, adversarial mutation review, context counts, history and frozen-file comparisons, and the full repository validation suite. No onboarding was performed and no user state, source sample, download, helper, remote, Phase 5 behavior, or external system was created.

## Requirement verdicts

1. **First use and project isolation: pass after stronger fixture proof.** In a project copy, the router inspects only `<project-root>/.anti-slop-slop-canon/` and never global state. With no in-scope profile or settings, it conditionally loads onboarding and asks exactly one `personalize now`, `use defaults`, or `defer` choice before the natural-language task. Defaults and defer write only `setup: defaults` or `setup: deferred` in scope, load bundled defaults, and resume the task. The fixture now also requires resuming the original task with the approved profile after first-use personalization.
2. **Explicit onboarding and rerun: pass after stronger fixture proof.** Explicit onboarding bypasses the first-use choice and asks one question per turn. A rerun preserves every current state file through interview and preview. A changed approved profile increments the prior profile content version. A failed replacement restores the prior profile and prompt instead of leaving a mixed pair. First-use personalization resumes its suspended task after approval.
3. **Evidence handling: pass.** One short sample is accepted without a minimum and always offers a proceed path. Strong consistent evidence can go directly to preview when no material choice remains. Sparse evidence asks only the highest-impact unresolved question with a proceed option. Conflicts and explicit contradictions receive one focused resolution question and are never silently averaged. Analysis separates recurring voice traits from subject matter, channel formatting, quotations, borrowed text, and one-off quirks. Confidence, measurements, and evidence notes remain ephemeral.
4. **Inputs and helpers: pass after stronger fixture proof.** Pasted text, Markdown, and local plain text are accepted directly. URLs, PDFs, videos, and transcripts use host-native reading first. Paste or export is the fallback. `yt-dlp` and `pdftotext` are optional only when useful and missing, never block onboarding, and require explicit install approval. There is no provenance attestation. Named-person requests are translated into abstract cadence, formality, vocabulary, or humor traits without exact-imitation claims.
5. **Compilation: pass after ordered-precedence mutation coverage.** Compilation produces one complete actionable bundle with the exact ten schema sections, schema `1.0.0`, initial profile content version `1.0.0`, active `global` or `project` scope, defaults version `0.1.0`, and complete written and spoken guidance. The exact order is router invariants, explicit current answers, consistent sample traits, then defaults. Invariants constrain compilation but stay outside the editable profile. Higher-precedence personal choices replace conflicts. The complete profile replaces rather than supplements defaults and must remain below 1,500 guarded units.
6. **Preview and persistence: pass after correction.** Before any write, one preview contains the complete profile, complete personalized realtime module, one written example, and one spoken example. The only paths are approve, revise one trait, or continue the interview, and approval must be explicit. Both artifacts are staged in active scope and validated for metadata, scope, sections, content, and budgets before either current file is replaced. Hosts use atomic replacement when supported and a rollback-protected pair action otherwise. Failure restores the prior pair or leaves neither new file. Existing rerun state is never overwritten by a failed attempt.
7. **Privacy and retention: pass.** Active state is limited to `voice-profile.md`, `realtime-voice-prompt.md`, and minimal `settings.md`. Samples, pasted text, URLs, downloads, transcripts, source lists, extraction notes, measurements, confidence data, and onboarding analysis are not retained. User originals stay in place. Temporary derived material is discarded when the approved write completes or onboarding ends.
8. **Realtime boundary and retrieval: pass after correction.** The bundled asset and personalized-generation contract are style-only, retain no-Markdown and first-listen delivery constraints, and require 250 to 400 guarded units. They exclude jobs or roles. They exclude tools, APIs, or function calls. They exclude safety or refusal policy and facts or knowledge. They exclude conversation flow, greetings, or follow-up behavior. They exclude handoff, transfer, or escalation. They exclude interruption or barge-in behavior and orchestration or delegation. Normal spoken responses do not load a realtime module. Explicit retrieval returns the active personalized file unchanged or the bundled default. Personalized generation occurs only during approved onboarding. Standalone regeneration remains Phase 5.
9. **Router contract and budget: pass.** Frontmatter triggers composition, rewriting, editing, audit, prose, scripts, narration, voice-agent text, onboarding, profile inspection, and realtime retrieval. The router preserves project isolation, single-bundle loading, conditional onboarding, protected-content exemptions, written-by-default routing, clean output, detector-evasion rejection, and the Phase 5 mismatch boundary. Its guarded count is 564, below 600.
10. **Fixtures, tests, docs, and phase boundary: pass after stronger proof.** Ten Phase 4 fixtures plus the foundational rerun fixture now carry decisive semantics in the required sections. The validator checks metadata and section placement. Mutation tests fail on precedence reordering, preview or approval weakening, helper approval removal, pair-validation weakening, rerun rollback relocation, realtime boundary weakening, retention weakening, and budget regressions. Documentation says routing, onboarding, default realtime retrieval, and approved personalized generation ship now. It keeps profile lifecycle, mismatch-choice persistence, standalone regeneration, cross-host release evaluation, distribution, and showcase work deferred.

## Manual scenario walks

### Project first use with out-of-scope global state

Starting state: a project-scoped copy, no project profile, no project settings, and an existing global profile and settings. The router permits only the project state directory, so the global files are neither inspected nor loaded. It conditionally reads onboarding and asks one three-way choice with no questionnaire. `use defaults` writes only project `settings.md` with `setup: defaults`, loads the bundled default bundle alone, and completes the suspended project update. `defer` follows the same path with `setup: deferred`. `personalize now` writes nothing, begins the one-question interview, and resumes the project update only after explicit approval using the new project profile.

### Explicit rerun over valid current state

Starting state: a valid profile at content version `1.3.0`, matching personalized prompt, and minimal settings. Explicit onboarding bypasses the first-use choice. Each turn asks one focused question. Current files stay active and untouched while evidence is assessed and while the complete replacement pair and examples are previewed. A trait revision returns to one-question resolution and produces another complete preview. Approval of changed instructions compiles version `1.4.0`, validates both staged artifacts before replacement, and replaces the pair atomically or with rollback. A simulated second-file failure restores the original pair. No failed path leaves one new and one old artifact.

### Evidence strength and contradiction matrix

- One short note produces low-confidence internal analysis, no sample minimum, one targeted question, and an immediate proceed option.
- Four consistent cross-format samples shorten the interview and reach preview when no material preference is unresolved.
- A formal sample and a casual sample with most casual language inside a quotation exclude the quotation from stable evidence, surface the remaining conflict, and ask whether the explicit casual preference should govern. The workflow does not average formality or treat topic, formatting, borrowed language, or quirks as voice.

### Input and helper matrix

Pasted, Markdown, and local plain-text inputs are read directly. URL, PDF, video, and transcript inputs attempt native host reading first. If video reading fails while `yt-dlp` is absent, onboarding can proceed from the usable pasted sample, offer paste or export, and optionally ask approval to install the useful helper. The same rule applies to a missing `pdftotext` path. No helper is suggested when native reading succeeds. No install occurs without approval, and no extracted or supplied source enters retained state.

### Compilation, preview, and runtime use

A project user approves fragments and a casual sign-off while multiple samples support concrete workshop detail. Compilation retains router invariants outside the file, lets explicit fragment and sign-off choices replace conflicting defaults, carries consistent workshop traits, fills every remaining style decision from defaults, and emits all ten sections with written and spoken guidance. The preview includes the complete profile, complete personalized realtime module, and both examples before a write. Later normal prose loads the profile alone. A normal voice-agent reply uses spoken guidance without loading the realtime module. An explicit realtime request retrieves the active project prompt unchanged.

## Confirmed defects and corrections

### Personalized realtime exclusions were underspecified

The target used broad exclusions such as tools, safety policy, handoffs, and orchestration. Those categories imply much of the intended boundary, but they did not explicitly name APIs, function calls, refusal behavior, knowledge, greetings, follow-up behavior, transfer, escalation, barge-in, or delegation. The onboarding contract, fixture, validator, mutation test, and user doc now name the complete prohibited domain list. The bundled prompt itself contained none of these domains and did not need editing.

### Pair persistence sequencing was ambiguous

The target required staging and validation, then atomic or consistent replacement with rollback, but did not explicitly say both staged artifacts must validate before either current file is replaced. The persistence contract now states that order and calls the non-atomic path rollback-protected. A mutation test fails if validation is moved after replacement.

### Fixture proof omitted several shipped guarantees

The target prose covered first-use task resumption, native input routes, changed-rerun versioning, and rollback, but the semantic fixture map did not require them in their decisive sections. Existing fixtures were strengthened rather than adding duplicate scenarios. The foundational conflicting-evidence fixture is now part of the Phase 4 contract map. New mutations prove precedence reordering and rerun rollback relocation fail.

## Validation and budgets

- `ruby scripts/validate.rb`: pass. It covers schemas, exact runtime allowlist, fixture section contracts, local links, realtime policy boundaries, and budgets.
- `ruby scripts/test_validate.rb`: 36 runs, 108 assertions, no failures, errors, or skips.
- `ruby -c scripts/validate.rb` and `ruby -c scripts/test_validate.rb`: syntax pass.
- Ruby Psych fallback: parsed every YAML file and every Markdown frontmatter block.
- Skill Creator `quick_validate.py`: could not start because PyYAML is absent. No dependency was installed. The documented Psych fallback passed.
- `git diff --check`, `git log --check`, and `git fsck --full`: pass. The object check reported only unreachable blobs left by prior local work, not repository corruption.
- Runtime allowlist and local-link checks: pass through repository validation.
- Frozen-source integrity: current `defaults.md`, `profile-schema.md`, and both prior review artifacts have the same Git object hashes as target commit `7303f65`. Defaults remain identical to canon commit `3f6297a`. The schema history still ends at Phase 1 commit `d0fbfb6`.
- Baseline and final remote checks: no configured remote.

| Artifact | Raw units | Guarded units | Gate |
| --- | ---: | ---: | --- |
| `SKILL.md` | 451 | 564 | `<600` |
| `defaults.md` | 1,157 | 1,447 | `<1,500` |
| `voice-profile.template.md` | 221 | 277 | `<1,500` |
| Bundled realtime module | 239 | 299 | `250..400` |

Generated profiles and personalized realtime modules are not static repository artifacts. Their generation contract requires the same guarded gates, and approval persistence requires staging and validating each generated artifact before replacement.

## Remaining risks

- Phase 4 is a Markdown behavioral contract. Atomic replacement and rollback depend on the active host's filesystem capabilities and correct agent execution. The contract is explicit, but no distributed runtime script performs the transaction.
- Deterministic checks can prove required instructions, placement, exclusions, and budgets. They cannot prove that every host model will infer stable traits well or produce a faithful personal voice. Cross-host and blind editorial evaluation remain later release gates.
- The default bundle has 53 guarded units of headroom and should remain frozen unless a separately authorized change is unavoidable.
- Direct profile editing, refresh, mismatch-choice persistence, reminder cooldowns, and standalone realtime regeneration remain intentionally unavailable until Phase 5.

## Blockers

None. Phase 4 is ready for handoff. This review does not authorize Phase 5, installation, publication, remote configuration, or pushing.
