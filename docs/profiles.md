# Voice profiles

Defaults and personal profiles share the contract in `skills/anti-slop-slop-canon/references/profile-schema.md`. Schema and content versions advance independently.

A global profile belongs in `~/.config/anti-slop-slop-canon/voice-profile.md`. A project profile belongs in `<project-root>/.anti-slop-slop-canon/voice-profile.md`. Project-scoped resolution never falls through to global state.

Profiles are complete, directly editable bundles. Runtime resolution loads one valid in-scope profile or the bundled defaults, never both. Phase 4 onboarding compiles and previews all ten sections, including written and spoken guidance, then saves only after explicit approval. Explicit answers outrank consistent sample traits, which outrank defaults; product invariants remain non-overridable.

The approved profile and personalized realtime module are staged and validated together before replacement. Direct profile editing, approved refresh, mismatch-choice persistence, and standalone prompt regeneration remain Phase 5 work.
