---
name: social-trends
description: Scrape TikTok trending content via ScrapeCreators API and generate interactive HTML dashboards with clickable posts, engagement stats, and culture-jacking insights. Use when researching TikTok trends for a topic, finding viral content in a niche, or generating a visual trends dashboard for a client presentation.
---

# Social Media Trends Dashboard Generator

Scrapes TikTok for trending content on any topic and generates a comprehensive HTML dashboard with clickable posts, engagement stats, trend analysis, and culture-jacking opportunities for brands.

## When to Use This Skill

Use when:
- Researching social media trends for a topic/industry
- Finding viral content in a specific niche
- Generating a trends dashboard for a client
- Analyzing TikTok hashtags and engagement
- Finding culture-jacking opportunities for brands
- Competitive analysis on social media
- Content strategy research

## Step 1: Collect Required Information

### API Key (Auto-loaded from ~/.env)

First, check for the API key in the user's environment:

```bash
# Check ~/.env for SCRAPECREATORS_API_KEY
grep SCRAPECREATORS_API_KEY ~/.env 2>/dev/null | cut -d'=' -f2
```

- If found: Use automatically, no need to ask
- If not found: Ask user for key and offer to save it:
  ```bash
  echo "SCRAPECREATORS_API_KEY=their_key_here" >> ~/.env
  ```

**Ask the user for:**

1. **Topic/Industry** (required)
   - The main subject to research
   - Examples: "sunscreen", "coffee", "fitness", "skincare", "travel"

3. **Region** (default: AU)
   - Target market for the analysis
   - Options: AU (Australia), US (United States), GB (UK), NZ (New Zealand), CA (Canada)

4. **Adjacent Topics** (optional)
   - Related hashtags to also search
   - Example: For "sunscreen" → "tanning", "skincare", "beach", "heatwave", "spf"

5. **Output Location** (default: ~/[topic]-trends-dashboard/)

## Step 2: Generate Hashtag List

Based on the topic, create 8-12 hashtags to search:

```
Primary: #[topic]
Product: Related products/brands
Lifestyle: Associated activities
Regional: Location-specific tags
Problem/Solution: Pain points and fixes
```

**Example for "sunscreen":**
- Primary: #sunscreen, #spf
- Product: #ultraviolette, #sunscreenreview
- Lifestyle: #beachday, #summer, #tanning
- Regional: #australiansummer, #aussiebeach
- Problem: #skincancer, #sundamage

## Step 3: Scrape TikTok Data

First, load the API key from ~/.env:

```bash
API_KEY=$(grep SCRAPECREATORS_API_KEY ~/.env 2>/dev/null | cut -d'=' -f2)
```

For each hashtag, execute:

```bash
curl -s "https://api.scrapecreators.com/v1/tiktok/search/hashtag?hashtag=HASHTAG&region=REGION&trim=true" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json"
```

**Parse response to extract (use this exact command to get working links):**

```bash
# CRITICAL: Always extract real data from API - never use placeholder IDs
API_KEY=$(grep SCRAPECREATORS_API_KEY ~/.env 2>/dev/null | cut -d'=' -f2) && \
curl -s "https://api.scrapecreators.com/v1/tiktok/search/hashtag?hashtag=HASHTAG&region=REGION&trim=true" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" | \
python3 -c "import sys,json; d=json.load(sys.stdin); [print(f\"{p['aweme_id']}|{p['author']['unique_id']}|{p['region']}|{p['statistics']['play_count']}|{p['statistics']['digg_count']}|{p['statistics']['share_count']}|{p['desc'][:80]}\") for p in d.get('aweme_list',[])]"
```

**Output format:** `aweme_id|username|region|views|likes|shares|description`

**Example output:**
```
7389963380674612513|dailymailuk|GB|74668939|514212|9870|Just Stop Oil say they're celebrating...
7154330427887570181|guardian|GB|9587152|361175|9955|"What is worth more: art or life?"...
```

**CRITICAL: Working TikTok URL Format:**
```
https://www.tiktok.com/@{username}/video/{aweme_id}
```

Example: `https://www.tiktok.com/@dailymailuk/video/7389963380674612513`

**Never generate placeholder video IDs - always use the real aweme_id from the API response.**

## Step 4: Analyze Trends

Identify and document:
- **Top performers**: Highest views/engagement
- **Content themes**: Common formats and hooks
- **Regional breakdown**: % from target region vs global
- **Viral patterns**: What's working and why
- **Brand activity**: Competitor mentions
- **Culture-jack opportunities**: Moments to capitalize on

## Step 5: Generate Dashboard Images

Create visuals using image generation:

```
1. Header image (16:9) - Topic theme with icons
2. Topic illustration (1:1) - Main subject visual
3. Trend-specific images (1:1) - Key trend visuals
4. Data visualization style graphics
```

## Step 6: Build HTML Dashboard

Structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Topic] Trends Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-50">
    <!-- Hero Header with Image -->
    <!-- Key Stats Cards (4 columns) -->
    <!-- Trending Posts by Category (clickable cards) -->
    <!-- Trend Analysis Sections -->
    <!-- Culture Jack Opportunities -->
    <!-- Engagement Chart (verified data) -->
    <!-- Hashtag Performance Table -->
    <!-- Footer with data source -->
</body>
</html>
```

## Post Card Component

Each post must be clickable and show:

```html
<a href="https://www.tiktok.com/@username/video/ID" target="_blank"
   class="post-card bg-white rounded-xl p-4 shadow block hover:shadow-lg transition">
    <div class="flex items-center gap-2 mb-2">
        <span class="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">🇦🇺 AU</span>
        <span class="text-xs text-gray-500">@username</span>
    </div>
    <p class="text-sm text-gray-700 mb-3">"Post description truncated..."</p>
    <div class="flex justify-between text-xs text-gray-500">
        <span>👁️ 1.2M</span>
        <span>❤️ 45K</span>
        <span>📤 2.3K</span>
    </div>
    <div class="mt-2 text-xs font-bold bg-gradient-to-r from-pink-500 to-cyan-500
                bg-clip-text text-transparent">Open in TikTok →</div>
</a>
```

## Region Flag Mapping

```javascript
const flags = {
    'AU': '🇦🇺', 'US': '🇺🇸', 'GB': '🇬🇧', 'NZ': '🇳🇿',
    'CA': '🇨🇦', 'DE': '🇩🇪', 'FR': '🇫🇷', 'JP': '🇯🇵',
    'KR': '🇰🇷', 'BR': '🇧🇷', 'MX': '🇲🇽', 'IN': '🇮🇳'
};
```

## Step 7: Verify Data Accuracy

Before finalizing, always:
1. Cross-check displayed numbers against raw API responses
2. Test all TikTok links open correctly
3. Verify image paths are relative
4. Confirm dashboard renders in browser

**Update chart labels to "Top Video" not "Average" unless calculating actual averages.**

## Step 8: Output and Deploy

1. Save as `index.html` (for easy hosting)
2. Copy images to same directory
3. Optionally:
   - Initialize git repo
   - Push to GitHub
   - Deploy to Netlify/Vercel

```bash
# Example deployment
mkdir ~/[topic]-trends-dashboard
cp index.html *.png ~/[topic]-trends-dashboard/
cd ~/[topic]-trends-dashboard
git init
git add -A
git commit -m "Add [topic] trends dashboard"
git remote add origin https://github.com/user/repo.git
git push -u origin main
```

## API Reference

**Endpoint:** `https://api.scrapecreators.com/v1/tiktok/search/hashtag`

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| hashtag | string | Yes | Hashtag without # |
| region | string | No | Proxy region (AU, US, etc.) |
| trim | boolean | No | Trim response size |
| cursor | number | No | Pagination cursor |

**Response Structure:**
```json
{
  "success": true,
  "credits_remaining": 25000,
  "aweme_list": [
    {
      "aweme_id": "7514829069632982288",
      "desc": "Video description #hashtag",
      "region": "AU",
      "author": {
        "unique_id": "username",
        "nickname": "Display Name"
      },
      "statistics": {
        "play_count": 733338,
        "digg_count": 27217,
        "share_count": 4361,
        "comment_count": 648
      }
    }
  ]
}
```

## Example Execution

**User:** "Create a trends dashboard for coffee culture in the US"

**Steps:**
1. Ask for ScrapeCreators API key
2. Hashtags: #coffee, #coffeelover, #coffeetiktok, #barista, #latte, #espresso, #coffeeshop, #morningcoffee
3. Scrape with region=US
4. Generate coffee-themed header and images
5. Build dashboard with:
   - Top coffee content creators
   - Viral coffee recipes/hacks
   - Coffee shop aesthetics
   - Barista content
6. Identify culture-jack opportunities for coffee brands
7. Output to ~/coffee-trends-dashboard/

## Tips

- **Parallel requests**: Run multiple curl commands simultaneously for speed
- **Credit efficiency**: ~1 credit per hashtag search
- **Data freshness**: Results are real-time trending content
- **Number formatting**: Use K/M suffixes (733K, 1.2M)
- **Always verify**: Cross-check stats before presenting
- **Mobile-friendly**: Dashboard uses Tailwind responsive classes

## CRITICAL: Working Links

**NEVER generate placeholder or fake video IDs.** All TikTok links MUST use real `aweme_id` values from the API response.

**Wrong:** `https://www.tiktok.com/@someuser/video/1234567890123456789` (made up ID)
**Right:** `https://www.tiktok.com/@dailymailuk/video/7389963380674612513` (real API data)

**Always run the data extraction command to get real video IDs and usernames before building the dashboard.**

If links don't work, re-scrape the hashtags and extract the real aweme_id and author.unique_id values from the API response.
