---
name: notebooklm-research
description: Builds queryable knowledge bases in Google NotebookLM from YouTube videos, URLs, PDFs, and Google Drive files using the nlm CLI and yt-dlp. Generates deliverables including podcasts, slide decks, reports, infographics, and mind maps. Use when researching a topic, building a knowledge base, analyzing multiple sources, creating research-backed content, or generating audio/visual summaries from source material.
---

# NotebookLM Context Research

Build deep, queryable knowledge bases from any combination of YouTube videos, web articles, PDFs, and Google Drive documents. Query across all sources with grounded, citation-backed answers. Generate deliverables (podcasts, slides, reports, infographics) directly from the research.

## When to Use This Skill

- Researching a topic and need a queryable knowledge base from multiple sources
- Pulling YouTube videos on a subject to extract and cross-reference insights
- Building a research corpus from web articles, PDFs, or Google Drive files
- Generating a podcast, slide deck, or infographic summarizing research
- Preparing for a client pitch by aggregating competitive/category intelligence
- Analyzing multiple documents to find patterns, contradictions, or themes
- Creating a "brain" on a topic that can answer follow-up questions with citations

## Core Philosophy

**Research is only as good as the questions you can ask it.** Dumping 20 links into a folder doesn't create knowledge. A queryable knowledge base that can cross-reference sources, surface contradictions, and generate deliverables does.

The pipeline is: **Gather > Ingest > Query > Generate.** Each step has clear commands. The skill's job is to make the right calls in the right order and return actionable results.

## Prerequisites

Two CLI tools must be installed and authenticated:

- **`nlm`** (notebooklm-mcp-cli) - authenticated via `nlm login`
- **`yt-dlp`** - no auth needed for YouTube search

Verify with:
```bash
nlm login --check
yt-dlp --version
```

---

## The Pipeline

### Step 1: Gather Sources

**From YouTube (search by topic):**
```bash
yt-dlp --flat-playlist --print "%(id)s %(title)s" "ytsearch10:TOPIC HERE"
```
This returns video IDs and titles. Adjust the number (ytsearch5, ytsearch10, ytsearch20) based on depth needed.

To get full URLs for adding to NotebookLM:
```bash
yt-dlp --flat-playlist --print "https://www.youtube.com/watch?v=%(id)s" "ytsearch10:TOPIC HERE"
```

**From the web (NotebookLM's built-in research):**
```bash
nlm research start "QUERY" --mode fast --title "Research: TOPIC"
nlm research status
nlm research import
```
- `fast` mode: ~30 seconds, ~10 sources
- `deep` mode: ~5 minutes, ~40 sources (web only)

**From Google Drive:**
```bash
nlm research start "QUERY" --source drive --notebook-id NOTEBOOK_ID
```

### Step 2: Create Notebook and Add Sources

**Create a new notebook:**
```bash
nlm notebook create "TITLE"
```
Returns a notebook ID. Save this for all subsequent commands.

**Add YouTube videos:**
```bash
nlm source add NOTEBOOK_ID --youtube "https://www.youtube.com/watch?v=VIDEO_ID"
```
Multiple at once:
```bash
nlm source add NOTEBOOK_ID \
  --youtube "https://www.youtube.com/watch?v=ID1" \
  --youtube "https://www.youtube.com/watch?v=ID2" \
  --youtube "https://www.youtube.com/watch?v=ID3" \
  --wait
```

**Add web URLs:**
```bash
nlm source add NOTEBOOK_ID --url "https://example.com/article" --wait
```

**Add local files (PDFs, etc.):**
```bash
nlm source add NOTEBOOK_ID --file /path/to/document.pdf --wait
```

**Add Google Drive documents:**
```bash
nlm source add NOTEBOOK_ID --drive "DRIVE_DOC_ID" --type slides
```
Types: `doc`, `slides`, `sheets`, `pdf`

**Add plain text:**
```bash
nlm source add NOTEBOOK_ID --text "Your text content here" --title "Note Title"
```

The `--wait` flag blocks until NotebookLM finishes processing the source (extracting captions, indexing content). Use it when adding sources sequentially or when you need to query immediately after.

### Step 3: Query the Knowledge Base

**Ask a question across all sources:**
```bash
nlm query notebook NOTEBOOK_ID "What are the key themes across all sources?"
```

**Query specific sources only:**
```bash
nlm query notebook NOTEBOOK_ID "question" --source-ids "SOURCE_ID1,SOURCE_ID2"
```

**Follow-up questions (maintains conversation context):**
```bash
nlm query notebook NOTEBOOK_ID "initial question"
# Note the conversation ID from the response
nlm query notebook NOTEBOOK_ID "follow up" --conversation-id CONV_ID
```

**Useful research queries to run:**
- "What are the key themes across all sources?"
- "Where do sources contradict each other?"
- "Summarize the top 3 actionable insights"
- "What's mentioned most frequently and why?"
- "What's the most surprising or counterintuitive finding?"

### Step 4: Generate Deliverables

**Audio overview (podcast):**
```bash
nlm audio create NOTEBOOK_ID --format deep_dive --length default --confirm
```
Formats: `deep_dive`, `brief`, `critique`, `debate`
Lengths: `short`, `default`, `long`
Optional: `--focus "specific topic"` to narrow the podcast focus

**Slide deck:**
```bash
nlm slides create NOTEBOOK_ID --format detailed_deck --confirm
```
Formats: `detailed_deck`, `presenter_slides`
Optional: `--focus "specific angle"`

**Report:**
```bash
nlm report create NOTEBOOK_ID
```

**Infographic:**
```bash
nlm infographic create NOTEBOOK_ID
```

**Mind map:**
```bash
nlm mindmap create NOTEBOOK_ID
```

**Export to Google Docs/Sheets:**
```bash
nlm export to-docs NOTEBOOK_ID ARTIFACT_ID
nlm export to-sheets NOTEBOOK_ID ARTIFACT_ID
```

### Step 5: Download Artifacts

```bash
nlm download NOTEBOOK_ID ARTIFACT_ID --output /path/to/output
```

---

## Complete Workflows

### YouTube Topic Research (End-to-End)

```bash
# 1. Search YouTube
yt-dlp --flat-playlist --print "https://www.youtube.com/watch?v=%(id)s" "ytsearch10:TOPIC"

# 2. Create notebook
nlm notebook create "Research: TOPIC"

# 3. Add all videos (use the URLs from step 1)
nlm source add NOTEBOOK_ID \
  --youtube "URL1" \
  --youtube "URL2" \
  --youtube "URL3" \
  --wait

# 4. Query
nlm query notebook NOTEBOOK_ID "What are the key insights across all videos?"

# 5. Generate deliverables
nlm audio create NOTEBOOK_ID --format deep_dive --confirm
nlm slides create NOTEBOOK_ID --confirm
```

### Web + YouTube Combined Research

```bash
# 1. Create notebook with web research
nlm research start "TOPIC" --mode deep --title "Deep Dive: TOPIC"
# Wait for completion
nlm research status
nlm research import

# 2. Get the notebook ID
nlm notebook list  # find the new notebook

# 3. Add YouTube videos to the same notebook
yt-dlp --flat-playlist --print "https://www.youtube.com/watch?v=%(id)s" "ytsearch5:TOPIC"
nlm source add NOTEBOOK_ID --youtube "URL1" --youtube "URL2" --wait

# 4. Query the combined knowledge base
nlm query notebook NOTEBOOK_ID "Synthesize the web articles and video content"
```

### Google Drive Document Analysis

```bash
# 1. Create notebook
nlm notebook create "Drive Analysis: PROJECT"

# 2. Add Drive docs (get IDs from Google Drive URLs)
nlm source add NOTEBOOK_ID --drive "DOC_ID_1" --type slides
nlm source add NOTEBOOK_ID --drive "DOC_ID_2" --type doc
nlm source add NOTEBOOK_ID --drive "DOC_ID_3" --type pdf --wait

# 3. Query across all documents
nlm query notebook NOTEBOOK_ID "What are the common themes across these documents?"
```

---

## Managing Notebooks

**List all notebooks:**
```bash
nlm notebook list
```

**List sources in a notebook:**
```bash
nlm source list NOTEBOOK_ID
```

**Delete a source:**
```bash
nlm source delete NOTEBOOK_ID SOURCE_ID
```

**Delete a notebook:**
```bash
nlm notebook delete NOTEBOOK_ID
```

**Set an alias for a notebook (easier to reference):**
```bash
nlm alias set my-research NOTEBOOK_ID
# Now use "my-research" instead of the UUID
nlm query notebook my-research "question"
```

---

## Execution Notes

- **Always use `--wait` when adding sources** if you plan to query immediately after. Without it, sources may still be processing when you query.
- **YouTube search quantity**: `ytsearch5` for focused topics, `ytsearch10` for broad research, `ytsearch20` for exhaustive coverage. More than 20 rarely adds value and slows processing.
- **NotebookLM has a source limit** per notebook (approximately 50 sources). For larger research projects, split into themed notebooks and query each separately.
- **Audio overviews take 2-5 minutes** to generate. The command will return an artifact ID. Use `nlm download` to get the audio file when ready.
- **The `--focus` flag** on deliverables is powerful. "Create a podcast about X" from a notebook with 20 sources will focus the output on that angle while still drawing from all source material.
- **For client-facing research**, use `nlm export to-docs` to push reports directly to Google Docs for sharing.
- **Research mode `deep`** is significantly more thorough than `fast` but takes ~5 minutes. Use `fast` for quick explorations, `deep` for proper research.
- **Conversation IDs** from queries allow multi-turn research. Ask a broad question first, then drill into specifics without losing context.
