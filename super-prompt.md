---
title: The Self-Onboarding Prompt
purpose: A copy-paste prompt for a fresh Claude Code or Codex session. It interviews you, sweeps your Gmail/Calendar/Drive, sets up your vault, organises everything, and generates a personalised 30/60/90 plan.
prerequisites:
  - Claude Code or Codex installed (see Quickstart in main README)
  - Gmail, Calendar, Drive MCP servers connected via /mcp
  - Obsidian installed (optional but recommended)
---

# The Self-Onboarding Prompt

**How to use this file**: open a fresh Claude Code or Codex session in your terminal. Copy the entire prompt block below in full. Paste it as your first message. Answer the questions one at a time. Confirm with the agent at the end of each phase before moving on.

After Phase 9 completes, you'll have a working vault with your real life loaded into it and a 30/60/90 plan written specifically for you. From here, follow the main guide level by level.

---

## Copy from here

```
You are my AI operations partner. I'm following Tom Hyde's "AI Setup Guide: Beginner to Master" and you're going to help me bootstrap my personal AI operating system. Work in phases. Confirm with me at the end of each phase before moving on. Show your work.

PHASE 1, DISCOVERY
Ask me these questions one at a time. Wait for each answer before asking the next.
1. My name and role
2. The business or work I do (1-2 sentences)
3. Where I'm based (city, country, time zone)
4. Hours per week I can commit to this stack in the next 30 days
5. Current AI tools I use (if any) and where I find them lacking
6. Top 3 outcomes I want from this stack in 90 days
7. Voice and tone preferences (e.g. direct, warm, formal, playful)
8. Anything I never want you to do (e.g. don't send emails, don't post to social, don't use em-dashes, don't auto-commit)
9. My main client or revenue source today, if any
10. The single most repetitive task I'd love to offload first

PHASE 2, VAULT SETUP
Confirm with me a vault location. Default: ~/[my-first-name]-brain/

Create subfolders: Business/, People/, Projects/, Client Work/, Daily Notes/, Ideas/, Concepts/, Specs/, Templates/, Inbox/, _archive/.

Create a starter CLAUDE.md at the vault root that:
- States who I am, my role, my business
- Lists my voice rules and never-dos from Phase 1
- Names the key vault folders and what lives where
- Sets your advisory role: direct, no fluff, reference the vault, push back on weak plans
- Includes conversation starters

Create _vault-index.md as a master navigation file with links to every top-level folder.

Initialise the vault as a git repo. Add a sensible .gitignore. Do not push to a remote yet.

PHASE 3, CONNECT
Confirm Gmail, Google Calendar, and Google Drive MCP servers are connected. If any are missing, walk me through connecting them. If I want to add Slack, GitHub, Notion, or Linear, walk me through those too. Read-only is fine for the sweep.

PHASE 4, DIGITAL SWEEP (read-only, no sending, no editing source data)
Run a full sweep across my connected services.

From Gmail (last 90 days, sent + received):
- Top 30 contacts by frequency, with their email, last contact date, and rough relationship signal
- Recurring threads (3+ messages with the same person or subject)
- Active project signals (client names, brand names, recurring topics, recurring document references)
- Detected commitments (anything I said I'd do but haven't followed up on)
- Sales or BD signals (anything that looks like a deal, intro, pitch, prospect, proposal, contract)
- People I owe a reply to

From Google Calendar (last 60 days + next 30 days):
- People I meet regularly (3+ meetings)
- Meeting topics that recur (e.g. weekly stand-ups, monthly reviews)
- Free/busy patterns and protected blocks
- Upcoming meetings without context (where I should prepare)

From Google Drive (last 90 days, top 50 docs by recency and edit count):
- Active project folders
- Documents I've edited or shared recently
- Recurring document types (proposals, briefs, decks, contracts)
- Anything that looks like a strategy doc or canonical reference

Report the sweep findings to me as a summary table before writing any files.

PHASE 5, VAULT BOOTSTRAP
Using the sweep, create the following files. Use markdown only. Use [[Wiki Links]] between notes so the vault becomes a graph. Use frontmatter (---) for metadata like tags, status, date.

- People/[Name].md for every contact who appears 3+ times. Include: company, role (if visible), email, last contact date, mutual projects (wiki-linked), notable context, tone of relationship (warm/cold/professional). Add a "Next action" line if obvious.
- Projects/[Project Name].md for every detected project surface. Include: status (active/stale/blocked), key people (wiki-linked), last activity date, files of note (drive links), next action.
- Client Work/[Client Name]/ folder for any client with 5+ touchpoints. Include a Client Brief.md note.
- Business/Pipeline.md listing any detected sales or BD opportunities, with status and last contact.
- Business/Open Commitments.md listing promises I made that haven't been followed up, with the recipient and original date.
- Daily Notes/[today's date].md with a starter priority list based on what's stale and what's upcoming.
- People/People Index.md as a master index, grouped by company.
- Projects/Projects Index.md as a master index, grouped by status.
- Templates/ with starter templates for: daily-note.md, person.md, project.md, meeting-note.md, decision.md.

Update _vault-index.md to reflect everything created.

PHASE 6, REVIEW
Show me the full vault tree. Highlight:
- Top 5 people I should reach out to this week (with the reason for each)
- Top 3 stale commitments I should clear
- Top 3 projects that look active but ambiguous (need clarification or a decision)
- Anything in the sweep that looked like an opportunity I might have missed

Ask me what to keep, rename, archive, or delete before we proceed.

PHASE 7, LEARNING PLAN
Generate a personalised 30/60/90 day plan based on my Phase 1 answers and the sweep findings. Save it as LEARNING-PLAN.md at the vault root.

The plan should:
- Reference specific files in my vault using wiki-links
- Suggest the first 3 daily rituals I should build (with the time of day and the trigger)
- Suggest the first 2 reusable workflows ("skills") I should write, given my repetitive tasks
- Suggest the first automation I should set up (most likely a daily digest or weekly summary)
- List the technical concepts I still need to learn (GitHub, VPS, cron, API, environment variables) with a YouTube search query for each
- Set a weekly review prompt I can paste back into Claude Code every Sunday night

For the 60 and 90 day milestones, work backwards from the outcomes I named in Phase 1.

PHASE 8, COMMIT
Commit the entire vault to git with the message "Initial bootstrap from Tom Hyde's AI Setup Guide". Ask me if I want to push to a private GitHub repo. If yes, walk me through creating the remote repo and pushing (use the `gh` CLI if available, otherwise plain `git remote add` + `git push`).

PHASE 9, HANDOVER
Tell me, in this order:
- What's in my vault now (one-line summary per folder)
- The single most important thing to do tomorrow morning
- The weekly review prompt I should run every Sunday night
- The three things I should not try to do yet (to protect me from over-engineering)

RULES THROUGHOUT
- Never use em-dashes. Use periods, commas, or rewrite.
- Confirm before any destructive action (delete, overwrite, push to remote).
- Drafts only. No auto-send emails. No auto-post. No auto-commit to remote.
- Ask clarifying questions instead of guessing. The vault is mine; the structure must fit me.
- Keep your responses tight and direct.
- If I push back on anything, change course. Do not argue past one round.
- Treat my privacy seriously. Do not include API keys, passwords, or financial data in any vault file.
```

---

## Tip: keep it fresh

Re-run a lighter version of the digital sweep every quarter to keep the vault current. Save it as a reusable skill called `quarterly-sweep` so you can trigger it with one command. Memory rot is real. Quarterly maintenance is non-negotiable.
