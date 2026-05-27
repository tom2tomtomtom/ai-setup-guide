# Campaign Tracker Sheet Structure

The Google Sheets schema that the `pr-campaign` skill creates and maintains for every campaign. Built once per campaign, updated by the skill at every check-in.

## Spreadsheet name pattern

`PR Campaign Tracker - [Campaign Name] - [YYYY-MM-DD]`

Example: `PR Campaign Tracker - Subjectivity Trade Press - 2026-05-21`

## Sheet 1: Targets

The master list of people the campaign is going to. One row per target.

| Column | Type | Description |
|---|---|---|
| ID | text | Short unique ID, e.g. `T01`, `T02` |
| Name | text | Full name |
| Outlet / Org | text | Publication or company name |
| Title | text | Job title |
| Email | text | Primary email address |
| LinkedIn URL | text | Profile URL |
| X / Twitter | text | Handle, format `@username` |
| Tier | dropdown | T1 / T2 / T3 |
| Beat / Focus | text | What they cover |
| Relationship | dropdown | Cold / Warm / 1st degree / Past contact |
| Last touchpoint | date | Last time Tom interacted with them |
| Notes | text | Anything relevant: recent piece, mutual contacts, no-go topics |

## Sheet 2: Sends

One row per outbound message sent across the campaign.

| Column | Type | Description |
|---|---|---|
| Send ID | text | `S0001`, `S0002`, etc |
| Target ID | text | FK to Targets sheet |
| Target Name | text | Denormalised for readability |
| Touch # | number | 1 = initial, 2 = bump, 3 = channel switch, 4 = graceful exit |
| Channel | dropdown | Email / LinkedIn / X / Other |
| Date sent | datetime | When the send went out |
| Subject line | text | Email subject (or DM opener) |
| Gmail thread ID | text | For polling replies |
| Asset version | text | Which template / canonical line version was used |
| Status | dropdown | Sent / Replied / Bounced / Dead |

## Sheet 3: Replies

Captured automatically as Gmail polling detects responses to campaign threads.

| Column | Type | Description |
|---|---|---|
| Reply ID | text | `R0001`, etc |
| Send ID | text | FK to Sends |
| Target Name | text | Denormalised |
| Date received | datetime | |
| Reply classification | dropdown | Interested / Wants more info / Passing / Negative / Out of office |
| Sentiment | dropdown | Positive / Neutral / Negative |
| Action required | dropdown | Reply now / Reply later / No action / Convert to call |
| Next step | text | What Tom or the skill should do next |
| Conversion status | dropdown | Open / Coverage published / Demo signup / Closed lost |

## Sheet 4: Coverage

One row per piece of coverage that gets published off the back of the campaign.

| Column | Type | Description |
|---|---|---|
| Coverage ID | text | `C0001`, etc |
| Target ID | text | FK to Targets |
| Outlet | text | |
| Headline | text | |
| URL | text | |
| Date published | date | |
| Type | dropdown | News piece / Op-ed / Mention / Newsletter / Podcast / Other |
| Sentiment | dropdown | Positive / Neutral / Negative |
| Reach estimate | number | Optional, only if available |
| Quote used | text | Did they use a Tom quote, and which one |
| Demo link included | boolean | Critical for tracking traffic |
| Notes | text | Anything notable about how the story landed |

## Sheet 5: Dashboard

A single summary sheet built with formulas that pulls from the four above.

Sections:
- **Campaign at a glance**: name, start date, days running, total targets, sends made, replies received, coverage published
- **Funnel**: targets → opens → replies → meetings → coverage
- **Tier breakdown**: how each tier is performing
- **Outstanding follow-ups**: targets where it's been 3+ days since the last touch with no reply
- **Coverage list**: live links to all published pieces

## How the skill uses this

1. **Setup phase**: Skill creates the spreadsheet, populates Sheet 1 (Targets) from the campaign brief.
2. **Send phase**: Skill writes to Sheet 2 (Sends) for every email or DM sent.
3. **Monitor phase** (recurring): Skill polls Gmail for replies, writes to Sheet 3 (Replies), updates Status on Sheet 2.
4. **Coverage phase** (recurring): Skill polls Google Alerts / search / direct journalist outputs, prompts Tom to confirm new coverage, writes to Sheet 4.
5. **Report phase** (weekly): Skill reads Sheet 5 and reports the campaign state in Slack or email.

## Permissions

The skill creates the sheet in Tom's Drive (`tomandkimsrsvp@gmail.com`). Tom can share manually with collaborators. The skill should never auto-share without explicit instruction.
