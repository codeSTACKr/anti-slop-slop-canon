---
id: punctuation-and-three-part-padding
category: ai_like
operation: rewrite
mode: written
expected_mutation: true
---

# Punctuation and three-part padding

## Context

Rewrite a project note whose concrete facts are buried under ornamental punctuation and an unsupported three-part slogan.

## Input

The decision is simple: keep the east entrance open—it serves 240–260 people daily; it's faster, friendlier, and fundamentally better!

## Expected behavior

Preserve the supported decision and count while removing banned punctuation, the filler intensifier, and the padded three-part claim. Do not replace them with a different slogan.

## Assertions

- Preserve `east entrance` and the daily range from 240 to 260 people.
- Do not claim that the entrance is faster, friendlier, or better because the input supplies no evidence.
- Use no em dash, en dash, semicolon, exclamation point, or mid-sentence colon in the mutable result.
- Keep the result concise rather than expanding the note to compensate for the removed language.
