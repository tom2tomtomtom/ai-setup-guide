---
description: Route to the right vault command based on what you need. Use when you want to interact with the Obsidian vault but aren't sure which specific command to use.
---

# Vault Command Router

You have 21 vault commands available. Tell me what you need and I'll route you to the right one, or just browse the categories below.

**What do you need?** $ARGUMENTS

## Decision Tree

Match the user's intent to the right command below. If arguments were provided, identify the best match and immediately invoke that command using the Skill tool. If no arguments or the intent is ambiguous, present the categories and ask the user to pick.

---

### Morning / Planning

| Command | What it does | Use when... |
|---------|-------------|-------------|
| `/vault-today` | Build a prioritized daily plan from recent notes, projects, and inbox | "What should I work on?" / "Plan my day" |
| `/vault-morning-scout` | Full morning briefing with git activity review, opportunity scouting, and build targets | "Give me the morning briefing" / "What happened yesterday and what's next?" |

---

### Research / Analysis

| Command | What it does | Use when... |
|---------|-------------|-------------|
| `/vault-ask` | Answer a question by searching across the entire vault | "What do I know about X?" / "Find my notes on X" |
| `/vault-research` | Research a topic via web search and create a formatted vault note | "Research X and save it to the vault" |
| `/vault-deep` | 30-day cross-domain deep scan for patterns and new ideas | "What patterns are emerging across my work?" |
| `/vault-gaps` | Audit the vault for missing knowledge, stale notes, and broken links | "What's missing from my vault?" / "What needs updating?" |
| `/vault-scout-report` | Scan for buildable opportunities, stale commitments, and quick wins | "What should I build next?" / "Find revenue blockers" |

---

### Creation / Writing

| Command | What it does | Use when... |
|---------|-------------|-------------|
| `/vault-dump` | Convert scattered thoughts into linked vault notes | "I have some thoughts to capture" / "Brain dump" |
| `/vault-spec-it` | Generate a buildable spec from a vault idea or feature request | "Spec out X" / "Turn this idea into a plan" |
| `/vault-tov-writer` | Write or rewrite text in Tom's natural voice using the TOV profile | "Write this in my voice" / "Does this sound like me?" |
| `/vault-resource` | Summarize a URL into a formatted, wiki-linked vault note | "Save this article to the vault" / [any URL] |
| `/vault-update-vault` | Update vault notes after a coding session with new patterns and decisions | "Sync what we just did back to the vault" |

---

### Intelligence

| Command | What it does | Use when... |
|---------|-------------|-------------|
| `/vault-client-intel` | Analyze client work and suggest what to pitch, build, or propose next | "What should I pitch to X?" / "Client opportunities" |
| `/vault-cross-pollinate` | Force unexpected connections between ideas from different domains | "I'm stuck, give me fresh angles" / "Smash ideas together" |
| `/vault-emerge` | Surface hidden ideas, unnamed patterns, and unarticulated directions | "What's hiding in my vault?" / "Find patterns I haven't named" |
| `/vault-graduate` | Scan daily notes and inbox for buried ideas worth promoting to standalone notes | "Anything worth promoting from my daily notes?" |

---

### Reflection

| Command | What it does | Use when... |
|---------|-------------|-------------|
| `/vault-challenge` | Pressure-test thinking by finding contradictions and blind spots | "Where am I wrong?" / "Challenge my assumptions" |
| `/vault-drift` | Compare stated intentions against actual behavior to surface avoidance | "Am I doing what I said I'd do?" / "Where am I drifting?" |
| `/vault-trace` | Track the evolution of a specific idea or concept over time | "How has my thinking on X changed?" / "Trace the history of X" |

---

### Context

| Command | What it does | Use when... |
|---------|-------------|-------------|
| `/vault-context` | Load project-specific context from the vault before a coding session | "Load context for X" / "What do I need to know about this project?" |

---

### Autonomous

| Command | What it does | Use when... |
|---------|-------------|-------------|
| `/vault-auto-build` | Full autonomous pipeline: scout, spec, build, report | "Build the most valuable thing" / "Auto-build X" |

---

## Quick Reference by Question

| You're thinking... | Use this |
|---|---|
| "What should I focus on today?" | `/vault-today` |
| "Morning briefing please" | `/vault-morning-scout` |
| "What do I know about X?" | `/vault-ask` |
| "Research X for me" | `/vault-research` |
| "What patterns am I missing?" | `/vault-deep` or `/vault-emerge` |
| "What's missing from my vault?" | `/vault-gaps` |
| "What should I build next?" | `/vault-scout-report` |
| "I have thoughts to capture" | `/vault-dump` |
| "Turn this into a spec" | `/vault-spec-it` |
| "Write this in my voice" | `/vault-tov-writer` |
| "Save this URL" | `/vault-resource` |
| "Update vault after this session" | `/vault-update-vault` |
| "What should I pitch to clients?" | `/vault-client-intel` |
| "Give me fresh ideas" | `/vault-cross-pollinate` |
| "What's hiding in my notes?" | `/vault-emerge` |
| "Promote buried ideas" | `/vault-graduate` |
| "Where am I wrong?" | `/vault-challenge` |
| "Am I doing what I said?" | `/vault-drift` |
| "How has X evolved?" | `/vault-trace` |
| "Load project context" | `/vault-context` |
| "Just build something valuable" | `/vault-auto-build` |
