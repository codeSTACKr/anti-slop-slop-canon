---
id: ai-like-product-update
category: ai_like
operation: rewrite
mode: written
expected_mutation: true
---

# AI-like product update

## Context

Rewrite a short internal update. Preserve the release date, measured improvement, and named feature.

## Input

We're thrilled to announce a groundbreaking update that unlocks a seamless, robust, and transformative experience. Here's the thing: Smart Filters arrive on August 12, and early tests show a 17% drop in time spent sorting results. This isn't just an update; it's a game-changer for every workflow!

## Expected behavior

Remove unsupported hype, canned framing, formulaic contrast, and distracting punctuation while keeping the concrete news easy to find.

## Assertions

- Preserve `Smart Filters`, `August 12`, and `17%` exactly.
- Do not add benefits or test conclusions that the input does not support.
- Return clean written prose when no explanation or diff is requested.
