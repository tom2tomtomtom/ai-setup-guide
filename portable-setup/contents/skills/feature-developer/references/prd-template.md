# Lean Agile PRD Template

**Philosophy:** A PRD defines *outcomes*, not outputs. It answers: what user problem are we solving and how will we know we solved it? It is NOT a delivery backlog, a feature spec sheet, or a static document.

Keep it short. If you're writing more than 2 pages, you're over-specifying.

---

## Feature: [Name]

**Date:** [today]
**Status:** Draft → In Review → Approved

---

## Problem Statement

One paragraph. What pain does this solve, for whom, and how often do they hit it?

Ground this in evidence: quote from user reviews, explicit user feedback, or a named flow dead end in the current app. Do not write "users want X" without a source.

**The outcome we're optimising for:** [measurable change — e.g., "reduce time-to-first-action from 4 steps to 1", "eliminate the #2 support request category"]

---

## Assumptions

Explicit assumptions this feature is built on. If any of these are wrong, the feature should be reconsidered.

- We assume [users do X]
- We assume [X is the bottleneck, not Y]
- We assume [users have permission / access / context to do this]

---

## User Stories

Format: "As a [type of user], I want [goal] so that [outcome]."

Keep to 3-5 stories. Each story = one goal.

1. As a [user], I want [thing] so that [outcome].
2. As a [user], I want [thing] so that [outcome].
3. As a [user], I want [thing] so that [outcome].

---

## Acceptance Criteria

Testable. Use "Given / When / Then". These define done — if you can't tick every box, the feature isn't complete.

**Story 1:**
- Given [context], when [action], then [observable result].

**Error states:**
- Given [bad input / error condition], when [action], then [graceful failure].

---

## UX Flow

Step-by-step from the user's perspective. Every screen, state, and branch.

1. User [does X]
2. System [shows/does Y]
3. If [condition A] → [outcome A]
4. If [condition B] → [outcome B]

**Empty state:** [what the user sees before any data exists]
**Loading state:** [what they see while data is fetching]
**Error state:** [what they see if something fails]
**Success state:** [what confirms the action worked]

---

## Edge Cases

- What if [input is empty / null / too long / malformed]?
- What if [the user has no permissions]?
- What if [network fails mid-operation]?
- What if [two users do this simultaneously]?
- What if [user hits back/refresh mid-flow]?

---

## Technical Approach

**Files to create:**
- `path/to/file.ts` — [what it does]

**Files to modify:**
- `path/to/existing.ts` — [what changes and why]

**Schema changes (if any):**
- New table: [name, key fields]
- New column: [table, column, type, nullable?]

**APIs:**
- `POST /api/[endpoint]` — [request shape, response shape]

**Dependencies:**
- New packages? Justify. Prefer solving with existing deps.

---

## Implementation Order

Ordered sequence to avoid blocking:

1. Schema migration (if needed)
2. API route / server action
3. Data fetching layer
4. UI component(s)
5. Wire into navigation/layout

---

## Out of Scope (v1)

Explicitly list what this version does NOT include. This prevents scope creep and sets stakeholder expectations.

- [Thing that belongs in v2]
- [Adjacent feature that could wait]
- [Nice-to-have that would double the effort]

---

## How We'll Know It Worked

What metric or user behaviour will change if this feature succeeds?

- [Metric] changes from [X] to [Y] within [timeframe]
- Support tickets about [X] decrease
- [User action] happens more frequently
