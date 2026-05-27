---
name: vault-research
description: Research a topic via web search and create a formatted vault note with sources
---

# Vault Research — Web Search to Note

Research a topic online and create a well-sourced vault note.

## Instructions

1. **Identify the topic** from the user's input: $ARGUMENTS

2. **Search the web** using WebSearch to gather current information. Run 2-3 searches with different angles:
   - The topic directly
   - Recent news/developments about the topic
   - Technical or practical aspects if relevant

3. **Check existing vault notes**: Search using the Obsidian CLI first:
   ```bash
   obsidian search query="topic" vault="VAULT_NAME"
   ```
   If an existing note is found, update it rather than create a new one.

4. **Synthesize findings** into a structured note. Fetch key URLs with WebFetch if needed for deeper detail.

5. **Create or update the note**:

   For new notes, place in the most appropriate folder:
   - Tech topics -> `~/VAULT_PATH/Tech Stack/`
   - Industry/trends -> `~/VAULT_PATH/Concepts/` or `~/VAULT_PATH/Ideas/`
   - People/companies -> `~/VAULT_PATH/People/` or `~/VAULT_PATH/Business/`
   - Project-related -> alongside the relevant project note

   Format:
   ```
   ---
   tags: research
   status: active
   date: [today]
   source: web-research
   ---

   # [Topic]

   ## Summary
   [2-3 sentence overview of key findings]

   ## Key Points
   - [finding 1]
   - [finding 2]
   - [finding 3]

   ## Relevance
   [How this connects to Tom's work — link to relevant vault notes with [[wiki links]]]

   ## Sources
   - [Title](URL) — [one-line summary]
   - [Title](URL) — [one-line summary]

   ## Related
   - [[relevant vault notes]]
   ```

6. **Open the note** in Obsidian:
   ```bash
   obsidian open file="Note Name" vault="VAULT_NAME"
   ```

7. **Output**: Show the note content and confirm where it was saved. Flag any wiki-links to notes that don't exist yet.
