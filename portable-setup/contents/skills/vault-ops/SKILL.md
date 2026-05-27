---
name: vault-ops
description: Extract project context, commitments, and opportunities from the Obsidian vault before taking action. Use when building something new, suggesting priorities, checking what exists, or deciding what to work on next.
---

# Vault Intelligence Skill

## Description
Autonomous intelligence extraction from the Obsidian vault at `~/VAULT_PATH/`. Use this skill when you need to understand the current state of Tom's projects, commitments, clients, and opportunities before taking action.

## When to Use
- Before building anything: understand the project context
- Before suggesting priorities: check what's actually committed
- Before creating specs: check what already exists
- When asked "what should I work on": scan for highest-value actions

## Vault Structure

```
~/VAULT_PATH/
├── AIDEN/           — Platform product notes (19 files)
├── Architecture/    — Technical patterns, infrastructure, repos (9 files)
├── Business/        — Client engagements, revenue, commitments (33 files)
├── Concepts/        — Named patterns and frameworks (7 files)
├── Ideas/           — Rated ideas with priority tags (24 files)
├── Mother London/   — Mother-specific work (4 files)
├── People/          — Contacts and relationships
├── Projects/        — All project notes (62 files)
├── Specs/           — Buildable specifications (generated)
├── Tech Stack/      — Technology reference notes (18 files)
├── Daily Notes/     — Daily journals
├── Inbox/           — Unprocessed thoughts
└── Dashboards/      — Overview dashboards
```

## Key Files for Decision-Making

| Decision | Read These |
|---|---|
| What to build next | `Ideas/Ideas Index.md`, `Business/Open Commitments.md`, `Ideas/AIDEN Module Pipeline Tracker.md` |
| Client priorities | `Business/[Client] Engagement.md`, `Business/Open Commitments.md` |
| Tech stack for project | `Architecture/Development Patterns.md`, project note, `package.json` |
| Design system | `Architecture/UI Design Preferences.md` |
| Deployment target | `Architecture/Deployed Infrastructure.md`, `AIDEN/AIDEN Deployment.md` |
| Revenue blockers | `Business/Open Commitments.md`, `Ideas/Capacity Crisis as Product Decision.md` |
| Cross-client leverage | `Ideas/AIDEN Module Pipeline Tracker.md`, `Ideas/AIDEN Listen Unification.md` |

## Priority Framework

When ranking opportunities:
1. **Revenue-blocking** — anything preventing money coming in (auth fixes, unfinished MVPs, unsent proposals)
2. **Multi-client** — one build that serves 2+ clients (highest leverage)
3. **Client-promised** — items in Open Commitments with deadlines
4. **Platform-building** — work that converts consulting into product
5. **Quick wins** — shippable in < 1 day, visible impact

## Patterns to Follow

- Always check `Development Patterns.md` before building in any project
- AIDEN projects use Brutalist design system
- Redbaez/consumer projects use Warm design system
- Never edit `database.ts` (auto-generated)
- Always `npm run build` before declaring done
- AIDEN Gateway deploys on Railway (`railway up --detach`)
- Creative Agent auto-deploys from `main` (never use Railway CLI)
