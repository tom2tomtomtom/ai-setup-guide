# Feature Scoring Model

## Goal

Give every feature proposal an objective score before presenting to the user. This prevents "whatever's easiest to build" from winning and makes the ranking defensible.

---

## Layer 1: Impact/Effort Score

Score each proposal on two dimensions (1-3 scale):

**Impact** — how much value does this create for users?

| Score | Definition |
|-------|------------|
| 1 | Nice-to-have. Improves a secondary workflow or adds convenience |
| 2 | Removes meaningful friction from a workflow users run regularly |
| 3 | Unblocks a core workflow, or solves a problem users have explicitly complained about |

**Effort** — how long to build?

| Score | Definition |
|-------|------------|
| 1 | Small: < 1 day. UI change, new component, minor API endpoint |
| 2 | Medium: 1-3 days. New route, schema change, multiple components |
| 3 | Large: 3+ days. New data model, third-party integration, significant state logic |

**Priority Score = Impact ÷ Effort**

| Result | Interpretation |
|--------|----------------|
| 3.0 | Build now — high value, low cost |
| 1.5-2.9 | Strong candidate |
| 1.0-1.4 | Reasonable, but may have better options |
| < 1.0 | Deprioritise — high cost, low value |

---

## Layer 2: MoSCoW Classification

After scoring, classify the feature's priority at the current product stage:

**Must-have** — Without this, the product is incomplete for its core user. Missing table stakes fall here. Build before anything else.

**Should-have** — Important and expected, but the product functions without it. High-impact differentiators fall here. Build in the next cycle.

**Could-have** — Would improve the product but is not time-sensitive. Nice-to-haves fall here. Schedule when capacity allows.

**Won't-have (this iteration)** — Explicitly out of scope. Acknowledging this prevents scope creep.

**How to classify:**
- If 3+ competitor users have explicitly complained about the absence → Must-have
- If it appears on competitor pricing pages as a standard feature → Must-have
- If it's a differentiator that no competitor has built well → Should-have
- If it's genuinely optional and only useful for power users → Could-have

---

## Layer 3: Confidence Check

Before finalising a proposal, answer:

1. **Is there user evidence?** (review mining, explicit feedback, or named flow dead end)
   - Yes: proceed
   - No: downgrade MoSCoW classification by one level

2. **Is this the right scope?** (could this be split into a smaller Must-have + a larger Could-have?)
   - If yes, split it — the Must-have is your proposal, the Could-have is "out of scope v1"

3. **Does the existing codebase support this?** (does the tech stack make this feasible without major new dependencies?)
   - If no, increase Effort score by 1

---

## Presenting Scores to the User

Present proposals with scores visible but not overwhelming:

```
**Feature A: [Name]**
Impact: 3 | Effort: 1 | Score: 3.0 | MoSCoW: Must-have

[One-sentence description]
[Why users want it — grounded in evidence]
[Competitor proof point]
Effort: S (< 1 day)

---

**Feature B: [Name]**
Impact: 2 | Effort: 2 | Score: 1.0 | MoSCoW: Should-have

...
```

The score is a signal, not the deciding vote. If the user has strong reasons to prefer a lower-scored option, that's valid. The scoring model ensures the recommendation is grounded in value, not just availability.

---

## Anti-patterns

- **Scoring everything as high impact** — be honest. Not every feature is a 3. If all proposals are score 3.0, the scoring isn't doing any work.
- **Ignoring the Effort column** — a 3-week build for marginal UX improvement is a bad trade. Score honestly.
- **Proposing three features with no score difference** — if they're all tied, find a tiebreaker (review evidence, product stage, strategic fit) or reconsider the proposals.
