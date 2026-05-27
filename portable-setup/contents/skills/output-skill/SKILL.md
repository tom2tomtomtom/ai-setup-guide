---
name: output-skill
description: Prevents AI code truncation and lazy output patterns. Use when generating complete implementations - enforces full code output with no placeholders, no ellipsis, no "rest of code" comments.
---

# Output Skill

Prevents truncated, lazy, or placeholder code output. Every deliverable must be complete and production-ready.

---

## When to Use This Skill

Always active when generating code. This skill is a quality gate, not a workflow.

---

## Banned Patterns in Code

These patterns are NEVER acceptable in generated code:

```
// ...
// rest of code
// rest of the component
// TODO: implement
// similar to above
// etc.
// add more as needed
// ... (remaining items)
// previous code remains
/* ... */
{/* ... */}
```

Bare `...` or `…` used as code placeholders are also banned.

**The only exception**: `...` as the JavaScript spread operator (`...props`, `...args`) is obviously fine.

---

## Banned Patterns in Prose

Do not write:
- "Let me know if you want me to continue"
- "I'll leave the rest as an exercise"
- "For brevity, I've omitted..."
- "The rest follows a similar pattern"
- "And so on"
- "etc." when it replaces actual content that should be enumerated
- "You can add more as needed"

---

## Banned Structural Shortcuts

- Generating a skeleton/scaffold and calling it "done"
- Describing what code should do instead of writing it
- Referencing "the implementation above" without including it
- Generating only the changed lines without surrounding context (when writing a full file)

---

## Execution Process

When generating a deliverable:

1. **Scope**: Count the discrete items to deliver (files, components, functions, routes)
2. **Build**: Generate each item completely. No partial implementations.
3. **Cross-check**: Verify the count — did you deliver everything from step 1?

---

## Token Limit Handling

If output genuinely exceeds capacity:

1. Write at full quality up to a clean breakpoint (end of a function, end of a file)
2. Output: `[PAUSED — X of Y complete. Send "continue" to resume]`
3. On "continue", pick up exactly where you left off — no re-summarizing, no preamble

Never reduce quality to fit in one response. Full quality at a breakpoint is better than degraded quality across everything.

---

## Key Principle

**Complete or paused, never partial.** Every piece of code you output should be copy-pasteable and functional. If it isn't complete, explicitly pause and say so — don't silently omit.
