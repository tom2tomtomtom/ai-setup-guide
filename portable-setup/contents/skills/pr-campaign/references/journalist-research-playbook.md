# Journalist Research Playbook

Before pitching any journalist, run this research routine. The difference between "this looks like every other pitch I got today" and "this person did their homework" is usually 15 minutes of pre-work.

## The qualifying signals (rank high before pitching)

A journalist is a strong target if **three or more** of these are true:

1. **They've written about an adjacent topic in the last 90 days.** Adjacent = same beat, not the same story. AI is too broad. "AI in advertising agencies" is adjacent. "AI safety research" is not.
2. **Their last byline references one of: a verifiable claim, a demo, a builder voice, a counterintuitive finding.** These journalists are receptive to story shapes you can offer.
3. **They've engaged with similar pitches publicly** (e.g. quote-tweeting a demo, replying to a builder, sharing a Show HN). This signals openness to cold outreach in this specific shape.
4. **They have a public newsletter, podcast, or column slot they own.** Owned platforms convert better than newsroom-assigned beats because the journalist controls the schedule.
5. **They are at a publication their target audience reads regularly.** Don't pitch a B2B AI architecture story to a consumer tech reporter even if they cover AI.

If fewer than three signals are true: deprioritise. Don't waste a pitch.

## The research routine (15 minutes per journalist)

### Step 1: Read their last 3 pieces (5 min)

Pull their author archive at their publication. Read the last three pieces in full. Note:
- What kind of story did they choose? (Trend piece, profile, news analysis, demo review)
- What kind of source did they quote? (Founders, researchers, investors, customers)
- What was the implicit framing? (Skeptical, enthusiastic, contrarian)
- Did they include a verifiable element (link to a demo, a number, a screenshot)?

### Step 2: Check their X / LinkedIn for the last week (3 min)

What are they signaling they're interested in right now? A journalist tweeting frustration about generic AI pitches will respond well to a pitch that explicitly bucks that pattern. A journalist who just got back from a holiday will be slow.

### Step 3: Search for their email and contact preferences (2 min)

Find their byline email, newsroom email, or muckrack profile. Many journalists list pitching preferences on their bio page or X profile ("DMs open for tips", "Email me at X, no PR pitches please", "I don't cover funding announcements").

If they say "no PR pitches" and you're sending a PR pitch, do not send the pitch.

### Step 4: Map their mutual context with Tom (3 min)

Search:
- Tom's Gmail for any prior correspondence (use `mcp__claude_ai_Gmail__search_threads` with `from:[journalist email] OR to:[journalist email]`)
- Tom's LinkedIn first-degree connections for shared connections
- Tom's vault (`~/[your-vault]/`) for any past mention
- Their public posts for any mention of someone Tom knows

Even one shared connection or one prior exchange converts the email from cold to warm.

### Step 5: Decide the pitch angle (2 min)

Based on the research, pick the single angle most likely to land with this specific journalist. Different journalists at the same publication will respond to different angles for the same story.

Output to the campaign brief:
- Recommended pitch angle (one sentence)
- Subject line crafted for them (under 70 chars)
- Hook line (sentence one of the email)
- Whether to add LinkedIn DM as a Touch 3 fallback

## Tools to use

### Free
- The publication's website (author archive)
- X / Twitter search (`from:@username` for their posts)
- LinkedIn (mutual connections, recent posts)
- Muck Rack public profiles (free tier shows bio + last 5 articles)
- Google with `site:publication.com author:"[name]"`
- Substack and personal newsletters (subscribe before pitching, references "I read your last issue" land hard)

### Paid (only if doing high volume)
- Muck Rack Pro (~$5k/yr) for journalist database
- Roxhill (~$3k/yr) for UK/AU/EU media
- Prowly (~$3k/yr) for journalist contact + sentiment
- Cision (~$10k+/yr) for enterprise

For a solo founder doing <50 pitches/quarter, free tools are sufficient. Spend the saved budget on writing better pitches.

## Red flags (do not pitch)

- Their last 5 pieces have been negative profiles or hit pieces in your category
- They have publicly criticised pitches structured the way yours is structured
- They are an investor or advisor at a direct competitor
- They have not published in the relevant outlet in 6+ months
- Their X bio includes any of: "PR pitches will be ignored", "no PR", "I do not accept cold pitches"

## Green flags (escalate priority)

- They've publicly asked for the kind of story you have ("Has anyone built X?" → you built X)
- They cover a beat that nobody else covers ("the only person writing about AI in agencies in the UK")
- They are a first-degree LinkedIn connection of Tom's
- They have responded to a previous Tom email
- They are at an outlet that has published a competitor of yours (signals editorial interest in the category)

## Output to feed the next phase

For each journalist, the research produces this object that gets written to the campaign tracker (Sheet 1: Targets):

```yaml
name: Tim Burrowes
outlet: Unmade
title: Founder
email: tim@unmade.media
linkedin: linkedin.com/in/timburrowes
x: @timburrowes
tier: T1
beat: Australian media business commentary
relationship: 2nd degree (mutual: [TBD])
last_touchpoint: never
notes: |
  - Owns Unmade newsletter, weekly paid sub
  - Posts on AI in agencies regularly, frames as evolution not automation
  - Highly engaged with founder-led builders, less with corporate comms
recommended_angle: "Demo lets you verify the architecture claim yourself"
recommended_subject: "A demo about taste, sent to the audience most likely to argue with it"
```
