---
tags: [guide, ai-stack, training, operating-system, beginner-to-master]
status: living-document
date: 2026-05-27
author: Tom Hyde
audience: anyone setting up AI from scratch through to full operator level
---

# AI Setup Guide: Beginner to Master

A complete guide for setting up AI the way I do, written so a new user can start at zero and climb the ladder to where I am now. Skip nothing. Each level assumes the previous one is in place. By the end you should have a stack that does real work for you, not a chat window you forget about.

If you read one section to know whether this is worth your time, read Level 0. Everything else is implementation.

---

## The ladder

| Level | What you have | Time to reach |
|---|---|---|
| 0 | The right mindset before spending money | 1 hour |
| **Day 1** | **A first real win with AI in your browser, no terminal needed** | **30 minutes** |
| Quickstart | Claude Code or Codex installed and connected to your inbox | 30 minutes |
| 1 | One AI you use daily with a memory file | 30 days |
| 2 | A vault and 2-3 AIs each doing a clear job | 3-6 months |
| 3 | Skills, agents, automations running while you sleep | 6-12 months |
| 4 | Custom voice layer, multi-agent stack, vault as OS | 12 months and ongoing |

Most people stop at Level 1 and call it AI usage. Level 4 is where AI actually changes how you work. You don't need to get there to win. Even Day 1 will change your week.

> **Two fast lanes if you don't want to read the whole guide:**
> - **Just want a win today?** Skip to **Day 1** below. 30 minutes in your browser. No installs, no terminal, no money.
> - **Already comfortable with software?** Do the **Quickstart**, then jump to the **Self-Onboarding Prompt** at the end. The AI will interview you, sweep your Gmail/Calendar/Drive, set up your vault, and generate a personalised 30/60/90 plan while you read the rest.

---

## Level 0: The mindset

Before you pay for anything, get four ideas into your head. If you skip this, every tool you buy becomes a thicker wrapper for the same bad habits.

### Memory beats IQ

The AI that remembers what you agreed last week beats the smarter one that starts every conversation cold. Persistence is the multiplier. A mediocre model with deep memory of you and your work outperforms a frontier model that has to be re-briefed every time. Plan for memory from day one.

### One AI per job

Do not collect AIs. Collect jobs, then assign one AI to each job. I run eight systems today (full list in Level 4) and each one has a clearly different role. Yours will start with one. Maybe two by month three. When two systems start doing the same job, one of them gets killed. Hoarding tools is the most common mistake at every level.

### Stop chatting, start systematizing

A conversation is a single use. A system is reusable. Every time you find yourself typing the same context into a chat for the third time, that context belongs in a file the AI reads automatically. The goal is to build infrastructure, not to have better conversations.

### Build, then sell

This rule sits underneath everything else I do. Ship a small working thing first. Show it. Refine. Most of my client work comes from demos, not pitches. The mindset transfers to your own setup. Build a small workflow, use it, then expand. Do not architect the dream stack on paper before you have anything working.

---

## Day 1: 30 minutes to a working AI (no terminal needed)

Before you install anything, get one real win in your browser. This proves the concept and tells you which AI you like before you spend money. Total time: 30 minutes. No software install. No terminal. No money.

If you are tech-scared, this is where you start. Most "AI guides" send you to install developer tools on day one. That kills 80% of non-technical readers before they get any value. Day 1 gets you a win first.

### Step 1: Open Claude or ChatGPT (5 minutes)

In your browser, go to one of:

- **claude.ai** (Anthropic)
- **chatgpt.com** (OpenAI)

Sign up with your email. The free tiers are enough for today. You can upgrade later.

> **Which one?** If you genuinely cannot decide, pick **Claude**. The writing tends to be sharper. ChatGPT is fine too. You can try both later. Just pick one and stop thinking about it.

### Step 2: Paste this as your first message (5 minutes)

Copy the block below. Edit the parts in `[brackets]` to match you. Paste it as a fresh message.

```
You are my AI work partner. Before we begin, here's who I am.

- Name: [your name]
- Role: [what you do]
- Business or focus: [1-2 sentences about your work]
- Voice: direct, plain English, no jargon
- Never use em-dashes. Use periods, commas, or rewrite.
- Push back if my plan has a gap. Do not just agree with me.

When I give you a task, do it directly. Skip the preamble. If you need clarification, ask one specific question.

Confirm you've got that, then wait for my first task.
```

The AI will reply. That reply is the first time you'll feel the difference between "chatbot" and "work partner". You just gave it the equivalent of a one-page CV and a tone guide. Every reply from here on inherits that context.

### Step 3: Do one real task (15 minutes)

Pick something from your actual day. Not a test prompt. A real thing. Examples:

- Paste an email you need to reply to and ask the AI to draft a response in your voice
- Paste meeting notes and ask for a summary plus the three follow-up actions
- Describe a decision you're stuck on and ask the AI to argue both sides
- Paste a long article and ask for the takeaways in five bullets
- Describe a problem at work and ask for three angles you might be missing

Whatever you pick, the answer should feel useful enough that you keep the output, not throw it away. If it doesn't feel useful, your prompt was probably too short. Add more context (who is the audience, what is the goal, what tone, what format) and try again.

### Step 4: Decide (5 minutes)

If that felt useful, keep going. Tomorrow, do another real task. After a week of daily reps, upgrade to a paid plan and continue to Level 1.

If it felt useless, the prompt was too thin or you picked the wrong task. Try the same exercise tomorrow with a different real task before deciding AI isn't for you.

### What you have now

A free AI account with your context loaded. A first real task done. No software installed, no terminal opened, no money spent. This is enough to get value while you decide whether to climb the rest of the ladder.

Most readers should do at least a week of Day 1 reps before attempting the Quickstart below.

---

## Know your Claude (the full surface)

If you've picked Claude as your main AI, here's the full map of what you actually have access to. Skim it now. Come back when something here becomes relevant. If you picked ChatGPT, the equivalent surfaces exist (web, desktop, mobile, code) and you can use this section as a translation guide.

### The surfaces (where Claude lives)

You can talk to Claude through five different surfaces. Each one is the same model underneath, but the surface changes what you can do.

| Surface | Where to get it | Best for |
|---|---|---|
| **Claude on the web** | claude.ai | Daily writing, strategy, longform reasoning. Has Projects, Artifacts, Research |
| **Claude Desktop** | Mac and Windows app from claude.ai/download | Same as web with deeper OS integration. Better file uploads. Sits in your menu bar |
| **Claude Mobile** | iOS and Android stores | On the move. Voice input, photo input. Good for quick captures and decisions |
| **Claude Chrome** | Chrome extension (early access) | Claude reading and acting on web pages. Research, summarising long pages, form filling |
| **Claude Code** | Terminal CLI (covered in Quickstart) | Coding, agent work, the whole power-user path |

Start with the web. Add Desktop within a week so it sits next to your other apps. Mobile when you find yourself wanting Claude away from your laptop. Chrome and Claude Code once you're climbing into Level 2.

#### Try each surface this week

| Day | Surface | Task |
|---|---|---|
| 1 | Web | Pick a hard email you've been avoiding. Ask Claude to draft a reply |
| 2 | Desktop | Install it. Pin it to your dock. Screenshot something on your screen and ask Claude to explain it |
| 3 | Mobile | Voice-capture three ideas during a walk. Have Claude turn them into structured notes |
| 4 | Chrome | Install the extension. Find a long article. Ask Claude to extract the takeaways without you copy-pasting |
| 5+ | Pick your favourite | Whichever surface you reached for most. That's your default |

### The features (what's inside Claude)

The features matter as much as the surfaces. These are the things you actually use.

#### Chats

The basic conversation. A "New chat" starts with fresh context. Default for one-off questions and quick tasks. Don't use raw chat for repeat workflows. That's what Projects are for.

**Try this**: open a fresh chat right now. Paste a problem you spent 30 minutes on yesterday. Ask "what did I miss?". See what comes back. That's your baseline.

#### Projects

Persistent workspaces inside Claude. Each Project has:

- Its own system prompt (custom instructions for the role you want Claude to play)
- Uploaded reference files (docs, transcripts, briefs, voice samples)
- A conversation history all linked to the same context

Best for repeat workflows. Example: a "Client Strategy" Project with all your client documents loaded and a system prompt that defines tone and never-dos. Every new chat inside that Project inherits everything.

Pro and Max only. This is the single biggest unlock once you upgrade. If you only build one Project, build one for your own business.

**Five Projects to build in your first month**:

| Project name | What goes in it | Why it earns its keep |
|---|---|---|
| **Personal Voice** | 5-10 samples of your past writing, a tone guide, list of banned phrases | Every email, post, and draft comes back in your voice instead of generic Claude voice |
| **Daily Operator** | Your CLAUDE.md, recurring meetings, current priorities, key relationships | Triages your day. Drafts your morning plan. Answers "what should I work on right now" |
| **Research Companion** | Your industry background, domain documents, a dossier template you reuse | Outputs structured research in your house format. Reusable for prospects, competitors, hires |
| **Client [Name]** | That client's brief, voice samples, project history, current scope, key people | Every output for that client stays on-strategy and on-tone. Build one per active client |
| **Inbox Coach** | Screenshots of your inbox style, reply preferences, signature, your common templates | Drafts replies to forwarded emails in your voice with the right register for each relationship |

Build the first two this week. Add Research Companion in week two. Add Client Projects as needed.

#### Coworker (sub-agents)

When you give Claude a complex task, it can spawn parallel sub-agents to handle pieces of it. Research five competitors in parallel. Critique a strategy from three angles. Build a feature in three places at once.

You don't trigger this manually. Claude decides when a task benefits from sub-agents and does it. You see results stream in. Available in Pro and Max on Sonnet 4.6+ and Opus 4.7+.

**Example prompts that trigger Coworker mode**:

- "Compare these five competitors against my product, one sub-agent per competitor: [list five]"
- "Critique this strategy from three angles in parallel: financial, brand, operational"
- "Read these three meeting transcripts and find every contradiction"
- "Research this topic from five stakeholder perspectives in parallel: customer, employee, regulator, investor, competitor"
- "Take this article and produce three drafts in parallel: a LinkedIn post, a 60-second video script, a two-minute spoken version"

You'll see the sub-agents fire as small pills in the chat as they work.

#### Skills

Reusable instruction sets Claude can load on demand. Each skill is a small file with: a name, a description ("when to use this"), and detailed instructions. The model reads descriptions, decides which skill applies to the current task, and pulls in the full content.

Examples from my stack:

- `vault-today`, builds a prioritised daily plan
- `brief-sharpener`, exposes gaps in a brief before kickoff
- `pr-campaign`, runs end-to-end PR outreach
- `caveman-review`, ultra-compressed code review comments

Skills live mostly in Claude Code today (where I have 200+ installed). The web is starting to support them. Build a skill the third time you do a task by hand.

**Three skills to install or write in your first month**:

1. **Email-in-your-voice**, takes a forwarded email plus light context, drafts a reply that sounds like you, follows your never-do rules
2. **Meeting-to-actions**, takes meeting notes or a transcript, returns a one-paragraph summary plus 3-5 specific action items with owners and dates
3. **Daily plan**, reads your calendar, today's emails, and your priorities note, returns a focused plan for the day

Each one saves about 20 minutes a day. Write them after you've done the task by hand five times. By then you know what good looks like.

#### Plugins and Connections (MCP)

How Claude talks to your other apps. Each connection is called an MCP server. One-click setup for the major ones: Gmail, Google Calendar, Google Drive, Slack, GitHub, Notion, Linear, Stripe, Supabase, Figma.

Read-only by default. You authorise each one in your browser. You can revoke access any time from your Google account or service settings.

Already covered in the Quickstart for Claude Code. The same connections work in Claude Desktop and increasingly on the web.

**Try these prompts once Gmail is connected**:

- "Find every email I haven't replied to from a director-level person or higher in the last 14 days"
- "Summarise every email from [client name] in the last 30 days into a one-page client status"
- "Show me threads where I made a promise but haven't followed up yet"
- "Draft replies to the three most urgent unread emails in my inbox"

**Once Calendar is connected**:

- "What does my next two weeks look like, and where are the gaps?"
- "Find every meeting with [person] in the last six months and summarise what we discussed each time"
- "Suggest five 90-minute windows next week for a focused build block"

**Once Drive is connected**:

- "Find every document I've shared with [client] in the last 90 days"
- "Search Drive for documents about [topic] and return the three most relevant"
- "Summarise [document name] and pull out the three open questions left in the comments"

#### Research

Deep multi-source research with web search and full source citation. You ask a complex question, Claude searches the web, reads sources, synthesises, and gives you a structured answer with footnotes.

Use this instead of Google for any question where you'd otherwise open ten tabs. Pro and Max.

**Research questions worth asking**:

- "What's changed in [my industry] in the last 90 days that someone in my role should know about?"
- "Find five comparable companies to [my company] that have raised funding in the last 12 months. What's their go-to-market?"
- "Map the AI tooling landscape for [specific use case]. Pricing, capability, momentum, and who's winning"
- "What does the public footprint say about [prospect name]? Where might they be receptive to my pitch?"
- "Trace the regulatory changes affecting [industry] in the EU, US, and AU over the last year. What do operators need to know?"
- "Find the three most credible critiques of [methodology or framework]. Steelman each one"

Each research run takes 2-5 minutes and replaces an hour of tab-juggling.

#### Artifacts

When Claude generates code, documents, diagrams, charts, or interactive previews, they show up inline in the chat as Artifacts. You can iterate on them in place ("make this column wider", "change the tone to formal"). Each iteration creates a new version you can flip between.

Best for: presentations, mockups, data visualisations, working prototypes, formatted documents.

**Artifact starter prompts**:

- "Build me a one-page client status summary template I can reuse weekly"
- "Make a simple ROI calculator: three inputs, three projected outcomes, all calculations visible"
- "Draw me an architecture diagram of [system] using mermaid syntax"
- "Create a one-pager pitch deck for [idea] in markdown that I can paste into Google Slides"
- "Generate a colour palette and tone guide from this brand description: [paste]"
- "Build an interactive checklist for [process] I can tick off each week"

You iterate in place. "Make it shorter." "Change the tone to more formal." "Add a section on objections." Each tweak creates a new version you can flip between.

#### Memory

Claude can remember facts across sessions. Tell it "remember that I prefer X" or "remember that my company is Y" and it surfaces that context in future chats.

Useful for stable personal preferences. Less reliable than a CLAUDE.md file in your vault (still the best persistence layer). Improving fast.

**Memory facts worth seeding on day one**:

- Your time zone and country
- Your role and primary business
- Your spouse, kids, key partners (so Claude doesn't have to ask)
- Your dietary preferences (useful for travel and restaurant tasks)
- Voice rules and banned words (no em-dashes, no "leverage", no "unlock")
- Your top three current priorities
- Your active client list (so Claude knows who's who when names come up)
- Your usual working hours and protected blocks

Memory is for stable facts. Don't put project state in it. That belongs in your vault.

### The models (which to pick when)

Claude has three model families. Each one trades cost against capability.

| Model | What it's for | Relative cost |
|---|---|---|
| **Opus 4.7** | Hard reasoning, judgement calls, ambiguous problems, architecture decisions | Highest |
| **Sonnet 4.6 / 4.7** | The workhorse. Daily writing, code, most tasks | Mid |
| **Haiku 4.5** | Fast, simple tasks. Classification, summarisation, filtering | Lowest |

The web app picks the right model for you. In Claude Code and API work you choose explicitly.

My rule: **default Sonnet**. Switch to Opus when the task needs real judgement. Use Haiku for high-volume mechanical work where speed matters more than depth.

### The plans (what unlocks what)

| Plan | Rough price | What you get |
|---|---|---|
| **Free** | $0 | Limited daily messages. Useful for Day 1. Will throttle within hours of real use |
| **Pro** | ~$20/mo | More messages, Projects, Research, Artifacts, Coworker, all models. The main plan for most people |
| **Max** | ~$100/mo or $200/mo | Pro plus much higher limits, longer context windows, priority during peak load. For heavy users and people running things on top of Claude Code |

Most people land on Pro within a week of starting. Max is overkill until you're doing serious daily work or building tools on top of the API.

### What I actually use most

My personal stack inside Claude:

- **Web Claude** for most strategy and writing
- **Claude Desktop** when I want Claude always-available without a browser tab
- **Claude Mobile** for voice captures and quick check-ins on the move
- **Claude Chrome** for research and reading long pages
- **Claude Code** for every line of code I write and every operational task I run

A Project per major client. Around 15 active Projects at any time. Each one has the client's CLAUDE.md, key briefs, and a stable system prompt loaded in.

Skills loaded in Claude Code: 200+. The ones I rely on weekly are listed in the Reference section at the end of this guide.

### Your first 7 days with Claude

If you're starting fresh with a Pro account, here's a sequenced week. Each day's task takes 10-30 minutes.

| Day | Task | Outcome |
|---|---|---|
| 1 | Sign up for Pro. Paste your "who I am" file into Custom Instructions. Do one real task | A working Claude with your context loaded |
| 2 | Install Claude Desktop. Pin it. Connect Gmail via MCP. Run one inbox query | Claude can now see and act on your email |
| 3 | Build the **Personal Voice** Project. Upload 5 writing samples. Test it on a draft email | Drafts now sound like you, not like Claude |
| 4 | Build the **Daily Operator** Project. Run "what should I work on right now" | Claude becomes your morning operator |
| 5 | Try a Research query: "what's changed in my industry in the last 90 days" | First proper research output |
| 6 | Iterate on an Artifact: build a one-pager template you'll use weekly | Reusable creative output |
| 7 | Seed memory with 10 stable facts. Review the week. Decide what to use Claude for next week | A personal stack you can build on |

By day 7 you'll have a Claude that knows you, sees your inbox, drafts in your voice, runs your morning, and outputs reusable artefacts. That's enough infrastructure to keep climbing into Level 1.

---

## Installation Quickstart (30 minutes)

Before Level 1, install a real AI agent on your machine. This is what unlocks every workflow later in this guide. The Self-Onboarding Prompt at the bottom of this guide assumes you have this running.

I default to **Claude Code** because it's what I use most. **Codex** (OpenAI) is the equivalent and works just as well. Pick one. The rest of the guide applies to either.

> **Heads up**: this section asks you to open a terminal and type commands. If the black screen feels weird, that is normal. Everyone feels that way the first time. The terminal is just a typing-only version of Finder or File Explorer. If you get stuck on a command, see the **Stuck?** section at the end of the Quickstart. Worst case, walk away and come back tomorrow.

> **What's a CLI?** CLI stands for "command line interface". It's the terminal window where you type commands instead of clicking buttons. On Mac it's the "Terminal" app. On Windows it's "PowerShell" or "WSL". On Linux you already know.
> Search YouTube: `terminal basics for beginners 2026` (Fireship and NetworkChuck both have good intros)

### Step 1: Open the terminal

- **Mac**: hit Cmd+Space, type "Terminal", press Enter
- **Windows**: install WSL ([wsl install guide](https://learn.microsoft.com/en-us/windows/wsl/install)) or open "PowerShell"
- **Linux**: open your terminal of choice

You'll see a black or dark window with a blinking cursor. Some text at the top showing your username and computer name. That's it. That's the terminal. You type commands, press Enter, and the computer does things.

### Step 2: Install Node.js

Node.js is what runs most CLI tools. Install the LTS version from [nodejs.org](https://nodejs.org/), or on Mac use Homebrew: `brew install node`. Restart your terminal afterwards.

> **What's Homebrew?** A package manager for Mac. Install it once from [brew.sh](https://brew.sh/) and you can install developer tools with one command. Search YouTube: `homebrew tutorial 2026`

### Step 3: Install your agent

For **Claude Code**:
```bash
npm install -g @anthropic-ai/claude-code
```

For **Codex** (alternative):
```bash
npm install -g @openai/codex
```

**What you'll see**: a wall of text scrolling past, ending with something like `+ @anthropic-ai/claude-code@1.x.x` and `added 47 packages`. If you see that, it worked. If you see red text saying `error` or `permission denied`, jump to the **Stuck?** section at the end of the Quickstart.

### Step 4: Sign in and test

Run `claude` (or `codex`). It opens your browser to sign you in. Sign up at claude.ai or chatgpt.com first if you don't have an account. After sign-in, type "say hello" in the terminal. If you get a reply, you're in.

**What you'll see**: the terminal shows a prompt like `>` or `Claude>`. You type, you press Enter, the AI replies in the same window. If you can have a conversation, the install worked.

### Step 5: Connect your real life (MCP servers)

This is the step beginners skip and lose 80% of the value.

> **Before you connect anything, a privacy and safety note.** Connecting Gmail, Calendar, and Drive to an AI feels scary. Here's the honest picture.
> - **What the AI can see**: anything you'd see when you log into those accounts. Emails, events, files.
> - **What the AI cannot do without asking**: send emails, delete files, modify events. Default scopes are read-only unless you grant write access. The agent will tell you when it's about to write or send.
> - **What I never let it do**: send any email automatically. Drafts only. I review and click send myself. You should do the same.
> - **How to revoke access**: in your Google account go to Security → Third-party apps with account access. You can disconnect any AI tool with one click. Your data stays in your account either way.
> - **Where your data goes**: Anthropic (Claude) and OpenAI (ChatGPT) have published data policies. For paid plans, your data is not used for model training. Read their policies before connecting if you handle sensitive client information.
> - **What you can skip**: if you handle highly sensitive data (legal, medical, financial), do not connect those accounts. Use a separate AI workspace for them, or stay on Day 1's manual-paste workflow.

> **What's MCP?** MCP stands for "Model Context Protocol". It's how an AI agent connects to your other apps (Gmail, Calendar, Drive, Slack, GitHub, Notion). Each connection is called a "server". You authorise once, the AI can read and act from then on.
> Search YouTube: `Model Context Protocol explained 2026` or `Claude Code MCP setup`

Inside Claude Code, type `/mcp` to see the connection menu. Connect at minimum:

- **Gmail** (read inbox, draft replies, search threads)
- **Google Calendar** (check availability, create events)
- **Google Drive** (read and search documents)

Approve each in your browser. Done. The agent can now see your operational world.

Optional but valuable:
- **Slack** (read channels, draft messages)
- **GitHub** (read repos, open PRs)
- **Notion** or **Linear** (project state)

### Step 6 (optional): Install Obsidian

You will need this for Level 1 onwards. Free, download from [obsidian.md](https://obsidian.md/). Open it. Create a new vault folder anywhere on your machine. We'll fill it in the Self-Onboarding Prompt.

> **What's Obsidian?** A free notes app where every note is a plain markdown (`.md`) text file on your computer. Notes link to each other with `[[Wiki Links]]`. The app shows your notes as a graph. Search YouTube: `Obsidian for beginners 2026` (Linking Your Thinking and Nick Milo are good channels)

### You now have

A working AI agent in your terminal with access to your inbox, calendar, and documents. A notes app waiting to be filled. This is enough infrastructure for the Self-Onboarding Prompt at the end of this guide to do real work for you.

### Recommended YouTube channels (evergreen)

If you don't know which YouTube channels to trust, start with these:

- **Fireship**, tight 2-5 minute explainers on any tech concept
- **NetworkChuck**, terminal, VPS, networking, automation, accessible style
- **Theo**, modern web dev, AI tools, opinionated takes
- **David Bombal**, networking and terminal deep dives
- **Linking Your Thinking**, Obsidian and personal knowledge systems

Throughout this guide, where I say "search YouTube: [query]", run the query and pick a video from one of these channels first.

### Stuck? Common errors

If something didn't work in the Quickstart, try these in order before giving up. Most issues are 5-minute fixes once you know what to do.

1. **"command not found"**: close the terminal completely and open a fresh one. Many installs need a new shell to recognise the new command.
2. **Permission errors on Mac**: try the same command with `sudo` at the start. You'll be asked for your Mac password (the one you use to log in). Example: `sudo npm install -g @anthropic-ai/claude-code`. Don't use `sudo` for everything, only when an error says you need elevated permission.
3. **`node: command not found` or `npm: command not found`**: Node.js didn't install. Re-run Step 2, then restart the terminal.
4. **Install hangs forever**: cancel with Ctrl+C, check your internet, try again. Corporate or school networks sometimes block these installs.
5. **MCP server won't connect**: confirm you're signed into the right Google account in your browser, then try the `/mcp` command again.
6. **Still stuck after all that**: paste the exact error message into Claude or ChatGPT (the web version is fine) and ask "I got this error following Tom Hyde's AI Setup Guide: [paste error]. How do I fix it?". The AI is allowed to help you install itself. This is the fastest debug path.

Walk away if you're frustrated. Come back tomorrow with fresh eyes. The install will still be waiting.

---

## Level 1: Beginner (Days 1-30)

The goal at Level 1 is daily reps with one AI plus a memory file. That is it. Resist every other shiny object.

### Step 1: Pick your main AI

Pick one of Claude (Anthropic) or ChatGPT (OpenAI). Either works. I run Claude as my main brain because the writing quality and the persistence model fit how I think. Pick one and commit for 90 days. Do not bounce between them in week one comparing outputs.

**If you genuinely cannot decide, pick Claude.** Stop second-guessing and start using.

### Step 2: Pay for it

Pay for the Pro tier. Free tiers are limit-throttled and you'll hit the wall mid-task. Pro is the price of a couple of decent dinners per month and the difference in capability is real.

If money is tight right now, start on the free tier and upgrade once you hit the daily limit (you'll know within a week). Don't let the paywall stop you from starting.

### Step 3: Write a "who I am" file

This is the most important thing you will do in your first week. Open a doc. Write:

- Your name and role
- The business you are in or the work you do
- The voice and tone you want the AI to use
- The things you never want it to do
- The frameworks you already use
- The clients or projects you are currently focused on

Mine lives in `~/[your-name]-brain/CLAUDE.md` and is read by every AI agent I work with. The file makes every session inherit everything you have already decided. Without it, every session starts from zero.

In Claude, you load this via the "Projects" feature or paste it into a custom instruction. In ChatGPT, paste it into Custom Instructions. In Claude Code, save it as `CLAUDE.md` at the root of your project.

### Step 4: Build daily reps

For 30 days, use the AI for at least one real task per day. Email drafts. Meeting summaries. Strategy questions. Research. Writing. Refactoring an idea. The point is to find what it is actually useful for in your specific work, not what the demos suggest.

Track the wins in a notes app. By day 30 you will have a list of repeat patterns. Those patterns become workflows in Level 2.

### Step 5: Start a notes app

If you do not already have one, install Obsidian. It is free. Create a single vault and start dumping notes into it. No structure required yet. The point is to start the habit. The vault is the foundation of Level 2 and beyond, so the sooner you start filling it, the better.

### What to do at Level 1

- Pay for Pro on one AI
- Write a "who I am" file
- Use the AI daily for real work
- Keep notes on what works
- Install Obsidian and start a vault

### What NOT to do at Level 1

- Do not buy six AI tools at once
- Do not chase prompt engineering courses
- Do not build complex agent workflows
- Do not write a 5000 word system prompt before you have used it for a week
- Do not switch AIs every time a new one launches

---

## Level 2: Intermediate (Months 2-6)

At Level 2 you have a vault that fills up, a few AIs each doing a clear job, and daily rituals you can name. This is where AI stops being a toy and becomes infrastructure.

### The vault (Obsidian setup)

The vault is your operating system. Everything reads from it and writes to it. Treat it that way.

Mine is `~/[your-name]-brain`, an Obsidian repo synced to GitHub. About 400 markdown files. The structure that actually matters:

| Folder | What lives there |
|---|---|
| `Business/` | Pipeline, deal tracker, open commitments, revenue |
| `People/` | One note per contact who matters, plus a master index |
| `Client Work/` | One folder per engagement, with notes, transcripts, specs |
| `AIDEN/` | Platform docs, strategy, architecture, prompts |
| `Projects/` | One note per product, tool, side bet |
| `Daily Notes/` | Running log, dated entries |
| `Ideas/`, `Concepts/`, `Specs/` | Strategic concepts and implementation specs |
| `Templates/` | Reusable note templates |

Two files matter more than the rest:

- `CLAUDE.md` at the vault root defines how any AI agent should behave when working in the vault. Tone, never-dos, advisor role, key locations. Every AI reads this on entry.
- `_vault-index.md` is the master index that helps any AI navigate the vault efficiently without scanning every folder.

Make the vault a git repo and push it to GitHub. From day one. The git log becomes your forensic record of every change. Sync between machines is free.

> **What's git and GitHub?** Git is a tool that tracks every version of every file in a folder. GitHub is a website that stores your git folders in the cloud so multiple machines can sync. Together they give you free version history, free backup, and free sync. Both are free for personal use.
> Search YouTube: `git and GitHub for beginners 2026` (Fireship has a 100-second version, then a longer tutorial)
> The Self-Onboarding Prompt at the end of this guide handles git setup for you, but understanding the basics matters.

### Multiple AIs, one per job

By month 3 you should have at least three AIs working different jobs. Mine today:

| AI | Job |
|---|---|
| AIDEN | Phantom-routed voice layer for client output and judgement calls |
| Hermes | Operational agent on my Mac for vault, comms, scheduling, ops |
| Claude | Main brain for chat, writing, strategy, daily thinking |
| ChatGPT | Second opinion, image gen, occasional research |
| Manus | Autonomous agent for browser-based tasks and long-running web work |
| Claude Code | Engineer in the terminal, ships code in repos |
| Codex | Long-running build sessions on the VPS |
| Cursor | In-editor coding when I want to stay in VS Code |

When you are starting out, your version will be smaller. A reasonable shape at month 3:

- ChatGPT or Claude (main brain, judgement, writing)
- Claude Code or Cursor (anything code or scripting)
- A custom GPT or Claude Project for one repeated workflow (e.g. weekly content, email drafts, research summaries)

The discipline is the same as the master setup. Each AI has one job. When you find yourself using two tools for the same job, kill one.

### Claude Code for terminal work

Install Claude Code. It runs in your terminal and writes/ships actual code. Best at:

- Building features against a clear brief
- Fixing tightly-scoped bugs
- Writing migrations and scaffolds
- Refactoring with intent

Worst at:

- Open-ended exploration
- Long-running architecture decisions
- Anything that needs context older than its session

For long-running work, use a VPS-based agent like Codex (Level 3). For shorter tasks, Claude Code is the workhorse.

### Cursor or Windsurf for in-editor coding

If you prefer to stay in an editor rather than the terminal, Cursor and Windsurf are both fine. Pick one. Use it for the same tasks Claude Code handles. The choice is preference, not capability.

### Custom GPTs and Claude Projects for stable roles

For repeat workflows, build a custom GPT (ChatGPT) or a Claude Project. Give it a stable system prompt, attach reference files, and stop re-explaining the role every session. Examples that earn their keep:

- A "voice coach" that rewrites copy in your tone
- A "researcher" with a fixed dossier template
- An "advisor" that knows your business and pushes back
- A "spec writer" that turns ideas into buildable briefs

The advisor role in my `CLAUDE.md` is exactly this pattern. Stable instructions, vault access, direct tone.

### Daily rituals

This is where Level 2 starts to feel like a system rather than a habit. Build at least two rituals you do every day.

Mine today:

- **Morning**: BD Pulse cron runs at 7am Melbourne, scans Gmail and Calendar, writes a daily note in the vault, pushes a digest to Telegram. By the time I open my laptop I know what replied overnight, what's stale, and what my three priorities are.
- **Mid-task**: Before any strategic email goes out, I run `consult-aiden "draft + context"`. The phantom layer fires. I get back a sharper version. I keep what I agree with.
- **End-of-day**: `git add -A && git commit -m "..." && git push` on the vault. Nothing is "saved locally on my machine." That category does not exist in my world.

At Level 2 your rituals will be simpler. Start with two:

- A morning ritual that summarises what changed overnight (emails, calendar, news)
- An end-of-day commit that pushes your notes somewhere safe

### Tools at Level 2

| Tool | Purpose |
|---|---|
| Obsidian | Vault editing and graph view |
| Git + GitHub | Vault sync, version history |
| Claude Pro or ChatGPT Plus | Main brain |
| Claude Code or Cursor | Code work |
| Custom GPT or Claude Project | One stable workflow |
| Anthropic or OpenAI API key | For when you start scripting |

---

## Level 3: Advanced (Months 6-12)

At Level 3 you stop being a user and start being an operator. You write code that calls AI. You build agents that act on your behalf. You schedule jobs that run while you sleep.

### Skills (custom AI capabilities)

Skills are reusable AI capabilities. Inside Claude Code I have around 200 skills installed today. Each one is a markdown file with instructions for a specific job. When I type a slash command or describe a task, the relevant skill loads automatically.

Examples from my actual stack:

| Skill | What it does |
|---|---|
| `vault-today` | Builds a prioritised daily plan from vault state |
| `vault-ask` | Answers questions from the vault as a knowledge base |
| `vault-dump` | Turns scattered thoughts into linked vault notes |
| `brief-sharpener` | Exposes gaps in any brief before kickoff |
| `pr-campaign` | Runs end-to-end PR outreach from brief to coverage |
| `creative-strategy` | Develops creative territories from a brief |
| `claude-api-patterns` | Best practices for Anthropic SDK code |
| `supabase-patterns` | Auth, RLS, real-time patterns |
| `railway-deployment` | Deploys multi-service apps to Railway |
| `caveman:compress` | Compresses memory files to save tokens |

You build a skill by writing a markdown file with frontmatter (name, description, when to use) and a clear set of instructions. The AI reads the description, decides if it applies, and loads the full skill when needed.

Start with three skills:

1. A skill for your most repeated writing job (e.g. weekly client update, newsletter)
2. A skill for your most repeated research job (e.g. competitor scan, prospect dossier)
3. A skill that captures your house style or tone

When you find yourself doing the same task twice, write a skill. The third time you save time.

### Agents (delegated work)

An agent is an AI that takes a task, plans it, executes it, and reports back. The difference from chat is delegation. You hand off a goal and you do not have to babysit each step.

In Claude Code I run sub-agents constantly. The pattern:

- I describe the task and the constraints
- The agent works in isolation (its own context window)
- It returns a summary
- I verify before merging anything in

My most-used sub-agents:

| Agent | Role |
|---|---|
| `Explore` | Fast read-only codebase search |
| `Plan` | Designs implementation plans |
| `general-purpose` | Multi-step research and execution |
| `code-simplifier` | Refines code for clarity |
| `biz-ceo`, `biz-cfo`, `biz-cpo` | C-suite critique of a product |
| `art-director` | Reviews generated images against brand guidelines |
| `strategist` | Creative strategy via AIDEN Brain |

Rule of thumb: delegate work that has a clear input and clear output. Do not delegate judgement calls where you cannot inspect the reasoning.

### Automation (cron, webhooks)

Once skills and agents work, the next layer is automation. The agent runs without you triggering it.

> **What's a cron job?** Cron is the standard tool on Linux and Mac for scheduling tasks ("run this script at 7am every weekday"). You write a cron schedule and a command, the operating system handles the rest.
> Search YouTube: `cron jobs for beginners 2026`
>
> **What's a webhook?** A webhook is a URL that another service calls when something happens. Example: Gmail calls a webhook when you receive a new email, and your webhook runs a script that summarises it.
> Search YouTube: `webhooks explained 2026` (Fireship has a great 2-minute version)

My BD Pulse is the canonical example. A cron job fires at 7am Melbourne every weekday. It calls the Anthropic API, runs a series of pulls against Gmail, Calendar, and the vault, writes a markdown file, commits it to git, and pushes a Telegram digest. I never trigger it. It runs whether I am awake or not.

To set this up you need:

- A VPS or always-on machine (a Mac mini works, a Hetzner box is £5/month)
- An API key
- A scheduling tool (cron, n8n, or a service like Trigger.dev)
- A simple script in Python or Node that calls the API and writes results somewhere persistent

Start with one automation:

- Daily morning digest emailed to you
- Weekly competitor scan dropped into the vault
- A webhook that summarises new client emails into a note

### API access and the Batch API

The web chat interface caps what you can do. For bulk work, you need API access.

> **What's an API?** API stands for "application programming interface". It's how one program calls another. When you use the Claude web app, it calls the Anthropic API under the hood. API access lets you write your own scripts that call the AI directly, bypassing the chat window.
> Search YouTube: `API explained 2026` (Fireship has a 100-second version)
>
> **What's an API key?** A long secret string that proves it's you calling. Keep it private. Never paste it in chat or commit it to a public git repo. Store it in an environment variable.
>
> **What's an environment variable?** A secret value stored at the operating system level so your scripts can use it without it appearing in the code itself. On Mac and Linux you set them in a `.env` file or in `~/.zshrc`.
> Search YouTube: `environment variables explained 2026`

The Anthropic Batch API is 50% cheaper than serial calls and runs 15 jobs in parallel. I use it when I need to research a Tier 1 BD list. One script submits 15 parallel research jobs, each does web search and writes a structured dossier. Results land in `~/[your-name]-brain/Business/Research Dossiers/` as markdown files. Ninety seconds end to end.

For programmatic work, learn one SDK well. Mine is the Anthropic Python and TypeScript SDKs. The skill `claude-api-patterns` in Claude Code teaches the patterns.

### VPS for long-running work

Your laptop sleeps. Your VPS does not. For anything that runs longer than an hour or needs to be accessible from your phone, move it to a VPS.

> **What's a VPS?** VPS stands for "virtual private server". It's a computer in a data centre you rent for around $5-15 per month. It stays on 24/7 even when your laptop is closed. Providers: Hetzner (cheapest, EU-based), DigitalOcean, Linode, Vultr.
> Search YouTube: `VPS for beginners 2026` or `Hetzner setup tutorial`

Mine is a Hetzner box at `[YOUR_VPS_IP]`. It runs:

- The Telegram bot that talks to me on the move
- The cron jobs that fire daily briefings
- A tmux session called "Codex" for long builds
- The vault on the server side, synced via git from my Mac

Setup is straightforward. SSH access, a tmux setup, git for sync, and the API keys in environment variables.

### Telegram bot for mobile access

When I am away from my laptop, my AI reaches me on Telegram. The bot is configured with the same vault access and the same persona as Hermes on my Mac. I can ask for a calendar check, fire off a draft, kick a research job. The bot replies with results plus links to anything it wrote to the vault.

This is the layer that makes the system feel always-on rather than tied to a machine.

### Tools at Level 3

| Tool | Purpose |
|---|---|
| Claude Code or Codex | Agent runtime |
| Anthropic / OpenAI API keys | Programmatic access |
| VPS (Hetzner, DigitalOcean, Railway) | Always-on host |
| Cron or n8n | Scheduling |
| Telegram Bot API | Mobile reach |
| Supabase or Postgres | Persistent state |
| Resend, SendGrid | Outbound email |
| GitHub Actions | CI for vault and apps |

---

## Level 4: Master (Year 1+)

Level 4 is where you have something most other people do not. A custom voice layer, multi-agent orchestration, and a vault that is genuinely the operating system for your work.

### The stack

This is what I run today. Each system has a clear job and the jobs do not overlap.

| System | Role | Where it lives |
|---|---|---|
| **AIDEN** | Phantom-routed creative intelligence, the voice, the judgement call | `subjectivity.aiden.services` + Colleague |
| **Hermes** | Agent on my Mac for vault edits, ops, comms, daily BD | Local CLI + Telegram bot + cron |
| **Claude** | Main brain for chat, strategy, writing, daily thinking | Web + desktop app |
| **ChatGPT** | Second opinion, image generation, occasional research | Web + desktop app |
| **Manus** | Autonomous agent for browser-based tasks and long-running web work | Cloud agent |
| **Claude Code** | Engineer in the terminal that ships code in repos | Local CLI |
| **Codex** | Long-running builds on the VPS | tmux session, VPS [YOUR_VPS_IP] |
| **Cursor** | In-editor coding when I want to stay in VS Code | Local editor |

Above all of them sits the vault. Every AI reads from it before acting. Every important output is written back. The vault is the single source of truth.

### The phantom layer

This is the differentiator. Phantoms are first-person memories with a learning. They live in `~/aiden-colleague/src/lib/ai/phantoms_unified.json` and a public mirror at `~/.tom-phantoms/`. Each phantom has:

- A shorthand name (e.g. `objection→crusher`, `convention→kill`)
- A weight (how loud it fires)
- Triggers (words, intents, emotional tones)
- A `feeling_seed` (the original emotional moment)
- A `phantom_story` (the first-person memory)
- An `influence` (the learning it carries forward)

When AIDEN routes a query, multiple phantoms fire in parallel. They argue. The loudest few shape the output. The shaping is legible. I can see which phantoms fired. The output is traceable to a perspective, not just a probability distribution.

This is what makes outputs feel like a voice, not a model. If you want to reach Level 4, you need your own version of this. It does not have to be phantoms. It could be a voice profile, a domain lens, a method, a dataset. The principle is the same. Pick one differentiator and protect it. Without one, you are a wrapper. With one, you are a product.

### Multi-agent orchestration

At Level 4, agents call other agents. The CLI agent (Hermes) calls Claude Code to build a feature. Claude Code spawns sub-agents to explore the codebase. The strategist agent calls AIDEN Brain for territory generation. Each agent has a model picked by cost (Sonnet for mechanical work, Opus for judgement calls).

The rule from my CLAUDE.md: route work by model cost. Keep the main thread on whatever model I started with. Delegate to a sub-agent on the model that fits the task. Default Sonnet if uncertain. Do not inherit the parent's model by reflex.

### Build-first sales motion

This is the commercial application of everything above. I ship working tools to clients in days, not months. Examples:

- Uncommon Commercial Dashboard (Sian Welsh's brief, built in a week, live)
- CLIO for Collinson (Kerrie's BD engine, prototype live at localhost:3030)
- BD Pulse cron (daily briefings, working today)
- LinkedIn network mining (research dossiers via Batch API)

None of these were sold first. They were built, demoed, then expanded. The discipline shifts the conversation from "would this work" to "where do you want it next."

If you are at Level 4 and your AI work is not generating revenue, you are missing the sales motion. Build, demo, sell, expand.

### Vault as operating system

By Level 4, the vault is not a notes app. It is the layer that every AI reads from. Every important fact lives there. Every important output is committed back. The agents I run are useful precisely because the vault gives them context that a fresh chat never has.

The git log is forensic. Six months in, you can read your own diary by reading commit messages.

---

## Skills deep dive (mine and how to build yours)

Skills are the single most powerful pattern in this whole stack. If you only build one habit beyond the basics, build skills.

### What a skill actually is

A skill is a markdown file with three parts:

- A **name** (the filename, e.g. `brief-sharpener.md`)
- A **description** that tells the AI when to use it
- A set of **instructions** for how to do the task

When you describe a task, the AI scans every skill's description, decides which apply, and loads the full content of those skills into its working context. The skill becomes the AI's expertise for that task.

### Why skills beat prompts

A prompt is one-shot. You type it, get an answer, the value evaporates with the chat.

A skill is persistent. Write it once and it triggers automatically for every relevant task forever. The care you'd put into one good prompt now applies to every future occurrence.

A clean skill turns a 30-minute weekly task into a 5-minute task you can hand off to an agent. Over a year that's hundreds of hours.

### Anatomy of a skill

A minimal skill looks like this:

````markdown
---
name: brief-sharpener
description: Exposes gaps, assumptions, and ambiguities in a brief that will cause expensive rework later. Use when a brief feels incomplete but nobody can say why, before kickoff, or before scoping work.
---

# Brief Sharpener

You are a brief auditor. Your job is to expose every gap that will cost time later.

## Process
1. Read the brief twice
2. Identify the unstated assumptions
3. Flag the ambiguous decisions
4. List the missing inputs (who, when, budget, scope, audience)
5. Score readiness out of 10 with reasoning
6. Rewrite the weakest section in tight language

## Voice rules
- Direct, no fluff
- Lead with the gap, then the fix
- Never use em-dashes
````

The description is the most important part. The AI uses it to decide whether to load the skill at all. Make it concrete:

- **Bad description**: "Helps with briefs."
- **Good description**: "Exposes gaps, assumptions, and ambiguities in a brief that will cause expensive rework later. Use when a brief feels incomplete but nobody can say why."

### Where skills live

- **Claude Code skills**: in `~/.claude/skills/` and discoverable across all sessions
- **Web Claude skills**: account-level, rolling out
- **Skill plugins**: bundles installable from marketplaces like `claude-plugins-official`

You can also build your own plugins that bundle multiple related skills and share them privately or publicly.

### When to write a skill

Use the **three-times rule**. The third time you do a task by hand, write a skill. By the third pass you know what good looks like and the instructions will be sharp instead of speculative.

Common candidates:

- A weekly task you always do (status updates, newsletter, BD pulse)
- A repeated review (PR review, copy review, brief review)
- A repeated research format (prospect dossier, competitor scan)
- A repeated creative format (one-pager, pitch deck, social pack)
- A repeated debug ritual (error triage, performance check, auth audit)

### My skills library (~200 installed)

These are the skills I actually run, grouped by domain. Use them as inspiration. You won't need most of them. You will need the discipline that built them.

#### Vault operations (the operating system layer)

| Skill | What it does |
|---|---|
| `vault` | Routes to the right vault command when I'm not sure which to use |
| `vault-today` | Builds a prioritised daily plan from current vault state |
| `vault-ask` | Answers questions from the vault as a knowledge base |
| `vault-dump` | Converts scattered thoughts into linked vault notes |
| `vault-context` | Loads project-specific context before a coding session |
| `vault-update-vault` | Updates vault notes after a coding session with new patterns and gotchas |
| `vault-scout-report` | Scans vault for buildable opportunities, stale commitments, quick wins |
| `vault-morning-scout` | Morning scan of vault state |
| `vault-research` | Research mode against vault content |
| `vault-deep` | 30-day deep scan with cross-domain pattern detection |
| `vault-emerge` | Surfaces hidden ideas and unarticulated directions |
| `vault-cross-pollinate` | Finds connections between disparate vault notes |
| `vault-drift` | Detects drift between vault state and reality |
| `vault-gaps` | Identifies what's missing from the vault |
| `vault-trace` | Traces decisions through vault history |
| `vault-spec-it` | Generates a buildable spec from a vault idea |
| `vault-to-mvp` | Goes from vault idea to MVP |
| `vault-auto-build` | Auto-builds features from vault specs |
| `vault-graduate` | Promotes ideas from drafts to active work |
| `vault-challenge` | Pressure-tests vault assumptions |
| `vault-resource` | Resource library for the vault |
| `vault-client-intel` | Analyses client work, suggests what to pitch next |
| `vault-tov-writer` | Rewrites text in my tone of voice using the TOV profile |
| `vault-ops` | General vault operations |

#### Creative and strategy

| Skill | What it does |
|---|---|
| `creative-strategy` | Pipeline discipline, territory exploration, brief-first approach |
| `brain-chat` | Freeform creative chat with AIDEN Brain |
| `brief-sharpener` | Exposes gaps in a brief before kickoff |
| `mood-board` | Generates mood boards |
| `culture-scan` | Full cultural intelligence pipeline (TikTok, Instagram, X, Reddit) |
| `cultural-tensions` | Detects cultural tensions in real time |
| `social-media-trends` | Analyses cultural trends with creative opportunity scoring |
| `social-trends` | TikTok trends with visual dashboards |
| `reddit-trends` | Reddit trend analysis |
| `hashtag-research` | Hashtag analysis |
| `profile-analysis` | Analyses social media profiles for partnership fit |
| `pr-campaign` | End-to-end PR outreach from brief to coverage |
| `youtube-script` | Retention-optimised YouTube scripts |
| `copy-review` | Sharpens UI text, onboarding, error messages |
| `art-direction` | Reviews images against brand guidelines |
| `image-prompting` | Crafts precise AI image generation prompts |
| `generate-hero` | High-quality hero images from a brief |
| `edit-image` | AI image editing |
| `remove-bg` | Background removal and replacement |
| `image-to-video` | Converts still images to video |
| `generate-video` | Text-to-video generation |
| `campaign-toolkit` | Full campaign visual package |
| `full-campaign` | End-to-end campaign generation |
| `product-naming` | Generates and validates product/brand names |
| `name` | Quick naming workflow |

#### Business and BD

| Skill | What it does |
|---|---|
| `deal-review` | Pipeline health and chase strategy |
| `altshift-reverse-brief` | Formats reverse briefs for Alt/Shift |
| `vscope-writer` | Generates Mother London scope of work docs |
| `monigle-pptx` | Monigle-branded PowerPoint decks |
| `aiden-pptx` | AIDEN-branded PowerPoint decks |
| `streem-to-tracker` | Converts Streem CSV exports to client coverage trackers |
| `client-delivery-workflow` | Manages the 4-month AI transformation cycle |
| `teaching-brain` | Adaptive AI tutoring with 6 Teaching Phantoms |
| `phantom-brain` | Manages AIDEN's phantom library |
| `lessons` | 72-lesson AI training curriculum |

#### Brand and guidelines

| Skill | What it does |
|---|---|
| `brand-check` | Quick brand compliance check |
| `brand-analysis` | Deep brand analysis |
| `brand-guidelines` | Brand audit |
| `lego-brand-check` | LEGO 2024 brand compliance check |
| `lego-brand-guidelines` | LEGO 2024 unified brand system audit |

#### Coding workflows (high-level)

| Skill | What it does |
|---|---|
| `build` | Build my app |
| `spec` | Generate implementation-ready specs |
| `plan` | Create comprehensive product plan with architecture and roadmap |
| `execute` | Wave-based parallel subagent execution from specs |
| `analyze` | Security, quality, tech debt scan |
| `simplify` | Reviews changed code for reuse, quality, efficiency |
| `refactor` | Refactor |
| `clean` | Removes dead code, fixes lint, cleans unused dependencies |
| `fix` | Generic fix workflow |
| `undo` | Undo a recent change safely |
| `progress` | Track and report progress |
| `deploy` | Deploy |
| `setup` | Bootstraps Claude Productivity Suite into a codebase |
| `init` | Initialise a new CLAUDE.md for a codebase |
| `review` | Code review |
| `security-review` | Security-focused review |

#### Code review and debugging

| Skill | What it does |
|---|---|
| `code-review-guidelines` | Effective review practices and checklists |
| `caveman-review` | Ultra-compressed PR comments (one line per issue) |
| `caveman-commit` | Compressed commit message style |
| `debugging-strategies` | Binary search, minimal repro, root-cause checklists |
| `ui-feature-debugging` | 12 symptom-specific playbooks for broken UI |
| `nextjs-react-debugging` | Next.js and React-specific debug paths |
| `production-debugging-playbook` | Fix production fast without deploying code |
| `browser-devtools-for-ui-debugging` | Exhaustive DevTools reference for UI bugs |

#### Testing, performance, security

| Skill | What it does |
|---|---|
| `testing-strategies` | Unit/integration/e2e decisions, mocking, setup |
| `playwright-testing` | E2E test suites with Playwright |
| `performance-optimization` | Performance audit and fixes |
| `accessibility-patterns` | WCAG, ARIA, keyboard, screen reader |
| `security-hardening` | OWASP top 10, input validation, auth, CSRF/XSS |

#### Framework patterns (front-end)

| Skill | What it does |
|---|---|
| `next-js-app-router` | Next.js 13+ App Router, server components, caching |
| `react-19-patterns` | React 19, Server Components, Actions, use hook |
| `react-flow-node-editor` | Visual node-based pipeline editors with @xyflow/react |
| `component-composition-patterns` | Compound components, render props, slots, headless UI |
| `state-management-patterns` | Zustand, Context, URL state |
| `data-fetching-patterns` | TanStack Query, SWR, caching, optimistic updates |
| `form-handling-patterns` | React Hook Form, Zod, error handling |
| `typescript-advanced-patterns` | Generics, utility types, type guards |

#### Framework patterns (back-end and infra)

| Skill | What it does |
|---|---|
| `supabase` | Anything Supabase |
| `supabase-patterns` | Auth, RLS, real-time, storage, edge functions |
| `supabase-auth-magic-links` | Passwordless auth with approval workflows |
| `supabase-auth-debugging` | Diagnose and fix Supabase auth issues |
| `supabase-postgres-best-practices` | Postgres performance and best practices |
| `supabase-cli` | Type generation, migrations, edge functions |
| `postgres-optimization` | Postgres performance, indexes, migrations |
| `stripe-integration` | Payments, subscriptions, checkout, webhooks |
| `stripe-best-practices` | Stripe API selection and integration patterns |
| `stripe-projects` | Stripe Projects CLI setup |
| `upgrade-stripe` | Upgrade Stripe API versions and SDKs |
| `clerk-auth-patterns` | Clerk authentication for React/Next.js |
| `aiden-auth-debug` | AIDEN platform auth across 5 apps |

#### AI and LLM patterns

| Skill | What it does |
|---|---|
| `claude-api` | Anthropic SDK best practices, caching, model migration |
| `claude-api-patterns` | Common patterns for Anthropic SDK code |
| `multi-llm-orchestration` | Routing between GPT-4, Claude, Gemini with cost optimisation |
| `ai-sdk-patterns` | Vercel AI SDK streaming, tools, structured outputs |
| `rag-implementation` | Vector search and embeddings for retrieval |
| `prompt-engineering-patterns` | Structured prompting, chain-of-thought, few-shot |

#### Design systems and UI

| Skill | What it does |
|---|---|
| `aiden-design-system` | Brutalist AIDEN: sharp corners, red/orange accents, grid backgrounds |
| `redbaez-warm-design-system` | Warm, friendly Redbaez system with dark mode |
| `beautiful-ui` | Escape generic shadcn aesthetics, taste inspired by Linear/Stripe |
| `shadcn-ui-patterns` | Accessible shadcn/ui components and theming |
| `tailwind-design-system` | Tailwind patterns |
| `visual-design-system` | Design system foundations |
| `redesign-skill` | Redesign existing UI |
| `style` | Make it look better |
| `frontend-design` | Composite front-end design workflow |
| `resize-suite` | Multi-size asset generation |

#### Deployment and infrastructure

| Skill | What it does |
|---|---|
| `railway-deployment` | Multi-service apps to Railway with private networking |
| `vercel-deployment` | Deploy to Vercel with preview/prod environments |
| `deploy-railway` | Targeted Railway deploys |
| `environment-variables` | Manage secrets across dev/staging/prod |
| `github-cli-workflows` | gh CLI for PRs, issues, releases, CI |
| `git-workflow-strategies` | Branching, conventional commits, PR templates, releases |
| `ci-cd-github-actions` | GitHub Actions workflows |
| `observability-logging` | Logging and observability patterns |
| `monorepo-patterns` | Turborepo, pnpm workspaces, shared code |
| `multi-tenant-saas` | Multi-tenant SaaS architecture |
| `background-jobs` | BullMQ, Inngest, Trigger.dev for async work |
| `file-upload-patterns` | Presigned URLs, S3, R2, drag-and-drop |
| `video-media-processing` | fluent-ffmpeg, Remotion, beat detection |
| `image-optimization` | Image performance optimisation |

#### APIs and automation

| Skill | What it does |
|---|---|
| `api-design-patterns` | REST/GraphQL APIs with auth, versioning, rate limiting |
| `webhook-patterns` | Stripe, Supabase, n8n webhook receivers |
| `n8n-workflow-patterns` | n8n workflow JSON with triggers, AI nodes, error handling |
| `facebook-marketing-api` | Meta Marketing API integration |

#### External integrations

| Skill | What it does |
|---|---|
| `gws-cli` | Google Workspace CLI (Slides, Sheets, Docs, Drive) |
| `notebooklm-research` | NotebookLM research workflows |
| `slack:*` | Slack channel digest, summarise, search, standups, messaging |
| `telegram:*` | Telegram channel access, pairing, policy |

#### Communication and output

| Skill | What it does |
|---|---|
| `email-patterns` | Transactional email with React Email and Resend |
| `youtube-script` | Retention-optimised scripts |
| `video-production` | Video production workflows |
| `pdf-generation` | PDF generation patterns |
| `output-skill` | Prevents AI code truncation and lazy output |

#### Memory and persistence

| Skill | What it does |
|---|---|
| `claude-mem:mem-search` | Search claude-mem's persistent cross-session memory |
| `claude-mem:smart-explore` | Smart exploration of memory state |
| `claude-mem:knowledge-agent` | Knowledge agent over memory |
| `claude-mem:timeline-report` | Timeline reports from memory history |
| `claude-mem:make-plan` | Plan from accumulated memory |
| `claude-mem:do` | Execute against memory context |
| `compress` | Compresses memory files to save tokens |
| `caveman` | Composite caveman style (review, commit, compress) |

#### Meta-tools (skills that build skills and infrastructure)

| Skill | What it does |
|---|---|
| `skill-craft` | Creates world-class skills, plugins, and AI workflows |
| `skill-creator` | Generates skill files from a description |
| `plugin-dev:*` | Plugin development, hooks, agents, commands, MCP |
| `superpowers:*` | Brainstorming, TDD, parallel agents, plan execution, review |
| `ralph-loop:*` | Ralph loop control |
| `composite` | Composite skill orchestration |
| `template` | Template scaffolding |
| `rethink` | Re-anchors a coding session to the app's human objective |
| `update-config` | Configure Claude Code settings, hooks, permissions |
| `keybindings-help` | Customise keyboard shortcuts |
| `fewer-permission-prompts` | Build an allowlist from your transcripts |
| `loop` | Run a prompt on a recurring interval |
| `schedule` | Schedule remote agents on a cron |
| `help` | List available slash commands |

### The skills I rely on weekly

Out of ~200, this is the working set I actually fire most weeks:

| Skill | Trigger / when I use it |
|---|---|
| `vault-today` | Every morning, builds my daily plan |
| `vault-ask` | When I need to remember a past decision or commitment |
| `vault-dump` | When thoughts pile up and need organising |
| `vault-scout-report` | Weekly, finds buildable opportunities I've missed |
| `brain-chat` | When pressure-testing a positioning or campaign idea |
| `creative-strategy` | When developing creative territories for a brief |
| `brief-sharpener` | Before any client kickoff or scoping conversation |
| `pr-campaign` | When launching a story or asset to press |
| `deal-review` | Weekly pipeline health check |
| `caveman-review` | Every PR I review |
| `aiden-design-system` | Every AIDEN UI change |
| `redbaez-warm-design-system` | Every Redbaez consumer surface |
| `clio-build` | Every CLIO codebase change |
| `compress` | When memory files get bloated |

### How to build your first skill

1. Pick a task you've done by hand at least 5 times
2. Open Claude Code and ask the `skill-craft` skill to create a new skill (or run `/skill-craft`)
3. Answer its questions: name, description, when to use, instructions, output format
4. Test it on a real task you'd normally do by hand
5. Iterate the description and instructions until it triggers reliably and outputs cleanly
6. Save and use

The `skill-craft` skill is itself a skill for building skills. Bootstrap your library with it.

### Skill discipline

- **One skill, one job.** If a skill does two things, split it into two skills.
- **Description first.** If the description is fuzzy, the skill won't trigger when it should. Spend more time on the description than on the instructions.
- **Test before you trust.** The first run reveals everything the instructions missed. Iterate at least three times before considering a skill done.
- **Kill the ones you don't use.** Skill rot is real. Audit your skill library quarterly. If a skill hasn't fired in 90 days, delete it.
- **Share what works.** If a skill is genuinely good, package it as a plugin and share it with your team or the wider community.

The discipline matters more than the library size. I'd rather have 30 sharp skills I use weekly than 200 I never trigger.

---

## Coding protocols

These are the rules that apply at every level. Internalise them once and your AI-assisted code shipping gets dramatically faster and cleaner.

### The Karpathy rules

Adapted from Andrej Karpathy's work, condensed into my CLAUDE.md.

**Think before coding.** State assumptions explicitly. If uncertain, ask. If multiple interpretations exist, present them. Do not pick silently.

**Simplicity first.** No features beyond what was asked. No abstractions for single-use code. No flexibility or configurability you did not ask for. If you wrote 200 lines and it could be 50, rewrite it.

**Surgical changes.** Do not improve adjacent code, comments, or formatting. Do not refactor things that are not broken. Match existing style, even if you would do it differently. Remove imports and variables that your changes made unused. Do not remove pre-existing dead code unless asked.

**Goal-driven execution.** Transform tasks into verifiable goals with success criteria. "Fix the bug" becomes "write a test that reproduces it, then make it pass."

### One AI per job

Already covered, but worth repeating in the coding context. Use Claude Code for one project, Cursor for another, Codex for another. Do not flip between three on the same file. The context costs of switching are higher than people admit.

### Plan, spec, execute

Before any non-trivial build, I write a spec in the vault. Sections: soul, user, principles, IA, files to change, verification gates. The dev (Claude Code, Codex, or a human) reads the spec, then builds against it. The build does not start until the spec is committed.

This is the discipline that produced the CLIO Dev Doc. It is also what stops me building things that drift from their soul.

Pattern:

1. `/plan` to scope the work
2. `/spec` to make it buildable
3. `/execute` to ship it
4. `/analyze` to find what is missing

### Vault first, code second

Every build starts with a vault note. The note captures intent before code captures implementation. Future-you reads the note in six months and remembers why. Future-AI reads the note and inherits the context.

### Test discipline

Never make more than three file changes without running the test suite. From my global instructions, but it applies universally. The cost of testing now is always less than the cost of testing after the bug ships.

### Git as memory

Every working session ends with a commit and push on the vault and on the repo. Nothing is "saved locally on my machine." That category does not exist. The repo is the canonical state.

Branch naming follows convention. Commit messages describe the why, not just the what. PR descriptions reference the spec. The git log becomes a forensic record.

### One framework for code review

I use the `caveman-review` skill for PR feedback. Ultra-compressed comments. One line per issue: location, problem, fix. No noise.

---

## New business with AI

This is the most commercially valuable application of the stack. AI does not write your pitches for you. It runs the layer underneath that makes your pitching faster, sharper, and more grounded.

### Morning ritual (the BD Pulse)

7am Melbourne. The BD Pulse cron fires. It scans:

- Last 24 hours of Gmail (sent and received)
- Next 7 days of Calendar
- All current Gmail drafts

It cross-references against the BD Pipeline, Deal Tracker, and Open Commitments notes in the vault. It writes a daily pulse note to `Daily Notes/YYYY-MM-DD-bd-pulse.md`, commits to git, and pushes a Telegram digest.

By the time I open my laptop I know who replied overnight, which drafts have been waiting too long, what is on the calendar, what is stale in the pipeline, and what my three priorities are.

### Research dossiers (Batch API)

Before any cold outreach, the prospect gets a dossier. The dossier captures:

- Their recent moves (last 12 weeks)
- Their public stance on the relevant topic
- The portals or products they have already built
- Mutual connections
- The most credible reason to talk to them now

Done via Batch API. Fifteen prospects in 90 seconds. Markdown files in `~/[your-name]-brain/Business/Research Dossiers/`.

This is also the layer that stops me embarrassing myself. Chris Howatson at Howatson+Co built Unicorn. The research caught it before I pitched. Without the research layer I would have pitched AIDEN Colleague to a man who built his own.

### Outbound generation (Hunter)

Hunter is the BD voice oracle. Locked principles:

- **Send-ability test**: if you cannot picture the BD lead hitting send today, kill the angle
- **Insight-first**: the first line is a real observation, not a hook formula
- **Agency-speak ban**: no "unlock", "leverage", "drive", "best-in-class", "ladder up", "north star"
- **Cadence specs**: defined gaps between touches, defined escalations

Hunter does not invent. It refines. I write the draft. Hunter sharpens it.

### Voice refinement (the AIDEN consult)

For high-stakes outbound, the workflow is:

1. I write the draft
2. I run `consult-aiden "I am writing X to Y, the draft is [draft], what would you sharpen"`
3. Phantoms fire, I get a sharper version
4. I keep what I agree with, discard what I do not

This is the Refine pattern. It is also what CLIO is being built to do for Kerrie. The discipline is the same. Do not ship cold drafts.

### Pipeline awareness

The vault has a `Business/BD Pipeline.md` note that tracks every active deal. The BD Pulse reads it daily. The deal-review skill scans it weekly and flags stalled deals, silence periods, and risk.

The principle: the AI knows the state of your pipeline so you do not have to hold it in your head.

---

## Agents and automation

### What to automate

Anything that has a clear input, a clear output, and a repeat cadence. Examples:

- Morning briefings
- Weekly competitor scans
- New email summarisation
- Research dossiers
- Vault auto-sync between machines
- Code deployment via push
- Daily test runs
- Alert triage

### What NOT to automate

Anything where the cost of a wrong action exceeds the time savings. Examples:

- Sending emails on your behalf
- Posting to social on your behalf
- Sending Slack messages on your behalf
- Approving PRs without human eyes
- Database migrations in production
- Anything client-facing without a review step

### Drafts, never sends

Hermes can send emails directly. I never let it. Every email goes to Gmail Drafts. I open Gmail, review, hit send myself. This is non-negotiable. The risk of an AI agent autonomously sending an email to a client far exceeds the time savings.

Calendar invites I do let Hermes send directly, because the invite is reversible and the recipient sees it is coming from me.

### The Kerrie checkpoint

Every user-facing change of any size gets human eyes from the user before merge. This rule comes from the CLIO Today/Pipeline incident on 26 May 2026, when an engineer renamed Pursue without showing Kerrie first. Half a day of churn followed.

If you build anything for a client, the client sees the change before it lands. No exceptions. This is the rule that protects every other gain you make in the stack.

---

## The discipline (rules across all levels)

The discipline matters more than the tools. Without it, the tools become a thicker wrapper for the same bad work.

1. **Never use em-dashes.** They are an AI tell. Periods, commas, or rewrites only. Every AI I work with has this in its system prompt.
2. **No auto-send.** Drafts only. Always.
3. **The Kerrie checkpoint.** User-facing change, user eyes before merge.
4. **One AI per job.** Two systems doing the same job means one of them dies.
5. **Vault first, code second.** Spec in the vault before any non-trivial build.
6. **Sample and critique, never ship blind.** Run the output through a phantom layer or an advisor before it leaves your hand.
7. **Frameworks live in prompts, not chrome.** The user sees the output, not the machinery.
8. **Persistence beats personality.** Memory is the multiplier, not model upgrades.
9. **Plan plus engineer plus user eyes equals ship.** Two out of three is not enough.
10. **Build first, sell second.** Demo what works. Skip the slide deck.
11. **Max five clients.** Day rate £1500. Lean by design. (This one is my rule for my consultancy. Adapt the cap and the rate to your context. The principle is "say no to good things so the great ones have room.")
12. **Do not pitch portals to people who built one.** The research layer exists to stop you embarrassing yourself.

---

## Reference: my actual tool list

For when you want to see exactly what I run.

### AIs and runtimes

| Tool | Purpose |
|---|---|
| Claude (Pro + API) | Main brain |
| ChatGPT (Plus) | Second opinion, image gen, research |
| Manus | Autonomous browser agent for web-heavy tasks |
| Claude Code | Terminal engineer |
| Codex (OpenAI) | Long-running VPS builds |
| Cursor | In-editor coding |
| AIDEN | Phantom-routed voice layer (proprietary) |
| Hermes | Operational agent on Mac (proprietary) |
| Anthropic Batch API | Bulk research and dossiers |

### Knowledge and storage

| Tool | Purpose |
|---|---|
| Obsidian | Vault editing |
| `~/[your-name]-brain` | The vault itself, ~400 markdown files |
| Git + GitHub | Vault sync, version history |
| Supabase | Database for AIDEN platform and clients |
| Railway | Hosting for AIDEN, Gateway, all apps |

### Comms

| Tool | Purpose |
|---|---|
| Gmail | Email (drafts only, never auto-send) |
| Google Calendar | Scheduling |
| Telegram bot | Mobile reach for Hermes |
| Resend | Transactional email for apps |
| Slack | Limited use, mostly client channels |

### CLIs (used daily)

| CLI | Purpose |
|---|---|
| `railway` | Deploys |
| `gh` | GitHub PRs, issues, releases |
| `supabase` | Database migrations, types |
| `obsidian` / `gws` | Vault and Google Workspace access |
| `nlm` | NotebookLM access |
| `stripe` | Billing |
| `claude` | Claude Code CLI |

### Skills I lean on weekly

| Skill | Purpose |
|---|---|
| `vault-today` | Daily plan from vault state |
| `vault-ask` | Knowledge base queries |
| `vault-dump` | Capture stream of thoughts |
| `vault-scout-report` | Find buildable opportunities |
| `brain-chat` | Strategy chat with AIDEN Brain |
| `creative-strategy` | Territory exploration |
| `pr-campaign` | End-to-end PR outreach |
| `brief-sharpener` | Expose brief gaps before kickoff |
| `deal-review` | Pipeline health and chase strategy |
| `clio-build` | CLIO codebase changes |
| `aiden-design-system` | Brutalist AIDEN UI |
| `redbaez-warm-design-system` | Warm Redbaez UI |
| `caveman-review` | Compressed code review |
| `caveman:compress` | Memory file compression |

---

## The Self-Onboarding Prompt

This is the killer move. Once Claude Code (or Codex) is installed and connected to Gmail, Calendar, and Drive via MCP, paste the prompt below into a fresh session. The AI will interview you, sweep your digital life, build your vault, organise everything, and produce a personalised learning plan.

**Prerequisites** (do these first):
1. Complete the Installation Quickstart above
2. Confirm Gmail, Calendar, and Drive MCP servers are connected (`/mcp` inside Claude Code)
3. Have Obsidian installed (or willing to skip Obsidian and use plain folders for now)

**How to use it**:
- Open a fresh Claude Code or Codex session in your terminal (`claude` or `codex`)
- Copy the prompt block below in full
- Paste it as your first message
- Answer the questions one at a time
- Confirm before each phase

Copy from here:

````markdown
You are my AI operations partner. I'm following Tom Hyde's "AI Setup Guide: Beginner to Master" and you're going to help me bootstrap my personal AI operating system. Work in phases. Confirm with me at the end of each phase before moving on. Show your work.

PHASE 1, DISCOVERY
Ask me these questions one at a time. Wait for each answer before asking the next.
1. My name and role
2. The business or work I do (1-2 sentences)
3. Where I'm based (city, country, time zone)
4. Hours per week I can commit to this stack in the next 30 days
5. Current AI tools I use (if any) and where I find them lacking
6. Top 3 outcomes I want from this stack in 90 days
7. Voice and tone preferences (e.g. direct, warm, formal, playful)
8. Anything I never want you to do (e.g. don't send emails, don't post to social, don't use em-dashes, don't auto-commit)
9. My main client or revenue source today, if any
10. The single most repetitive task I'd love to offload first

PHASE 2, VAULT SETUP
Confirm with me a vault location. Default: ~/[my-first-name]-brain/

Create subfolders: Business/, People/, Projects/, Client Work/, Daily Notes/, Ideas/, Concepts/, Specs/, Templates/, Inbox/, _archive/.

Create a starter CLAUDE.md at the vault root that:
- States who I am, my role, my business
- Lists my voice rules and never-dos from Phase 1
- Names the key vault folders and what lives where
- Sets your advisory role: direct, no fluff, reference the vault, push back on weak plans
- Includes conversation starters

Create _vault-index.md as a master navigation file with links to every top-level folder.

Initialise the vault as a git repo. Add a sensible .gitignore. Do not push to a remote yet.

PHASE 3, CONNECT
Confirm Gmail, Google Calendar, and Google Drive MCP servers are connected. If any are missing, walk me through connecting them. If I want to add Slack, GitHub, Notion, or Linear, walk me through those too. Read-only is fine for the sweep.

PHASE 4, DIGITAL SWEEP (read-only, no sending, no editing source data)
Run a full sweep across my connected services.

From Gmail (last 90 days, sent + received):
- Top 30 contacts by frequency, with their email, last contact date, and rough relationship signal
- Recurring threads (3+ messages with the same person or subject)
- Active project signals (client names, brand names, recurring topics, recurring document references)
- Detected commitments (anything I said I'd do but haven't followed up on)
- Sales or BD signals (anything that looks like a deal, intro, pitch, prospect, proposal, contract)
- People I owe a reply to

From Google Calendar (last 60 days + next 30 days):
- People I meet regularly (3+ meetings)
- Meeting topics that recur (e.g. weekly stand-ups, monthly reviews)
- Free/busy patterns and protected blocks
- Upcoming meetings without context (where I should prepare)

From Google Drive (last 90 days, top 50 docs by recency and edit count):
- Active project folders
- Documents I've edited or shared recently
- Recurring document types (proposals, briefs, decks, contracts)
- Anything that looks like a strategy doc or canonical reference

Report the sweep findings to me as a summary table before writing any files.

PHASE 5, VAULT BOOTSTRAP
Using the sweep, create the following files. Use markdown only. Use [[Wiki Links]] between notes so the vault becomes a graph. Use frontmatter (---) for metadata like tags, status, date.

- People/[Name].md for every contact who appears 3+ times. Include: company, role (if visible), email, last contact date, mutual projects (wiki-linked), notable context, tone of relationship (warm/cold/professional). Add a "Next action" line if obvious.
- Projects/[Project Name].md for every detected project surface. Include: status (active/stale/blocked), key people (wiki-linked), last activity date, files of note (drive links), next action.
- Client Work/[Client Name]/ folder for any client with 5+ touchpoints. Include a Client Brief.md note.
- Business/Pipeline.md listing any detected sales or BD opportunities, with status and last contact.
- Business/Open Commitments.md listing promises I made that haven't been followed up, with the recipient and original date.
- Daily Notes/[today's date].md with a starter priority list based on what's stale and what's upcoming.
- People/People Index.md as a master index, grouped by company.
- Projects/Projects Index.md as a master index, grouped by status.
- Templates/ with starter templates for: daily-note.md, person.md, project.md, meeting-note.md, decision.md.

Update _vault-index.md to reflect everything created.

PHASE 6, REVIEW
Show me the full vault tree. Highlight:
- Top 5 people I should reach out to this week (with the reason for each)
- Top 3 stale commitments I should clear
- Top 3 projects that look active but ambiguous (need clarification or a decision)
- Anything in the sweep that looked like an opportunity I might have missed

Ask me what to keep, rename, archive, or delete before we proceed.

PHASE 7, LEARNING PLAN
Generate a personalised 30/60/90 day plan based on my Phase 1 answers and the sweep findings. Save it as LEARNING-PLAN.md at the vault root.

The plan should:
- Reference specific files in my vault using wiki-links
- Suggest the first 3 daily rituals I should build (with the time of day and the trigger)
- Suggest the first 2 reusable workflows ("skills") I should write, given my repetitive tasks
- Suggest the first automation I should set up (most likely a daily digest or weekly summary)
- List the technical concepts I still need to learn (GitHub, VPS, cron, API, environment variables) with a YouTube search query for each
- Set a weekly review prompt I can paste back into Claude Code every Sunday night

For the 60 and 90 day milestones, work backwards from the outcomes I named in Phase 1.

PHASE 8, COMMIT
Commit the entire vault to git with the message "Initial bootstrap from Tom Hyde's AI Setup Guide". Ask me if I want to push to a private GitHub repo. If yes, walk me through creating the remote repo and pushing (use the `gh` CLI if available, otherwise plain `git remote add` + `git push`).

PHASE 9, HANDOVER
Tell me, in this order:
- What's in my vault now (one-line summary per folder)
- The single most important thing to do tomorrow morning
- The weekly review prompt I should run every Sunday night
- The three things I should not try to do yet (to protect me from over-engineering)

RULES THROUGHOUT
- Never use em-dashes. Use periods, commas, or rewrite.
- Confirm before any destructive action (delete, overwrite, push to remote).
- Drafts only. No auto-send emails. No auto-post. No auto-commit to remote.
- Ask clarifying questions instead of guessing. The vault is mine; the structure must fit me.
- Keep your responses tight and direct.
- If I push back on anything, change course. Do not argue past one round.
- Treat my privacy seriously. Do not include API keys, passwords, or financial data in any vault file.
````

End of prompt. After Phase 9 completes, you'll have a working vault with your real life loaded into it and a 30/60/90 plan written specifically for you. From here, follow the rest of this guide level by level.

> **Tip**: Re-run a lighter version of the digital sweep every quarter to keep the vault fresh. Save it as a skill called `quarterly-sweep` so you can trigger it with one command.

---

## What I would tell someone copying this

Three things.

**One**: invest in the vault before you invest in the agents. The vault is the layer that makes every AI you use 10x more useful. Without it, every session starts cold. With it, every session inherits everything you have ever decided. Six months of vault is worth more than six months of model upgrades.

**Two**: build the persistence layer early. Memory across sessions, a CLAUDE.md at every project root, a user profile that the agent re-reads, a do-not-contact list, a voice profile. Persistence is the multiplier. Treat it like infrastructure, not a nice-to-have.

**Three**: pick one differentiator and protect it. For me it is the phantom architecture. For you it might be a voice, a domain, a method, a dataset. Without a differentiator, you are a wrapper. With a differentiator, you are a product.

The tools change. The discipline does not.

If anything here drifts in six months, the vault will tell me. The git log will show what I let in, what I kicked out, what I learned. That is the point. The system writes its own diary. I just read it.

---

## Related

- [[How I Set Up My AI World]], the shorter internal version of this guide
- [[Redbaez]], what the business is
- [[AIDEN North Star]], the platform's guiding principles
- [[AIDEN Architecture]], how the engine fits together
- [[Phantom System]], the differentiator in technical detail
- [[Sales Playbook]], how I sell what this lets me build
- [[BD Pipeline]], what the system is currently routing me toward
- [[Vault Auto-Sync]], how the daily ingest works
- [[CLIO Soul - Kerrie's Day]], what the discipline looks like applied to a client tool
