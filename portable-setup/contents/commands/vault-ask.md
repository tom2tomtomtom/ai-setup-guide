---
name: vault-ask
description: Answer questions from your knowledge base by searching across the entire Obsidian vault. Use when you need to recall project details, find past decisions, check client commitments, or look up technical patterns you have documented.
---

# Vault Ask — Query Your Brain

Answer a question by searching across the entire Obsidian vault at `~/VAULT_PATH/`.

## Instructions

1. **Parse the question** from the user's input: $ARGUMENTS

2. **Search broadly**: Based on the question, identify which vault folders are most relevant and read the matching notes. Search across:
   - `~/VAULT_PATH/AIDEN/` — platform, products, architecture
   - `~/VAULT_PATH/Projects/` — all project notes
   - `~/VAULT_PATH/Business/` — clients, engagements, revenue
   - `~/VAULT_PATH/Architecture/` — technical patterns, infrastructure
   - `~/VAULT_PATH/Ideas/` — ideas and concepts
   - `~/VAULT_PATH/Concepts/` — named patterns
   - `~/VAULT_PATH/Tech Stack/` — technology notes
   - `~/VAULT_PATH/People/` — contacts and relationships
   - `~/VAULT_PATH/Mother London/` — Mother-specific work

   Use the Obsidian CLI for fast vault-wide search, then read the top matches:
   ```bash
   obsidian search query="keyword" vault="VAULT_NAME"
   ```
   Supplement with Grep for content-level detail when needed. Use `obsidian backlinks file="Note Name" vault="VAULT_NAME"` to discover related notes through the link graph.

3. **Synthesize an answer** from what you find. Cite specific notes using [[wiki links]] so the user can follow up.

4. **Output format**:
   ```
   ### Answer
   [Direct answer to the question, concise]

   ### Sources
   - [[Note Name]] — what it contributed to this answer
   - [[Note Name]] — what it contributed
   ...

   ### Gaps
   - [anything the vault doesn't cover that would help answer this better]
   ```

5. **Open the most relevant note** in Obsidian so I can explore further:
   ```bash
   obsidian open file="Most Relevant Note" vault="VAULT_NAME"
   ```

6. If the vault doesn't contain enough information to answer, say so clearly and suggest what notes would need to exist.

Keep the answer tight. This is a lookup, not an essay.
