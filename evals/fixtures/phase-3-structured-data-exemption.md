---
id: phase-3-structured-data-exemption
category: exemptions
operation: rewrite
mode: written
expected_mutation: true
---

# Phase 3 structured data exemption

## Context

Edit a mutable lead-in while preserving structured YAML and JSON exactly.

## Input

Polish the lead-in but keep both data blocks exact.

We're thrilled to unveil the incredibly robust configuration!

```yaml
status: "ready!"
range: "1–3"
```

`{"label":"Ready: yes!","enabled":true}`

## Expected behavior

Revise only the lead-in and preserve both structured-data spans byte for byte.

## Assertions

- Preserve the YAML and inline JSON exactly.
- Do not apply prose rules to keys, values, punctuation, or delimiters.
- Return no explanation or diff unless requested.
