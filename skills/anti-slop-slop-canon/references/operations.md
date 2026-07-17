# Operations

Use these workflows after the router resolves one style bundle and selects written or spoken mode. Keep protected content outside all transformations.

## Operation selection

Choose one operation from the user's requested outcome.

| Request | Operation |
| --- | --- |
| Create, draft, answer, summarize, or continue mutable prose | `compose` |
| Rewrite, edit, polish, shorten, expand, or adapt supplied prose | `rewrite` |
| Review, check, diagnose, or list style violations without changing text | `audit` |
| Start setup, learn a voice, or create or replace a profile | `onboarding` |
| Inspect the active voice, profile, scope, versions, or lifecycle state | `profile` |
| Refresh a profile, keep it, or remind later | `profile lifecycle` |
| Retrieve or explicitly regenerate a voice-agent style module | `realtime` |

Prefer an explicit operation over inference. Treat a request for both review and correction as `rewrite`. Include an explanation or diff only when asked. Do not turn operation names into shell commands.

## Shared preparation

1. Identify mutable prose and protected spans before drafting or editing.
2. Preserve exact quotations, code in any form, structured data, and legally fixed wording byte for byte. Preserve their position unless the user explicitly requests a move.
3. Use spoken guidance only when output is clearly for listening. Scripts, narration, station announcements, prepared remarks, text-to-speech copy, and voice-agent responses qualify. Labels such as message, post, page, note, document, or response are written unless context clearly says they will be heard. Default every ambiguous case to written without asking.
4. Follow compatible explicit current instructions, then the selected complete bundle. Never supplement a profile with defaults.

## Compose

1. Extract purpose, audience, facts, constraints, and format.
2. Draft only from supplied or established information. Do not invent evidence, claims, personal experience, or enthusiasm.
3. Apply the active bundle's shared rules and selected mode guidance.
4. Preserve required protected material exactly.
5. Return only ready-to-use content unless an explanation was requested.

## Rewrite

1. Make the smallest changes needed for the request and active bundle.
2. Preserve meaning, factual detail, uncertainty, effective voice, useful formatting, and deliberate rhythm.
3. Leave clean prose unchanged. Do not normalize harmless personal choices.
4. Edit mutable prose around protected spans without changing them.
5. Return only revised content. When asked for a diff, add a focused before-and-after or unified diff. When asked for reasoning, map material changes to active rules without exposing hidden chain-of-thought.

## Audit

1. Inspect without rewriting.
2. Report only concrete violations or risks, cite the active-bundle rule, and identify affected mutable text.
3. Separate hard violations from optional improvements. Report no issue when text complies.
4. Ignore prohibited patterns inside protected content.
5. Keep the report concise. Rewrite only on a separate request.

## Onboarding

Read [onboarding.md](onboarding.md). Use it for the first-use choice and every explicit onboarding or voice-learning session. On explicit reruns, do not alter the current profile, prompt, or settings until the new preview is approved.

## Profile

- On explicit inspection, return the active profile unchanged when one exists, plus its selected state path, scope, schema version, content version, `defaults_version`, and minimal lifecycle settings. For bundled defaults, report its metadata and that no personal profile exists. Inspection is read-only.
- If a profile is unusable, keep defaults selected for the task, explain the defect afterward, and offer a previewed repair. Never overwrite or silently repair it.
- Treat direct profile edits as authoritative. Do not normalize, regenerate, or replace the profile or realtime module because the file changed. Route explicit re-onboarding through onboarding and preserve current state through approval.

## Profile lifecycle

Use only metadata already loaded from the router and winning profile to detect a defaults mismatch. Do not read defaults or another scope for detection. Complete the current writing task with the profile alone. After returning its content, inspect only in-scope `settings.md`. For the current mismatch version, `shown`, `refresh`, and `keep` suppress another notice. `later` suppresses it until its date is due. Show one non-blocking `refresh`, `keep`, or `later` notice only for a new version or a due `later` state. Record `defaults_notice_version` and `defaults_notice_state: shown` only after showing it. If an earlier refresh was interrupted and no refresh workflow is active, recover its transient `refresh` state to `shown` without another notice.

Store lifecycle state as minimal YAML-like lines in `settings.md`, preserving `setup` when present. Use `defaults_notice_version`, `defaults_notice_state`, and, only for `later`, `defaults_remind_after`. Quote the semantic version and ISO `YYYY-MM-DD` date. Accept only `shown`, `refresh`, `keep`, or `later` as the notice state.

- `refresh`: record the transient choice immediately before starting a separate recompilation. Only then load current defaults alongside the profile. Treat current profile instructions, including direct edits, as approved preferences over new defaults. Compile a complete replacement profile and realtime module with the onboarding precedence, current schema, active scope, new `defaults_version`, and an incremented profile content version. Preview both complete files plus written and spoken examples. Require explicit approval. Never merge or write automatically. Stage and validate the pair before rollback-protected replacement. On approval, clear notice keys because profile metadata now matches. On cancellation or failure, leave the current pair active, restore `defaults_notice_state: shown` for that version, and remove `defaults_remind_after`. This recovery suppresses duplicate notices while allowing an explicit retry.
- `keep`: record the mismatched version with `defaults_notice_state: keep`. Never notify for that defaults version again. Do not change either generated file.
- `later`: record that version, `defaults_notice_state: later`, and `defaults_remind_after` exactly 14 calendar days after the choice. Notify at most once when that local date arrives, after the current task, then set the next date exactly 14 calendar days after the local date when the reminder was shown. Do not advance from an overdue date or notify before the next date. A newer mismatch version starts its own notice state.

Never perform lifecycle work above the installed scope. A project copy reads and writes project state only. A global copy reads and writes global state only. A mismatch, notice, keep, or later choice never regenerates either generated file.

## Realtime

- Treat a normal voice-agent response as spoken compose or rewrite. Do not load a realtime prompt for that task.
- For an explicit module request, return the active scope's `realtime-voice-prompt.md` unchanged when present. Otherwise return [../assets/realtime-voice-prompt.md](../assets/realtime-voice-prompt.md).
- Generate a personalized module only during approved onboarding, approved refresh, or an explicit regeneration request. For explicit regeneration, use the active profile alone, preview the complete module, require explicit approval, validate it, and replace only the in-scope prompt with rollback protection. Do not rewrite the profile or load defaults.
- Keep every module style-only and within its guarded budget.

## Silent second pass

Before returning compose or rewrite output, silently verify and correct mutable prose only:

- Preserve requested meaning, facts, uncertainty, intent, format, and protected bytes.
- Use the selected written or spoken guidance consistently.
- Satisfy the active bundle without loading another bundle.
- Remove unsupported claims and unnecessary edits.
- Emit clean content unless the user requested an explanation or diff.

For audit, do not treat exempt material as violations. Reveal this checklist only when asked for an explanation.
