# Phase 3 contract review

Date: 2026-07-17

Target commit: `c159c7ae31558580f047c4b8e5969ae8be128027`

## Verdict

Pass after narrow corrections. The router and operations contract now satisfy the Phase 3 build plan without changing the Phase 2 default canon or either version field. The review confirmed three defects in the target commit: profile validity was underspecified, mismatch handling presented later lifecycle choices as if they were available, and fixture validation relied on shallow text-presence checks. Several root and user-doc statements also remained frozen at Phase 1 and misstated the current boundary.

No Phase 4 or Phase 5 behavior was added. The review commit contains only contract clarification, stronger maintainer checks and regression tests, current-state documentation, this result, and its indexes.

## Baseline and method

An independent reviewer session performed this review. Before editing, `HEAD` was exactly `c159c7ae31558580f047c4b8e5969ae8be128027`, the worktree was clean, branch `main` had no configured remote, and history ended with the Phase 3 implementation after the Phase 2 review and canon commits.

The reviewer read the planning handoff, build plan, decision log, repository README, full target commit and patch, every changed file, current schema, defaults, profile template, operations, validators, tests, fixture contract, seven Phase 3 fixtures, foundational protected-content fixture, Phase 2 review artifact, and current documentation. Passing validation was treated as evidence to attack, not as the verdict.

## Requirement verdicts

1. **Trigger coverage: pass.** Frontmatter covers compose, rewrite, edit, audit, prose, messages, documents, scripts, narration, prepared speech, voice-agent text, profile inspection, and realtime style-prompt requests. The body limits profile and realtime work to shipped inspection or retrieval behavior.
2. **Scope isolation and one-bundle resolution: pass after clarification.** A project copy resolves only the project profile path and never checks global state. Outside project scope, only the global profile path is considered. A profile must match the active scope. Runtime loads one valid profile or bundled defaults, never both.
3. **Fallback and version behavior: pass after clarification.** A usable profile must use schema `1.0.0`, match scope, retain required sections, and contain actionable rules. Missing or unusable profiles fall back to defaults without blocking, with an invalid-file notice after the task. A `defaults_version` mismatch keeps the profile active, never loads defaults, and reports after the task. Later refresh, keep, and defer persistence is explicitly unavailable in Phase 3.
4. **Written and spoken choice: pass.** Spoken mode requires clear listening intent. Narration, prepared remarks, text-to-speech copy, announcements, and voice-agent responses qualify. Ambiguous cases silently use written mode without a question.
5. **Preservation invariants: pass.** Operations protect exact quotations, code in any form, structured data, and legally fixed wording byte for byte. Rewrite and second-pass instructions preserve meaning, facts, uncertainty, intent, format, protected-span position, useful formatting, and deliberate rhythm.
6. **Operation completeness and delivery: pass.** Compose, rewrite, audit, profile, and realtime routes are defined. Ordinary creation and revision route predictably. Compose and rewrite return clean content. Audit does not mutate. Explanations, reasoning, rule mappings, and diffs require an explicit request. The second pass checks meaning, facts, uncertainty, intent, format, protected bytes, mode, active-bundle compliance, unsupported claims, edit restraint, and clean delivery.
7. **Later-phase boundary: pass after correction.** Phase 3 does not onboard, learn from samples, create or persist profiles, refresh profiles, save mismatch choices, compile realtime prompts, or synthesize missing realtime files. Existing active-scope realtime files may only be returned unchanged. Documentation now states these boundaries consistently.
8. **Runtime layout and budgets: pass.** Runtime remains Markdown-first: `SKILL.md`, three Markdown resources, one Markdown asset, and generated `agents/openai.yaml`. There are no runtime scripts, packages, extractors, or duplicate rule files. Guarded counts are 590 for the complete router against `<600`, 1,447 for defaults against `<1,500`, and 138 for the profile template against `<1,500`.
9. **Fixture and validator strength: pass after correction.** All seven Phase 3 fixtures contain concrete inputs, routing expectations, protected literals, facts, and negative assertions. Validation now checks metadata and contract text in the correct fixture sections instead of accepting words moved anywhere in a file. The foundational mixed exemption is also required and protects quote, inline code, JSON, and legal text. Mutation tests prove failure when profile scope validation, all-code-forms protection, later-phase boundaries, exact-quote byte preservation, assertion placement, required fixtures, or legal coverage regress.
10. **Documentation and metadata accuracy: pass after correction.** README and interface metadata describe shipped routing while retaining the pre-release warning. Installation, onboarding, profile, realtime, contribution, evaluation, and template copy now distinguish Phase 3 behavior from Phase 4 and Phase 5 work.

## Confirmed defects and corrections

### Profile validity was too loose

The target router said to load a valid profile but did not say that schema compatibility, active scope, all required sections, and actionable content were part of validity. A structurally recognizable but wrong-scope, unsupported-schema, or empty profile could therefore be treated as valid. The router now makes those gates explicit, and validation includes a profile-scope mutation test.

### Mismatch choices crossed the Phase 5 boundary

The target operations file told Phase 3 to offer refresh, keep, or later while also saying not to persist or recompile. Those choices cannot behave according to the lifecycle contract until Phase 5. Phase 3 now reports the mismatch after the task and explains the later lifecycle without presenting unavailable actions.

### Fixture checks were shallow

The target validator checked a few snippets anywhere in each file. Important facts, protected bytes, clean-output rules, or assertion placement could be removed while validation still passed. The contract now checks each fixture's metadata, input facts and literals, expected routing, and assertions in their required sections. The preexisting mixed protected-content fixture is now mandatory for legal wording and inline protected forms.

### Current-state documentation was stale

Several pages still described the repository as Phase 1, deferred runtime resolution that now ships, or implied the first implementation had not landed. Copy was updated to state what Phase 3 provides and what remains deferred. The profile template's schema and version metadata did not change.

## Validation and integrity

- `ruby scripts/validate.rb`: pass.
- `ruby scripts/test_validate.rb`: 15 runs, 45 assertions, no failures, errors, or skips.
- `ruby -c scripts/validate.rb` and `ruby -c scripts/test_validate.rb`: syntax pass.
- Ruby Psych fallback: parsed every YAML file and every Markdown frontmatter block.
- Skill Creator `quick_validate.py`: could not start because `PyYAML` is absent. No dependency was installed. The documented Psych fallback passed.
- `git diff --check`: pass.
- Runtime allowlist and local-link checks: pass through repository validation.
- Phase 2 source integrity: `defaults.md` and `profile-schema.md` are unchanged from the Phase 2/target history. The Phase 2 review artifact is unchanged. The profile template changed only its stale phase note, not schema, defaults version, or content version.
- Repository history, final worktree cleanliness, and absence of remotes are rechecked after the review commit.

## Remaining risks

- The router has 10 guarded units of headroom and defaults have 53. Both are strictly below the repository limits, but later edits need deliberate budget review.
- Mechanical checks establish contract integrity, not model output quality. Cross-host execution in Claude Code, Codex, and Cursor remains a later release gate and is not claimed here.
- Whether profile prose is genuinely actionable requires host judgment. Phase 3 supplies a clear fallback rule, but a deterministic validator cannot fully decide prose usefulness.
- No realtime prompt asset ships, so Phase 3 retrieval is contract-reviewed but has no bundled success-path artifact to execute.

## Blockers

None. Phase 3 is ready for handoff. This review does not authorize Phase 4, publication, remote configuration, or pushing.
