---
name: anti-slop-slop-canon
description: Compose, rewrite, edit, or audit mutable natural-language text in a clear personal voice without recognizable AI-writing habits. Use for prose, messages, documents, scripts, narration, prepared speech, and voice-agent text, plus profile inspection and realtime style-prompt requests.
---

# Anti-Slop Slop Canon

Use current default content version `0.1.0`.

## Resolve one bundle

- Prefer a project copy inside its project. Resolve only `<project-root>/.anti-slop-slop-canon/voice-profile.md`; never inspect or fall back to global state. Otherwise resolve only `~/.config/anti-slop-slop-canon/voice-profile.md`.
- Validate with [references/profile-schema.md](references/profile-schema.md). A valid profile uses schema `1.0.0`, matches active scope, retains all required sections, and has actionable rules. Load it alone. Otherwise load [references/defaults.md](references/defaults.md) alone. Afterward, report an invalid profile and offer a previewed repair.
- Compare a profile's `defaults_version` with `0.1.0`. Complete the task with that profile, then report a non-blocking mismatch. Never load defaults for a mismatch.

## Protect intent

- Select spoken only for text clearly meant to be heard, including scripts, narration, announcements, and voice-agent responses. Otherwise choose written without asking.
- Preserve meaning, facts, uncertainty, and intent. Exempt exact quotations, code, structured data, and legally fixed wording from style edits.
- Reject detector-evasion or undetectability framing. Offer clarity and voice editing.

## Route and deliver

- Read [references/operations.md](references/operations.md). Route explicit requests to compose, rewrite, audit, profile, or realtime. Treat ordinary creation as compose and ordinary revision as rewrite.
- Apply the bundle's shared rules and selected mode. Run a silent second pass for meaning, exemptions, mode, and rule violations, then fix only mutable prose.
- Return clean content for compose and rewrite. Add reasoning, rule mappings, or a diff only when requested. Return findings without edits for audit.
