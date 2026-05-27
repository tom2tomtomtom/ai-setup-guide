---
name: culture-scan
description: Run a full cultural intelligence pipeline for any brand, collecting trending content across TikTok, Instagram, X, and Reddit, then scoring for creative opportunity and cultural tensions. Use when starting campaign planning and need to know what's happening in culture, when identifying real-time content opportunities for a brand, or when building a data-backed cultural strategy.
---

# Culture Scan — Full Cultural Intelligence Pipeline

Flagship command that runs the complete culture-wire analysis pipeline: three-layer collection, creative opportunity scoring, cultural tension analysis, and strategic recommendations.

## Workflow

1. **Get brand input** from the user:
   - **Required:** Brand name (e.g., "Bunnings", "Nike", "Boost Juice")
   - **Optional:** Path to a brand strategy YAML file for enhanced scoring
   - **Optional:** Specific category override (otherwise auto-detect from SKILL.md 25-category taxonomy)
   - **Optional:** Target market (default: Australia)

2. **Generate brand context:**
   - Auto-detect category from the 25-category taxonomy in SKILL.md
   - Generate brand values, pillars, tone, and target audience from the category
   - Build three-layer search queries:
     - **Layer 1 (Direct):** Brand name variants and owned hashtags
     - **Layer 2 (Category):** 10-15 lifestyle/category keywords relevant to the brand
     - **Layer 3 (Trending):** General viral/trending terms (fyp, viral, trending)
   - If a brand strategy YAML was provided, load its scoring_rules, brand_positioning, and reference_examples

3. **Three-layer collection** across platforms via Apify MCP + Reddit curl:

   ### TikTok (via `clockworks/tiktok-scraper` or `streamers/tiktok-scraper`)
   - Layer 1: Search for brand name, 20 results
   - Layer 2: Search top 3-5 category keywords, 10 results each
   - Layer 3: Search trending/fyp content, 20 results

   ### Instagram (via `apify/instagram-scraper`)
   - Layer 1: Search brand hashtag, 20 results
   - Layer 2: Search top 3-5 category hashtags, 10 results each
   - Layer 3: Explore/trending content, 20 results

   ### Twitter/X (via `apidojo/tweet-scraper`)
   - Layer 1: Search brand name mentions, 20 results
   - Layer 2: Search category keywords, 10 results each
   - Layer 3: Trending topics, 20 results

   ### Reddit (via curl — free, no API cost)
   - Identify 2-3 relevant subreddits based on brand category
   - Fetch hot posts: `curl -s -H "User-Agent: CultureWire/2.0" "https://www.reddit.com/r/{sub}/hot.json?limit=50"`
   - For Australian brands, always include r/australia

4. **Score ALL collected content** using the Creative Opportunity Scoring framework from SKILL.md:
   - Calculate all 6 dimensions for each piece of content
   - Apply Australian geo-boost (1.35x) where applicable
   - Classify into tiers: STRIKE ZONE / OPPORTUNITY / MONITOR / SKIP

5. **Run Cultural Tension Analysis** on all content:
   - Detect tension keywords across 8 categories
   - Identify opposing viewpoints
   - Cluster into battlegrounds
   - Calculate severity scores

6. **Detect cross-platform convergence:**
   - Flag topics/themes appearing on 2+ platforms
   - These get priority in the report

7. **Generate an interactive HTML dashboard** using the dashboard template in SKILL.md:
   - Save to `~/{brand}-culture-scan/index.html`
   - Use Tailwind CSS + Chart.js (CDN, single file)
   - Include all dashboard components from SKILL.md:
     - Hero header with brand name, category, date, platform badges
     - Stat cards row (STRIKE ZONE count, OPPORTUNITY count, MONITOR count, BATTLEGROUNDS count)
     - Tab navigation: Opportunities | Battlegrounds | Convergence | Actions
     - **Opportunities tab:** Tier-colored opportunity cards with scores, platform badges, engagement stats, brand bridges, campaign concepts, and clickable links to original posts
     - **Battlegrounds tab:** Battleground cards with severity scores, platform badges, DO/DON'T guidance
     - **Convergence tab:** Cross-platform convergence highlights
     - **Actions tab:** Immediate / Short-term / Watch list recommendations
     - Radar chart showing top opportunity's score breakdown (6 dimensions)
     - Doughnut chart showing tier distribution
     - Bar chart showing platform distribution
     - Risk zones section at the bottom
   - After generating, open in browser: `open ~/{brand}-culture-scan/index.html`

## Error Handling

- If Apify MCP is not connected, inform the user and offer Reddit-only analysis (still valuable)
- If a specific platform scraper fails, continue with the others — report which platforms were collected
- If no brand strategy YAML is provided, use auto-generated brand context (still produces good results)
- If Reddit curl fails, skip Reddit and note it in the report

## Examples

- `/culture-scan` → prompts for brand name
- `/culture-scan Bunnings` → full pipeline for Bunnings
- `/culture-scan Nike --strategy ~/brand-strategies/nike_summer_2026.yaml` → enhanced scoring with strategy file
- `/culture-scan "Boost Juice" --category "Food & Beverage"` → explicit category override
