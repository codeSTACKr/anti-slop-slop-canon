# Onboarding

On the first natural-language task in a scope with no profile or setup state, the skill asks one choice: personalize now, use defaults, or defer. Defaults and defer record only minimal local setup state and resume the original task with the bundled style. Explicit onboarding can start or rerun at any time.

Personalization asks one question per turn. It establishes what you write and how you want to sound, then requests samples early. Pasted text, Markdown, and local text files always work. The host may also read supplied URLs, PDFs, videos, or transcripts when it has native access. Missing helpers such as `yt-dlp` or `pdftotext` are optional, never block setup, and require approval before installation.

One short sample is accepted. Strong consistent evidence shortens the interview. Sparse or conflicting evidence leads to focused questions, with an option to proceed. The skill does not verify source ownership or provenance. Named-person imitation requests are translated into abstract traits rather than a promise of exact imitation.

Before saving, the skill shows the complete profile, complete realtime module, one written example, and one spoken example. You may approve, revise one trait, or continue the interview. Approval writes the profile and prompt together only in the active global or project scope. Existing state remains untouched during a rerun until approval.

You can rerun onboarding at any time. The current profile, prompt, and settings remain active until you explicitly approve the complete replacement preview.

By default, retained state is limited to `voice-profile.md`, `realtime-voice-prompt.md`, and minimal `settings.md`. Samples, pasted text, URLs, downloads, transcripts, source lists, extraction notes, measurements, confidence notes, and onboarding analysis are not retained.
