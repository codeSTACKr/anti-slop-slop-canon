# Onboarding

Onboarding builds your `voice-profile.md` and personalized realtime prompt through a short, adaptive interview. The full contract lives in [../skills/anti-slop-slop-canon/references/onboarding.md](../skills/anti-slop-slop-canon/references/onboarding.md). This page explains it for users.

## First use

On your first natural-language task in a scope with no saved state, the skill asks one question before doing anything else:

- **Personalize now** starts the interview.
- **Use defaults** proceeds immediately with Jesse's built-in voice and records only that choice.
- **Defer** proceeds immediately with the built-in voice and asks again later.

Nothing is written to disk for defaults or defer beyond that one recorded choice. You can start or rerun the interview explicitly at any time afterward, and a rerun leaves your current profile active until you approve its replacement.

## One question at a time

The interview asks what you write and how you want it to sound, then asks for representative material early. Pasted text, Markdown, and local text files always work. If your host can read a supplied URL, PDF, video, or transcript natively, the skill uses that. If it cannot, it asks for pasted text or an export instead of stalling.

One short sample is enough to proceed. Strong, consistent evidence shortens the interview because there is less left to ask about. Sparse or conflicting evidence produces a focused question about the one thing that matters most, and you can always choose to proceed without answering it. The skill never averages a conflict or picks a side for you silently.

## Optional extraction helpers

If a supplied source needs a tool your host does not already have, such as `yt-dlp` for a video or `pdftotext` for a PDF, the skill suggests it by name and explains why. It never installs anything without your explicit approval, and declining just means pasting the text yourself instead.

## Preview before anything is saved

Before writing anything, the skill shows one complete preview:

1. The full proposed `voice-profile.md`.
2. The full proposed `realtime-voice-prompt.md`.
3. One short written example.
4. One short spoken example.

From there you can approve, ask to revise one trait, or continue the interview. Nothing is saved until you approve. Approval writes the profile and the realtime prompt together, inside the active scope only.

## What is not retained

By default, your state directory holds only three files after onboarding: `voice-profile.md`, `realtime-voice-prompt.md`, and `settings.md`. Samples, pasted text, URLs, downloads, transcripts, source lists, extraction notes, confidence notes, and the interview's own analysis are not retained. Your original files are left exactly where they were.

## Imitating someone else

The skill does not verify authorship or ownership of anything you supply. If you ask it to imitate a specific person, it learns abstract traits such as cadence, formality, vocabulary, and humor rather than promising an exact or cloned voice.
