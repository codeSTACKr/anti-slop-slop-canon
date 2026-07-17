---
id: phase-3-exact-quote-exemption
category: exemptions
operation: rewrite
mode: written
expected_mutation: true
---

# Phase 3 exact quotation exemption

## Context

Edit mutable framing around an exact quotation that contains banned style patterns.

## Input

Tighten the intro but preserve the quote exactly.

Intro: We're very excited to share this customer note!

Quote: “Here's the thing: it was fast—really fast!”

## Expected behavior

Revise only the mutable introduction and preserve the quotation byte for byte.

## Assertions

- Preserve `“Here's the thing: it was fast—really fast!”` exactly.
- Do not report protected punctuation or wording as a violation.
- Return only the revised intro and unchanged quote unless a diff is requested.
