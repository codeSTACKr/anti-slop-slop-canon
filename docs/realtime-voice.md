# Realtime voice prompt

No bundled or generated realtime prompt ships yet. Phase 3 can return an existing active-scope `realtime-voice-prompt.md` unchanged. A later generated prompt will be a compact style-only module derived from the active profile. It must not define tools, safety, facts, jobs, handoffs, or orchestration.

Prompt generation and persistence belong to Phases 4 and 5. Phase 3 does not synthesize or save a replacement when the file is missing.
