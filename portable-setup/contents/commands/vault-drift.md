---
name: vault-drift
description: Compare stated intentions against actual behavior to surface avoidance and drift
---

# Vault Drift — Intention vs. Reality

Compare what you said you'd do against what you actually did. Surface avoidance, drift, and misaligned priorities.

## Instructions

1. **Use Obsidian CLI** for quick searches:
   ```bash
   obsidian search query="commit" vault="VAULT_NAME"
   obsidian search query="priority" vault="VAULT_NAME"
   obsidian search query="next week" vault="VAULT_NAME"
   ```

2. **Gather stated intentions**: Read these files to find what was planned, committed to, or prioritized:
   - `~/VAULT_PATH/Business/Open Commitments.md`
   - `~/VAULT_PATH/Ideas/Capacity Model.md`
   - `~/VAULT_PATH/Ideas/Ideas Index.md`
   - `~/VAULT_PATH/Business/Redbaez Next Steps - March 2026.md`
   - `~/VAULT_PATH/Business/Time Allocation.md`
   - `~/VAULT_PATH/Business/BD Pipeline.md`
   - Any recent daily notes in `~/VAULT_PATH/Daily Notes/` (last 30-60 days)

3. **Gather actual behavior**: Look for evidence of what actually happened:
   - Check git logs across active project directories (use `~/VAULT_PATH/Architecture/Local Paths.md` for locations). Run `git log --oneline --since="30 days ago"` in each.
   - Read recently modified vault notes (`find ~/VAULT_PATH -name "*.md" -mtime -30`)
   - Check `~/VAULT_PATH/Architecture/Deployed Infrastructure.md` for recent deployments
   - Read any session notes or updates in project files

4. **Compare and surface drift**:

   For each stated intention/commitment, classify as:
   - **Done**: Completed as intended
   - **In Progress**: Active work happening
   - **Drifted**: Started but shifted to something else
   - **Avoided**: No evidence of any action despite being stated priority
   - **Replaced**: Explicitly deprioritized in favor of something else

5. **Look for patterns**:
   - What *type* of work gets avoided? (client work vs product work? building vs selling?)
   - What gets done that was never planned? (reactive work? shiny objects?)
   - Where is time actually going vs where it was allocated?
   - Are there recurring "next week" items that never happen?

6. **Output format**:
   ```
   ### Drift Report: [date range]

   #### Completed as Intended
   - [item] — delivered [when]

   #### In Progress (On Track)
   - [item] — evidence: [git commits, note updates]

   #### Drifting
   - [item] — intended: [X], actual: [Y]. Why?

   #### Avoided (No Action Despite Priority)
   - [item] — stated [when], zero evidence of progress
   - Pattern: [what these avoided items have in common]

   #### Unplanned Work (Done But Never Prioritized)
   - [item] — not in any plan, but consumed time

   ### The Real Priorities (Based on Behavior)
   [What your actions say your priorities actually are, regardless of what the plans say]

   ### Honest Questions
   - [2-3 questions that the drift pattern raises]
   ```

Be direct. This command exists to cut through self-deception, not to be polite.

$ARGUMENTS
