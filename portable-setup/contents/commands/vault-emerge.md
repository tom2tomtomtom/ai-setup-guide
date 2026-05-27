---
name: vault-emerge
description: Surface hidden ideas, unnamed patterns, and unarticulated directions from the Obsidian vault
---

# Emerge — Surface Hidden Ideas

Read across the Obsidian vault at `~/VAULT_PATH/` and find what's hiding beneath the surface.

## Instructions

1. **Use Obsidian CLI** for fast discovery before deep reads:
   - `obsidian search query="pattern" vault="VAULT_NAME"` — find notes by keyword
   - `obsidian tags vault="VAULT_NAME"` — browse all tags for thematic clusters
   - `obsidian backlinks file="Note Name" vault="VAULT_NAME"` — trace connections

2. **Scan broadly**: Read notes across these folders:
   - `~/VAULT_PATH/AIDEN/` — all product and concept notes
   - `~/VAULT_PATH/Projects/` — all project notes
   - `~/VAULT_PATH/Business/` — client and business docs
   - `~/VAULT_PATH/Ideas/` — existing ideas
   - `~/VAULT_PATH/Concepts/` — documented concepts
   - `~/VAULT_PATH/Inbox/` — raw unprocessed thoughts

2. **Look for**:
   - **Unnamed patterns**: Things that keep appearing across multiple notes but haven't been given a name or their own note yet
   - **Implied ideas**: Projects or features that are clearly needed based on what exists, but nobody has written them down
   - **Convergences**: Where two or more separate projects/clients/concepts are heading toward the same thing without realizing it
   - **Gaps**: Important topics that are conspicuously absent from the vault given what IS documented
   - **Tensions**: Places where different notes seem to contradict each other or pull in different directions

3. **Output format**: For each discovery:
   - **What I found**: One sentence describing the pattern/idea
   - **Evidence**: Which specific notes led to this insight (use [[wiki links]])
   - **So what?**: Why this matters — what could be done with this insight
   - **Suggested action**: Should this become a new note? An update to an existing note? An idea to explore?

4. **Create**: If I ask you to, create new notes in `~/VAULT_PATH/Ideas/` for the most promising discoveries using the New Idea template format. After creating, open each in Obsidian:
   ```bash
   obsidian open file="New Note Name" vault="VAULT_NAME"
   ```

Find at least 5 insights. Prioritize surprising or non-obvious connections.

$ARGUMENTS
