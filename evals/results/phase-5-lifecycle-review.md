# Phase 5 lifecycle review

Date: 2026-07-17

Target commit: `f6aff731672115f658fb92a32c5a2d9364e69446`

## Verdict

Pass after two narrow corrections. The Phase 5 contract preserves direct edits, scope isolation, explicit approval, pair rollback, realtime regeneration boundaries, and one-bundle execution. The independent state-machine walk found two lifecycle defects that the target tests did not challenge. A cancelled, failed, or interrupted refresh could leave the transient `refresh` state stranded. A reminder shown after an overdue `later` date could advance from the old deadline and leave the next date in the past, allowing notices on successive tasks.

The corrections recover an inactive `refresh` state to `shown` without another notice and restore `shown` on refresh cancellation or failure. Due reminders now schedule the next date 14 local calendar days after the day the reminder was actually shown. Frozen defaults, schema, profile template, and prior review artifacts are unchanged.

## Baseline and method

An independent reviewer session performed this audit. Before editing, `HEAD` was exactly the target commit, the worktree was clean on `main`, and no remote was configured.

The reviewer read the Skill Creator instructions, `HANDOFF.md`, both complete planning files, the implementation task record and its evidence, the complete target commit and parent patch, the current router and every bundled runtime file, all user and maintainer docs, every fixture, both validators, all mutation tests, and every prior review artifact. Green tests and the implementation summary were treated as claims to attack.

Review work included requirement-by-requirement tracing, a manual lifecycle state machine, delayed and interrupted transition walks, section-scoped fixture review, adversarial source mutations, frozen-file hashes, context counts, runtime allowlist and link checks, YAML parsing, history checks, repository object checks, and no-remote verification. No user state, helper, dependency, remote, Phase 6 artifact, or external system was created.

## Lifecycle state trace

| Starting state | Event | Reads and active bundle | Persistent result |
| --- | --- | --- | --- |
| No profile and no settings | First natural-language task | Project or global scope only. Onboarding gate before defaults | One explicit setup choice. No lifecycle keys without a profile |
| Valid profile with matching defaults version | Ordinary task | Winning profile alone | No notice or lifecycle write |
| Mismatch with no state for current version | Ordinary task | Router and winning-profile metadata only. Profile alone for task | After task, show one notice, then record current version as `shown` |
| Current version is `shown` | Later ordinary task | Profile alone | Suppress another notice |
| Current version is `keep` | Any later task | Profile alone | Suppress that version permanently. Generated files unchanged |
| Current version is `later`, date not due | Ordinary task | Profile alone | Suppress notice and preserve date |
| Current version is `later`, date due or overdue | Ordinary task | Profile alone | After task, show once and set the next date 14 days after the local display date |
| New mismatch version | Ordinary task | New router version and profile metadata only | Start one notice state for the new version after the task |
| User chooses `refresh` | Separate lifecycle operation | Record transient choice, then load profile and current defaults only for recompilation | No generated-file replacement before preview and approval |
| Refresh cancelled or fails | Refresh workflow | Prior pair remains active | Restore current version to `shown`, remove reminder date, and suppress a duplicate notice |
| Refresh is interrupted | Later task with no active refresh workflow | Profile alone for task | Recover stale `refresh` to `shown` without displaying another notice |
| Refresh approved | Refresh workflow | Complete proposed pair validated before replacement | Replace pair atomically or with rollback. Clear notice keys after metadata matches |
| Profile edited directly | Inspection or ordinary task | Edited profile alone | Treat edits as authoritative. No normalization or prompt regeneration |
| Explicit re-onboarding | Onboarding workflow | Current state remains active through preview | Replace only after approval with pair validation and rollback |
| Explicit realtime regeneration | Realtime workflow | Active profile alone, never defaults | Preview, validate, approve, then replace only the in-scope prompt |

The trace confirms that an ordinary current task never loads two bundles. Profile plus defaults is permitted only inside a separate, explicit refresh recompilation after the prior task. Mismatch detection, notices, keep, later, inspection, direct edits, and realtime regeneration do not load both.

## Requirement findings

1. **Profile inspection and re-onboarding: pass.** Explicit inspection is read-only and reports the active path, scope, schema version, content version, defaults version, and minimal lifecycle settings. Re-onboarding uses the existing preview and approval workflow and preserves the current three-file state until an approved replacement.
2. **Direct-edit stability: pass.** A valid direct edit is authoritative. Ordinary tasks and inspection do not normalize the profile, recompile it, or synchronize the realtime module. Refresh gives current profile instructions, including direct edits, precedence over new defaults.
3. **Metadata-only mismatch detection: pass.** The router exposes the current defaults version and the already-loaded winning profile exposes its compiled version. Detection reads neither bundled defaults nor another scope. The requested task completes with the profile alone before settings inspection or notice output.
4. **Notice timing and repetition: pass after correction.** A new mismatch is recorded as `shown` only after display. `shown`, transient `refresh`, and `keep` suppress repetition. `later` alone permits a reminder when due. An interrupted refresh now recovers without another display.
5. **Minimal settings and keep: pass.** Lifecycle state uses only notice version, notice state, and a reminder date for `later`, while preserving an existing setup line. `keep` changes neither generated file and suppresses the current defaults version across later sessions. A newer version receives its own state.
6. **Later cooldown: pass after correction.** Initial deferment is exactly 14 local calendar days. A due reminder occurs only after the task. Its next date is based on the actual display date, so a late reminder cannot leave a past date and repeat on successive tasks.
7. **Refresh preview, approval, and merge boundary: pass.** Refresh is a separate complete recompilation. It is not a patch or automatic merge. The complete profile, complete realtime module, written example, and spoken example appear before explicit approval. The profile content version increments, defaults metadata becomes current, all ten sections remain, and both budgets apply.
8. **Refresh cancellation, failure, and pair rollback: pass after correction.** Both staged artifacts validate before either current file is replaced. Atomic replacement is preferred and the fallback is rollback-protected. Cancellation, validation failure, write failure, or interruption preserves the old pair and now restores a stable notice state.
9. **Realtime regeneration: pass.** Personalized regeneration occurs only during approved onboarding, approved refresh, or an explicit request. Standalone regeneration uses the profile alone, preserves the style-only policy exclusions and budget, and replaces only the in-scope prompt after preview and approval.
10. **Scope, storage, and package boundary: pass.** Project copies read and write project state only. Global copies use global state only. State remains limited to `voice-profile.md`, `realtime-voice-prompt.md`, and `settings.md`. The installed skill contains only the approved Markdown runtime files and generated interface metadata.
11. **Frozen contracts and documentation: pass.** Defaults, profile schema, profile template, and Phase 2 through Phase 4 review artifacts retain their target hashes. User docs accurately describe direct edits, post-task notices, refresh approval, recovery, cooldown cadence, and realtime boundaries.
12. **Tests as claims: pass after stronger proof.** The target suite checked many required phrases but omitted stale refresh recovery and overdue-date behavior. New adversarial mutations remove each recovery rule and make validation fail. Existing section-scoped fixtures now require the corrected state transitions in their assertions.

## Confirmed defects and corrections

### Refresh state could remain transient after the workflow ended

The target recorded `defaults_notice_state: refresh` before recompilation, but cancellation and failure only said to record no successful refresh. That left no deterministic state restoration. Depending on host interpretation, the stale value could suppress future communication indefinitely or be treated as an unrecognized state and trigger duplicate notices.

The contract now treats `refresh` as transient. Cancellation or failure restores `shown` for the same version and removes any reminder date. If a process is interrupted, a later task recovers an inactive `refresh` to `shown` without displaying another notice. The user may still retry refresh explicitly.

### An overdue reminder could retain a past next date

The target said to advance a reminder date by another 14 days. If the stored deadline was weeks overdue, adding 14 days to that deadline could still produce a date in the past. The next task could then show another notice, violating the cooldown.

The contract now sets the next date exactly 14 days after the local date on which the reminder is displayed. This keeps the cadence deterministic and guarantees a full cooldown even when the user returns late.

## Adversarial checks

- Replacing interrupted-refresh recovery with “leave the refresh state unchanged” fails the lifecycle source contract.
- Replacing overdue-date recovery with advancement from the prior deadline fails the lifecycle source contract.
- Moving failed-refresh pair preservation out of fixture assertions still fails.
- Weakening metadata-only detection, post-task ordering, direct-edit precedence, explicit approval, no-automatic-merge, keep suppression, scope isolation, or realtime regeneration boundaries still fails.
- Removing Phase 5 fixtures or moving decisive notice clauses into the wrong section still fails.

## Validation and integrity

- `ruby scripts/validate.rb`: pass.
- `ruby scripts/test_validate.rb`: 50 runs, 150 assertions, no failures, errors, or skips.
- Ruby syntax checks: pass for both validator scripts.
- Ruby Psych: parses every YAML document and Markdown frontmatter block.
- Skill Creator `quick_validate.py`: cannot start because `PyYAML` is absent. No dependency was installed. The documented Psych fallback passes.
- Context budgets: router 466 raw and 583 guarded, defaults 1,157 and 1,447, profile template 221 and 277, realtime module 239 and 299.
- Runtime allowlist and local links: pass through repository validation.
- `git diff --check`, `git log --check`, and `git fsck --full`: pass. Object checking reports only the four pre-existing dangling blobs.
- Frozen-source and prior-review hashes match target commit `f6aff73`.
- Final history contains one focused local review commit over `f6aff73`. The worktree is clean and `git remote -v` is empty.

## Residual risks

- Lifecycle behavior remains a Markdown contract executed by the host model. There is no distributed transaction or date-handling runtime, so host compliance is not mechanically guaranteed.
- A single current-version notice record assumes defaults versions move forward. A deliberate rollback to an older version after a newer notice could lose an older `keep` decision. Expanding settings into a version history would exceed the approved minimal schema and is not justified in this review.
- Pair rollback depends on host filesystem support and correct recovery execution. The contract and fixtures are explicit, but do not emulate filesystem failure.
- Cross-host execution and editorial quality remain Phase 6 work. This review does not claim Claude Code, Codex, and Cursor behavior from deterministic source checks.
- The router retains 17 guarded units of headroom and frozen defaults retain 53. Future changes require budget discipline.

## Blockers

None. Phase 5 is ready for handoff. This review does not authorize Phase 6, installation, publication, remote configuration, or pushing.
