---
name: pr-campaign
description: "Run end-to-end PR and marketing campaigns from brief through send through follow-up through coverage tracking. Use when: (1) Pitching a story or asset to press, (2) Coordinating multi-outlet outreach, (3) Launching a product to journalists, (4) Asked to 'run a PR campaign' or 'pitch this to press', (5) Sequencing a creative-leader or industry outreach beyond a single email. Encodes 2024-2026 best practices from Muck Rack and Cision research, AU adland directory, AI launch postmortems, and Tom's locked canonical descriptions."
user_invocable: true
invocation: /pr-campaign
---

# PR Campaign

Run a real PR or marketing campaign end-to-end: brief intake, journalist research, asset preparation, sequenced sends, response tracking, follow-ups, and coverage logging. The skill enforces discipline around timing, follow-up cadence, and pitch shape that solo founders almost always get wrong by instinct.

## Invocation

- **`/pr-campaign`** — Start a new campaign from a blank brief. Walks Tom through the intake.
- **`/pr-campaign [name]`** — Resume an existing campaign by name. Loads the tracker and reports current state.
- **`/pr-campaign status`** — One-line summary of every active campaign and the next action due on each.
- **`/pr-campaign send [name]`** — Execute the approved send batch for a named campaign (post-approval gate).
- **`/pr-campaign followup [name]`** — Generate the (single) follow-up batch for a named campaign per the PR cadence rules.

## Required reading before executing

Always read these references at the start of a campaign run, in this order:

1. `references/campaign-cadence.md` — the master playbook for timing, exclusive-vs-broadcast, and adaptive signals
2. `references/journalist-research-playbook.md` — the per-journalist pre-pitch research routine
3. `references/au-trade-press-directory.md` — current AU adland editorial roster (verify before sending)
4. `references/ai-launch-best-practices.md` — the Devin-lesson and what works for AI product pitches
5. `templates/pitch-email-template.md` — the structural template for single pitch emails
6. `templates/press-release-template.md` — when and how to write a formal release
7. `templates/follow-up-sequence.md` — the PR-specific follow-up cap (one only) vs warm outreach cadence
8. `templates/campaign-tracker-structure.md` — the Sheets schema the skill maintains

Also pull, before any send:
- `~/.claude/projects/[YOUR-USER]/memory/reference-subjectivity-canonical-description.md` for the locked canonical line
- Tom's vault for relationship context: `~/[your-vault]/` (especially `~/[your-vault]/AIDEN/Strategy/`)
- Recent sent emails for voice match: `mcp__claude_ai_Gmail__search_threads` with `in:sent newer_than:30d`

## The phased workflow

### Phase 1: Brief intake

Ask Tom (in this order, accepting partial answers if he's already provided some):

1. **The asset.** What is being pitched? (Demo, product, transcript, research finding, story, etc.) Where does it live? (URL, file path, both.)
2. **The angle.** In one sentence, what's the story? Not the feature. The story.
3. **The targets.** Specific publications and/or names. If unspecified, recommend based on the asset (see `au-trade-press-directory.md` for AU adland defaults).
4. **The timing.** When does this need to go? Hard deadline or flexible window? Embargo or for-immediate-release?
5. **The goal.** What does success look like? Coverage volume, single tier-1 hit, downstream demo signups, inbound leads, all of the above?
6. **The constraints.** Any outlets to avoid? Any topics to keep off the record? Any embargoes from prior commitments?

Output a CampaignBrief block:

```yaml
campaign_name: [short name, used in tracker file naming]
asset:
  what: [one-line description]
  url: [public URL if any]
  file: [local path if applicable]
canonical_description: |
  [pulled from the locked memory note, verbatim]
angle: [one-sentence story shape]
targets:
  tier_1: [list with names and outlets]
  tier_2: [list with names and outlets]
  community_amplifiers: [list, treated separately per ai-launch-best-practices.md]
timing:
  send_window: [specific dates/times in recipient timezones]
  embargo: [yes/no, terms if yes]
  exclusive_path: [which Tier 1 outlet gets the head start, or "broadcast"]
goal:
  primary: [single most important outcome]
  secondary: [other valuable outcomes]
constraints: [list]
```

Save this block to `~/[your-vault]/AIDEN/Strategy/[campaign_name] - Brief.md` with frontmatter.

### Phase 2: Journalist research

For each named target, run the `journalist-research-playbook.md` routine. Time-budget: ~15 minutes per Tier 1 journalist, ~5 minutes per Tier 2, ~3 minutes per Tier 3.

For each journalist, produce the per-journalist research object (format in the playbook). Save all of these to the campaign tracker (Sheet 1: Targets).

Critical sub-tasks during research:
- Search Tom's Gmail for any prior thread with this journalist (`from:[email] OR to:[email]`)
- Search Tom's vault for any mention or context
- Pull the journalist's last 3 bylines and read them
- Note their recent X / LinkedIn posts for tone and topic signals
- Identify mutual connections
- Decide the per-journalist pitch angle and subject line

### Phase 3: Asset preparation

Determine the assets needed based on the brief:

- **Always:** per-journalist pitch emails (one per Tier 1, batched for Tier 2 with personalised first lines)
- **If multi-outlet:** a formal press release per `press-release-template.md`, saved to `~/[your-vault]/AIDEN/Strategy/[campaign_name] - Press Release.md`
- **If applicable:** supporting attachments (transcripts, screenshots, founder bio, demo link). For Subjectivity-class campaigns, attach the two-column transcript .docx.

For each pitch email:
- Subject line under 70 characters, following the patterns in `pitch-email-template.md`
- Body under 180 words
- Six-part structure: hook, claim (locked canonical line, verbatim), proof, instruction, close, sign-off
- No PDFs on Touch 1
- Send time: scheduled for Tuesday 8-10am recipient timezone unless brief specifies otherwise

Save every drafted pitch email to `~/[your-vault]/AIDEN/Strategy/[campaign_name] - Pitches/` as `[target_name].md`.

### Phase 4: The approval gate

Present the complete send batch to Tom in this format:

```markdown
# Campaign Ready: [Campaign Name]

**Targets:** [count] across [N] outlets
**Send schedule:** [first send] to [last send]
**Exclusive path:** [Tier 1 outlet getting head start, or "Broadcast"]
**Estimated reply rate:** 5-10% based on outlet quality and personalisation
**Estimated coverage:** 1-3 Tier 1 + 2-5 Tier 2 pieces

## Send list

| # | Send time (recipient TZ) | Target | Outlet | Subject | Asset |
|---|---|---|---|---|---|
| 1 | Tue 9am AEST | Tim Burrowes | Unmade | [subject] | Exclusive |
| 2 | Tue 9am AEST | Nathan Jolly | Mumbrella | [subject] | Opinion submission |
| 3 | Thu 9am AEST | Vivienne Kelly | Mumbrella | [subject] | Broadcast |
| ... |

## Asset preview

[For each pitch, show the full email body in a foldable section]

## What I need from you

- [ ] Approve the send batch as-is, OR
- [ ] Mark individual sends to revise, OR
- [ ] Hold the campaign for [specified reason]

Reply with: `approve`, `revise [target name]`, or `hold`.
```

Wait for explicit approval before any send goes out.

### Phase 5: Execution

On approval:

1. Create the Google Sheets tracker per `templates/campaign-tracker-structure.md`. Use `mcp__google-sheets__create_spreadsheet`. Name pattern: `PR Campaign Tracker - [Campaign Name] - [YYYY-MM-DD]`.
2. Populate Sheet 1 (Targets) from the research data.
3. For each scheduled send:
   - Create the draft via `mcp__claude_ai_Gmail__create_draft` OR (if execution is approved for live send) send directly. Default to drafts unless brief specified "send live" and Tom approved.
   - Log the send to Sheet 2 (Sends) with the Gmail thread ID.
4. Confirm to Tom with the list of sent items and the tracker URL.

**Important:** the skill defaults to creating Gmail drafts, not sending. Tom reviews and clicks send unless he has explicitly delegated send authority for this campaign. This is the single non-negotiable safety gate.

### Phase 6: Monitor (recurring)

The skill polls Gmail for replies on a recurring basis. Two modes:

**On-demand:** Tom runs `/pr-campaign status` and the skill polls all active campaigns immediately and reports the new state.

**Scheduled:** Tom uses `/schedule` to register a cron job that runs `/pr-campaign status` daily at 9am AEST. The skill posts a daily digest to wherever Tom directs (Slack, email summary, terminal).

For every new reply detected:
- Classify: Interested / Wants more info / Passing / Negative / Out of office
- Update Sheet 3 (Replies) and Sheet 2 (Sends status)
- For "Interested" or "Wants more info", flag as action-required for Tom to respond same-day
- For "Passing" or "Negative", close the thread, no further follow-up

### Phase 7: Follow-ups (PR cadence is strict)

On day 3-5 after the initial send, generate the single follow-up batch for unreplied journalists.

**Hard rules:**
- One follow-up only for journalists. Two damages the relationship.
- The follow-up MUST add new information (new endorsement, new proof point, new data, new coverage)
- Different copy per journalist (see `templates/follow-up-sequence.md` for patterns)
- After the single follow-up, walk away. Wait 60+ days for a new angle.

For warm outreach (non-journalist contacts), the standard 4-touch cadence applies. The skill MUST distinguish between PR targets and warm outreach when generating follow-up batches.

Present the follow-up batch as a second approval gate. Same format as Phase 4. Wait for explicit approval.

### Phase 8: Coverage tracking

When coverage is published (detected via Google Alerts, journalist's own posts, or Tom manually flagging):

1. Log to Sheet 4 (Coverage): outlet, headline, URL, date, sentiment, quotes used
2. Check if the published piece links to the demo (critical for downstream traffic attribution)
3. Trigger the broadcast wave if this was the Tier 1 exclusive (per `campaign-cadence.md`)
4. Notify Tom with the publication and any social-amplification recommendations

### Phase 9: Campaign retrospective

After the campaign window closes (default 6 weeks from launch):

1. Calculate metrics: open rate, reply rate, coverage volume, tier-weighted coverage, downstream demo signups, downstream inbound leads
2. Compare to baselines (46% open, 3.43% reply, 5%+ for well-targeted)
3. Identify the top 1-2 tactics that converted above baseline
4. Identify failures and root causes
5. Update `references/au-trade-press-directory.md` with any new contact info or relationship notes
6. Write the retrospective to `~/[your-vault]/AIDEN/Strategy/[Campaign Name] - Retrospective.md` with frontmatter and link back to the brief

## Tool usage

The skill orchestrates these MCP tools:

| Tool | Purpose |
|---|---|
| `WebSearch` | Journalist research, byline pulls, outlet verification |
| `WebFetch` | Read journalist bylines and recent coverage |
| `mcp__claude_ai_Gmail__search_threads` | Prior correspondence check, reply polling |
| `mcp__claude_ai_Gmail__get_thread` | Read individual threads and replies |
| `mcp__claude_ai_Gmail__create_draft` | Default send mode (Tom approves the draft, clicks send) |
| `mcp__google-sheets__create_spreadsheet` | Tracker setup |
| `mcp__google-sheets__add_rows` | Sends and replies logging |
| `mcp__google-sheets__update_cells` | Status updates |
| `Read` / `Write` / `Edit` | Vault and skill files |
| `Bash` | Run helper scripts (e.g. press release docx build) |

## Output formats

### CampaignBrief (saved to vault as YAML frontmatter)

See Phase 1 template above.

### Send batch (presented for approval)

See Phase 4 template above.

### Status report (presented on `/pr-campaign status` or daily digest)

```markdown
# PR Campaign Status — [DATE]

## Active campaigns: [count]

### [Campaign 1 name]
- Day [N] of [campaign window]
- Sends made: [N] | Opens (tracked): [N] | Replies: [N] | Coverage: [N]
- **Action required:** [list of journalists who replied and need a same-day response]
- **Next step:** [scheduled or manual]

### [Campaign 2 name]
[same shape]

## Coverage in the last 24hrs

- [URL] — [Outlet] — [headline] — [sentiment]
```

### Retrospective (saved to vault)

See Phase 9 description.

## Anti-patterns

- **No bcc blast.** Every pitch is sent individually with personalised first lines. Mass-bcc destroys relationships permanently.
- **No follow-up barrage.** For journalists, the cap is ONE follow-up. Going past this is the most common reason solo founders get blocklisted.
- **No PDF on Touch 1.** Heavy attachments tank open rates and trigger spam filters. .docx attachments OK, PDFs never.
- **No sender-timezone scheduling.** Always send in recipient timezone. Melbourne afternoon = London 5am = wasted send.
- **No "I hope this finds you well" or any variant.** Journalists scan the first 50 characters. Waste them on a greeting and the pitch is dead.
- **No capability pitches.** "We built X" is invisible. Pitch the story, the moment, the surprise.
- **No staged-only demos.** Always pitch a demo that can be run live by the journalist in their own browser in under 60 seconds. The Devin lesson.
- **No silent execution.** Every send is logged. Every reply is classified. Every coverage piece is captured. The tracker is the source of truth.
- **No paraphrasing the canonical line.** When describing the asset, use the locked canonical description verbatim from `reference-subjectivity-canonical-description.md`. Paraphrasing causes drift that compounds across the campaign.

## Tom's voice constraints

- No em-dashes. Use periods, commas, or rewrite the sentence.
- No orphan words. Use non-breaking spaces to keep last 2-3 words together.
- No consultant voice. Direct, specific, scars on display.
- No "perhaps", "it might be worth considering", "I'd love to chat". Direct language only.
- Specifics over generalities. "396 phantom memories" not "lots of context".
- Show beats tell. Demo link in every send. Transcript in every press pitch.
