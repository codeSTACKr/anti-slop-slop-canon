---
name: anti-slop-slop-canon
description: Write, compose, rewrite, edit, or audit everyday text such as notes, updates, posts, emails, docs, scripts, narration, and voice-agent replies. Applies your voice without AI-writing habits. Also covers voice onboarding or setup, profile inspection or refresh, and realtime style-prompt requests.
---

# Anti-Slop Slop Canon

Use default content version `0.1.0`.

## Resolve scope and one bundle

- In a project copy, inspect only `<project-root>/.anti-slop-slop-canon/`; never inspect or fall back to global state. Otherwise inspect only `~/.config/anti-slop-slop-canon/`.
- Validate `voice-profile.md` with [references/profile-schema.md](references/profile-schema.md). Require schema `1.0.0`, active scope, every required section, and actionable rules. Load it alone; otherwise load [references/defaults.md](references/defaults.md) alone. Report invalidity after the task and offer a previewed repair.
- When profile and `settings.md` are absent, gate the first natural-language task: read [references/onboarding.md](references/onboarding.md) and offer personalize, defaults, or defer before writing. Also read it for explicit onboarding, setup, or voice learning; otherwise do not.
- With a profile, compare its loaded `defaults_version` to `0.1.0` without reading defaults. Finish the task with that profile before any notice or lifecycle action.

## Protect and route

- Select spoken only when text is clearly meant to be heard. Otherwise use written without asking.
- Preserve meaning, facts, uncertainty, intent, exact quotations, code, structured data, and legally fixed wording. Reject detector-evasion framing and offer clarity or voice editing.
- Read [references/operations.md](references/operations.md). Route explicit operations and lifecycle choices; infer compose for creation and rewrite for revision.
- Apply one bundle and mode. Silently check meaning, exemptions, mode, and rules, then fix only mutable prose.
- Return clean compose or rewrite output. Add reasoning or a diff only when requested. Audit without editing.
