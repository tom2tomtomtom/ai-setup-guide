---
name: vault-update-vault
description: Update Obsidian vault notes after a coding session with new patterns, decisions, and gotchas
---

# Update Vault — Sync Knowledge Back to Obsidian

After a coding session, update the relevant notes in `~/VAULT_PATH/` with what was learned.

## Instructions

1. **Identify the project**: Based on the current working directory and what we just did, find the matching note in `~/VAULT_PATH/`.

2. **Read the existing note** to understand what's already documented.

3. **Update with new information**:
   - New architectural decisions made this session
   - Gotchas or bugs encountered (add to relevant sections)
   - New dependencies or tech stack changes
   - Deployment changes
   - Status updates

4. **Also check if these need updating**:
   - `~/VAULT_PATH/Architecture/Development Patterns.md` — if we discovered a reusable pattern
   - `~/VAULT_PATH/Architecture/Local Paths.md` — if file locations changed
   - `~/VAULT_PATH/Tech Stack/` notes — if we used a new technology

5. **Don't over-update**: Only add genuinely useful, stable information. Don't add session-specific debugging details or temporary workarounds.

6. **Add links**: If the new information connects to other notes in the vault, add `[[wiki links]]`.

7. **Open in Obsidian**: After updating, open each modified note so I can review:
   ```bash
   obsidian open file="Note Name" vault="VAULT_NAME"
   ```

8. **Log to daily note**: Append a session summary to today's daily note:
   ```bash
   obsidian daily:append content="Session: [project] — [brief summary of what changed]" vault="VAULT_NAME"
   ```

9. **Tell me what changed**: Summarize the updates made.

$ARGUMENTS
