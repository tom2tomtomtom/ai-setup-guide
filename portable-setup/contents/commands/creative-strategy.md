---
name: creative-strategy
description: Transform a raw creative brief into a full strategy with positioning, territories, and big idea concepts using the AIDEN brain pipeline. Use when kicking off a new campaign and need strategic direction, when exploring multiple creative territories from a brief, or when you want structured strategy output before generating copy or visuals.
arguments:
  - name: brief
    description: The raw creative brief text (paste inline or reference a file)
    required: true
---

# Creative Strategy Pipeline

You are running the AIDEN creative strategy pipeline. Follow these steps in order, using the aiden-brain MCP tools.

## Input
The user has provided this brief:
`$ARGUMENTS`

## Steps

### Step 1: Extract Brief
Call `extract_brief` with the raw brief text. This returns structured brief data that all subsequent tools need.

Display a summary of the extracted brief: brand, audience, objectives, constraints.

### Step 2: Generate Strategy
Call `generate_strategy` with the structured brief data JSON from Step 1.

This takes ~20 seconds. Display the strategy once complete: positioning, key messages, tone, channels.

### Step 3: Generate Territories
Call `generate_territories` with the brief data JSON. Request 5 territories.

This takes ~15 seconds. Display each territory with its name, description, and visual direction.

### Step 4: Generate Big Idea
Call `generate_big_idea` with the brief data JSON.

This takes ~30 seconds. Display the big idea concepts with their names, descriptions, and how they connect to the strategy.

## Output Format

Present results in this structure:

### Brief Summary
- Brand / Product
- Target Audience
- Key Objectives
- Constraints / Mandatories

### Campaign Strategy
- Positioning
- Key Messages
- Tone & Voice
- Recommended Channels

### Creative Territories (5)
For each: Name, Description, Visual Direction, Why It Works

### Big Idea Concepts
For each: Name, Tagline/Hook, Description, Territory Connection

## After Completion

Let the user know they can:
- Deep-dive into any territory with `/brain-chat`
- Generate a full copy suite with `/full-campaign`
- Create visual assets for any concept with `/generate-hero` or `/campaign-toolkit`
