---
name: rethink
description: "Stop whack-a-mole loops and re-anchor coding work to the app's ultimate human objective. Not a debugger — a mission anchor. Use BEFORE coding on any project to check that OBJECTIVE.md exists at repo root; if missing, stop and write one before any code is written. Use MID-FLIGHT when symptoms keep returning: 3+ edits to the same area, bugs reappearing after fixes, user says 'still broken', 'now it's doing X', 'same problem', 'wait now', 'back again', 'didn't work', user frustration ('ugh', 'why does this keep', 'I keep having to'), 'kind of works', 'works but', 'mostly works', repeated test failures on the same code path, or a single bug burning more than 30 minutes. Re-reads OBJECTIVE.md, holds the patch trail against it, and calls a verdict: CONTINUE, RESCOPE, RE-ANCHOR, or ABANDON."
---

# Rethink

**Not a debugger. A mission anchor.**

When coding work loses its grip on what the app is ultimately for, this skill stops the patching and forces a re-anchor to the human objective. Two modes — pre-flight (no OBJECTIVE.md → stop and write one) and mid-flight (whack-a-mole detected → call a verdict).

## The Hard Rule

**No `OBJECTIVE.md` at repo root, no code.**

This is non-negotiable. The objective doc is the contract between what's being built and what the human needs. Without it, every patch is unanchored and whack-a-mole is inevitable.

---

## When This Skill Fires

### Pre-flight (always, before non-trivial coding)

Before writing or editing any code on a project, check for `OBJECTIVE.md` at the repo root:

```
test -f OBJECTIVE.md
```

If missing, or present but incomplete (missing any of the five required headings), enter **Mode 1: Write the objective**. No code until the doc is complete and signed off.

### Mid-flight (during a session, when patterns appear)

Fire automatically when any of these are observed in the current session:

- 3+ edits to the same file or feature attempting the same fix
- A bug surfaces again after a previous fix in the same session
- User says: "still broken", "now it's doing X", "same problem", "wait, now", "back again", "didn't work", "broke something else", "different problem now"
- User frustration: "ugh", "why does this keep", "I keep having to", "this is getting silly", "we're going in circles"
- Hedged success: "kind of works", "works but", "mostly works", "almost there"
- 30+ minutes on a single bug with no resolution
- Multiple consecutive test failures on the same code path

Any one of these is enough. Do not wait for the user to type `/rethink`.

Also fires on manual invocation: `/rethink`.

---

## Mode 1: Write the Objective (pre-flight)

When `OBJECTIVE.md` is missing or incomplete:

### 1. Hard stop

State plainly, in the first message:

> No `OBJECTIVE.md` at repo root. Per rule, no code until one exists. Five questions, one at a time.

Do not start coding. Do not begin exploration of the codebase. Do not propose architecture. The Q&A comes first.

### 2. Ask the five questions, one at a time

One question per message. Do not batch. Each answer is recorded verbatim and shaped into the objective doc only after all five are answered.

**Q1: Who is this for?**
> Name the human. A role or a named person, not "users". Example: "Sian, the UCS commercial lead." Not "people who need to track jobs."

**Q2: What do they need to do?**
> The outcome in their language, not technical language. Example: "Spot allocation mistakes before they cost money." Not "view a SOLD vs ALLOCATED dashboard."

**Q3: What does success look like to them?**
> The felt experience when it's working. Not a metric. Example: "I trust the numbers without re-checking the spreadsheet." Not "95% reconciliation accuracy."

**Q4: What does failure look like to them?**
> The felt experience when it's broken. Not an error rate. Example: "I still have to open the sheet to verify what I just read." Not "12% of rows mismatch."

**Q5: What is this app NOT for?**
> Anti-scope. The tempting features that don't serve the above. Example: "Not a forecasting tool. Not a CRM. Not a job-tracking system."

If the user answers in technical language ("display a chart of weekly totals"), push back once and ask for the human-outcome version. If they insist on the technical phrasing, accept it but note in the doc that it's their preferred phrasing.

### 3. Write OBJECTIVE.md

Write the file at the repo root using exactly this structure:

```markdown
# Ultimate Objective

## Who is this for?
<answer to Q1>

## What do they need to do?
<answer to Q2>

## What does success look like to them?
<answer to Q3>

## What does failure look like to them?
<answer to Q4>

## What this app is NOT for
<answer to Q5>
```

All five headings are required. No additions, no embellishments, no extra sections.

### 4. Show for sign-off

Show the file to the user and ask one question: "Does this read as true? Yes / change X." Wait for confirmation before any coding resumes.

---

## Mode 2: Verdict (mid-flight)

When whack-a-mole is detected during an active session:

### 1. Read OBJECTIVE.md

Quote the **"What do they need to do?"** line at the top of the response. This is the anchor for everything that follows.

> Objective: <quoted line from OBJECTIVE.md>

### 2. List the patch trail

Last N fix attempts in the current session, one line each. For each, a brutal one-line read on whether it moved the human closer to the objective, or just made the code less wrong.

Format:

```
Patch trail:
1. <what was changed> — <closer to objective | just less-wrong code>
2. <what was changed> — <closer to objective | just less-wrong code>
3. <what was changed> — <closer to objective | just less-wrong code>
```

Be honest. "Just less-wrong code" is a frequent and correct verdict on a single line.

### 3. Call the verdict

State it first, in capitals, then reasoning in 2–4 sentences. No hedging. No "perhaps." No "it might be worth."

The four verdicts:

**CONTINUE** — The patches are serving the objective. The loop is noisy but converging. Keep going. Reasoning should explain why the next patch is likely to be the last one.

**RESCOPE** — The objective is right; the approach is wrong. The architecture, data model, or UX choice is fighting the objective. Propose 2–3 alternative approaches and recommend one. Reasoning should name the specific assumption that's now suspect.

**RE-ANCHOR** — The objective itself has drifted from what the human actually needs. Stop coding. Rewrite `OBJECTIVE.md` before any more work. Reasoning should point to which of the five sections is now stale and what evidence in the session suggests it.

**ABANDON** — The objective doesn't justify continuing this app. The cost of getting there is greater than the value of the outcome, or the outcome itself isn't worth pursuing. Reasoning should name the cost and the alternative use of the same effort.

### 4. Stop and wait

After the verdict, stop. Do not start the next fix. Do not begin rescoping. Wait for the user to either accept the verdict or push back. The intervention is the pause itself.

---

## What this skill does NOT do

- It does not debug. If the verdict is CONTINUE, hand back to whatever debugging skill applies (`debugging-strategies`, `systematic-debugging`, `ui-feature-debugging`, etc.).
- It does not assess code quality. That's `app-assessment`.
- It does not explore feature ideas. That's `brainstorming` or `feature-developer`.
- It does not write specs or implementation plans. After a RESCOPE or RE-ANCHOR verdict, hand off to `superpowers:brainstorming` or `superpowers:writing-plans`.
- It does not edit `OBJECTIVE.md` automatically on a RE-ANCHOR verdict. It runs Mode 1 again with the user.

---

## Voice

When this skill is active, drop hedging. State the verdict in the affirmative. "RESCOPE." Not "I think perhaps we should consider rescoping." The whole point of the intervention is to cut through the fog of an active patch loop — that needs a beam, not a candle.
