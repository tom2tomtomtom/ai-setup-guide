---
description: Scan the vault for buildable opportunities, stale commitments, revenue blockers, and quick wins with a ranked action list. Use when you need to identify what to build next, find neglected commitments, or discover high-value actions across all projects and clients.
argument-hint: [focus-area]
---

# Scout Report

Run the vault scout to identify what to build next.

Optional focus: $ARGUMENTS (e.g., "mother", "uncommon", "aiden", "revenue", "quick-wins")

Launch the scout agent to scan the Obsidian vault at `~/VAULT_PATH/`. Use the Obsidian CLI for fast searches (`obsidian search query="term" vault="VAULT_NAME"`). The agent will:

1. Read all client engagements, open commitments, and the ideas index
2. Check git activity across active projects
3. Identify buildable opportunities, stale commitments, quick wins, and revenue blockers
4. Produce a ranked action list

If a focus area was provided, weight the results toward that area. Otherwise, scan everything.

After the scout reports, ask me which items I want to act on. For each chosen item, offer:
- **Spec it**: Launch the spec-writer agent to produce a buildable spec
- **Build it**: Launch the builder agent to execute directly
- **Note it**: Update the relevant vault note with the finding and open it: `obsidian open file="Note" vault="VAULT_NAME"`
