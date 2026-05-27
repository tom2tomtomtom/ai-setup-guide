---
name: vault-gaps
description: Identify what's missing from the Obsidian vault — knowledge areas, undocumented projects, stale notes
---

# Gaps — What's Missing?

Audit the Obsidian vault at `~/VAULT_PATH/` for completeness and freshness.

## Instructions

1. **Read the vault broadly** — Home, all folders, major notes. Use the Obsidian CLI for structural analysis:
   ```bash
   obsidian tags vault="VAULT_NAME"
   obsidian backlinks file="Note Name" vault="VAULT_NAME"
   obsidian search query="TODO" vault="VAULT_NAME"
   ```

2. **Check for**:

   ### Missing Projects
   - Scan `~/` for project directories not yet documented in the vault
   - Are there any repos, tools, or apps that should have notes but don't?

   ### Stale Notes
   - Which notes reference outdated information?
   - Are there project statuses that need updating?
   - Any tech stack notes that are behind the actual usage?

   ### Knowledge Gaps
   - Given the projects and tech stack documented, what important topics are missing?
   - Are there architectural patterns used repeatedly but never documented?
   - Client/business knowledge that should be captured?

   ### Broken Links
   - Find `[[wiki links]]` that point to notes that don't exist
   - Which of these deserve to become real notes?

   ### Orphaned Notes
   - Notes that exist but aren't linked from anywhere
   - Should they be linked or deleted?

3. **Prioritize findings**: What's the most impactful gap to fill first?

4. **If I approve**, create or update the notes to fill the gaps. Open each in Obsidian:
   ```bash
   obsidian open file="New Note" vault="VAULT_NAME"
   ```

$ARGUMENTS
