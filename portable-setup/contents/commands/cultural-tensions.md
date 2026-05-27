---
name: cultural-tensions
description: Detect cultural debates and value clashes across social platforms, scoring tensions by severity and mapping opposing viewpoints. Use when a brand needs to take a public position on a divisive topic, when planning comms around a culturally sensitive issue, or when you want to identify the battlegrounds where your category is being debated.
---

# Cultural Tensions — Battleground Detection

Detect cultural debates, tensions, and battlegrounds across social media. Identifies where multiple perspectives clash, values are debated, and brands must choose positions carefully.

## Workflow

1. **Get input** from the user:
   - **Option A:** A specific topic (e.g., "AI in creative industries", "cost of living")
   - **Option B:** A category from the 25-category taxonomy (e.g., "Technology & Apps", "Sustainability")
   - **Option C:** A brand name (will auto-detect relevant categories and topics)
   - **Optional:** Specific platforms to focus on

2. **Build search queries** based on input:
   - For topics: use the topic directly as search terms across platforms
   - For categories: use category keywords from SKILL.md taxonomy
   - For brands: generate Layer 1 + Layer 2 keywords, focus on controversial/debate content

3. **Collect trending content** via Apify MCP + Reddit:

   ### Apify Collection
   - Search across TikTok, Instagram, Twitter/X with 30-50 results per platform
   - Focus on content with high comment-to-like ratios (signals debate)
   - Prioritize recent content (last 7 days)

   ### Reddit Collection (free)
   - Search relevant subreddits: `curl -s -H "User-Agent: CultureWire/2.0" "https://www.reddit.com/search.json?q={topic}&sort=controversial&limit=50"`
   - Reddit's "controversial" sort is particularly valuable for tension detection
   - Also check r/australia, r/changemyview, and topic-specific subreddits

4. **Apply Cultural Tension Analysis** from SKILL.md:
   - Scan all content for tension keywords across 8 categories:
     - debate, values, change, identity, sustainability, economic, technology, authenticity
   - Detect opposing viewpoint pairs (support/oppose, love/hate, embrace/reject, etc.)
   - Require 2+ tension signals OR clear opposition to flag as a tension
   - Score each tension 0-10

5. **Identify battlegrounds:**
   - Group tensions by category
   - A battleground forms when 2+ tensions cluster in the same category
   - Calculate severity (1-10) based on: tension count, average score, platform diversity
   - Sort by severity (highest first)

6. **Generate strategic insights:**
   - Primary battleground identification
   - Cross-platform significance (3+ platforms = broad cultural impact)
   - Dominant themes
   - High-severity warnings requiring careful brand positioning

7. **Generate an interactive HTML dashboard** using the dashboard template in SKILL.md:
   - Save to `~/{topic}-cultural-tensions/index.html`
   - Use Tailwind CSS + Chart.js (CDN, single file)
   - Include:
     - Hero header with topic, date, content count
     - Stat cards: total tensions, battleground count, highest severity, platforms covered
     - Battleground cards ranked by severity with:
       - Severity score (color-coded: red 7-10, amber 4-6, blue 1-3)
       - Platform badges showing where tension is active
       - Key opposing views (side A vs side B)
       - Example content with links to original posts
       - DO / DON'T strategic guidance panels (green/red backgrounds)
     - Tension heatmap: horizontal bar chart (category x severity, color-coded)
     - Platform distribution chart showing which platforms have most tension
     - Strategic insights section with multi-platform significance flags
   - After generating, open in browser: `open ~/{topic}-cultural-tensions/index.html`

## Error Handling

- If Apify MCP is not connected, use Reddit-only collection (Reddit is particularly good for tension detection due to debate culture)
- If few tensions are detected, report that finding — a low-tension environment is valuable intel
- For sensitive topics, add extra warnings about brand positioning risks

## Examples

- `/cultural-tensions` → prompts for topic
- `/cultural-tensions "AI and creativity"` → AI-specific tension analysis
- `/cultural-tensions --category "Sustainability & Environment"` → category-wide scan
- `/cultural-tensions --brand Nike` → tensions relevant to Nike's space
- `/cultural-tensions "cost of living" --platforms reddit,twitter` → specific platforms
