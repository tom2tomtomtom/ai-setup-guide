---
name: feature-developer
description: Use when asked to improve an app, suggest new features, find what's missing, audit a product for gaps, or when a user seems unsure what to build next. Triggers on phrases like "what should I add", "improve this app", "what's missing", "build a new feature", "what would make this better".
---

# Feature Developer

## Overview

A four-phase autonomous pipeline. Research first, then lead. Don't wait to be told what to build.

Each phase runs as a **subagent** — isolated context, distilled output returned to main thread. This keeps the primary context clean and each phase focused.

---

## Phase 1 — Discover

Dispatch two subagents in parallel:

**Subagent A — Codebase scan:**
- Read directory structure (top 2 levels)
- Identify framework, key routes/pages, data models, auth, payments
- List existing features as user-facing capabilities (not file names)
- Note tech stack (framework, DB, styling, auth provider)
- Return: `{ app_summary, tech_stack, existing_features[] }`

**Subagent B — Competitor research:**
- Classify the app category from the codebase summary
- Web-search `"[category] app features"` and `"best [category] tools 2025"`
- Pick 2-3 direct competitors; scan their landing pages, pricing tiers, changelogs
- Apply Perceptual Mapping: plot competitors on two axes (e.g., Simple↔Powerful, Consumer↔Enterprise) — find unoccupied quadrants
- Apply SWOT: identify Strengths/Weaknesses for each competitor; Opportunities = gaps they haven't addressed; Threats = table stakes this app lacks
- Extract: unique selling propositions, feature coverage gaps, pricing model positioning
- Return: `{ competitors[], table_stakes[], differentiators[], market_gaps[], perceptual_map_insight }`

See `references/competitor-research.md` for the Perceptual Map and SWOT methodology.

Merge subagent outputs into: `{ app_summary, tech_stack, existing_features[], competitors[], table_stakes[], differentiators[], market_gaps[] }`

---

## Phase 2 — Diagnose

Dispatch two subagents in parallel:

**Subagent A — Codebase gap audit:**
- Cross-reference existing features against table_stakes and differentiators
- Walk primary user flows; flag dead ends (e.g., auth exists but no password reset)
- Check for implied-but-absent features (stored data not surfaced, schema fields not in UI)
- Return: ranked gap list with type (missing table stake / dead end / dated pattern / implied-absent)

**Subagent B — User review mining:**
- Search G2, Capterra, or Trustpilot reviews for 2-3 named competitors
- Query: `site:g2.com "[competitor name]" reviews` or `"[competitor name]" "wish it had" OR "missing" OR "annoying"`
- Extract recurring complaints and feature requests that competitors haven't solved
- These become high-value opportunities: real user frustration, unaddressed by the market
- Return: `{ unmet_needs[], recurring_complaints[] }`

See `references/gap-analysis.md` and `references/review-mining.md`.

Merge into: ranked gap list scored by `(User Pain × Market Prevalence) ÷ Effort` (1-3 scale each).

---

## Phase 3 — Ideate + Score

Generate exactly **3 feature proposals**. For each:

- **What it is** — one crisp sentence
- **Why users will love it** — the specific pain it removes (ground in review-mining output where possible)
- **Proof of concept** — named competitor + what makes their version work
- **MoSCoW classification** — Must-have / Should-have / Could-have for this product stage
- **Impact/Effort score** — from the scoring model (see `references/scoring-model.md`)
- **Effort estimate** — S (<1 day) / M (1-3 days) / L (3+ days)

Present the three proposals clearly with scores. Ask the user to pick one — or offer to surprise them.

**Hard gate: do not proceed to Phase 4 without confirmed selection.**

---

## Phase 4 — Specify + Code

For the chosen feature, produce:

**Lean agile PRD** (fill `references/prd-template.md`):
- Problem statement (the outcome, not the output)
- User stories
- Acceptance criteria
- UX flow including empty/loading/error states
- Edge cases
- Technical approach + file-level implementation plan
- Out-of-scope items (explicit)

**Working code:**
- Write all files the feature requires
- Follow existing codebase conventions — don't introduce new patterns
- Include happy path AND all error states from the PRD
- Run build check if possible to catch type errors

See `references/ux-principles.md` for the UX quality bar.

---

## Subagent Architecture

```
Phase 1: [Subagent A: codebase] ──┐
                                   ├──► merge → context object
Phase 1: [Subagent B: competitors] ┘

Phase 2: [Subagent A: gap audit] ──┐
                                    ├──► merge → ranked gap list
Phase 2: [Subagent B: reviews]  ───┘

Phase 3: main thread (proposals + user selection)

Phase 4: main thread (PRD + code)
```

Phases 1 and 2 each dispatch two parallel subagents. Each subagent gets only what it needs and returns only its distilled output. This keeps token usage low and each phase focused.

---

## Phase Announcements

Tell the user what's happening at each transition:

```
Phase 1: Scanning codebase + researching competitors...
Phase 2: Auditing gaps + mining user reviews...
[Present 3 scored proposals — wait for selection]
Phase 4: Writing PRD and code for [chosen feature]...
```

---

## Optional CLAUDE.md Hook

To auto-activate this skill at session start for a project, add to the project's `CLAUDE.md`:

```markdown
## Feature Development
When asked about improving this app or what to build next, always use the feature-developer skill.
```

---

## When NOT to Use

- User has already specified exactly what to build → skip to Phase 4 directly
- Brand-new scaffold with no features → skip competitor research, focus on first-feature recommendations
- User explicitly requests a different workflow

---

## Quick Reference

| Phase | What | Output |
|-------|------|--------|
| 1 — Discover | Codebase scan + competitor research (parallel subagents) | Context object |
| 2 — Diagnose | Gap audit + review mining (parallel subagents) | Ranked gap list |
| 3 — Ideate | 3 scored proposals + user selection | Confirmed feature |
| 4 — Specify | Lean PRD + working code | Shipped feature |

---

## Common Mistakes

- **Skipping Phase 1 and proposing from instinct** — proposals without research are guesswork. Do the work.
- **Proposing what's easiest to build** — score by user value, not dev convenience.
- **Generic proposals** ("add notifications") — every proposal needs a named competitor proof point and a specific pain it solves from the review mining.
- **PRD without edge cases** — that's where features break.
- **Proceeding past Phase 3 gate** — always wait for user selection.
- **Replicating existing bad patterns** — if the codebase has an anti-pattern, don't copy it. Use the better pattern.
