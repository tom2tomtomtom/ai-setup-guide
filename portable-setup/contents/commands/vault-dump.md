---
name: vault-dump
description: Convert scattered thoughts into linked vault notes with automatic wiki-linking and smart routing. Use when you have meeting notes to capture, random ideas to record, or a stream of thoughts that need to become part of your knowledge graph.
---

# Vault Dump — Brain Dump to Graph

Take a stream of thoughts and turn them into properly linked vault notes.

## Instructions

1. **Read the brain dump** from the user: $ARGUMENTS

   If no arguments, ask the user to dump their thoughts. Anything goes: ideas, observations, meeting notes, random connections, frustrations, plans.

2. **Parse into atomic ideas**: Break the dump into distinct concepts, each of which could be its own note or belongs in an existing one.

3. **Check existing notes**: For each concept, search `~/VAULT_PATH/` to see if a relevant note already exists. Use the Obsidian CLI for fast search (`obsidian search query="concept" vault="VAULT_NAME"`), supplemented with Grep for content-level checks. Search:
   - `~/VAULT_PATH/Projects/`
   - `~/VAULT_PATH/Ideas/`
   - `~/VAULT_PATH/AIDEN/`
   - `~/VAULT_PATH/Business/`
   - `~/VAULT_PATH/Concepts/`
   - `~/VAULT_PATH/Inbox/`

4. **Route each idea**:
   - **Existing note found**: Append the new thought to the relevant section of that note (under a `## Recent Additions` section if no obvious section fits)
   - **New concept**: Create a new note in the most appropriate folder:
     - Ideas that need exploration -> `~/VAULT_PATH/Ideas/`
     - Project-related -> `~/VAULT_PATH/Projects/`
     - Client/business-related -> `~/VAULT_PATH/Business/`
     - Raw/unclear -> `~/VAULT_PATH/Inbox/`

5. **Wiki-link aggressively**: In every note you create or update, wrap any reference to an existing vault note in `[[double brackets]]`. Connect everything to the graph. If you mention a person, link to their People note. If you mention a project, link to the project note. If you mention a concept, link it.

6. **New notes format**:
   ```
   ---
   tags: [appropriate tag]
   status: active
   date: [today]
   ---

   # [Concept Name]

   [The idea, in Tom's voice — short, direct, no filler]

   ## Related
   - [[linked notes]]
   ```

7. **Open created/updated notes** in Obsidian:
   ```bash
   obsidian open file="Note Name" vault="VAULT_NAME"
   ```

8. **Log to daily note**:
   ```bash
   obsidian daily:append content="Brain dump processed: [count] ideas routed, [count] notes created" vault="VAULT_NAME"
   ```

9. **Output summary**:
   ```
   ### Dump Processed
   - **Updated**: [list of existing notes that got new content]
   - **Created**: [list of new notes]
   - **Linked**: [count of wiki-links added]
   - **Inbox**: [anything too vague to place, left in Inbox for review]
   ```
