---
tags: [claude, tools, reference]
status: active
updated: 2026-03-16
---

# Claude Ecosystem

Complete inventory of all commands, skills, plugins, and MCP servers across Claude Code, Claude Desktop, and Claude Cowork.

---

## Claude Code, Slash Commands (62 total)

### Vault Commands (22), Obsidian vault management
| Command | Purpose |
|---------|---------|
| `/vault-context` | Load vault context before coding session |
| `/vault-today` | Build prioritized daily plan from vault |
| `/vault-morning-scout` | Morning briefing: scout report + daily plan + what to build |
| `/vault-scout-report` | Run Scout agent to scan vault for opportunities |
| `/vault-ask` | Query the vault to answer a question using everything you know |
| `/vault-ops` | Vault intelligence operations |
| `/vault-challenge` | Pressure-test thinking, find contradictions |
| `/vault-cross-pollinate` | Force unexpected connections between projects |
| `/vault-emerge` | Surface hidden ideas and unnamed patterns |
| `/vault-graduate` | Promote inbox items to standalone notes |
| `/vault-gaps` | Audit vault for missing knowledge |
| `/vault-deep` | 30-day deep scan with cross-domain pattern detection |
| `/vault-drift` | Compare stated intentions against actual behavior |
| `/vault-trace` | Track evolution of a specific idea over time |
| `/vault-client-intel` | Analyze client work, suggest next moves |
| `/vault-update-vault` | Update vault after a coding session |
| `/vault-dump` | Brain dump thoughts with auto wiki-linking |
| `/vault-resource` | Summarize a URL into a formatted vault note |
| `/vault-research` | Research a topic via web search, create vault note |
| `/vault-spec-it` | Generate buildable spec from a vault idea |
| `/vault-auto-build` | Autonomous pipeline: scout, spec, and build |
| `/vault-tov-writer` | Rewrite or generate text in Tom's natural voice |

### Creative Studio Commands (17), Media pipeline + strategy
| Command | Purpose |
|---------|---------|
| `/brain-chat` | Conversational brainstorming with AIDEN Brain |
| `/creative-strategy` | Generate creative strategy from brief |
| `/full-campaign` | End-to-end campaign pipeline |
| `/campaign-toolkit` | Campaign toolkit generation |
| `/culture-scan` | Full cultural intelligence pipeline |
| `/cultural-tensions` | Battleground detection |
| `/brand-analysis` | Strategic fit & right to play |
| `/brand-check` | Brand guidelines check |
| `/profile-analysis` | Profile analysis |
| `/hashtag-research` | Hashtag research |
| `/trending-content` | Trending content discovery |
| `/reddit-trends` | Reddit cultural signal collection |
| `/scrape-trends` | Scrape social media trends |
| `/mood-board` | Mood board generation |
| `/generate-hero` | Hero image generation |
| `/generate-video` | Video generation |
| `/image-to-video` | Image to video conversion |
| `/edit-image` | Image editing |
| `/remove-bg` | Background removal |
| `/resize-suite` | Image resize suite |
| `/composite` | Image compositing |

### Productivity Suite Commands (17), symlinked from `~/claude-productivity-suite/`
| Command | Purpose |
|---------|---------|
| `/analyze` | Analyze codebase and generate quality tasks |
| `/build` | Build application |
| `/clean` | Automated code cleanup with validation |
| `/deploy` | Deploy |
| `/execute` | Execute development tasks from specs |
| `/fix` | Fix issues |
| `/help` | Show all available commands |
| `/loop` | Run a prompt or command on a recurring interval |
| `/plan` | Plan new product or feature |
| `/railway-deploy` | Railway-specific deployment validation |
| `/refactor` | Intelligent refactoring |
| `/setup` | Analyze product & install suite standards |
| `/simplify` | Review changed code for reuse, quality, efficiency |
| `/spec` | Create detailed feature specifications |
| `/style` | Make it look better |
| `/template` | Enterprise application templates |
| `/undo` | Intelligent rollback system |

---

## Claude Code, Skills (110+ in ~/.claude/skills/)

### Core Custom Skills
| Skill | Purpose |
|-------|---------|
| aiden-design-system | AIDEN brutalist design system (red/orange accents, sharp corners) |
| aiden-pptx | PowerPoint generation with 60 slide types, AIDEN branding |
| monigle-pptx | PowerPoint generation with Monigle branding (88 slide types) |
| brief-sharpener | 7-dimension brief review for agencies |
| vault-ops | Vault intelligence and operations |
| teaching-brain | AI adaptive tutor with persistent learning model |
| supabase-auth-magic-links | [[Supabase]] auth helper |
| ux-analysis | UX analysis tools |
| skill-craft | Meta-skill for creating new skills |

### CLI Tool Skills (added 2026-03-10)
| Skill | Purpose |
|-------|---------|
| supabase-cli | Supabase CLI: type gen, migrations, local dev, edge functions |
| github-cli-workflows | `gh` CLI: PRs, issues, releases, CI checks, API queries |
| gws-cli | Google Workspace CLI: Slides, Sheets, Docs, Drive (v0.6.3 pinned) |
| railway-deployment | Railway deployment + AIDEN platform deployment map |
| vercel-deployment | Vercel CLI deployment patterns |
| docker-patterns | Docker multi-stage builds, Compose, security |
| notebooklm-research | NotebookLM + nlm CLI research pipelines |

### Framework & Pattern Skills (60+)
Covers: Next.js, React 19, Supabase, Prisma, Drizzle, tRPC, TanStack, Tailwind, shadcn/ui, Framer Motion, Playwright, and many more. Full list via `/help`.

---

## Alt-Shift Skills (12 zipped packages in ~/altshift-skills/)

| Skill | Purpose |
|-------|---------|
| behaviour-change-campaign | Behaviour change campaign design |
| campaign-copy-rollout | Campaign copy rollout |
| campaign-strategy | Campaign strategy generation |
| campaign-timeline | Campaign timeline planning |
| case-study-awards | Awards case study writing |
| client-wip | Client WIP tracking |
| competitor-analysis | Competitor analysis |
| influencer-sourcing | Influencer sourcing |
| media-pitch-au | Australian media pitch writing |
| media-release-au | Australian media release writing |
| proposal-writer | Proposal writing |
| DEPLOYMENT-GUIDE.md | Deployment instructions |

---

## Plugins (Downloads, 9 packages)

| Plugin | Description |
|--------|-------------|
| brand-strategy | Strategic brand positioning tools |
| brand-strategy 2 | Brand strategy variant |
| client-experience | Account management, meeting notes, proposals |
| copywriting | Copywriting tools |
| copywriting 2 | Copywriting variant |
| creative-review | Creative review tools |
| crisis-comms | Crisis response & media management |
| redbaez-warm-design-system | Warm, friendly design system (dark mode, accessibility) |
| vscope-writer | Mother London SOW generator |

### Creative Studio Plugin (2 versions)
| Version | Path |
|---------|------|
| creative-studio | `~/creative-studio/` |
| creative-studio-plugin-v3.0.0 | `~/creative-studio-plugin-v3.0.0/` |

---

## Claude Cowork, Marketplace Plugins (12 categories)

Installed from `knowledge-work-plugins` marketplace:

| Plugin | Skills |
|--------|--------|
| **sales** | account-research, call-prep, competitive-intelligence, create-an-asset, daily-briefing, draft-outreach |
| **marketing** | brand-voice, campaign-planning, competitive-analysis, content-creation, performance-analytics |
| **product-management** | competitive-analysis, feature-spec, metrics-tracking, roadmap-management, stakeholder-comms, user-research-synthesis |
| **customer-support** | customer-research, escalation, knowledge-management, response-drafting, ticket-triage |
| **data** | data-context-extractor, data-exploration, data-validation, data-visualization, interactive-dashboard-builder, sql-queries, statistical-analysis |
| **enterprise-search** | knowledge-synthesis, search-strategy, source-management |
| **finance** | audit-support, close-management, financial-statements, journal-entry-prep, reconciliation, variance-analysis |
| **legal** | canned-responses, compliance, contract-review, legal-risk-assessment, meeting-briefing, nda-triage |
| **productivity** | dashboard, memory-management, task-management |
| **cowork-plugin-management** | cowork-plugin-customizer, create-cowork-plugin |
| **bio-research** | instrument-data, nextflow, scientific-problem-selection, scvi-tools, single-cell-rna-qc |

### Custom Uploads
| Plugin | Description |
|--------|-------------|
| social-media-scraper | [[Social Media Scraper]], uploaded to Cowork |

---

## MCP Servers (local)

| Server | Path | Purpose |
|--------|------|---------|
| gmail-mcp | `~/gmail-mcp/` | Gmail integration |
| google-calendar-mcp | `~/google-calendar-mcp/` | Google Calendar integration |
| mcp-google-sheets-railway | `~/mcp-google-sheets-railway/` | Google Sheets (Railway-deployed) |
| context7 | (configured) | Documentation lookup |
| google-sheets | (configured) | Google Sheets MCP |
| media-pipeline | (configured) | Image/video generation |
| n8n | (configured) | n8n workflow automation |

---

## Summary

| Category | Count |
|----------|-------|
| Claude Code commands | 62 |
| Claude Code skills | 110+ |
| Alt-Shift skills | 12 |
| Download plugins | 9 + 2 Creative Studio versions |
| Cowork marketplace plugins | 12 (60+ skills) |
| Cowork custom uploads | 1 |
| MCP servers | 9 |
| **Total** | **~220+ tools/skills/commands** |

## Related

- [[Claude Code]]
- [[Claude Code Skills]]
- [[Claude Plugins]]
- [[Creative Studio Plugin]]
- [[Claude Productivity Suite]]
- [[Claude Code/MCP Servers - Claude Code]]
