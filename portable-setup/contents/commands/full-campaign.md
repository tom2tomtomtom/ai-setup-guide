---
name: full-campaign
description: Run the complete campaign pipeline from brief to finished creative, generating strategy, territories, big idea, copy suite, and optional visual assets in one session. Use when you have a brief and want the full deliverable set in one pass, when building a complete campaign presentation, or when you need strategy-through-execution without switching between tools.
arguments:
  - name: brief
    description: The raw creative brief text (paste inline or reference a file)
    required: true
  - name: formats
    description: "Comma-separated ad formats for copy suite (e.g. social,print,digital). Optional."
    required: false
---

# Full Campaign Pipeline

You are running the complete AIDEN campaign pipeline. This is the longest-running command (~5 min total). Follow each step in order using aiden-brain MCP tools.

## Input
Brief: `$ARGUMENTS`

## Steps

### Step 1: Extract Brief
Call `extract_brief` with the raw brief text.
Display a brief summary and confirm with the user before proceeding.

### Step 2: Generate Strategy
Call `generate_strategy` with the structured brief data JSON.
Display the strategy overview.

### Step 3: Generate Territories
Call `generate_territories` with the brief data JSON (5 territories).
Display all territories and ask the user to pick their favorite (or recommend one).

### Step 4: Generate Big Idea
Call `generate_big_idea` with the brief data JSON.
Display big idea concepts. If multiple, ask the user to pick one (or recommend the strongest).

### Step 5: Generate Copy Suite
Call `generate_copy_suite` with:
- `brief_data_json`: the structured brief data
- `territory_json`: the selected territory as JSON
- `big_idea_json`: the selected big idea as JSON
- `selected_formats`: any format preferences from the user

This takes 2-3 minutes. Display the full copy suite organized by format.

### Step 6: Visual Assets (Optional)
Ask the user if they'd like visual assets generated for any of the copy.
If yes, use the media-pipeline tools to produce a full visual package:
- **Generate hero images** — `create_asset` for hero (16:9) based on the big idea and territory visual direction
- **Generate social assets** — `create_asset` for social formats (1:1, 9:16) if social formats were in the copy suite
- **Edit/refine based on feedback** — `edit_image` to adjust colors, elements, or lighting on any generated asset
- **Remove backgrounds for product shots** — `remove_background` to extract subjects for clean compositing
- **Composite product onto lifestyle backgrounds** — `composite_images` to place product shots onto on-brand scenes
- **Generate video versions of key visuals** — `generate_video` for fresh video content or `image_to_video` to animate hero stills
- **Resize suite across all formats** — adapt final approved visuals for every channel size

Use the strategy, territory visual direction, and brand guidelines to craft image prompts.

## Output Format

### Campaign Brief
Summary of extracted brief data

### Strategy
Positioning, messages, tone, channels

### Selected Territory
Name, description, visual direction

### Selected Big Idea
Name, tagline, description

### Copy Suite
Organized by format with headlines, body copy, CTAs

### Visual Assets (if generated)
Generated images with art direction notes

## Tips
- The full pipeline takes ~5 minutes — let the user know at the start
- If any step fails or times out, note the job_id and offer to check status manually
- Territory and big idea selection are the key creative decision points — give the user time to decide
