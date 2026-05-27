---
name: vault-trace
description: Track the evolution of a specific idea or concept over time across the vault
---

# Vault Trace — Idea Archaeology

Track how a specific idea, concept, or decision has evolved over time across the vault.

## Instructions

1. **Identify the concept** to trace from the user's input: $ARGUMENTS

   If no argument, ask what idea/concept/decision they want to trace.

2. **Search exhaustively**: Use the Obsidian CLI for fast initial discovery, then Grep for content-level detail:
   ```bash
   obsidian search query="concept name" vault="VAULT_NAME"
   obsidian backlinks file="Concept Note" vault="VAULT_NAME"
   ```
   Also search for synonyms, related terms, and abbreviations.

   Check everywhere:
   - `~/VAULT_PATH/AIDEN/`
   - `~/VAULT_PATH/Projects/`
   - `~/VAULT_PATH/Business/`
   - `~/VAULT_PATH/Ideas/`
   - `~/VAULT_PATH/Concepts/`
   - `~/VAULT_PATH/Architecture/`
   - `~/VAULT_PATH/Daily Notes/`
   - `~/VAULT_PATH/Inbox/`
   - `~/VAULT_PATH/People/`

3. **Read each matching note** and extract every mention of the concept with surrounding context. Note the date (from frontmatter or file modification time).

4. **Build a timeline**: Arrange all mentions chronologically. For each entry, capture:
   - When it was written (date)
   - What was said about the concept at that point
   - How the thinking had shifted from the previous mention
   - What triggered the shift (if evident)

5. **Identify the evolution pattern**:
   - **Stable**: Idea hasn't changed, just been reinforced
   - **Expanding**: Started small, grew in scope/ambition
   - **Narrowing**: Started broad, got more focused
   - **Pivoting**: Fundamentally changed direction
   - **Oscillating**: Keeps going back and forth between two positions
   - **Stalled**: Lots of early mentions, then silence

6. **Output format**:
   ```
   ### Trace: [Concept Name]

   #### Timeline
   | Date | Source | What Was Said | Shift |
   |------|--------|---------------|-------|
   | [date] | [[note]] | [summary] | [first mention] |
   | [date] | [[note]] | [summary] | [what changed] |
   ...

   #### Evolution Pattern: [type]
   [1-2 sentence summary of how this idea has evolved]

   #### Key Turning Points
   - [date]: [what changed and why]

   #### Current State
   [Where this concept stands now based on the most recent mentions]

   #### What's Next
   [Based on the trajectory, where is this heading? What decision or action does the evolution point toward?]
   ```
