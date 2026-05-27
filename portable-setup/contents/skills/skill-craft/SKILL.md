---
name: skill-craft
description: Creates world-class skills, plugins, and productivity workflows for AI coding tools (Claude Code, Cursor, Copilot, Windsurf). Covers skill architecture, description writing, framework design, and AI-augmented workflows. Use when building skills, writing plugin docs, creating AI tool configurations, or designing productivity systems around AI assistants.
---

# Skill Craft

Build skills, plugins, and productivity systems that make AI tools do their best work. This skill codifies what separates forgettable plugins from ones people actually use — and teaches you how to design AI-augmented workflows that compound over time.

---

## When to Use This Skill

- Creating a new skill or plugin for Claude Code, Cursor, Copilot, or similar tools
- Writing descriptions and documentation that AI tools actually understand and invoke correctly
- Designing repeatable workflows that leverage AI for real productivity gains
- Reviewing and improving existing skills that aren't performing well
- Building a personal or team skill library
- Writing "how-to" guides for AI-assisted development

---

## Core Philosophy

**A skill is a decision you only make once.** Every time you solve a problem well, you have a choice: solve it again next time, or encode it so AI solves it the same way forever. Skills are compounding infrastructure — the more you build, the more capable your AI assistant becomes.

### The Three Laws of Great Skills

1. **Encode expertise, not instructions.** Bad skills say "do X then Y." Great skills teach the AI *how an expert thinks* about the problem — the mental models, the tradeoffs, the judgment calls.

2. **Be opinionated or be ignored.** A skill that says "consider using either REST or GraphQL" helps nobody. One that says "use REST for CRUD, GraphQL for complex reads, here's exactly when to switch" gets used daily.

3. **The best skill is the one that gets invoked.** Architecture doesn't matter if the description is wrong and AI never triggers it. Description quality is the #1 predictor of skill usefulness.

### What Separates World-Class from Mediocre

| World-Class Skills | Mediocre Skills |
|-------------------|-----------------|
| Start with *why* — mental models before mechanics | Jump straight to commands |
| Include established frameworks (Nielsen's laws, OWASP, etc.) | Only personal opinions |
| 70%+ actionable checklists and templates | Mostly explanatory prose |
| Show bad vs good examples throughout | Abstract descriptions |
| Organized by situation ("when you see X, do Y") | Linear reading only |
| Self-contained — includes everything needed | Requires external docs |
| Templates you can copy-paste and fill | Everything needs adaptation |
| Opinionated defaults with escape hatches | "It depends" without guidance |

---

## Part 1: Skill Architecture

### The Anatomy of a Skill File

Every effective skill follows this structure. Not every section is required — but this is the order that works.

```markdown
---
name: kebab-case-name
description: [2-3 sentences — this is the most important part]
---

# Skill Title

One-paragraph summary of what this skill does and the outcome it produces.

## When to Use This Skill
[Bullet list of 4-8 triggering scenarios]

## Core Philosophy
[1-3 paragraphs: mental models, principles, "why before how"]

## Main Framework
[The structured methodology — steps, dimensions, or decision trees]

## Practical Tools
[Checklists, templates, commands — copy-paste ready]

## Examples
[Bad vs good comparisons with rationale]

## Quick Reference
[Cheat sheet for experienced users]

## Execution Notes
[How to run this skill effectively — tips for the AI]
```

### Section-by-Section Guide

#### Frontmatter — The Make-or-Break Moment

The `description` field is the single most important line in your entire skill. AI tools use it to decide whether to invoke your skill. Get this wrong and nothing else matters.

**The Formula:**

```
description: [Action verb] + [what it does] + [specific capabilities]. [Deliverable]. Use when [3-5 trigger scenarios separated by commas].
```

**What makes descriptions get invoked correctly:**

| Element | Why It Matters | Example |
|---------|---------------|---------|
| **Action verbs** | AI matches actions to user intent | "Reviews", "Generates", "Implements", "Analyzes" |
| **Domain keywords** | Matches natural language queries | "authentication", "UX", "copy", "deployment" |
| **Concrete deliverables** | AI knows what to produce | "provides actionable rewrites" not "helps with writing" |
| **"Use when" clause** | Explicit trigger conditions | "Use when building forms, validating input, or handling errors" |
| **Technical specifics** | Disambiguates from similar skills | "with React Hook Form, Zod validation" |

**Real examples — good vs bad:**

```yaml
# ❌ Too vague — AI won't know when to invoke
description: Helps with writing better code and following best practices.

# ❌ Too narrow — misses valid use cases
description: Runs ESLint and Prettier on TypeScript files.

# ❌ No trigger clause — AI has to guess
description: A comprehensive guide to React component patterns including compound components, render props, and hooks.

# ✅ Clear action + specifics + deliverable + triggers
description: Implements React component composition patterns including compound components, render props, slots, and headless UI; use when building flexible, reusable component libraries.

# ✅ Multiple capabilities + concrete output + broad triggers
description: Expert UX analysis for flow, friction, and intuitive design. Understands clunky vs slick, user flows, and how to make interfaces feel effortless. Use when reviewing UI/UX, planning features, or making things less clunky.

# ✅ Technical specifics + what it produces + when to use
description: Scrapes TikTok for trending content using ScrapeCreators API and generates interactive HTML dashboards with clickable posts, stats, and culture-jacking insights; use when researching social media trends for any topic or industry.
```

**Length:** 1-3 sentences. Under 300 characters is too short (not enough keywords). Over 500 characters is too long (dilutes signal).

#### "When to Use" Section

This reinforces the description with expanded scenarios. Use bullet points, be specific, include edge cases:

```markdown
## When to Use This Skill

- Building a new API endpoint and need consistent error handling
- Reviewing an existing API for standards compliance
- Setting up authentication middleware for the first time
- Migrating from REST to GraphQL (or deciding whether to)
- Onboarding a team member who needs to understand your API patterns
```

**Tip:** Think about what the user would *type* to trigger this skill. Include those phrases.

#### Core Philosophy

This is what separates a skill from a checklist. Give the AI the mental models an expert uses:

```markdown
## Core Philosophy

**Great error messages are conversations, not announcements.**
They answer three questions: What happened? Why? What can I do about it?

### Principles
1. **The user is not wrong** — if they hit an error, your UI led them there
2. **Be specific** — "Invalid input" helps nobody
3. **Offer a path forward** — every error should include a next step
```

**Why this matters:** When the AI encounters a situation the skill doesn't explicitly cover, the philosophy section gives it the judgment to improvise correctly.

#### Main Framework

This is the core methodology. Three patterns that work:

**Pattern A: Numbered Steps** (for sequential processes)
```markdown
## Framework

### Step 1: Audit
[What to look at, what to look for]

### Step 2: Diagnose
[How to identify problems]

### Step 3: Fix
[How to resolve each problem type]

### Step 4: Verify
[How to confirm the fix worked]
```

**Pattern B: Dimensional Analysis** (for evaluation/review skills)
```markdown
## The 8 Review Dimensions

### 1. Clarity
[Definition, examples, check]

### 2. Performance
[Definition, examples, check]
...
```

**Pattern C: Decision Tree** (for "which approach" skills)
```markdown
## Choosing Your Approach

| Situation | Approach | Why |
|-----------|----------|-----|
| Simple CRUD | REST | Lower overhead, well-understood |
| Complex reads | GraphQL | Avoid over-fetching |
| Real-time | WebSocket | Bidirectional, persistent |
```

#### Practical Tools

This is where skills earn their keep. Include things the AI can directly use:

- **Checklists** with `- [ ]` checkboxes
- **Search patterns** (grep commands, glob patterns)
- **Templates** with blanks to fill
- **Code snippets** ready to adapt
- **Commands** to run

```markdown
## Audit Checklist

- [ ] Every API endpoint returns consistent error shape
- [ ] All user inputs validated at boundary
- [ ] No secrets in client-facing responses
- [ ] Rate limiting on authentication endpoints
- [ ] CORS configured for production domains only
```

#### Examples — The Bad vs Good Pattern

This is the highest-impact teaching tool. Every major concept should have one:

```markdown
❌ Bad:
"An error occurred. Please try again later."

✅ Good:
"We couldn't save your changes because the file was
edited by someone else. Refresh to see their version,
then re-apply your changes."

Why: Tells the user what happened (save failed), why
(conflict), and what to do (refresh + re-apply).
```

**Rules for examples:**
- Use real-world scenarios, not toy problems
- Show the *reasoning* behind the good version
- Include 2-3 examples per major concept
- Use `❌`/`✅` markers — they're instantly scannable

---

## Part 2: Writing Descriptions for AI Tools

How to write descriptions, prompts, and documentation that make AI assistants maximally effective.

### The Description Stack

AI tools read descriptions at multiple levels. Each layer serves a different purpose:

```
┌─────────────────────────────────┐
│  Tool Description (1-2 lines)   │  ← What this tool does
│  Shown in tool lists/menus      │
├─────────────────────────────────┤
│  Skill Description (2-3 lines)  │  ← When to invoke
│  Used for matching/routing      │
├─────────────────────────────────┤
│  Skill Body (full content)      │  ← How to execute
│  Read after invocation          │
├─────────────────────────────────┤
│  System Prompts / CLAUDE.md     │  ← Always-on context
│  Loaded every conversation      │
└─────────────────────────────────┘
```

**Key insight:** The description determines *if* the skill gets used. The body determines *how well* it performs. Optimize both, but description first.

### Writing for AI Comprehension

AI tools parse descriptions differently than humans. Optimize for how they actually work:

**1. Front-load the action verb**
```
# ❌ AI has to parse the whole sentence to understand intent
"A comprehensive toolkit for building and deploying..."

# ✅ Intent is clear from the first word
"Builds and deploys production applications with..."
```

**2. Use keywords the user would type**
```
# ❌ Formal language users wouldn't naturally use
"Facilitates the implementation of user authentication mechanisms"

# ✅ Natural language users actually say
"Sets up login, signup, and auth flows with JWT or sessions"
```

**3. Be specific about inputs and outputs**
```
# ❌ What does "helps with" even produce?
"Helps with database performance issues"

# ✅ Clear input (slow queries) → output (optimized queries + indexes)
"Analyzes slow database queries and generates optimized queries, missing indexes, and schema improvements"
```

**4. Include negative space — what this is NOT**
```
description: "...Use for application-level auth patterns, NOT infrastructure/IAM setup."
```

### Description Templates by Skill Type

**For "Build Something" Skills:**
```
Implements [what] with [technology/pattern].
Includes [specific capabilities].
Use when [building/creating/setting up] [scenarios].
```

**For "Review/Audit" Skills:**
```
Reviews [what] against [standard/criteria],
auditing [specific elements].
Provides [deliverable].
Use when [reviewing/improving/evaluating] [scenarios].
```

**For "Fix/Debug" Skills:**
```
Diagnoses and resolves [problem domain] including [specific issues].
[Methodology].
Use when [encountering/debugging/troubleshooting] [scenarios].
```

**For "Generate/Create" Skills:**
```
Generates [output type] with [key features].
[Quality/format details].
Use when [needing/creating/producing] [scenarios].
```

**For "Workflow/Process" Skills:**
```
[Action verb] [domain] workflow from [start] to [end].
Covers [key stages].
Use when [orchestrating/managing/planning] [scenarios].
```

---

## Part 3: AI Productivity Systems

How to design workflows where AI tools compound your effectiveness instead of just autocompleting code.

### The Productivity Stack

Most people use AI at Level 1. The real leverage is at Level 3+.

```
Level 1: AUTOCOMPLETE
  "Write this function for me"
  Saves: typing time
  Compounds: not at all

Level 2: DELEGATE
  "Build this feature end-to-end"
  Saves: implementation time
  Compounds: slightly (learns your codebase)

Level 3: ENCODE EXPERTISE
  Skills, rules, patterns that persist across sessions
  Saves: decision-making time
  Compounds: every future session benefits

Level 4: SYSTEMATIC WORKFLOWS
  Chained skills that handle entire categories of work
  Saves: cognitive overhead
  Compounds: new work types become one-command operations

Level 5: AUTONOMOUS IMPROVEMENT
  AI identifies gaps, suggests new skills, improves existing ones
  Saves: meta-cognitive overhead
  Compounds: the system improves itself
```

### Building a Personal Skill Library

**Start with your repeating friction.** Track what you do repeatedly for one week:

| Task | Frequency | Time/Instance | Skill Opportunity |
|------|-----------|---------------|-------------------|
| Review PR copy | 3x/week | 20 min | copy-review |
| Set up new API endpoint | 2x/week | 45 min | api-scaffold |
| Debug auth issues | 1x/week | 60 min | auth-debugging |
| Write deployment config | 1x/week | 30 min | deploy-config |

**Priority formula:** `Frequency × Time × Variability`
- High frequency + high time + low variability = **automate with a skill**
- High frequency + low time = probably not worth a skill
- Low frequency + high variability = skill won't cover enough cases

### Skill Composition Patterns

**The Pipeline Pattern** — Skills that chain together:
```
analyze → plan → build → test → deploy

Each skill's output feeds the next skill's input.
User kicks off "analyze" and the chain runs.
```

**The Toolkit Pattern** — Skills that share a domain:
```
react-patterns/
  ├── component-composition    (building)
  ├── state-management         (architecture)
  ├── performance-optimization (improving)
  └── testing-strategies       (validating)

All share mental models but handle different phases.
```

**The Workflow Pattern** — Skills that handle a complete process:
```
feature-development:
  1. Read the spec/ticket
  2. Analyze affected code
  3. Plan implementation
  4. Build with patterns from relevant skills
  5. Write tests
  6. Create PR with summary

One command, entire workflow.
```

### Claude Code Specific: CLAUDE.md + Skills System

**CLAUDE.md** = always-on rules (loaded every conversation)
- Project conventions, file structure, naming patterns
- "Always do X, never do Y" rules
- Environment-specific config

**Skills** = invoked on demand (loaded when triggered)
- Specialized knowledge for specific tasks
- Frameworks and methodologies
- Templates and checklists

**Best practice:** CLAUDE.md sets the baseline. Skills handle specialized work. Don't put skill-level detail in CLAUDE.md (wastes context) or project rules in skills (won't be loaded).

```
CLAUDE.md:
  "We use TypeScript strict mode, Tailwind, shadcn/ui.
   API routes follow /api/v1/[resource] pattern.
   Run `npm run build` before committing."

Skills:
  "When building a new API route, here's the full
   pattern with auth, validation, error handling,
   rate limiting, and tests..."
```

### Designing AI-Augmented Workflows

**The 80/20 Rule of AI Workflows:**
- AI handles 80% of the *volume* (boilerplate, patterns, research)
- You handle 20% of the *decisions* (architecture, tradeoffs, UX judgment)
- The skill encodes *which* decisions need human judgment

**Template for a workflow skill:**

```markdown
## Workflow: [Name]

### Trigger
[When to run this workflow]

### Inputs Required
[What the AI needs from the user before starting]

### Steps

#### Step 1: [Name] (AI)
[What AI does autonomously]
- Search for X
- Read Y
- Analyze Z

#### Step 2: [Name] (Human Decision)
[Present options, user picks]
> "I found 3 approaches. Here are the tradeoffs..."

#### Step 3: [Name] (AI)
[Execute the chosen approach]

### Output
[What the workflow produces]

### Quality Checks
[How to verify the output is good]
```

---

## Part 4: Skill Quality Checklist

Use this to evaluate any skill before shipping it.

### The Description Test

- [ ] **Action verb first** — starts with what it does, not what it is
- [ ] **Domain keywords** — contains words users would naturally type
- [ ] **Concrete deliverable** — says what it produces, not just what it "helps with"
- [ ] **"Use when" clause** — explicit trigger scenarios (3-5 minimum)
- [ ] **Right length** — 150-400 characters (enough signal, not diluted)
- [ ] **Disambiguated** — wouldn't be confused with another skill in the library

### The Content Test

- [ ] **Philosophy section** — teaches *why*, not just *how*
- [ ] **Established frameworks** — references industry-standard knowledge, not just personal opinion
- [ ] **Actionable ratio** — at least 70% checklists, templates, examples (not prose)
- [ ] **Bad vs good examples** — every major concept has a `❌`/`✅` comparison
- [ ] **Self-contained** — doesn't require reading external docs to be useful
- [ ] **Copy-paste ready** — includes templates, commands, or patterns that work immediately
- [ ] **Organized by situation** — user can find relevant advice by their current scenario

### The Execution Test

- [ ] **Can the AI actually do this?** — doesn't require capabilities the AI doesn't have
- [ ] **Clear stopping point** — AI knows when the skill's job is done
- [ ] **Output format specified** — AI knows what to produce and how to structure it
- [ ] **Handles edge cases** — includes "what if" guidance for common variations
- [ ] **Respects scope** — doesn't try to do everything; does one thing extremely well

### The Longevity Test

- [ ] **Not time-sensitive** — will still work in 6 months without updates
- [ ] **Framework-aware, not framework-dependent** — teaches patterns that transfer
- [ ] **Opinionated with escape hatches** — has defaults but explains when to deviate
- [ ] **Improvisation-ready** — philosophy section enables AI to handle novel situations

---

## Part 5: Common Anti-Patterns

### Skills That Fail

**The Encyclopedia** — Tries to cover everything, covers nothing well.
```
# ❌ 3000-line skill covering all of web development
# ✅ Focused skill covering React form patterns specifically
```

**The Manual** — Reads like documentation, not a decision framework.
```
# ❌ "React.useState accepts an initial value and returns an array..."
# ✅ "Use useState for simple, local state. Switch to useReducer when
#     you have 3+ related state variables or complex update logic."
```

**The Opinion Piece** — All philosophy, no actionable tools.
```
# ❌ 500 words on why clean code matters, zero checklists
# ✅ 2 sentences on why, then a 20-item checklist of what to check
```

**The Stale Wrapper** — Just wraps external docs that change.
```
# ❌ "Here's the Next.js 14 API..." (outdated in months)
# ✅ "Here are the patterns for server components..." (patterns persist)
```

**The Kitchen Sink** — Combines unrelated concerns.
```
# ❌ "Full-Stack Development Skill" (auth + DB + UI + deployment)
# ✅ Separate skills for auth, DB patterns, UI components, deployment
```

### Descriptions That Never Get Invoked

```yaml
# ❌ No verbs — AI can't match to user actions
description: "Information about React patterns and best practices"

# ❌ No triggers — AI doesn't know when this is relevant
description: "Comprehensive guide to building modern web applications"

# ❌ Too clever — AI takes descriptions literally
description: "Your secret weapon for bulletproof backends"

# ❌ Overlaps everything — AI can't disambiguate
description: "Helps with coding, debugging, and building features"
```

---

## Part 6: Quick Reference

### Skill Creation Checklist (Copy-Paste Ready)

```markdown
## New Skill: [name]

### Pre-Flight
- [ ] Confirmed this doesn't overlap an existing skill
- [ ] Identified 5+ real scenarios where this would be invoked
- [ ] Gathered 3+ established frameworks/references to include
- [ ] Listed the concrete deliverables this skill produces

### Writing
- [ ] Wrote description (action verb + specifics + deliverable + triggers)
- [ ] Wrote "When to Use" section with 4-8 scenarios
- [ ] Wrote philosophy section (2-3 paragraphs max)
- [ ] Built main framework (steps, dimensions, or decision tree)
- [ ] Added checklists and templates (copy-paste ready)
- [ ] Added bad vs good examples for every major concept
- [ ] Added execution notes for the AI

### Review
- [ ] Passed the Description Test (6 checks)
- [ ] Passed the Content Test (7 checks)
- [ ] Passed the Execution Test (5 checks)
- [ ] Passed the Longevity Test (4 checks)
- [ ] Tested by invoking in a real project
```

### Starter Templates

**Minimal Viable Skill:**
```markdown
---
name: [name]
description: [Action verb] [what] with [specifics]. Use when [scenarios].
---

# [Title]

[One sentence: what this skill does.]

## When to Use
- [Scenario 1]
- [Scenario 2]
- [Scenario 3]

## Approach

### Step 1: [Understand]
[What to look at first]

### Step 2: [Execute]
[The main work]

### Step 3: [Verify]
[How to confirm quality]

## Quick Reference
[Cheat sheet or checklist]
```

**Full Production Skill:**
```markdown
---
name: [name]
description: [2-3 sentences with action verbs, domain keywords,
deliverables, and "Use when" clause with 3-5 trigger scenarios.]
---

# [Title]

[Summary paragraph — what this produces and why it matters.]

## When to Use This Skill
- [4-8 specific triggering scenarios]

## Core Philosophy
[Mental models, principles, "why before how" — 2-3 paragraphs max]

## Framework
### [Numbered steps OR dimensional analysis OR decision tree]
[The main methodology with examples throughout]

## Practical Tools
### Checklists
[Copy-paste checkbox lists]

### Templates
[Fill-in-the-blank structures]

### Search Patterns
[Grep commands, glob patterns for finding relevant code]

## Examples
[3-5 bad vs good comparisons with rationale]

## Anti-Patterns
[Common mistakes to avoid]

## Execution Notes
[Tips for the AI on how to run this skill effectively]
```
