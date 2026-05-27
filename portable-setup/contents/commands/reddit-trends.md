---
description: Collect and analyze trending Reddit content with sentiment scoring and interactive HTML dashboards, using the free Reddit JSON API. Use when detecting authentic cultural sentiment on a topic, monitoring brand mentions on Reddit, or finding emerging trends before they hit mainstream platforms.
---

# Reddit Trends — Free Cultural Signal Collection

Collect and analyze trending content from Reddit using free JSON API (no Apify cost). Reddit is excellent for detecting authentic cultural sentiment, debates, and emerging trends.

## Workflow

1. **Get input** from the user:
   - **Option A:** Specific subreddit(s) (e.g., "r/australia", "r/technology")
   - **Option B:** A topic to search across all of Reddit (e.g., "AI tools", "cost of living")
   - **Option C:** A brand name (will search brand mentions + relevant subreddits)
   - **Optional:** Sort method — hot (default), rising, new, controversial, top

2. **Fetch Reddit data** via curl (free, no API key needed):

   ### For specific subreddits:
   ```
   curl -s -H "User-Agent: CultureWire/2.0" "https://www.reddit.com/r/{subreddit}/hot.json?limit=50"
   ```
   Also fetch rising for early trend detection:
   ```
   curl -s -H "User-Agent: CultureWire/2.0" "https://www.reddit.com/r/{subreddit}/rising.json?limit=25"
   ```

   ### For topic search:
   ```
   curl -s -H "User-Agent: CultureWire/2.0" "https://www.reddit.com/search.json?q={query}&sort=hot&limit=50"
   ```

   ### For brand analysis:
   ```
   curl -s -H "User-Agent: CultureWire/2.0" "https://www.reddit.com/search.json?q={brand_name}&sort=relevance&limit=50"
   ```

   ### Parse JSON response:
   Extract from `data.children[].data`:
   - `title` — post title
   - `selftext` — post body text
   - `score` — upvotes minus downvotes
   - `num_comments` — comment count
   - `upvote_ratio` — percentage upvoted (>0.9 = strong consensus, <0.6 = divisive)
   - `url` — link URL
   - `subreddit` — source subreddit
   - `created_utc` — timestamp
   - `link_flair_text` — post flair/category
   - `is_video` — whether it's a video post

3. **Analyze the collected data:**

   ### Theme Analysis
   - Group posts by common themes/topics
   - Identify recurring keywords and phrases
   - Flag cross-subreddit themes (convergence signal)

   ### Sentiment Assessment
   - **High consensus (upvote_ratio > 0.9):** Strong agreement — safe brand territory
   - **Divisive (upvote_ratio < 0.6):** Cultural tension detected — proceed with caution
   - **High engagement (comments > 100):** Active discussion — culturally relevant
   - **Rising rapidly:** Early trend signal — potential opportunity

   ### Creative Opportunity Scoring
   - Apply the full scoring framework from SKILL.md to each post
   - Reddit posts with high upvote_ratio + high comments = strong cultural relevance
   - Classify into STRIKE ZONE / OPPORTUNITY / MONITOR / SKIP tiers

4. **Generate an interactive HTML dashboard** using the dashboard template in SKILL.md:
   - Save to `~/{topic}-reddit-trends/index.html`
   - Use Tailwind CSS + Chart.js (CDN, single file)
   - Include:
     - Hero header (dark, with Reddit orange accent) showing subreddits, date, post count
     - Stat cards: total posts, avg score, avg comments, avg upvote ratio
     - **Top Trending Content:** Clickable post cards linking to Reddit, showing score, comments, upvote %, tier badge, subreddit badge
     - **Emerging Themes section:** Theme cards with sentiment indicator, opportunity score, brand bridge suggestion
     - **Cultural Tensions section:** Posts with low upvote ratios (<0.6) flagged as divisive, with risk level badges
     - **Subreddit Pulse:** Cards per subreddit showing top theme, avg engagement, mood indicator
     - Bar chart: top posts by score
     - Doughnut chart: sentiment distribution (consensus vs divisive vs mixed)
     - Horizontal bar chart: subreddit engagement comparison
     - Recommended actions section: high-value signals, watch list, avoid list
   - After generating, open in browser: `open ~/{topic}-reddit-trends/index.html`

## Useful Subreddit Suggestions

### Australian Focus
- r/australia — general Australian culture and news
- r/melbourne, r/sydney, r/brisbane, r/perth — city-specific
- r/AusFinance — financial trends
- r/CasualAustralia — casual culture

### By Category
- **Tech:** r/technology, r/gadgets, r/artificial, r/programming
- **Food:** r/food, r/cooking, r/EatCheapAndHealthy
- **Fashion:** r/streetwear, r/malefashionadvice, r/femalefashionadvice
- **Fitness:** r/fitness, r/running, r/bodyweightfitness
- **Gaming:** r/gaming, r/pcgaming, r/Games
- **Sustainability:** r/environment, r/sustainability, r/ZeroWaste
- **Business:** r/business, r/entrepreneur, r/smallbusiness
- **Trends/Memes:** r/trending, r/OutOfTheLoop, r/TikTokCringe

## Error Handling

- If Reddit returns 429 (rate limited), wait 60 seconds and retry once, then inform user
- If a subreddit doesn't exist, inform user and suggest alternatives
- If JSON parsing fails, the endpoint may have changed — inform user

## Examples

- `/reddit-trends` → prompts for subreddit or topic
- `/reddit-trends r/australia` → Australian trending content
- `/reddit-trends "AI tools"` → search all Reddit for AI tools discussion
- `/reddit-trends r/technology r/artificial --sort rising` → rising tech content
- `/reddit-trends --brand Bunnings` → Bunnings mentions + relevant subreddits
