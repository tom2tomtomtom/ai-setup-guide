---
name: business-review
description: "Launch C-suite business agents to critique your product from CEO, CFO, CMO, CPO, CRO, and Business Analyst perspectives. Run a single role or a full board meeting. Use when: (1) You want to know if what you're building is worth building, (2) You need pricing/revenue analysis, (3) You want go-to-market feedback, (4) You need a full business health check before launch, (5) Something feels off about the product direction."
user_invocable: true
invocation: /business-review
---

# Business Review

Run your product through a gauntlet of C-suite business analysis. Each agent reads your actual codebase and gives evidence-based critique -- not generic consulting advice.

## Available Roles

| Role | Agent | What They Evaluate |
|------|-------|--------------------|
| CEO | `biz-ceo` | Market opportunity, competitive positioning, strategic focus, should this exist? |
| CFO | `biz-cfo` | Unit economics, pricing strategy, cost structure, path to profitability |
| CMO | `biz-cmo` | Go-to-market, messaging clarity, acquisition channels, conversion readiness |
| CPO | `biz-cpo` | Product-market fit, feature prioritization, user research gaps, scope |
| CRO | `biz-cro` | Revenue model, conversion funnels, pricing tiers, monetization readiness |
| Analyst | `biz-analyst` | Operational readiness, tech debt business impact, compliance, scalability |

## Invocation

- **`/business-review`** or **`/business-review board`** -- Full board meeting (all 6 agents in parallel + synthesis)
- **`/business-review ceo`** -- Single agent review
- **`/business-review cfo cmo`** -- Specific subset of agents
- **`/business-review board [project-path]`** -- Review a specific project directory

## Process

### Phase 1: Gather Project Context

Before dispatching any agents, gather the project context centrally. This prevents 6 agents from all reading the same README.

**Read these files (if they exist):**

1. `README.md` -- What the project claims to be
2. `package.json` -- Dependencies, scripts, project metadata
3. Main landing page (`app/page.tsx` or equivalent) -- First impression
4. Pricing page (if any) -- Revenue model
5. `.env.example` or `.env.local` (NOT .env) -- Service dependencies
6. Route structure -- Feature surface area

**Build a ProjectContext block:**

```markdown
## ProjectContext

**Project:** [name from package.json]
**Description:** [from README or package.json]
**Tech stack:** [framework, language, key deps]
**Route count:** [number of pages/API routes]
**Key routes:** [list main features by route]
**Payment integration:** [Stripe/other/none, with details]
**Pricing:** [tiers found, or "none implemented"]
**External services:** [from env vars and imports]
**Current state:** [prototype/MVP/production -- based on completeness]
**Landing page headline:** [actual text]
**Working directory:** [pwd]
```

Use Glob and Grep to fill in what you can't find by reading files directly:

```bash
# Route structure
Glob: **/app/**/page.tsx
Glob: **/app/api/**/route.ts

# Payment signals
Grep: "stripe|price|billing|checkout|subscription" across source

# External services
Grep: "NEXT_PUBLIC_|API_KEY|_SECRET|_URL" in .env* files

# Current state signals
Grep: "TODO|FIXME|WIP|coming.soon|placeholder" across source
```

### Phase 2: Dispatch Agents

**For single agent mode** (`/business-review ceo`):

Launch one Agent with subagent_type matching the role. Include the full ProjectContext in the prompt. The agent does its own deeper investigation from there.

```
Agent(
  subagent_type: "general-purpose",
  prompt: "You are the biz-ceo agent. [Paste full agent instructions from biz-ceo.md]

  Here is the project context gathered for you:
  [ProjectContext block]

  Working directory: [pwd]

  Conduct your full CEO review of this product. Read additional files as needed.
  Follow your output format exactly. Be decisive."
)
```

**For board meeting mode** (`/business-review` or `/business-review board`):

Launch ALL 6 agents in parallel using multiple Agent tool calls in a single message. Each agent gets the same ProjectContext but runs its own investigation independently.

**For subset mode** (`/business-review cfo cmo`):

Launch only the specified agents in parallel.

### Phase 3: Synthesize (Board Meeting Mode Only)

After all agents return their reports, synthesize into the Board Meeting format:

```markdown
# Board Meeting: [Product Name]
Date: [today's date]

## Executive Summary
[2-3 sentences: what is this product, and what's the overall business verdict]

## Verdicts at a Glance
| Role | Verdict | One-Line Rationale |
|------|---------|-------------------|
| CEO  | [verdict] | [one line from their review] |
| CFO  | [verdict] | [one line] |
| CMO  | [verdict] | [one line] |
| CPO  | [verdict] | [one line] |
| CRO  | [verdict] | [one line] |
| Analyst | [verdict] | [one line] |

## Points of Tension
[This is the MOST VALUABLE section. Where do agents DISAGREE?]

Look for conflicts like:
- CEO says BUILD HARDER but CFO says MONEY PIT
- CMO says READY TO SCALE but CPO says NEEDS USER RESEARCH
- CRO says REVENUE-READY but Analyst says FRAGILE

For each tension, explain both sides and what the disagreement reveals about the real strategic decision.

## Consensus
[What ALL agents agree on -- these are high-confidence findings]

## Priority Actions (Next 2 Weeks)
1. [Most impactful action -- cite which agent(s) recommended it]
2. [Second action]
3. [Third action]
4. [Fourth action]
5. [Fifth action]

## The Hard Question
[One question that the product team is probably avoiding.
This comes from the tension points -- the thing nobody wants to confront.
Frame it as a direct question that demands an answer.]
```

## Anti-Patterns

**Don't do these:**

- **Don't give generic advice.** Every observation must reference a specific file, feature, route, or config found in this codebase. "You should think about pricing" is useless. "There's no pricing page and no Stripe integration -- revenue is blocked" is actionable.
- **Don't be falsely positive.** If the product isn't ready, say so. Kindness that prevents hard truths is cruelty.
- **Don't confuse code quality with business quality.** Beautiful code that solves no problem is a failure. Messy code that makes money is a success (with tech debt to manage).
- **Don't assume the builder's context.** Evaluate what EXISTS, not what they told you they plan to build.
- **Don't give a balanced review.** The most useful reviews are opinionated. Force a verdict. Take a position.
- **Don't skip the synthesis.** In board mode, the synthesis (especially Points of Tension) is the whole point. Don't just paste 6 reports together.

## Verdict Taxonomy

Each agent uses forced verdicts from a small, decisive set:

| Agent | Verdicts |
|-------|----------|
| CEO | BUILD HARDER / PIVOT / PAUSE / KILL |
| CFO | PROFITABLE PATH / NEEDS WORK / MONEY PIT |
| CMO | READY TO SCALE / FIX MESSAGING FIRST / NO GTM STRATEGY |
| CPO | SHIP IT / NARROW SCOPE / NEEDS USER RESEARCH / OVERBUILT |
| CRO | REVENUE-READY / LEAKY FUNNEL / NO MONETIZATION PATH |
| Analyst | SOLID FOUNDATION / TECH DEBT RISK / FRAGILE |

No hedging. No "it depends." Pick one.
