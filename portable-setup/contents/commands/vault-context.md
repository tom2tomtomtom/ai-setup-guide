---
name: vault-context
description: Load project-specific context from the vault before a coding session, including architecture patterns, deployment config, tech stack notes, and gotchas. Use when starting a coding session, switching projects, or needing to remember how a project is structured and deployed.
---

# Load Context from Tom's Brain

Read the Obsidian vault at `~/VAULT_PATH/` to build a targeted context picture for the current coding session.

If the user provided arguments, treat them as a project name hint: $ARGUMENTS

## Step 1: Detect the Project

If arguments were provided, use them to find the matching project note. Otherwise, detect from the current working directory using these mappings:

| Local Path Contains | Project | Primary Note |
|---|---|---|
| `aiden-gateway` | AIDEN Gateway | `AIDEN/AIDEN Platform.md` |
| `aiden-creative` or `creative-agent` | AIDEN Creative | `AIDEN/AIDEN Create.md` |
| `aiden-studio` or `studio-v2` | AIDEN Studio V2 | `AIDEN/AIDEN Studio V2.md` |
| `aiden-unified` | AIDEN Unified | `AIDEN/AIDEN Unified.md` |
| `aiden-chat` | AIDEN Chat | `AIDEN/AIDEN Chat.md` |
| `aiden-brain` | AIDEN Brain | `AIDEN/AIDEN Brain V2.md` |
| `aiden-api` | AIDEN API | `AIDEN/AIDEN API.md` |
| `aiden-hub` | AIDEN Hub | `AIDEN/AIDEN Hub.md` |
| `aiden-test` | AIDEN Test | `AIDEN/AIDEN Test.md` |
| `aiden` (generic) | AIDEN Platform | `AIDEN/AIDEN Platform.md` |
| `research-agent` or `culturewire` or `culture-wire` | Culture Wire | `Projects/Culture Wire.md` |
| `mothersnotes` or `meeting-notes` | Mother Meeting Notes | `Projects/Mother Meeting Notes.md` |
| `dynamic-timelines` | Mother Timelines | `Projects/Mother Dynamic Timelines.md` |
| `trend-reporter` | Mother Trend Reporter | `Projects/Mother Trend Reporter.md` |
| `day-trader` or `trading` | Day Trader | `Projects/Day Trader.md` |
| `apex-trader` | Apex Trader | `Projects/Apex Trader.md` |
| `congressional-trading` | Congressional Trading | `Projects/Congressional Trading System.md` |
| `refer-ify` | Refer-ify | `Projects/Refer-ify.md` |
| `coffee-chief` | Coffee Chief | `Projects/Coffee Chief.md` |
| `gimme-golf` | Gimme Golf | `Projects/Gimme Golf.md` |
| `proofwall` | Proofwall | `Projects/Proofwall.md` |
| `vscope` | Vscope Writer | `Projects/Vscope Writer.md` |
| `deck-builder` | Deck Builder | `Projects/Deck Builder.md` |
| `bonwick` | Bonwick Property | `Projects/Bonwick Property.md` |
| `trilogy` | Trilogy Funds | `Projects/Trilogy Funds.md` |
| `sunscreen` | Sunscreen Dashboard | `Projects/Sunscreen Dashboard.md` |

If no match is found from the directory or arguments, check `~/VAULT_PATH/Architecture/Local Paths.md` for a mapping. If still no match, ask the user which project this is for.

## Obsidian CLI Tools

Use these throughout the context-loading process:
- **Search**: `obsidian search query="term" vault="VAULT_NAME"` — fast vault-wide search
- **Backlinks**: `obsidian backlinks file="Note Name" vault="VAULT_NAME"` — discover related notes through the link graph
- **Tags**: `obsidian tags vault="VAULT_NAME"` — browse by tag for broader discovery

## Step 2: Read Baseline Context

Always read these files (in parallel):

- `~/VAULT_PATH/Architecture/Development Patterns.md`
- `~/VAULT_PATH/Architecture/Local Paths.md`
- `~/VAULT_PATH/Architecture/UI Design Preferences.md`
- `~/VAULT_PATH/Architecture/GitHub Repos.md`
- `~/VAULT_PATH/Architecture/Deployed Infrastructure.md`

## Step 3: Read Project-Specific Context Layers

Based on the detected project, read additional files:

### If any AIDEN project:
- `~/VAULT_PATH/AIDEN/AIDEN SSO Architecture.md`
- `~/VAULT_PATH/AIDEN/AIDEN Guiding Principles.md`
- `~/VAULT_PATH/AIDEN/AIDEN Deployment.md`
- `~/VAULT_PATH/AIDEN/AIDEN Platform.md` (the overall platform note, if not already the primary note)
- `~/VAULT_PATH/AIDEN/AIDEN Data Flow.md`
- The specific product note (e.g., AIDEN Create, AIDEN Studio V2, etc.)

### If Culture Wire:
- `~/VAULT_PATH/Projects/Culture Wire.md`
- `~/VAULT_PATH/Projects/Culture Wire Roadmap.md`
- `~/VAULT_PATH/Business/Alt-Shift Engagement.md`
- `~/VAULT_PATH/Business/Alt-Shift.md`

### If any Mother London project (Meeting Notes, Dynamic Timelines, Trend Reporter):
- `~/VAULT_PATH/Business/Mother London.md`
- `~/VAULT_PATH/Business/Mother London Engagement.md`

### If any trading project (Day Trader, Apex Trader, Congressional Trading):
- `~/VAULT_PATH/Projects/Day Trader.md`
- `~/VAULT_PATH/Projects/Apex Trader.md`
- `~/VAULT_PATH/Projects/Congressional Trading System.md`
- `~/VAULT_PATH/Projects/Trading Arena.md`

### If a client project (Bonwick, Trilogy, Emotive, Monigle, Uncommon, etc.):
- The client company note from `~/VAULT_PATH/Business/` (e.g., `Monigle.md`, `Uncommon Creative.md`)
- The engagement note if it exists (e.g., `Monigle Engagement.md`, `Uncommon Creative Engagement.md`)
- `~/VAULT_PATH/Business/Open Commitments.md` (to find commitments for this client)

## Step 4: Read Tech Stack Context

Check the project's `package.json` (or `requirements.txt` for Python projects) in the current working directory. Based on the dependencies found, read matching notes from `~/VAULT_PATH/Tech Stack/`:

| Dependency | Read |
|---|---|
| `next` | `Tech Stack/Next.js.md` |
| `@supabase/supabase-js` or `supabase` | `Tech Stack/Supabase.md` |
| `react` (without next) | `Tech Stack/React.md` |
| `vite` | `Tech Stack/Vite.md` |
| `stripe` | `Tech Stack/Stripe.md` |
| `tailwindcss` | `Tech Stack/Tailwind CSS.md` |
| `@shadcn/ui` or `shadcn` | `Tech Stack/shadcn-ui.md` |
| `drizzle-orm` or `prisma` | `Tech Stack/PostgreSQL.md` |
| `electron` | `Tech Stack/Electron.md` |
| `fastapi` or `flask` | `Tech Stack/FastAPI.md` and `Tech Stack/Python.md` |
| `n8n` or workflow automation project | `Tech Stack/n8n.md` |
| `jose` or JWT-related | `Tech Stack/JWT Authentication.md` |

Only read the ones that match. Don't read all of them. Limit to the 3 most relevant if many match.

## Step 5: Output Structured Orientation

After reading all files, output a concise orientation in this format:

```
### Project: [Name]
**Status**: [from frontmatter or note content: active/on-hold/archived/planning]
**Tech**: [frameworks and key dependencies from package.json and vault note]
**Design System**: [from UI Design Preferences - Brutalist for AIDEN, Warm for Redbaez, etc.]
**Repo**: [from GitHub Repos]
**Local**: [path on disk]
**Deploy**: [where it deploys - Railway, Vercel, GitHub Pages, etc.]

### Key Patterns
- [3-5 most relevant patterns from Development Patterns for this stack]
- [any project-specific patterns from the project note]

### Gotchas
- [things NOT to do, common mistakes, from Development Patterns and project notes]
- [e.g., "Don't edit database.ts manually - it's auto-generated"]
- [e.g., "Creative deploys via auto-deploy from main - don't use Railway CLI"]

### Current Status
- [what's been built, what's in progress, blockers - from the project note]

### Open Commitments
- [only if client project: relevant items from Open Commitments.md]

### Files Loaded
- [list the vault notes you read, so I know what context you have]
```

Keep it tight. This is an orientation briefing, not documentation. Prioritize actionable information over background. If a section has nothing relevant, skip it entirely.

## Step 6: Open in Obsidian

Open the primary project note so it's ready for reference:
```bash
obsidian open file="Project Note Name" vault="VAULT_NAME"
```
