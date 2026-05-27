# Campaign Cadence: The PR-Specific Playbook

The end-to-end timing for a real PR campaign, drawn from Muck Rack 2025 (n=1,600+ journalists), Cision 2025 (n=3,000+ journalists), and recent AI launch postmortems (Devin, Anthropic, Cursor).

This is the cadence the skill executes. Override only with explicit reason.

## The benchmark numbers to design against

- **Average open rate:** 46% (Muck Rack 2025)
- **Average reply rate:** 3.43%
- **Target reply rate for a well-targeted campaign:** 5%+
- **Word count preference:** 65% of journalists want pitches under 200 words. 28% want 100-200. Only 2% want 400+.
- **Follow-up tolerance:** 62% want exactly one follow-up. Two is the ceiling. Three damages future pitches.
- **Best send window:** Tuesday, 5am-noon recipient timezone

## The 6-week campaign template

This is the optimal cadence for a single asset (e.g. a demo, a product launch, a research finding) being pitched to ~10-20 outlets. Compress for time-sensitive news, extend for evergreen launches.

### Week -2 to -1: Warming

**Goal:** Get on the radar of Tier 1 journalists 30-60 days before the actual pitch.

- For the top 5 priority journalists, send a **no-pitch intro email** (see `templates/follow-up-sequence.md` for the script).
- Subscribe to their newsletters, follow them on X/LinkedIn, engage meaningfully with one post.
- Do NOT send the actual pitch yet.

**Why this matters:** 85% of journalists explicitly welcome a no-pitch intro. The actual pitch lands much warmer when the name is already in their inbox.

### Week 0: The exclusive

**Goal:** Place one Tier 1 outlet with an exclusive 24-48hr head start.

- Pick the single most aligned Tier 1 journalist (for AU: usually Tim Burrowes at Unmade or Nathan Jolly at Mumbrella for an opinion piece).
- Send the pitch on a Tuesday, 8-10am their local time.
- Frame as exclusive: *"I'm giving you a 48hr head start before this goes wider."*
- Include: canonical 2-sentence description, the proof, the live demo link, the transcript .docx attachment.

**The exclusive ask buys editorial commitment.** Outlets that pay attention to exclusives respond faster.

### Week 0 + 48 hours: The broadcast

**Goal:** Same-day broadcast to all other Tier 2 outlets with a coverage hook.

If the Tier 1 outlet published:
- Subject line: *"[Outlet] just covered this. Here's why it's actually bigger."*
- Body: link to the published piece, then the same canonical description and proof, then the angle their specific outlet would care about.

If the Tier 1 outlet did NOT publish within 48hrs:
- Send the broadcast anyway. Do not wait indefinitely.
- Subject line: standard pattern, no reference to the missed exclusive.

### Week 1: Follow-ups

**Goal:** One follow-up to anyone who hasn't replied. Stop there.

- Day 3-5 after the initial pitch: send the single follow-up (must contain new info).
- After that: no further emails. If they're going to cover, they will. If not, walk away.

### Week 2: Channel switching and amplification

**Goal:** Where email failed, try LinkedIn DM. Where coverage landed, amplify.

- For journalists who opened but didn't reply: send a LinkedIn DM with the short version.
- For journalists who didn't open: do not re-email. Pause until you have a new angle.
- For published coverage: post on LinkedIn / X / Bluesky with the article link and a thanks. Tag the journalist appropriately (X yes, LinkedIn yes, do not tag in negative coverage).

### Week 3-4: Second wave (if applicable)

**Goal:** Use the published coverage as proof for a second wave of pitches.

- Build a new pitch with the coverage embedded: *"As covered in [Outlet], here's the deeper story."*
- Target the outlets that passed in Week 0 with this new social proof.
- One round only. Do not flog dead horses.

### Week 5-6: Retrospective

**Goal:** Lock in what worked.

- Read the campaign tracker.
- Calculate: open rate, reply rate, coverage volume, tier-weighted coverage, downstream demo signups, downstream inbound leads.
- Update the journalist directory with new contact info, new relationship notes.
- Identify the top 1-2 tactics that converted above baseline.
- Write the campaign retrospective to vault: `~/[your-vault]/AIDEN/Strategy/[Campaign Name] - Retrospective.md`

## Exclusive vs broadcast: when to use which

| Pattern | When |
|---|---|
| **Pure exclusive** | High-stakes news (funding, partnership, acquisition). One outlet gets it, no other outlets pitched. |
| **Exclusive-then-broadcast** | Mid-stakes news with broader interest (product launch, research finding, demo). One Tier 1 gets 24-48hr head start, then everyone gets it same-day. Default for most Subjectivity-class campaigns. |
| **Pure broadcast** | Low-stakes / evergreen / community amplification. All outlets pitched same day, no exclusivity. Used when the news won't decay if multiple outlets cover it together. |
| **Embargo** | Multi-outlet coordinated drop with simultaneous publication. Only works when you have enough volume to fill 10+ outlets. Honoured less in 2025-2026 than they used to be. |

## Speed signals to watch in real time

During execution, the skill monitors these signals and adapts:

| Signal | Meaning | Action |
|---|---|---|
| Open rate <30% after 24hrs | Subject line not landing | Rewrite subject for the second wave |
| Open rate 30-50% | Healthy baseline | Continue as planned |
| Open rate >60% | Subject is hot | Save the subject pattern to the playbook |
| Reply rate <2% | Pitch body or targeting wrong | Re-examine the angle, not just the subject |
| Reply rate 5-10% | Strong campaign | Stay the course |
| Reply rate >10% | Exceptional. Document why. | Capture every insight for the retrospective |
| Tier 1 silence after 48hrs | Exclusive isn't working | Pull the embargo, broadcast |
| One Tier 1 publishes | Activate the broadcast play | Send the "[Outlet] just covered this" wave |

## Anti-patterns

- **The mass blast.** Sending the same email body to 50 journalists in one bcc. Catastrophic for relationships. The skill never bcc-sends pitches.
- **The follow-up barrage.** Sending 3, 4, 5 follow-ups. Damages the relationship for every future pitch.
- **The wrong-timezone send.** Sending at sender-local time so a Melbourne 2pm hits a London journalist at 5am.
- **The PDF attachment cold.** Heavy attachments on first emails tank open rates and trigger spam filters. Asset .docx is OK, PDFs are not, and never on Touch 1.
- **The "Hi [first name]" template.** Journalists see template formatting in their sleep. The first 50 characters must be personalised.
- **The capability pitch.** "We built X." Wrong. The right pitch is the story: "Here's the moment that surprised us."
