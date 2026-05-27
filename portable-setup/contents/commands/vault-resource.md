---
name: vault-resource
description: Summarize a URL (article, video, page) into a formatted vault note with smart linking
---

# Vault Resource — URL to Note

Take a URL and turn it into a summarized, wiki-linked vault note.

## Instructions

1. **Get the URL** from the user's input: $ARGUMENTS

   If no URL provided, ask for one.

2. **Fetch the content** using WebFetch. Read the full page content.

3. **Check existing vault notes**: Search `~/VAULT_PATH/` for any existing notes related to this content:
   ```bash
   obsidian search query="article title or concept" vault="VAULT_NAME"
   ```
   Supplement with Grep for content-level checks.

4. **Create a note** in the appropriate folder:
   - Articles about tech -> `~/VAULT_PATH/Tech Stack/` or `~/VAULT_PATH/Architecture/`
   - Articles about industry/trends -> `~/VAULT_PATH/Inputs/`
   - Articles about people -> `~/VAULT_PATH/People/`
   - Articles about clients/business -> `~/VAULT_PATH/Business/`
   - Everything else -> `~/VAULT_PATH/Inputs/`

   Format:
   ```
   ---
   tags: resource
   status: active
   date: [today]
   source: [URL]
   type: [article/video/tool/talk]
   ---

   # [Title]

   **By**: [Author if known]
   **Source**: [Publication/Platform]
   **URL**: [link]

   ## Summary
   [3-5 sentence summary of the key argument or content]

   ## Key Takeaways
   - [takeaway 1]
   - [takeaway 2]
   - [takeaway 3]

   ## Relevance to Tom's Work
   [How this connects — what vault notes it relates to, which projects could use this]
   - [[linked vault notes]]

   ## Quotes Worth Keeping
   > [any standout quotes, if applicable]

   ## Related
   - [[relevant vault notes]]
   ```

5. **Wiki-link everything**: Any concept, person, project, or tool mentioned that has a vault note should be linked.

6. **Open the note** in Obsidian:
   ```bash
   obsidian open file="Note Name" vault="VAULT_NAME"
   ```

7. **Output**: Show the note content, confirm save location, and highlight the most interesting connection to existing work.
