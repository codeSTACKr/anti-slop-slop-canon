---
id: phase-3-code-exemption
category: exemptions
operation: rewrite
mode: written
expected_mutation: true
---

# Phase 3 code exemption

## Context

Edit prose around a fenced code block whose strings and punctuation violate prose rules.

## Input

Make the explanation direct, but do not change the code.

This robust snippet basically shows the status!

```js
const message = "Ready: yes!";
const range = "1–3";
```

## Expected behavior

Revise the mutable explanation while preserving the entire fenced code block byte for byte.

## Assertions

- Preserve both code lines, punctuation, quotes, and indentation exactly.
- Do not apply prose punctuation bans inside code.
- Remove unsupported mutable-prose padding with a minimal edit.
