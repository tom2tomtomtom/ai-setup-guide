---
name: vault-deep
description: 30-day deep scan using cross-domain pattern detection to generate new ideas
---

# Vault Deep — Cross-Domain Deep Scan

Run a time-bounded deep analysis across all vault domains. Like `/vault-emerge` but focused on the last 30 days and specifically looking for cross-domain connections.

## Instructions

1. **Use Obsidian CLI** for structural analysis:
   ```bash
   obsidian tags vault="VAULT_NAME"
   obsidian search query="keyword" vault="VAULT_NAME"
   obsidian backlinks file="Note Name" vault="VAULT_NAME"
   ```

2. **Find recently modified notes**: Search for all notes modified in the last 30 days across `~/VAULT_PATH/`. Use file modification times to identify active thinking.

3. **Read all recent notes**: Read every note modified in the last 30 days. Group them by domain:
   - AIDEN / Platform
   - Client Work (Mother, Uncommon, Alt-Shift, Monigle)
   - Personal Projects
   - Business / Revenue
   - Creative (screenwriting, filmmaking)
   - Trading / Finance
   - Ideas / Concepts
   - Architecture / Technical

4. **Cross-domain pattern detection**: For each pair of domains, ask:
   - What concept from Domain A could solve a problem in Domain B?
   - What pattern is repeated across both but called different things?
   - What would happen if you combined the approach from A with the goal of B?
   - Where is Domain A ahead of Domain B in maturity?

5. **Graph analysis** (use `obsidian backlinks` to map the link graph): Look at wiki-links across the recent notes. Which notes are heavily linked? Which are isolated? Where are there missing links that should exist?

6. **Generate new ideas**: Based on the cross-domain analysis, produce at least 5 novel ideas that don't exist in the vault yet.

7. **Output format**:
   ```
   ### Deep Scan: [date range]
   **Notes analyzed**: [count]
   **Domains active**: [list]

   #### Cross-Domain Connections

   **[Domain A] x [Domain B]**
   - Connection: [what links them]
   - Insight: [what this means]
   - Action: [what to do with this]

   [repeat for each interesting pair]

   #### New Ideas Generated
   1. **[Idea Name]**: [one sentence]. Connects [[note]] + [[note]].
   2. ...

   #### Graph Observations
   - **Most connected**: [[note]] ([count] links in/out)
   - **Surprisingly isolated**: [[note]] (should connect to more)
   - **Missing links**: [[A]] should link to [[B]] because [reason]

   #### 30-Day Momentum
   - **Accelerating**: [domains/projects getting more attention]
   - **Decelerating**: [domains/projects losing attention]
   - **New arrivals**: [concepts that appeared for the first time]
   ```

$ARGUMENTS
