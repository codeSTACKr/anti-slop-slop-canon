# Voice profiles

Defaults and personal profiles share the contract in `skills/anti-slop-slop-canon/references/profile-schema.md`. Schema and content versions advance independently.

A global profile belongs in `~/.config/anti-slop-slop-canon/voice-profile.md`. A project profile belongs in `<project-root>/.anti-slop-slop-canon/voice-profile.md`. Project-scoped resolution never falls through to global state.

Profiles are complete, directly editable bundles. Phase 3 runtime resolution loads one valid in-scope profile or the bundled defaults, never both. Profile creation, persistent edits, refresh, and mismatch-choice persistence remain deferred to Phases 4 and 5.
