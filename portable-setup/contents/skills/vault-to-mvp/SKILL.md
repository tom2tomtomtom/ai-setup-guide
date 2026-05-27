---
name: vault-to-mvp
description: Chains vault-context, spec, execute, and deploy skills into an end-to-end pipeline that turns Obsidian vault ideas into deployed MVPs. Use when turning an idea into a working product, building from vault specs, or running the full idea-to-deploy pipeline.
---

# Vault to MVP Pipeline

Turn an Obsidian vault idea into a deployed, working product in a single session. This is a Level 4 orchestration skill that chains together vault-ask, vault-context, vault-spec-it, spec, execute, build, and deploy into a sequential pipeline with clear handoffs, abort conditions, and progress tracking.

## When to Use

- "Turn this idea into a working app"
- "Build the thing from my vault note about X"
- "Take [idea] from concept to deployed"
- "Run the full pipeline on [vault note]"
- "I want to ship [concept] today"

## Pipeline Overview

```
Idea --> Context --> Spec --> Plan --> Build --> Test --> Deploy --> Validate
 |         |         |        |        |         |        |          |
vault-   vault-    spec    execute  execute   build   deploy    validate
 ask    context  vault-                                        against
                spec-it                                        vault
```

**Total pipeline: 8 steps. Each step produces an artifact that feeds the next.**

---

## Step 1: Idea Extraction

**Skill:** `vault-ask`
**Input:** Idea name, vault note path, or natural language description
**Output:** Structured idea brief with constraints

### Actions

1. Invoke `/vault-ask` with the idea query to pull the full note and any linked context
2. Search `~/VAULT_PATH/Ideas/` for the note, including fuzzy matches
3. Check `~/VAULT_PATH/Specs/` for any existing spec (skip to Step 3 if found)
4. Check `~/VAULT_PATH/Projects/` for any existing partial build (skip to Step 4 if found)

### Handoff Artifact

```markdown
## Idea Brief
- **Name:** [extracted]
- **One-liner:** [what it does in one sentence]
- **Target user:** [who uses it]
- **Core value:** [why they'd use it]
- **Vault source:** [file path]
- **Linked notes:** [list of [[wiki-links]] found]
- **Existing work:** none | partial-spec | partial-build | deployed-but-broken
```

### Context Enrichment

After extracting the idea, invoke `/vault-context` to pull:
- Architecture patterns from `~/VAULT_PATH/Architecture/Development Patterns.md`
- Deployment config from `~/VAULT_PATH/Architecture/Deployed Infrastructure.md`
- Design system preferences from `~/VAULT_PATH/Architecture/UI Design Preferences.md`
- Related project patterns (if the idea connects to an existing codebase)

---

## Step 2: Spec Generation

**Skill:** `vault-spec-it` then `spec`
**Input:** Idea brief + vault context
**Output:** Implementation-ready specification

### Actions

1. Invoke `/vault-spec-it` to generate the initial spec from vault context
2. Invoke `/spec` to expand into implementation-ready detail covering:
   - Database schema (tables, RLS policies, indexes)
   - API endpoints (routes, request/response shapes, auth)
   - UI components (pages, layouts, key interactions)
   - Environment variables needed
3. Cross-reference against existing codebase patterns:
   - Check if the target repo already exists -- read its `package.json`, `tsconfig.json`, folder structure
   - Identify reusable components (auth, layouts, design system)
   - Flag any conflicts with existing architecture

### Handoff Artifact

The spec file, saved to `~/VAULT_PATH/Specs/[project-name]-spec.md`, containing:
- Tech stack decision (see Step 3)
- Database schema
- API surface
- Component tree
- Environment variables list
- Deployment target

### Validation Gate

Before proceeding, confirm with the user:
> "Spec ready for [project]. Tech stack: [X]. Deployment: [Y]. [N] API routes, [M] components. Proceed to build?"

**Do not auto-proceed past this gate.** The spec is the last cheap place to change direction.

---

## Step 3: Tech Stack Decision

**Decision tree applied during Step 2. Not a separate invocation.**

### Framework

```
Is it an AIDEN module?
  YES --> Next.js + Supabase + AIDEN design system
  NO  --> Continue

Does it need a UI?
  NO  --> Flask/FastAPI (Python) or Express (Node)
  YES --> Continue

Is it a SaaS product?
  YES --> Next.js App Router + Supabase + Stripe
  NO  --> Continue

Is it a client tool or internal dashboard?
  YES --> Next.js App Router + Supabase
  NO  --> Next.js (default)
```

### Database

```
Needs auth or multi-user?
  YES --> Supabase (Postgres + Auth + RLS)
  NO  --> Continue

Needs real-time?
  YES --> Supabase (real-time subscriptions)
  NO  --> Continue

Simple data storage only?
  YES --> Supabase (still -- standardize on one DB)
  NO  --> External API only, no DB needed
```

### Deployment

```
Is it an AIDEN module or SaaS?
  YES --> Vercel (frontend) + Supabase (backend)
  NO  --> Continue

Does it need background jobs, cron, or long-running processes?
  YES --> Railway
  NO  --> Continue

Static or mostly-static?
  YES --> Vercel
  NO  --> Vercel (default for Next.js)

Python backend?
  YES --> Railway
  NO  --> Vercel
```

### Design System

```
AIDEN module?        --> Brutalist (sharp corners, red/orange, grid bg)
Consumer SaaS?       --> Warm design system (redbaez-warm-design-system)
Client tool?         --> Match client brand or use warm system
Internal tool?       --> Minimal, functional, shadcn defaults
```

---

## Step 4: Scaffold and Build

**Skill:** `execute`
**Input:** Finalized spec
**Output:** Working codebase with passing tests

### Actions

1. Create a git branch: `feat/[project-name]-mvp`
2. Invoke `/execute` with the spec, using wave-based parallel agents:

**Wave 1 -- Foundation (parallel):**
- Database schema + migrations
- Project scaffold (Next.js/Flask, folder structure, config)
- Environment variable setup (.env.example)

**Wave 2 -- Core (parallel, depends on Wave 1):**
- Auth setup (if needed)
- API routes / server actions
- Core data models and types

**Wave 3 -- UI (parallel, depends on Wave 2):**
- Layout and navigation
- Page components
- Forms and interactions

**Wave 4 -- Polish (parallel, depends on Wave 3):**
- Error handling and loading states
- Responsive design pass
- Basic SEO metadata

### Git Strategy

- Atomic commits per wave completion
- Commit message format: `feat(mvp): [wave] - [description]`
- Do not squash -- keep the build history readable
- Tag the final working state: `mvp/[project-name]-v0.1`

### Build Verification

After each wave, run:
```bash
npm run build    # or equivalent
npm run lint     # if configured
```

If build fails, fix before proceeding to next wave. Do not accumulate broken state.

---

## Step 5: Deploy

**Skill:** `deploy` (routes to `vercel-deployment` or `railway-deployment`)
**Input:** Working codebase from Step 4
**Output:** Live URL

### Vercel Deployment (default for Next.js)

1. Invoke `/deploy` or use Vercel CLI:
   ```bash
   vercel --prod
   ```
2. Environment variables:
   - Pull from `.env.example` to identify required vars
   - Set via `vercel env add` or Vercel dashboard
   - Never commit `.env` files
3. Domain:
   - Default: `[project].vercel.app`
   - Custom: configure in Vercel dashboard if needed
4. Verify deployment:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" https://[deployed-url]
   ```

### Railway Deployment (for Python backends or background jobs)

1. Invoke `/railway-deploy`:
   ```bash
   railway up
   ```
2. Environment variables: `railway variables set KEY=VALUE`
3. Health check: confirm the service is running in Railway dashboard
4. Domain: Railway provides `[project].up.railway.app`

### Post-Deploy Checklist

- [ ] Home page loads without errors
- [ ] Auth flow works (sign up, sign in, sign out)
- [ ] Core feature functions end-to-end
- [ ] No console errors in production
- [ ] Environment variables are all set (no undefined)

---

## Step 6: Validate

**Input:** Deployed URL + original vault idea
**Output:** Validation report, feedback captured to vault

### Does It Match the Idea?

Re-read the original vault note from Step 1. For each stated requirement:

| Requirement | Status | Notes |
|---|---|---|
| [from vault note] | Done / Partial / Missing | [detail] |

### User Testing Checklist

- [ ] Can a new user understand what it does within 10 seconds?
- [ ] Does the core action work on first try?
- [ ] Does it work on mobile?
- [ ] Are error states handled (not blank screens)?
- [ ] Is there a way to give feedback or report issues?

### Feedback Capture

Write results back to the vault:

1. Update the original idea note with `status:: shipped` and the live URL
2. Create or update `~/VAULT_PATH/Projects/[project-name].md` with:
   - Deployed URL
   - Tech stack summary
   - Known gaps and next steps
   - Date shipped
3. If gaps were found, create items in `~/VAULT_PATH/Ideas/` for V2 features

---

## Pipeline Configuration

### Product Type Presets

**SaaS Product:**
```
stack: next.js + supabase + stripe
design: warm or custom brand
deploy: vercel
auth: supabase (Google OAuth + email)
extras: stripe checkout, webhook handler, usage tracking
```

**Client Tool:**
```
stack: next.js + supabase
design: client brand or warm
deploy: vercel
auth: supabase (invite-only or approval flow)
extras: client-specific data model, export functionality
```

**Internal Tool:**
```
stack: next.js + supabase
design: shadcn defaults, minimal
deploy: vercel (password-protected or internal)
auth: simple (magic link or Google OAuth)
extras: admin dashboard, data import/export
```

**AIDEN Module:**
```
stack: next.js + supabase + aiden-design-system
design: brutalist (sharp corners, red/orange accents, grid bg)
deploy: vercel (subdomain of aiden platform)
auth: aiden SSO gateway
extras: integrate with existing AIDEN services
```

### Customization Flags

Pass these when invoking the pipeline to override defaults:

- `--no-auth` -- Skip auth setup entirely
- `--no-deploy` -- Stop after build (local only)
- `--no-db` -- No database, API-only or static
- `--template=[saas|client|internal|aiden]` -- Preset selection
- `--repo=[existing-repo-path]` -- Build into existing codebase instead of new project
- `--resume` -- Pick up from last checkpoint (reads vault project note for state)

---

## Abort Conditions

### When to Stop the Pipeline

| Condition | Detection | Action |
|---|---|---|
| **Scope too large** | Spec has >15 API routes or >20 components | Pause. Ask user to cut scope to true MVP. Suggest what to defer. |
| **Missing critical dependency** | Needs an API key, service, or dataset that doesn't exist | Pause. Document what's needed in vault. Cannot proceed without it. |
| **Blocked on external** | Needs client approval, third-party access, or DNS changes | Pause. Deploy what's possible. Create a waiting-on note in vault. |
| **Duplicate exists** | Found existing project in vault or deployed infrastructure that does the same thing | Pause. Show user the existing work. Suggest extending it instead. |
| **Ambiguous requirements** | Cannot determine core feature or target user from vault note | Stop at Step 1. Ask clarifying questions. Do not guess and build. |
| **Build repeatedly failing** | Same error persists after 3 fix attempts in a wave | Pause. Save progress. Document the blocker in vault project note. |

### Saving Progress on Abort

When the pipeline stops before completion:

1. Commit all working code with message: `wip(mvp): [project] - paused at step [N]`
2. Update `~/VAULT_PATH/Projects/[project-name].md` with:
   - Current step number and status
   - What's done, what's remaining
   - Blocker description
   - How to resume: `/vault-to-mvp --resume [project-name]`
3. Push branch to remote so work isn't lost

### Resuming a Paused Pipeline

When invoked with `--resume`:
1. Read `~/VAULT_PATH/Projects/[project-name].md` for last known state
2. Check git for the `feat/[project-name]-mvp` branch
3. Verify what's already built (run build, check deployed URL)
4. Resume from the step after the last completed one

---

## Orchestration Rules

1. **Always confirm the spec before building.** Step 2 has a mandatory user gate.
2. **Never skip context loading.** Even if the idea seems simple, vault-context may reveal constraints, existing work, or architecture decisions that change the approach.
3. **Atomic progress.** Each step produces a durable artifact (vault note, git commit, deployed URL). If the session crashes, nothing is lost.
4. **Fail fast on ambiguity.** If the vault note is vague, stop and ask. Building the wrong thing costs more than a 2-minute conversation.
5. **One skill at a time.** Invoke each skill sequentially. Do not try to parallelize across pipeline steps -- only within waves during Step 4.
6. **Write everything back to the vault.** The vault is the source of truth. Every decision, URL, and status change gets recorded there.
