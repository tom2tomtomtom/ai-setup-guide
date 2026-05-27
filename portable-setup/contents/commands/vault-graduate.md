---
name: vault-graduate
description: Scan daily notes and inbox for buried ideas worth promoting to standalone notes
---

# Graduate — Promote Buried Ideas

Scan raw notes for ideas that deserve their own space to grow.

## Instructions

1. **Use Obsidian CLI** for initial discovery:
   ```bash
   obsidian search query="should" vault="VAULT_NAME"
   obsidian search query="what if" vault="VAULT_NAME"
   obsidian tags vault="VAULT_NAME"
   ```

2. **Read all files** in:
   - `~/VAULT_PATH/Inbox/` — raw unprocessed thoughts
   - `~/VAULT_PATH/Daily Notes/` — daily journals (all of them)

2. **Look for**:
   - Ideas mentioned in passing that were never developed
   - Recurring themes or topics that keep coming up across multiple daily notes
   - Questions asked but never answered
   - "I should..." or "What if..." statements that were never followed up
   - Links to notes that don't exist yet (unresolved `[[links]]`)

3. **For each discovery**, tell me:
   - **The buried idea**: What it is, in one sentence
   - **Where I found it**: Which daily note(s) or inbox item(s)
   - **Why it deserves promotion**: Is it recurring? Important? Time-sensitive?
   - **Suggested home**: Which folder should the new note live in?

5. **If I approve**, create the notes using the appropriate template:
   - Ideas → `~/VAULT_PATH/Ideas/` using New Idea template format
   - Projects → `~/VAULT_PATH/Projects/` using New Project template format
   - Concepts → `~/VAULT_PATH/Concepts/`

6. **Open promoted notes** in Obsidian after creating:
   ```bash
   obsidian open file="Promoted Note" vault="VAULT_NAME"
   ```

7. **Also clean up**: Flag any inbox items that look like noise (no longer relevant, duplicate of existing notes, too vague to act on).

$ARGUMENTS
