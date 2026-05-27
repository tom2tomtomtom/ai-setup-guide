---
name: client-delivery-workflow
description: Manages the 4-month AI transformation consulting cycle from audit through handover with phase checklists, deliverable templates, and retainer conversion playbook. Use when onboarding a new client, planning delivery phases, writing proposals, or transitioning to retainer.
---

# Client Delivery Workflow

Redbaez 4-month AI transformation consulting cycle for creative agency clients. This skill generates deliverables, tracks phases, and manages the audit-to-retainer pipeline.

**Clients:** Mother London, Uncommon, Alt-Shift, Monigle (and new agencies onboarded to this model).

**Cycle:** 4 months from kickoff to handover. Each phase is ~4 weeks.

---

## Phase 1: Audit & Discovery (Month 1)

### AI Readiness Audit Checklist

Run this checklist during the first two weeks. Every item produces a finding for the audit report.

```markdown
## AI Readiness Audit — [CLIENT NAME]
Date: [DATE]
Lead: Tom Hyde, Redbaez

### 1. Current Tool Landscape
- [ ] List all software tools currently in use (Creative Suite, PM tools, DAMs, etc.)
- [ ] Identify any existing AI tool usage (ChatGPT, Midjourney, Runway, etc.)
- [ ] Document license costs and renewal dates for current tools
- [ ] Map which teams use which tools (creative, strategy, production, account management)
- [ ] Note any shadow IT / unofficial tool usage
- [ ] Assess current cloud infrastructure (Google Workspace, Microsoft 365, etc.)

### 2. Workflow Analysis
- [ ] Map the brief-to-delivery pipeline end-to-end
- [ ] Identify manual/repetitive tasks in each department
- [ ] Time the top 10 most frequent workflows
- [ ] Document approval chains and bottleneck points
- [ ] List recurring pain points reported by staff
- [ ] Identify work that gets outsourced that could be brought in-house with AI

### 3. Data & Content Assessment
- [ ] Audit existing brand guidelines and asset libraries
- [ ] Assess data hygiene (file naming, folder structure, metadata)
- [ ] Evaluate content reuse patterns
- [ ] Check for existing style guides, tone of voice docs, brand books
- [ ] Review pitch/proposal archive for template potential
- [ ] Assess client data handling and privacy compliance (GDPR, etc.)

### 4. People & Culture
- [ ] Gauge leadership appetite for AI adoption (1-10 scale per leader)
- [ ] Identify AI champions within the organisation
- [ ] Identify AI skeptics and their specific concerns
- [ ] Assess current digital literacy baseline across departments
- [ ] Document team structure and reporting lines
- [ ] Note any union/HR considerations around AI adoption

### 5. Infrastructure & Security
- [ ] Review IT policies on third-party SaaS tools
- [ ] Check client data handling agreements (can AI tools process client work?)
- [ ] Assess SSO/identity management capability
- [ ] Review NDA and IP clauses in client contracts re: AI-generated work
- [ ] Check internet bandwidth and hardware specs for AI tool requirements
- [ ] Document any regulated industries in client roster (pharma, finance, etc.)

### 6. Quick-Win Identification
- [ ] List 3-5 tasks that can be automated in week 1 with existing tools
- [ ] Identify one "wow moment" demo for leadership buy-in
- [ ] Find one cost-saving opportunity with clear ROI
- [ ] Spot one quality-improvement opportunity
- [ ] Note one competitive threat if AI is NOT adopted
```

### Stakeholder Interview Template

Conduct with department heads, creative directors, and key producers.

```markdown
## Stakeholder Interview — [CLIENT NAME]
Interviewee: [NAME]
Role: [TITLE]
Department: [DEPT]
Date: [DATE]
Duration: 45 mins

### Opening (5 mins)
"We're mapping how AI can genuinely help your team — not replace anyone, but remove the grunt work so you can focus on the craft. Everything here is confidential to this project."

### Current Workflow (10 mins)
1. Walk me through a typical week. What takes up most of your time?
2. What's the most repetitive task your team does?
3. Where do briefs get stuck or delayed?
4. What would you do with an extra 10 hours per week?

### AI Perception (10 mins)
5. What's your honest feeling about AI in the creative industry? (Scale 1-10, skeptic to enthusiast)
6. Have you or your team experimented with any AI tools? Which ones?
7. What's your biggest fear about AI adoption here?
8. What's your biggest hope?

### Pain Points (10 mins)
9. Name three things that frustrate you about current tools/processes.
10. Where do you see quality suffering due to time pressure?
11. What client requests do you dread because of the manual effort involved?
12. Is there work you outsource that you wish you could do in-house?

### Opportunity Mapping (5 mins)
13. If I could wave a magic wand and automate one thing for your team, what would it be?
14. What would success look like for your department in 6 months?

### Closing (5 mins)
15. Who else in your team should I speak to?
16. Anything I haven't asked that you think is important?

### Interviewer Notes (post-interview)
- AI readiness score: [1-10]
- Key pain points: [BULLET LIST]
- Quick-win opportunities: [BULLET LIST]
- Potential resistance factors: [BULLET LIST]
- Champion potential: [YES/NO + NOTES]
```

### Department Mapping Template

```markdown
## Department Map — [CLIENT NAME]

| Department | Head | Headcount | Key Tools | Top Pain Point | AI Readiness (1-10) | Quick-Win Opportunity |
|------------|------|-----------|-----------|----------------|--------------------|-----------------------|
| Creative   |      |           |           |                |                    |                       |
| Strategy   |      |           |           |                |                    |                       |
| Production |      |           |           |                |                    |                       |
| Account Mgmt |   |           |           |                |                    |                       |
| New Business |   |           |           |                |                    |                       |
| Design     |      |           |           |                |                    |                       |
| Social     |      |           |           |                |                    |                       |
| Finance/Ops |    |           |           |                |                    |                       |

### Capability Heat Map

Rate each department 1-5 on:
- Digital literacy: [SCORE]
- Process maturity: [SCORE]
- Data organisation: [SCORE]
- Change appetite: [SCORE]
- Leadership support: [SCORE]

### Cross-Department Dependencies
- [Department A] depends on [Department B] for: [WHAT]
- Bottleneck points between departments: [LIST]
- Shared tools/platforms: [LIST]
```

### Tool Assessment Template

```markdown
## Tool Assessment — [CLIENT NAME]

### Current Stack
| Tool | Category | Users | Monthly Cost | Contract End | AI Alternative | Migration Effort |
|------|----------|-------|-------------|-------------|----------------|-----------------|
|      |          |       |             |             |                |                 |

### Recommended AI Tool Stack
| Need | Recommended Tool | Why | Cost | Implementation Time | Training Need |
|------|-----------------|-----|------|--------------------|--------------| 
| Text generation | Claude (via AIDEN) | Best for creative/long-form | [COST] | 1 week | 2 workshops |
| Image generation | Midjourney / DALL-E / Flux | [REASON] | [COST] | 1 week | 1 workshop |
| Video | Runway / Kling / Veo | [REASON] | [COST] | 2 weeks | 1 workshop |
| Automation | n8n (self-hosted) | Full control, no per-task cost | [COST] | 2-4 weeks | Managed by Redbaez |
| Code assistance | Claude Code | Fastest for internal tools | [COST] | 1 week | 1 workshop |
| Presentation | AIDEN PPTX | Brand-compliant deck generation | Included | 1 day | 30 min demo |
| Research | NotebookLM / Perplexity | [REASON] | [COST] | 1 day | 1 workshop |

### Cost Comparison
- Current annual tool spend: GBP [AMOUNT]
- Proposed AI tool spend: GBP [AMOUNT]
- Net change: GBP [AMOUNT]
- Estimated time savings: [HOURS/WEEK] across [N] staff
- Effective hourly value of time saved: GBP [AMOUNT]
```

---

## Phase 2: Foundation & Training (Month 2)

### AIDEN Platform Rollout Checklist

```markdown
## AIDEN Rollout — [CLIENT NAME]
Target users: [NUMBER]
Rollout date: [DATE]

### Pre-Rollout (Week 1)
- [ ] Client IT review and sign-off on AIDEN platform
- [ ] SSO/authentication configured (Google OAuth or email)
- [ ] Client brand guidelines uploaded to AIDEN knowledge base
- [ ] Client tone of voice document loaded
- [ ] Client logo and brand assets uploaded
- [ ] Test accounts created for IT and leadership preview
- [ ] Client-specific prompt templates created (brief writing, copy review, research)
- [ ] Usage limits and billing configured

### Claude Code Skill Deployment
- [ ] Identify 3-5 custom skills needed for this client
- [ ] Build client-specific skills (e.g., brand voice checker, brief generator)
- [ ] Test skills against real client briefs
- [ ] Document skill usage for training materials
- [ ] Deploy to client team leads for beta testing

### Rollout (Week 2-3)
- [ ] Wave 1: Leadership + department heads (5-10 people)
- [ ] Wave 2: Creative and strategy teams (10-20 people)
- [ ] Wave 3: All remaining staff (10-20 people)
- [ ] Each wave includes a 90-min hands-on workshop
- [ ] Each wave gets a follow-up check-in at +3 days
- [ ] Slack/Teams channel created for AI questions and tips
- [ ] FAQ document distributed

### Post-Rollout (Week 4)
- [ ] Usage analytics reviewed
- [ ] Non-adopters identified and personally onboarded
- [ ] Top users identified as internal champions
- [ ] First monthly usage report generated
- [ ] Feedback survey sent (see template below)
```

### Training Workshop Template (20-40 staff)

```markdown
## AI Training Workshop — [CLIENT NAME]
Date: [DATE]
Attendees: [NUMBER] ([DEPARTMENT])
Duration: 90 minutes
Facilitator: Tom Hyde

### Agenda

#### 1. Context Setting (10 mins)
- Why AI matters for creative agencies RIGHT NOW (not someday)
- What competitors are doing (anonymised examples)
- What AI does NOT replace (taste, relationships, strategy, craft)
- The goal: remove grunt work, protect creative time

#### 2. Live Demo — "The Wow Moment" (15 mins)
- Take a real brief from the client's recent work
- Show AI generating: first-draft copy, research summary, competitor audit
- Show before/after time comparison
- Show AIDEN platform doing this with their brand voice loaded

#### 3. Hands-On: Your First Prompt (20 mins)
- Everyone opens AIDEN on their laptop
- Exercise 1: Rewrite a piece of existing copy in 3 different tones
- Exercise 2: Generate a research brief from a one-line input
- Exercise 3: Summarise a long document into a one-pager
- Facilitator circulates, helps with prompts, answers questions

#### 4. Department-Specific Use Cases (20 mins)
- Creative: Concept generation, script drafts, art direction briefs
- Strategy: Trend research, audience profiling, data synthesis
- Production: Timeline generation, vendor briefs, estimate templates
- Account: Status updates, meeting summaries, client email drafts
- Each group identifies their top 3 use cases and shares back

#### 5. Prompt Engineering Basics (15 mins)
- The CRAFT framework: Context, Role, Action, Format, Tone
- Show good prompt vs bad prompt (same task, different results)
- Provide prompt template cheat sheet (printed + digital)
- Demonstrate iteration: prompt > review > refine > output

#### 6. What Happens Next (10 mins)
- AIDEN is live — use it starting today
- Slack/Teams channel for questions: [CHANNEL]
- Office hours: [DAY/TIME] for 1:1 help
- Follow-up workshop in 2 weeks for intermediate techniques
- "AI wins of the week" sharing encouraged

### Materials Checklist
- [ ] Laptops/devices for all attendees
- [ ] AIDEN accounts provisioned and tested
- [ ] Printed prompt cheat sheets
- [ ] Real client brief for live demo (cleared with client lead)
- [ ] Slide deck (max 15 slides, mostly demo)
- [ ] Post-workshop survey link ready
- [ ] Follow-up email template drafted
```

### Adoption Tracking Metrics

```markdown
## Adoption Tracker — [CLIENT NAME]
Reporting period: [MONTH]

### Usage Metrics
| Metric | Week 1 | Week 2 | Week 3 | Week 4 | Trend |
|--------|--------|--------|--------|--------|-------|
| Daily active users |  |  |  |  |  |
| Total prompts/queries |  |  |  |  |  |
| Avg prompts per user |  |  |  |  |  |
| Unique users this week |  |  |  |  |  |
| Peak usage day |  |  |  |  |  |
| Most-used feature |  |  |  |  |  |

### Adoption by Department
| Department | Total Staff | Active Users | Adoption % | Top Use Case |
|------------|------------|-------------|-----------|-------------|
| Creative   |            |             |           |             |
| Strategy   |            |             |           |             |
| Production |            |             |           |             |
| Account    |            |             |           |             |
| Other      |            |             |           |             |

### Health Indicators
- Power users (>10 prompts/day): [NAMES]
- Non-adopters (0 usage in 2+ weeks): [NAMES]
- Support tickets raised: [NUMBER]
- Positive feedback received: [EXAMPLES]
- Negative feedback received: [EXAMPLES]

### Actions
- Non-adopters to follow up with: [LIST]
- Additional training needed: [TOPICS]
- Feature requests from users: [LIST]
- Champion programme candidates: [NAMES]
```

### Post-Workshop Feedback Survey

```markdown
## Post-Training Survey — [CLIENT NAME]

1. How confident do you feel using AI tools after today's workshop? (1-10)
2. What was the most useful part of the session?
3. What was the least useful part?
4. Name one task you'll try using AI for this week:
5. What's still unclear or confusing?
6. Would you attend an advanced session? (Yes/No/Maybe)
7. Any tools or capabilities you'd like us to add?
8. Net Promoter Score: How likely are you to recommend this training to a colleague? (0-10)
```

---

## Phase 3: Custom Builds (Month 3)

### n8n Automation Priorities Template

```markdown
## Automation Priorities — [CLIENT NAME]
Assessment date: [DATE]

### Priority Matrix

Rate each candidate automation on Impact (1-5) and Effort (1-5). Build highest impact/lowest effort first.

| # | Automation | Trigger | Steps | Impact | Effort | Priority | Status |
|---|-----------|---------|-------|--------|--------|----------|--------|
| 1 | Brief intake to project setup | New form submission | Create Slack channel, Notion project, assign team | 5 | 2 | BUILD NOW | |
| 2 | Weekly status report generation | Cron (Friday 3pm) | Pull task data, generate summary, send to client | 4 | 2 | BUILD NOW | |
| 3 | Asset delivery packaging | Manual trigger | Resize, rename, zip, upload to client portal | 4 | 3 | BUILD NEXT | |
| 4 | Competitor monitoring | Cron (daily) | Scrape, summarise, alert on changes | 3 | 3 | BACKLOG | |
| 5 | Meeting notes to action items | Webhook from transcription tool | Extract actions, assign in PM tool, set deadlines | 4 | 3 | BUILD NEXT | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |

### Build Order
1. **Week 1-2:** [TOP PRIORITY AUTOMATIONS]
2. **Week 3:** [SECOND TIER]
3. **Week 4:** [POLISH + TEST + HANDOVER DOCS]

### Success Criteria Per Automation
- Time saved per execution: [X] minutes
- Frequency of execution: [X] times per [PERIOD]
- Total monthly time saved: [X] hours
- Error rate target: <[X]%
- User satisfaction: Tested with [N] users before rollout
```

### Custom Tool Specification Template

```markdown
## Tool Specification — [TOOL NAME]
Client: [CLIENT NAME]
Author: Tom Hyde
Date: [DATE]
Version: [VERSION]

### Problem Statement
[2-3 sentences: what pain point does this solve? What is the current manual process?]

### Users
- Primary: [ROLE — e.g., "Account Directors"]
- Secondary: [ROLE]
- Estimated daily users: [NUMBER]

### Functional Requirements
| # | Requirement | Priority | Notes |
|---|------------|----------|-------|
| 1 |            | Must     |       |
| 2 |            | Must     |       |
| 3 |            | Should   |       |
| 4 |            | Nice     |       |

### Input
- Source: [Where does the input come from? Form, Slack, email, file upload, etc.]
- Format: [Text, JSON, file, URL, etc.]
- Example input:
```
[PASTE REAL EXAMPLE]
```

### Output
- Destination: [Where does the output go? Slack, email, file, dashboard, etc.]
- Format: [Text, PDF, Slack message, etc.]
- Example output:
```
[PASTE OR DESCRIBE EXPECTED OUTPUT]
```

### Technical Approach
- Platform: [n8n / Claude Code skill / AIDEN custom feature / standalone app]
- Key integrations: [LIST APIs and services]
- Authentication: [How users access this]
- Hosting: [Where it runs]

### Build-Measure-Learn Plan
- **Build:** [X] days to MVP
- **Measure:** Success metric = [METRIC]. Target = [VALUE].
- **Learn:** Review with [N] users after [X] days. Iterate or kill.

### Acceptance Criteria
- [ ] [CRITERION 1]
- [ ] [CRITERION 2]
- [ ] [CRITERION 3]
- [ ] Tested by [N] real users on real tasks
- [ ] Documentation written
- [ ] Handover-ready (client can maintain without Redbaez)
```

### Client Feedback Collection Template

```markdown
## Monthly Feedback — [CLIENT NAME]
Month: [MONTH]
Collected by: Tom Hyde

### Quantitative
1. Overall satisfaction with Redbaez engagement (1-10): [SCORE]
2. Value for money (1-10): [SCORE]
3. Responsiveness (1-10): [SCORE]
4. Quality of deliverables (1-10): [SCORE]
5. Would you recommend Redbaez to a peer agency? (0-10 NPS): [SCORE]

### Qualitative
6. What's working well?
7. What could be improved?
8. What's the single most valuable thing we've delivered so far?
9. Is there anything you expected that we haven't addressed?
10. Any new pain points or opportunities since last month?

### Action Items from Feedback
| Feedback | Action | Owner | Due |
|----------|--------|-------|-----|
|          |        |       |     |

### Trend (fill in monthly)
| Month | Satisfaction | NPS | Key Theme |
|-------|-------------|-----|-----------|
| 1     |             |     |           |
| 2     |             |     |           |
| 3     |             |     |           |
| 4     |             |     |           |
```

---

## Phase 4: Handover & Transition (Month 4)

### Documentation Checklist

```markdown
## Handover Documentation — [CLIENT NAME]
Handover date: [DATE]

### Platform Documentation
- [ ] AIDEN platform admin guide (how to add/remove users, update brand assets)
- [ ] Custom prompt library with usage instructions
- [ ] Troubleshooting FAQ (top 10 issues and fixes)
- [ ] Escalation contacts (Redbaez support email, response SLA)

### Automation Documentation
- [ ] n8n workflow inventory (name, purpose, trigger, owner)
- [ ] Each workflow has: description, diagram, error handling notes
- [ ] Admin credentials documented in client's password manager
- [ ] Backup/restore procedure documented
- [ ] Monitoring and alerting setup documented

### Training Documentation
- [ ] Recorded training sessions (video links)
- [ ] Prompt engineering cheat sheet (updated with client-specific examples)
- [ ] Department-specific playbooks
- [ ] "Train the trainer" guide for internal champions
- [ ] Onboarding guide for new starters joining post-handover

### Custom Tools Documentation
- [ ] Each custom tool has: purpose, users, inputs, outputs, maintenance notes
- [ ] Source code in client's repository (or Redbaez-managed with access)
- [ ] Known limitations and workarounds documented
- [ ] Future enhancement wishlist captured
```

### Self-Service Transition Plan

```markdown
## Transition Plan — [CLIENT NAME]

### Week 1 of Month 4: Shadow Mode
- Redbaez leads, client team shadows all admin tasks
- Client team given admin access to all platforms
- Daily 15-min check-ins

### Week 2: Reverse Shadow
- Client team leads, Redbaez shadows and advises
- Client handles first support request independently
- Redbaez provides feedback after each task

### Week 3: Independent + On-Call
- Client operates independently
- Redbaez available on Slack for questions (4-hour response SLA)
- End-of-week review: what went well, what needs more support

### Week 4: Full Handover
- Final handover meeting with leadership
- All documentation delivered and walked through
- Retainer proposal presented (if applicable)
- 30-day post-handover check-in scheduled
- Formal sign-off on deliverables

### Internal Champions Identified
| Name | Department | Strength | Role Post-Handover |
|------|-----------|----------|-------------------|
|      |           |          | AI Lead           |
|      |           |          | Automation Admin  |
|      |           |          | Training Lead     |

### Risk Register for Post-Handover
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Champion leaves the company | Medium | High | Train 2+ champions per dept |
| Tool subscription lapses | Low | High | Calendar reminders set for renewals |
| New staff untrained | High | Medium | Onboarding guide + quarterly refresher |
| n8n workflow breaks | Medium | Medium | Error alerts + Redbaez retainer |
| Client data/brand assets change | High | Low | Document update process |
```

### Retainer Proposal Template

```markdown
## Ongoing AI Partnership Proposal
From: Redbaez (Tom Hyde)
To: [CLIENT NAME]
Date: [DATE]

### What We've Achieved Together (Months 1-4)
- [KEY ACHIEVEMENT 1 with metric]
- [KEY ACHIEVEMENT 2 with metric]
- [KEY ACHIEVEMENT 3 with metric]
- Total estimated time saved: [X] hours/month
- Total estimated cost saved: GBP [X]/month

### Why Ongoing Support Matters
The AI landscape changes weekly. New models, new tools, new capabilities. Without dedicated support:
- Your team falls behind competitors within 3-6 months
- Automations break when APIs update and nobody fixes them
- New staff don't get trained and adoption declines
- You miss opportunities to automate new workflows

### Retainer Options

#### Option A: Maintenance (GBP [X]/month)
- Monthly platform health check
- Up to [X] hours support/troubleshooting
- Quarterly tool landscape review
- Priority access to new Redbaez capabilities
- Email support (24-hour response)

#### Option B: Growth (GBP [X]/month)
Everything in Maintenance, plus:
- [X] days/month dedicated to new builds and improvements
- Monthly training session for new staff or advanced techniques
- Quarterly strategy review with leadership
- Slack support (4-hour response)
- Access to AIDEN platform updates

#### Option C: Embedded (GBP [X]/month)
Everything in Growth, plus:
- [X] days/month on-site or dedicated time
- New department rollouts
- Client-facing AI capability (pitch support, client demos)
- Weekly check-in with senior leadership
- Custom tool builds included

### Recommended Option
Based on [CLIENT NAME]'s trajectory, I recommend **Option [X]** because:
- [REASON 1]
- [REASON 2]

### Next Steps
1. Review this proposal by [DATE]
2. 30-min call to discuss and customise
3. Start date: [DATE] (seamless transition from current engagement)
```

### Expansion Opportunity Identification

```markdown
## Expansion Opportunities — [CLIENT NAME]
Reviewed: [DATE]

### New Departments/Teams
| Team | Opportunity | Estimated Value | Timing |
|------|------------|----------------|--------|
|      |            |                |        |

### New Capabilities
| Capability | What It Enables | Client Interest (1-5) | Redbaez Readiness |
|-----------|----------------|----------------------|------------------|
| AI-powered pitch creation | Generate pitch decks from brief | | Ready |
| Video AI (Runway/Veo) | Automate rough cuts, mood films | | Ready |
| Voice cloning for presentations | Consistent presenter voice | | Beta |
| Client-facing AI tools | White-label AIDEN for their clients | | Custom build |

### Network Referrals
- Who at [CLIENT NAME] can introduce us to other agencies?
- Which holding company connections exist?
- Conference/event speaking opportunities through this client?

### Case Study Potential
- [ ] Permission to use client name in marketing
- [ ] Permission to share metrics (anonymised or named)
- [ ] Joint speaking opportunity identified
- [ ] Written testimonial requested
```

---

## Cross-Phase Tools

### Weekly Status Update Template

Send every Friday. Keep it to one screen.

```markdown
## Weekly Update — [CLIENT NAME]
Week of: [DATE]
Phase: [1/2/3/4] — [PHASE NAME]

### This Week
- [ACCOMPLISHMENT 1]
- [ACCOMPLISHMENT 2]
- [ACCOMPLISHMENT 3]

### Next Week
- [PLANNED ITEM 1]
- [PLANNED ITEM 2]
- [PLANNED ITEM 3]

### Metrics
- Active AI users: [N] / [TOTAL] ([%])
- Prompts this week: [N]
- Automations running: [N]
- Hours saved (estimated): [N]

### Blockers / Risks
- [BLOCKER 1] — Owner: [NAME] — Status: [OPEN/RESOLVED]
- [BLOCKER 2] — Owner: [NAME] — Status: [OPEN/RESOLVED]

### Decision Needed
- [DECISION ITEM, if any — otherwise remove this section]

### Mood: [GREEN / AMBER / RED]
[One sentence on overall project health]
```

### ROI Tracking Framework

```markdown
## ROI Tracker — [CLIENT NAME]
Updated: [DATE]

### Time Savings
| Task | Before (mins) | After (mins) | Saving (mins) | Frequency/week | Weekly Hours Saved |
|------|--------------|-------------|--------------|----------------|-------------------|
|      |              |             |              |                |                   |

**Total weekly hours saved:** [X]
**Monthly hours saved:** [X]
**Annual hours saved:** [X]

### Cost Savings
| Category | Before (GBP/month) | After (GBP/month) | Monthly Saving |
|----------|--------------------|--------------------|---------------|
| Freelancer spend reduction |  |  |  |
| Tool consolidation |  |  |  |
| Outsourcing reduction |  |  |  |
| Error/rework reduction |  |  |  |

**Total monthly cost saving:** GBP [X]
**Annual cost saving:** GBP [X]

### Revenue Impact
| Opportunity | Estimated Value | AI Contribution | Notes |
|------------|----------------|----------------|-------|
| Faster pitch turnaround | GBP [X] | Enabled [X] more pitches/quarter | |
| New AI-powered services offered to clients | GBP [X] | New revenue stream | |
| Higher win rate from better materials | GBP [X] | [X]% improvement | |

### ROI Summary
- Total Redbaez investment: GBP [X]
- Total measurable savings: GBP [X]
- Total measurable revenue impact: GBP [X]
- **ROI: [X]%**
- **Payback period: [X] months**
```

### Stakeholder Communication Cadence

```markdown
## Communication Plan — [CLIENT NAME]

| Audience | Format | Frequency | Owner | Content |
|----------|--------|-----------|-------|---------|
| Project sponsor (CEO/MD) | 1:1 call | Fortnightly | Tom | Strategic progress, ROI, decisions needed |
| Department heads | Group standup | Weekly (15 min) | Tom | Phase progress, adoption, blockers |
| All staff | Email update | Monthly | Tom + internal champion | What's new, tips, success stories |
| IT lead | Slack/Teams | As needed | Tom | Technical issues, access, security |
| Finance | Email | Monthly | Tom | Spend tracking, ROI metrics |
| Redbaez internal | Notion log | Weekly | Tom | Lessons learned, reusable assets, pipeline notes |
```

### Risk & Blocker Escalation Template

```markdown
## Risk/Blocker Alert — [CLIENT NAME]
Raised by: Tom Hyde
Date: [DATE]
Severity: [HIGH / MEDIUM / LOW]

### Issue
[Clear description of the problem in 2-3 sentences]

### Impact
- What is affected: [DELIVERABLE / TIMELINE / BUDGET / RELATIONSHIP]
- If unresolved by [DATE]: [CONSEQUENCE]

### Root Cause
[What caused this — be specific]

### Proposed Resolution
- Option A: [DESCRIPTION] — Timeline: [X] days — Risk: [LOW/MED/HIGH]
- Option B: [DESCRIPTION] — Timeline: [X] days — Risk: [LOW/MED/HIGH]

### Recommended Option: [A/B]
Because: [REASON]

### Decision Needed From
- [NAME / ROLE] by [DATE]

### Status Log
| Date | Update |
|------|--------|
| [DATE] | Issue raised |
|        |              |
```

---

## Revenue Patterns

### Day-Rate to Retainer Conversion Playbook

```markdown
## Retainer Conversion Playbook

### The Psychology
Day-rate clients think in projects. Retainer clients think in partnerships.
The conversion happens when they realise:
1. The value compounds over time (AI gets better as it learns their brand)
2. The risk of stopping is real (competitors, tool decay, staff turnover)
3. The cost of re-engaging later is higher than continuing now

### Conversion Timeline
- **Month 1:** Plant seeds. Mention "ongoing" and "evolving" language in every update.
- **Month 2:** Share examples of what OTHER clients get from retainers (anonymised).
- **Month 3:** Start the "what happens after we leave" conversation explicitly.
- **Month 4, Week 1:** Present retainer proposal. Never wait until the last week.

### Pricing Strategy
- Day rate: GBP [X]/day
- Retainer floor: GBP [X]/month (minimum viable engagement)
- Target retainer: GBP [X]/month (sweet spot)
- Premium retainer: GBP [X]/month (embedded model)
- Always offer 3 options (anchor high, recommend middle)
- Annual commitment = 10% discount
- Quarterly reviews with opt-out = reduces commitment anxiety

### Objection Handling

| Objection | Response |
|-----------|----------|
| "We can manage it ourselves now" | "You absolutely can for maintenance. The retainer is about staying ahead — new tools launch weekly and your competitors are watching the same space." |
| "Budget is tight" | "Option A is designed for exactly that — minimal commitment, maximum safety net. It's less than one day of freelancer spend per month." |
| "We need to think about it" | "Of course. I'll send a summary with the ROI data. Can we book a 20-min call for [DATE] to discuss?" |
| "Can we do ad-hoc instead?" | "We can, but retainer clients get priority response and locked rates. Ad-hoc is [X]% more per day and subject to availability." |
| "We want to wait and see" | "Smart. Let's schedule a 30-day check-in. If the tools are humming along, great. If things start breaking, you'll want the safety net." |

### Conversion Signals to Watch For
- Client asks "what happens after the 4 months?"
- Client mentions wanting to roll out to another department
- Client asks you to join a pitch or client meeting
- Internal champion advocates for continued engagement
- Leadership references you positively in all-hands
- Client shares your work with their network
- They ask about new AI capabilities unprompted
```

### Expansion Signals Checklist

```markdown
## Expansion Signal Tracker — [CLIENT NAME]

### Signals Detected
| Signal | Date | Context | Action Taken |
|--------|------|---------|-------------|
| Client asked about rolling out to [new dept] | | | |
| Client mentioned sister agency / holding company | | | |
| Client invited us to pitch / client meeting | | | |
| New hire needs onboarding to AI tools | | | |
| Client shared our work externally | | | |
| Leadership asked "what else can AI do?" | | | |
| Client's client asked about AI capabilities | | | |
| Competitor agency mentioned as adopting AI | | | |

### Expansion Opportunities Prioritised
| Opportunity | Revenue Potential | Likelihood | Next Step | Timeline |
|------------|------------------|-----------|-----------|----------|
|            | GBP [X]          |           |           |          |
```

### Upsell Timing Guide

```markdown
## Upsell Timing — When to Pitch What

### Month 1 (Audit Phase)
- DO: Mention the full 4-month journey and what's possible
- DON'T: Pitch retainer yet — too early, no proven value

### Month 2 (Training Phase)
- DO: Share retainer examples from other clients (anonymised)
- DO: Drop "ongoing partnership" language in updates
- DON'T: Hard-sell anything — let adoption metrics speak

### Month 3 (Build Phase)
- DO: Start the "what happens when we leave" conversation
- DO: Quantify ROI and share it proactively
- DO: Identify and nurture internal champions who'll advocate for you
- DON'T: Wait for them to ask — you raise it first

### Month 4 (Handover Phase)
- DO: Present retainer proposal in Week 1 (not Week 4)
- DO: Offer 3 tiers (anchor high)
- DO: Include a "bridge" option (2 months at reduced rate to ease transition)
- DO: Schedule the decision meeting, don't leave it open-ended
- DON'T: Be desperate — confidence sells
```

### Mothership Model Pitch Template

```markdown
## The Mothership Model — Pitch Deck Outline
For: [HOLDING COMPANY / GROUP]

### Slide 1: The Opportunity
Creative agencies that adopt AI effectively deliver [X]% faster at [X]% lower cost.
Most agencies are experimenting. Few have a system.
Redbaez provides the system.

### Slide 2: What We've Done
- [AGENCY 1]: [METRIC] — [RESULT]
- [AGENCY 2]: [METRIC] — [RESULT]
- [AGENCY 3]: [METRIC] — [RESULT]

### Slide 3: The Mothership Model
One central AI transformation partner across your portfolio:
- Shared platform (AIDEN) with per-agency customisation
- Shared learnings across agencies (anonymised)
- Volume pricing on tools and training
- Single vendor relationship, consistent quality

### Slide 4: How It Works
- Each agency gets the standard 4-month transformation
- Shared infrastructure reduces per-agency cost by [X]%
- Central reporting dashboard for group leadership
- Quarterly cross-agency AI benchmarking

### Slide 5: Pricing
| Agencies | Per-Agency Cost | Group Total | Saving vs Individual |
|----------|---------------|-------------|---------------------|
| 1        | GBP [X]       | GBP [X]     | —                   |
| 3        | GBP [X]       | GBP [X]     | [X]%                |
| 5+       | GBP [X]       | GBP [X]     | [X]%                |

### Slide 6: Next Steps
1. Pilot with one agency (lowest risk)
2. Measure results over 4 months
3. Roll out to remaining agencies
4. Ongoing group retainer
```

---

## Deliverable Templates

### Audit Report Structure

```markdown
## AI Transformation Audit Report
Client: [CLIENT NAME]
Date: [DATE]
Prepared by: Tom Hyde, Redbaez

### Executive Summary (1 page)
- Current state in 3 sentences
- Biggest opportunity in 2 sentences
- Recommended investment and expected ROI in 2 sentences

### 1. Current State Assessment
#### 1.1 Tool Landscape
[Summary table + narrative]
#### 1.2 Workflow Analysis
[Key workflows mapped + bottlenecks identified]
#### 1.3 People & Culture
[Readiness scores by department + key findings from interviews]
#### 1.4 Infrastructure & Security
[Findings + any blockers]

### 2. Opportunity Map
#### 2.1 Quick Wins (Week 1-2)
| Opportunity | Impact | Effort | Owner |
|------------|--------|--------|-------|
|            |        |        |       |

#### 2.2 Medium-Term Wins (Month 1-2)
[Table format as above]

#### 2.3 Strategic Opportunities (Month 3-4)
[Table format as above]

### 3. Recommended AI Stack
[Tool assessment table with costs and rationale]

### 4. Implementation Roadmap
| Phase | Timeline | Key Activities | Deliverables |
|-------|----------|---------------|-------------|
| 1: Audit | Month 1 | [DONE — this report] | Audit report |
| 2: Foundation | Month 2 | Platform rollout, training | Trained team, live platform |
| 3: Build | Month 3 | Custom automations, tools | Working automations |
| 4: Handover | Month 4 | Documentation, transition | Self-sufficient team |

### 5. Investment & ROI
- Engagement cost: GBP [X]
- Estimated annual savings: GBP [X]
- Estimated ROI: [X]%
- Payback period: [X] months

### 6. Risks & Mitigations
[Top 5 risks with mitigation strategies]

### Appendices
- A: Full tool audit table
- B: Stakeholder interview summaries (anonymised)
- C: Department capability heat map
- D: Recommended reading / resources
```

### Training Deck Outline

```markdown
## Training Deck — [CLIENT NAME]
Audience: [DEPARTMENT / ALL STAFF]
Slides: ~15 (keep it lean, mostly demo)

1. Title slide — "AI for [CLIENT NAME]: Working Smarter, Not Harder"
2. Agenda — what we'll cover in 90 mins
3. Why now — market context, competitor activity, opportunity cost of waiting
4. What AI does NOT replace — creativity, taste, relationships, judgment
5. What AI IS good at — first drafts, research, repetition, formatting, data
6. Meet AIDEN — screenshot, live URL, how to log in
7. Demo 1 — Real brief > AI-generated first draft (live)
8. Demo 2 — Research task that took 2 hours > done in 2 minutes (live)
9. Demo 3 — Department-specific example (live)
10. Your turn — Exercise instructions (open AIDEN, try these 3 prompts)
11. Prompt engineering basics — CRAFT framework on one slide
12. Good prompt vs bad prompt — side-by-side comparison
13. Your department's top use cases — [CUSTOMISE PER SESSION]
14. What happens next — support channels, office hours, follow-up session
15. Q&A
```

### Weekly Update Format

Use the template from the Cross-Phase Tools section above. Key rules:
- Send every Friday by 4pm
- Maximum one scroll on mobile
- Always include: accomplishments, next week, metrics, blockers, mood
- Mood = GREEN (on track), AMBER (minor concern), RED (needs intervention)
- If RED, send a separate blocker alert immediately — don't wait for Friday

### Handover Document Structure

```markdown
## Handover Pack — [CLIENT NAME]
Date: [DATE]
Prepared by: Tom Hyde, Redbaez

### Document Index
1. Executive Summary — what was delivered, key metrics, recommendations
2. Platform Guide — AIDEN admin, user management, brand asset updates
3. Automation Inventory — every n8n workflow with purpose, trigger, owner
4. Custom Tool Documentation — each tool with usage guide and maintenance notes
5. Training Materials — recorded sessions, prompt cheat sheet, playbooks
6. Champion Contacts — who knows what internally
7. Ongoing Support — retainer options, ad-hoc rates, escalation contacts
8. Future Roadmap — recommended next steps, new capabilities to evaluate

### For Each Section, Include:
- What it is and why it matters
- How to use/maintain it
- What can go wrong and how to fix it
- Who to contact if stuck
```

### Retainer Proposal Document

Use the template from Phase 4 above. Additional formatting rules:
- Maximum 2 pages (plus a metrics appendix if needed)
- Lead with achieved results, not future promises
- Always include 3 options (never just one)
- Include a "do nothing" scenario — what they risk by not continuing
- End with a specific next step and date, not an open question
- Send as PDF, not as an email body

---

## Workflow Triggers

When this skill is invoked, determine which phase the client is in and offer the relevant templates. Use these triggers:

- **"New client" / "onboarding" / "starting engagement"** — Begin with Phase 1 audit checklist and stakeholder interview template
- **"Training" / "workshop" / "rollout"** — Provide Phase 2 training workshop and adoption tracking templates
- **"Build" / "automation" / "custom tool"** — Provide Phase 3 n8n priorities and tool spec templates
- **"Handover" / "transition" / "wrapping up"** — Provide Phase 4 documentation checklist and retainer proposal
- **"Status update" / "weekly update"** — Provide weekly update template pre-filled with current phase context
- **"ROI" / "metrics" / "value"** — Provide ROI tracking framework
- **"Retainer" / "proposal" / "upsell"** — Provide retainer proposal template and conversion playbook
- **"Mothership" / "holding company" / "group"** — Provide Mothership model pitch template

Always populate templates with the client name and current date when generating deliverables. Ask for any missing information before generating.
