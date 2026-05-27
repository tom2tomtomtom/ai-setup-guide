import type { Milestone, MilestoneId } from './types'

export const MILESTONES: Milestone[] = [
  {
    id: 'mindset',
    number: 1,
    title: 'Mindset',
    oneLiner: 'Four ideas to get into your head before you spend a penny.',
    prereqs: [],
    estMinutes: 10,
    steps: [
      {
        id: 'memory-beats-iq',
        title: 'Memory beats IQ',
        body: `The AI that remembers what you agreed last week beats the smarter one that starts cold every time. Persistence is the multiplier. A mediocre model with deep memory of you and your work outperforms a frontier model that has to be re-briefed every session.

Plan for memory from day one. You will write a short "who I am" file in Level 1, and the AI will read it on every session. That single file is worth more than upgrading models for a year.`,
        estMinutes: 2,
      },
      {
        id: 'one-ai-per-job',
        title: 'One AI per job',
        body: `Do not collect AIs. Collect jobs, then assign one AI to each job.

When two systems start doing the same job, one of them dies. Hoarding tools is the most common mistake at every level. Your job for now: pick one main AI and use it for 90 days.`,
        estMinutes: 2,
      },
      {
        id: 'stop-chatting-systematize',
        title: 'Stop chatting, start systematizing',
        body: `A conversation is a single use. A system is reusable.

Every time you find yourself typing the same context into a chat for the third time, that context belongs in a file the AI reads automatically. The goal is to build infrastructure, not to have better conversations.`,
        estMinutes: 2,
      },
      {
        id: 'build-then-sell',
        title: 'Build, then sell',
        body: `Ship a small working thing first. Show it. Refine.

This guide is built around small wins that compound. Do not architect the dream stack on paper before you have anything working. Build a small workflow, use it for a week, then expand.`,
        estMinutes: 2,
        checklist: [
          { id: 'read-all-four', label: "I have read all four ideas and I am ready to move on" },
        ],
      },
    ],
  },
  {
    id: 'day-1-win',
    number: 2,
    title: 'Day 1 Win',
    oneLiner: 'Get one real win in your browser. No install, no terminal, no money.',
    prereqs: [],
    estMinutes: 30,
    steps: [
      {
        id: 'open-claude',
        title: 'Open Claude in your browser (5 min)',
        body: `Go to **[claude.ai](https://claude.ai)** in your browser. Sign up with your email. The free tier is enough for today. You can upgrade later.

This guide is Claude-only. Anthropic's writing quality, memory, and integrations are what make the rest of the stack work. Pick one tool and learn it deeply.`,
        estMinutes: 5,
        checklist: [
          { id: 'signed-up', label: 'I have signed up at claude.ai and I am logged in' },
        ],
      },
      {
        id: 'paste-who-i-am',
        title: 'Paste this as your first message (5 min)',
        body: `Copy the block below. Edit the parts in [brackets] to match you. Paste it as a fresh message.

\`\`\`
You are my AI work partner. Before we begin, here's who I am.

- Name: [your name]
- Role: [what you do]
- Business or focus: [1-2 sentences about your work]
- Voice: direct, plain English, no jargon
- Never use em-dashes. Use periods, commas, or rewrite.
- Push back if my plan has a gap. Do not just agree with me.

When I give you a task, do it directly. Skip the preamble. If you need clarification, ask one specific question.

Confirm you have that, then wait for my first task.
\`\`\`

The AI will reply. That reply is the first time you will feel the difference between a chatbot and a work partner.`,
        estMinutes: 5,
        checklist: [
          { id: 'pasted-intro', label: 'I pasted my intro and got a confirmation reply' },
        ],
      },
      {
        id: 'do-one-real-task',
        title: 'Do one real task (15 min)',
        body: `Pick something from your actual day. Not a test prompt. A real thing. Examples:

- Paste an email you need to reply to and ask the AI to draft a response in your voice.
- Paste meeting notes and ask for a summary plus the three follow-up actions.
- Describe a decision you are stuck on and ask the AI to argue both sides.
- Paste a long article and ask for the takeaways in five bullets.

Whatever you pick, the answer should feel useful enough that you keep the output, not throw it away.`,
        estMinutes: 15,
        checklist: [
          { id: 'real-task-done', label: 'I did one real task and kept the output' },
        ],
      },
      {
        id: 'decide-continue',
        title: 'Decide (5 min)',
        body: `If that felt useful, keep going. Tomorrow, do another real task. After a week of daily reps, upgrade to a paid plan and continue to the next level.

If it felt useless, your prompt was probably too short or too generic. Try again tomorrow with more context: who is the audience, what is the goal, what tone, what format. AI is a tool that gets better the more you tell it.

You now have a free AI account with your context loaded. A first real task done. No software installed, no terminal opened, no money spent.`,
        estMinutes: 5,
      },
    ],
  },
  {
    id: 'know-claude',
    number: 3,
    title: 'Know Claude',
    oneLiner: 'Map the full surface: surfaces, features, models, plans.',
    prereqs: ['day-1-win'],
    estMinutes: 20,
    steps: [
      {
        id: 'the-surfaces',
        title: 'The surfaces',
        body: `You can talk to Claude through five different places. Same brain underneath, different reach.

- **claude.ai** (web): your daily home, has Projects, Artifacts, Research
- **Claude Desktop** (Mac + Windows app): the web version sitting next to your other apps
- **Claude Mobile** (iOS + Android): voice and photo input on the move
- **Claude Chrome** (extension): Claude reading the page you are looking at
- **Claude Code** (terminal CLI): coding and agent work, covered in Quickstart

Start with the web. Add Desktop within a week so it sits next to your other apps. Pick one favourite by day five.`,
        estMinutes: 4,
      },
      {
        id: 'the-features',
        title: 'The features',
        body: `Six things you should know about by name:

- **Chats**: a new conversation each time, default for one-off questions
- **Projects** (Pro+): persistent workspaces with their own instructions and uploaded files. The biggest unlock when you upgrade.
- **Coworker** (Pro+): Claude spawns parallel sub-agents for complex tasks
- **Skills**: reusable instruction sets that load on demand
- **Connections**: Claude reaches into your other apps. In Desktop and Web open **Settings → Connectors**. In Claude Code run the slash-mcp command. Available connectors include Gmail, Google Calendar, Google Drive, Slack, GitHub, Figma, Supabase, Context7 (documentation lookup), and more.
- **Research** (Pro+): deep multi-source research with citations
- **Artifacts**: code, docs, diagrams rendered inline with version history
- **Memory**: stable facts Claude remembers across sessions`,
        estMinutes: 4,
      },
      {
        id: 'the-models',
        title: 'The models',
        body: `Claude has three families. The web picks for you. In code work you choose explicitly.

- **Opus**: top tier for judgement, hard reasoning, architecture decisions
- **Sonnet**: the workhorse for daily writing, code, most tasks
- **Haiku**: fast and cheap for classification, filtering, bulk work

The rule: default Sonnet. Switch to Opus when the task needs real judgement. Use Haiku for volume.`,
        estMinutes: 3,
      },
      {
        id: 'the-plans',
        title: 'The plans',
        body: `Three plans. Most people end up on Pro within a week.

- **Free**: limited daily messages, fine for Day 1, throttles fast
- **Pro** (about $20/month): more messages, Projects, Research, Artifacts, Coworker, all models. The default plan.
- **Max** (about $100 or $200/month): much higher limits, longer context, priority access. For heavy users and people building on Claude Code.`,
        estMinutes: 3,
        checklist: [
          { id: 'know-surfaces', label: 'I know the five surfaces of Claude' },
          { id: 'know-features', label: 'I know what Projects, Skills, Connections, and Research do' },
          { id: 'know-models', label: 'I know the three models and when to use each' },
        ],
      },
    ],
  },
  {
    id: 'core-features',
    number: 4,
    title: 'Become Good at Claude',
    oneLiner: 'Install every surface and learn every feature with hands-on examples.',
    prereqs: ['know-claude'],
    estMinutes: 180,
    steps: [
      {
        id: 'install-claude-desktop',
        title: 'Install Claude Desktop and pin it',
        body: `Go to **[claude.ai/download](https://claude.ai/download)** and install Claude Desktop for your operating system. Mac and Windows both supported.

After installing:

1. Open Claude Desktop. Sign in with the same account as the web.
2. **Mac**: drag the Claude icon to your Dock. Right-click → Options → Keep in Dock.
3. **Windows**: right-click the taskbar icon → Pin to taskbar.
4. Set a global keyboard shortcut to open it. Mac: System Settings → Keyboard → Keyboard Shortcuts → App Shortcuts → add one for "Claude". Windows: right-click the shortcut → Properties → Shortcut key.

**Why this matters**: Claude Desktop has the same brain as the web but feels integrated. You can drop screenshots, paste images, drag in PDFs, and call it without opening a browser tab. From now on, Desktop is your daily home for Claude.`,
        estMinutes: 8,
        checklist: [
          { id: 'desktop-installed', label: 'Claude Desktop is installed and signed in' },
          { id: 'desktop-pinned', label: 'Pinned to Dock or taskbar' },
          { id: 'desktop-shortcut', label: 'Global keyboard shortcut set (optional but worth it)' },
        ],
      },
      {
        id: 'install-claude-mobile-chrome',
        title: 'Install Claude on mobile and Chrome',
        body: `Two more surfaces, ten minutes total.

**Claude on mobile** (iOS or Android): search "Claude" in the App Store or Play Store, install, sign in with the same account.

What mobile is best for:
- **Voice capture**: tap the mic, talk for a minute, get a structured response.
- **Photo input**: take a photo of a whiteboard, a menu, a contract, a sign. Claude reads it.
- **Quick decisions on the move**: "Help me decide between X and Y given my priorities."
- **Continuing chats from desktop**: any conversation syncs across surfaces.

**Claude Chrome extension** (early access at the time of writing): if available in your region, install from the Chrome Web Store. The extension lets Claude:
- Read the current web page without you copying and pasting
- Summarise long articles or research papers
- Pull structured data from a page (companies, prices, dates)
- Suggest replies inside Gmail and other web apps

If the extension is not yet available where you are, skip and come back later. It's not blocking.`,
        estMinutes: 10,
        checklist: [
          { id: 'mobile-installed', label: 'Claude mobile app installed and signed in' },
          { id: 'voice-tried', label: 'I tried voice capture at least once' },
          { id: 'chrome-installed', label: 'Claude Chrome extension installed (if available)' },
        ],
      },
      {
        id: 'master-chats',
        title: 'Master Chats: when fresh, when to continue',
        body: `A new chat starts fresh. A continued chat keeps context. Choose wisely.

**Start a fresh chat when**:
- The topic is unrelated to what came before
- The previous chat got long and Claude started missing details
- You want to test a clean prompt without conversation drift

**Continue an existing chat when**:
- You're iterating on the same piece of work (a draft, a plan, a strategy)
- You've built useful context Claude is referring back to
- You're refining an Artifact across multiple turns

**Six chat patterns worth using today**:

1. **The first-pass draft**: paste raw notes or a brief, ask "draft this in my voice". Iterate.
2. **The pressure test**: paste your plan, ask "what's the weakest assumption here? Steelman three objections."
3. **The decision matrix**: describe the decision, ask Claude to lay out the options as a table with criteria you care about.
4. **The thinking partner**: "I'm trying to decide whether to [X]. Help me think through it. Ask me one question at a time."
5. **The summariser**: paste a long transcript or article, ask for the takeaways in five bullets plus the three questions it raises.
6. **The translator**: take something written for one audience, ask Claude to rewrite it for another (technical to plain, formal to casual, long to short).

Run at least three of these today against real work. The point is muscle memory.`,
        estMinutes: 15,
        checklist: [
          { id: 'tried-three-patterns', label: 'I ran at least three chat patterns against real work' },
        ],
      },
      {
        id: 'projects-personal-voice',
        title: 'Build your first Project: Personal Voice',
        body: `Projects are the single biggest unlock when you upgrade to Pro. Each Project has its own instructions, uploaded reference files, and a chat history scoped to that context.

**Build Personal Voice now**:

1. In Claude (web or desktop), click **Projects** in the sidebar. Click **New project**.
2. Name it **Personal Voice**.
3. In **Custom instructions**, paste this and edit the brackets:

\`\`\`
You are my writing partner. Every reply must sound like me.

About me: [your name, role, business in two sentences]
Voice: direct, plain English, no jargon, no em-dashes
Banned phrases: leverage, unlock, best-in-class, ladder up, north star
Format: short paragraphs, no headings unless I ask for them

Process for any draft request:
1. Ask me one clarifying question if the audience or goal is unclear
2. Draft in my voice
3. After the draft, tell me which line you're least sure about so I can rewrite it
\`\`\`

4. **Upload 5 samples** of your past writing: emails, posts, internal memos, anything that sounds like you. Use **Project files** → **Upload**.
5. Test it. Open a chat inside the Project, paste an email you need to reply to, and ask for a draft.

From now on, anything that should sound like you starts here.`,
        estMinutes: 15,
        checklist: [
          { id: 'voice-project-instructions', label: 'Custom instructions written and saved' },
          { id: 'voice-project-samples', label: '5 writing samples uploaded' },
          { id: 'voice-project-tested', label: 'I tested it on a real draft' },
        ],
      },
      {
        id: 'projects-four-more',
        title: 'Build 4 more starter Projects',
        body: `Build these one at a time over the next few days. Each one earns its keep within a week.

**Daily Operator**
- Instructions: "You are my morning operator. Read my calendar, check my inbox for anything urgent (using the Gmail and Calendar connectors), then tell me my three priorities for today in plain language. Push back if my priorities look reactive."
- Files: your CLAUDE.md, current quarter goals, list of active clients with status

**Research Companion**
- Instructions: "You are my research analyst. Every output follows this template: TL;DR (3 lines) / Background / Key findings (numbered) / Open questions / Sources. Cite everything. Flag anything you're unsure about."
- Files: any past research dossiers you've written, your industry context, common analyst frameworks you use

**Client [Name]** (build one per active client)
- Instructions: "You are my account lead for [client]. Reply to anything in their tone, with their context, and following the principles we agreed: [paste]. Never invent metrics or commitments."
- Files: their brief, voice samples (their writing not yours), scope, project status, key people

**Inbox Coach**
- Instructions: "You triage forwarded emails. For each, tell me: 1) the ask in one sentence 2) the urgency (now / today / this week / can wait) 3) a draft reply in my voice 4) any commitment I'd be making by sending it."
- Files: your CLAUDE.md, your common reply templates, your standing rules (e.g. "never agree to free pitches")

Build these as you need them, not all at once. One a day is fine.`,
        estMinutes: 30,
        checklist: [
          { id: 'daily-operator', label: 'Daily Operator project built' },
          { id: 'research-companion', label: 'Research Companion project built' },
          { id: 'client-project', label: 'At least one Client project built' },
          { id: 'inbox-coach', label: 'Inbox Coach project built' },
        ],
      },
      {
        id: 'skills-install-and-write',
        title: 'Skills: install and write your first',
        body: `A skill is a small instruction set Claude loads on demand. They live mostly inside Claude Code (the terminal version) but the web is starting to support them too.

**For now, in the web**: open any chat and try the slash menu. Type \`/\` and see what's available. Anthropic ships starter skills like \`/summarise\` and \`/brainstorm\`.

**Inside Claude Code** (terminal): you have access to plugin marketplaces with hundreds of skills.

**Install your first 3 plugins** in Claude Code:

\`\`\`
/plugins install caveman
/plugins install superpowers
/plugins install supabase
\`\`\`

What they give you:
- **caveman**: ultra-compressed code reviews and commits. The reviews are one line per issue.
- **superpowers**: structured workflows like brainstorming, TDD, plan execution.
- **supabase**: full Supabase agent skill set (auth, RLS, migrations) if you build with Supabase.

**Write your first skill**:

In Claude Code, run \`/skill-craft\` and answer the prompts. A skill is just a markdown file with a frontmatter description and instructions. Build one for the most repetitive thing you do.

Example skills you might write:
- \`email-in-my-voice\`: takes a forwarded email plus light context, drafts a reply in your tone
- \`meeting-to-actions\`: takes notes or a transcript, returns a summary plus 3-5 action items with owners and dates
- \`daily-plan\`: reads calendar, inbox, priorities, returns a focused plan for today
- \`pitch-prep\`: builds a one-pager on a prospect using their public info and your sales angle

The three-times rule: the third time you do something by hand, write a skill.`,
        estMinutes: 25,
        commands: [
          {
            label: 'Install three useful plugins (inside Claude Code)',
            variants: {
              default: '/plugins install caveman\n/plugins install superpowers\n/plugins install supabase',
            },
            expectedOutput:
              'Each plugin installs and the skills become available. Type / in your next message to see new options.',
          },
          {
            label: 'Bootstrap your first skill',
            variants: {
              default: '/skill-craft',
            },
            expectedOutput:
              'Claude walks you through name, description, when-to-use, and instructions. Saves the skill to ~/.claude/skills/[name]/SKILL.md',
          },
        ],
        checklist: [
          { id: 'plugins-installed', label: 'At least 2 plugins installed' },
          { id: 'first-skill-written', label: 'My first skill is written and saved' },
          { id: 'first-skill-fired', label: 'I triggered the skill on a real task and it worked' },
        ],
      },
      {
        id: 'connect-gmail',
        title: 'Connect Gmail and try 6 prompts',
        body: `Connecting Gmail to Claude is the single highest-leverage thing you can do for your inbox. Read access only, you stay in control of sending.

**In Claude Desktop or Web**, Connections live in settings. The exact path:

1. Open Claude Desktop (or claude.ai in your browser).
2. Click your profile icon (bottom-left on Web, top-right on Desktop) → **Settings**.
3. Click **Connectors** (sometimes labelled **Connections**, sometimes under **Integrations**).
4. Find **Gmail** in the list. Click **Connect**.
5. A browser tab opens. Sign in with your Google account, authorise read access, come back.
6. Gmail is now available in any chat. Try a prompt below.

> **In Claude Code (terminal)** the same connectors are available via the \`/mcp\` command. Same connector underneath, different surface. If you already wired Gmail via Claude Code in the Installation Quickstart, you can skip the Web/Desktop connect step. If not, do it here.

**Six prompts to run today**:

1. "Find every email I haven't replied to from a director-level person or higher in the last 14 days. Show sender, subject, days waiting, and a one-line summary of what they're asking."
2. "Summarise every email from [client name] in the last 30 days into a one-page client status: open threads, decisions made, things I promised, things they promised."
3. "Show me threads where I made a promise but haven't followed up. Group by recipient. For each, suggest a one-line nudge in my voice."
4. "Find any emails about [topic] across all time. Build a timeline of how my thinking on this evolved."
5. "Draft replies to the three most urgent unread emails in my inbox. Save as drafts in Gmail. Do not send."
6. "Scan the last 90 days for any thread that smells like a sales opportunity. Surface anyone who asked about pricing, capacity, or working with me."

**Privacy and discipline**:
- Read-only by default. Drafts only when you ask. Never auto-send.
- Revoke any time in Google account → Security → Third-party apps with account access.
- For Claude Pro and Max, your data is not used for training.`,
        estMinutes: 20,
        checklist: [
          { id: 'gmail-connected-web', label: 'Gmail connected in Claude Desktop or Web (Settings → Connectors)' },
          { id: 'ran-three-gmail', label: 'I ran at least 3 of the 6 prompts and got useful output' },
        ],
      },
      {
        id: 'connect-calendar-drive',
        title: 'Connect Calendar and Drive',
        body: `Same pattern as Gmail. Open **Settings → Connectors** in Claude Desktop or Web, then connect:

- **Google Calendar** (read events, suggest meeting times)
- **Google Drive** (read and search documents)

Each one opens a browser tab, you authorise, you come back. Two minutes per connector.

> If you're on Claude Code instead, run \`/mcp\` and add the same connectors there. The connectors are the same product, the access path is the only difference.

**Once Calendar is connected, try these**:

1. "What do my next two weeks look like? Where are the gaps for deep work?"
2. "Find every meeting with [person] in the last six months. For each, summarise what we discussed and any commitments either side made."
3. "Suggest five 90-minute windows next week for focused build time, avoiding back-to-back meetings."
4. "Which meetings this week am I going into without enough context? For each, what should I prep?"
5. "Tomorrow's first meeting: pull together everything you can from my inbox, drive, and past calendar entries to brief me."

**Once Drive is connected**:

1. "Find every document I've shared with [client] in the last 90 days."
2. "Search Drive for documents about [topic]. Rank them by recency and relevance."
3. "Summarise [document name] and pull out the three open questions left in the comments."
4. "Find any strategy or planning docs I've worked on in the last quarter. Build me a one-page synthesis of what I was thinking."
5. "Compare these two proposals (paste filenames). Where do they overlap, where do they conflict?"

**The combined power**: once Gmail, Calendar, and Drive are all connected, you can ask things like "Brief me on tomorrow's 9am: pull the latest emails from this client, our last meeting notes, and any docs we've shared." That single prompt would have taken 20 minutes. Now it's 30 seconds.`,
        estMinutes: 15,
        checklist: [
          { id: 'calendar-connected', label: 'Google Calendar connected' },
          { id: 'drive-connected', label: 'Google Drive connected' },
          { id: 'combined-brief-test', label: 'I tried a combined prompt that uses Gmail + Calendar + Drive together' },
        ],
      },
      {
        id: 'connect-the-rest',
        title: 'Connect the rest: Slack, GitHub, Figma, Supabase, Context7',
        body: `Gmail, Calendar, and Drive are the daily three. Add the rest as you actually need them. Each one takes about two minutes from **Settings → Connectors** in Claude Desktop or Web (or \`slash-mcp\` in Claude Code).

**Context7** (always worth installing): pulls current documentation for any library, framework, SDK, or CLI tool. Try this: "Use Context7 to fetch the latest Anthropic SDK docs and write me a streaming chat example." Better than guessing from training data.

**Slack**: read channels and threads, draft messages, search history. Try this: "Summarise the last two weeks of the #product channel into a one-page brief for someone returning from leave."

**GitHub**: read repos, issues, PRs, file diffs. Try this: "Read the open PRs on my main repo, prioritise them by risk and review effort, and tell me which to look at first."

**Figma**: read design files, copy variables, extract code-connect mappings. Try this: "Open this Figma file (paste URL), describe the design system in plain language, and suggest the Tailwind tokens that would match it."

**Supabase**: list tables, run queries, apply migrations, fetch logs. Try this: "List my Supabase tables, pick the one with the most rows, and tell me about its schema and any RLS policies."

**Other connectors worth knowing**:
- **Notion**: read pages, search workspaces, write back
- **Linear**: read issues, project state, sprint plans
- **Stripe**: payment and subscription state (read-only in most setups)
- **Microsoft 365**: Outlook, Teams, OneDrive (if you live in the MS ecosystem)
- **NotebookLM**: pull research notebooks into context

**Connection hygiene**:
- Only connect what you use. Each connector grants real access.
- Revoke unused connectors monthly. Go to Settings → Connectors → Disconnect.
- Read-only is the default. Write actions (sending Slack, opening a PR) need explicit per-action confirmation.
- For sensitive workspaces, use a separate Claude session or browser profile.`,
        estMinutes: 20,
        checklist: [
          { id: 'context7-connected', label: 'Context7 connected (recommended)' },
          { id: 'slack-or-github', label: 'At least one of Slack, GitHub, Figma, or Supabase connected if I actually use it' },
          { id: 'tried-non-google-connector', label: 'I ran one prompt using a non-Google connector' },
        ],
      },
      {
        id: 'research-deep-dive',
        title: 'Use Research like a research assistant',
        body: `Claude's Research mode runs deep multi-source web research with citations. Available on Pro and Max. Use it instead of opening twelve tabs.

**In Claude (web or desktop)**: click **Research** in the new-chat options before sending your prompt. Claude will spend 2 to 5 minutes searching, reading, and synthesising.

**Six research questions worth running today**:

1. "What has changed in [my industry] in the last 90 days that someone in my role should know? Group by topic. Include any new regulation, funding rounds, or technology shifts."
2. "Find five companies similar to mine that have raised funding in the last 12 months. For each: stage, lead investor, go-to-market motion, and what their public pitch is."
3. "Map the AI tooling landscape for [specific use case, e.g. agency operations]. Cover pricing, capability, momentum, and which tools have meaningful traction. Cite sources for any market-share claim."
4. "What does the public footprint say about [prospect name]? Surface their last six months of public activity (talks, posts, hires, product launches). What angle would let me pitch them without sounding generic?"
5. "Find the three most credible critiques of [methodology or framework]. Steelman each. Then tell me which critique I should take most seriously."
6. "Trace the regulatory changes affecting [industry] in the EU, US, and AU over the last year. For each, summarise what an operator at my scale needs to know."

**How to get more from Research**:
- Be specific about format. "Group by X" or "Output as a table" works.
- Ask for sources to be ranked by credibility, not just listed.
- Treat the output as a starting draft, not the final answer. Verify load-bearing claims.

Each Research run takes 2 to 5 minutes and replaces an hour of tab-juggling.`,
        estMinutes: 20,
        checklist: [
          { id: 'research-ran', label: 'I ran at least 2 Research queries and kept the output' },
          { id: 'research-cited', label: 'I checked one of the cited sources to validate' },
        ],
      },
      {
        id: 'coworker-subagents',
        title: 'Trigger Coworker for parallel work',
        body: `Coworker (Pro+) lets Claude spawn parallel sub-agents for complex tasks. You don't trigger it manually. Claude decides when a task benefits and does it. You see results stream in as small "agents working" pills.

The trick is writing prompts that obviously benefit from parallelism. Once Claude sees the pattern, sub-agents fire.

**Five prompts that reliably trigger Coworker**:

1. "Compare these five competitors against my product, one agent per competitor: [list 5 with URLs]. For each, return: positioning, pricing, three product strengths, three weaknesses, who they win against."
2. "Critique this strategy from three angles in parallel: financial (will the math work), brand (will it dilute), operational (can we deliver). Each angle should be its own dedicated analysis."
3. "Read these three meeting transcripts (paste them). Have one agent extract decisions, one extract open questions, one extract any contradictions between sessions. Then synthesise."
4. "Research this prospect from five stakeholder perspectives in parallel: customer, employee, regulator, investor, competitor. Each perspective should give me a different angle on what they care about and where they're vulnerable."
5. "Take this article (paste) and produce three drafts in parallel: a LinkedIn post in my voice, a 60-second video script in plain language, a two-minute spoken version for a podcast intro. Optimise each for its format."

**What to look for**:
- Multiple small "Working on X" pills appearing in the chat as the response builds
- Each sub-agent's findings labelled separately, then a synthesis at the end
- Total response time still fast because work runs in parallel, not in series

If Coworker doesn't fire, your prompt probably looks like one task. Rewrite to make the parallelism explicit (one agent per X).`,
        estMinutes: 15,
        checklist: [
          { id: 'coworker-fired', label: 'I saw sub-agents fire in at least one response' },
          { id: 'coworker-output-used', label: 'I used the parallel output for real work' },
        ],
      },
      {
        id: 'artifacts-templates',
        title: 'Build 5 reusable Artifact templates',
        body: `Artifacts are inline rendered outputs you can iterate on. Code blocks, documents, diagrams, simple interactive prototypes. Each iteration creates a new version you can flip between.

**Build these five today or this week. Save each one (Project file) so you can reuse them.**

1. **One-page client status template**. Prompt: "Build me a one-page client status markdown template I can fill in weekly. Sections: this week's progress, blockers, decisions needed, next week's priorities, risks. Keep it tight, no fluff."

2. **ROI calculator** (interactive HTML/JS Artifact). Prompt: "Build me a simple ROI calculator as an interactive Artifact. Three inputs: monthly cost, hours saved per week, hourly rate. Output: monthly net benefit and payback period. Show the math."

3. **Architecture diagram in Mermaid**. Prompt: "Draw a mermaid diagram of my current AI setup: my vault on the left, Claude in the middle, Gmail/Calendar/Drive connectors on the right. Label everything. Use the flowchart syntax."

4. **Pitch one-pager template**. Prompt: "Generate a one-page pitch deck template in markdown I can paste into Google Slides. Sections: problem, insight, proposed approach, why us, what success looks like, what we need from you. Each section is 2-3 lines max."

5. **Weekly review prompt** (saved Artifact). Prompt: "Write me a weekly review prompt I can paste into Claude every Sunday night. It should ask me five questions about the week (what worked, what didn't, what got dropped, what I learned, what I'm carrying into next week), then summarise my answers as a reflection note."

**Iterate in place**: after each Artifact, say "make it shorter", "change the tone to more formal", "add a section on risks". Each tweak creates a new version. Flip between versions with the buttons in the Artifact panel.

Pin the ones you'll reuse weekly. Treat them as your templates.`,
        estMinutes: 30,
        checklist: [
          { id: 'artifact-status-template', label: 'Client status template built' },
          { id: 'artifact-roi-calc', label: 'ROI calculator built' },
          { id: 'artifact-diagram', label: 'Mermaid architecture diagram built' },
          { id: 'artifact-pitch-template', label: 'Pitch one-pager template built' },
          { id: 'artifact-weekly-review', label: 'Weekly review prompt saved' },
        ],
      },
      {
        id: 'memory-seed',
        title: 'Seed Memory with 12 stable facts',
        body: `Claude has cross-session memory. Tell it stable facts about you and they surface in future chats without you re-stating context.

**How to seed**: open any Claude chat and say "Remember the following about me, and use these in future conversations:" then list facts.

**The 12 to seed today** (edit to match you):

1. Time zone and country (e.g. "Melbourne, Australia, UTC+10/+11")
2. Role and primary business (one sentence each)
3. Spouse, partner, kids (first names so Claude doesn't have to ask)
4. Dietary preferences (useful for travel and restaurant prompts)
5. Voice rules: never use em-dashes, never use agency-speak, prefer short sentences
6. Banned words specific to your industry
7. Your top three priorities for the current quarter
8. Active client list (just names, so Claude knows who's who when you mention them)
9. Usual working hours and protected blocks (e.g. "no meetings before 10am Mondays")
10. Your default day rate and pricing (if you consult)
11. The frameworks you actively use (e.g. "I think in jobs-to-be-done, six dimensions of strategy, build-first-sell-second")
12. The frameworks you actively avoid (e.g. "I do not use OKRs, do not suggest them")

**Memory hygiene**:
- Memory is for stable facts. Don't put project state in here, that belongs in your vault.
- Review memory monthly. Delete anything stale.
- Anything you correct twice should become a memory entry instead of a recurring correction.

Test it: start a fresh chat the next day, ask "what do you know about me?" Claude should rattle off the seeded facts without prompting.`,
        estMinutes: 10,
        checklist: [
          { id: 'memory-12-seeded', label: '12 stable facts seeded in Claude memory' },
          { id: 'memory-tested-fresh-chat', label: 'I tested in a fresh chat and Claude remembered' },
        ],
      },
      {
        id: 'daily-claude-routine',
        title: 'Your daily Claude routine',
        body: `By now you have: Desktop, mobile, Chrome (where available), Projects, Skills, Connectors (Gmail/Calendar/Drive), Research, Coworker, Artifacts, Memory. The trick is using them as one workflow, not nine separate features.

**A worked daily routine**:

**Morning (10 minutes)**: open Daily Operator project on Claude Desktop. Ask "What should I focus on today?" It reads your calendar, recent emails, and your priorities, returns a tight plan. Capture any overnight ideas you had via mobile voice notes.

**Mid-morning (when you need to write something)**: switch to the Personal Voice project. Draft in Claude. Edit in your usual tool. The first pass takes a quarter of the time.

**Lunch (5 minutes)**: scan inbox via Inbox Coach project. Triage the three most urgent threads. Save drafts for the high-stakes ones, send the quick ones yourself from Gmail.

**Afternoon (when you hit a research question)**: open Research Companion project or use Research mode directly. Don't go to Google. Let Claude do the multi-tab work while you keep building.

**End of day (5 minutes)**: open Claude Desktop, paste "What did I commit to today that I haven't done yet?" Claude reads your sent mail and drafts a quick follow-up list for tomorrow.

**Weekend (15 minutes)**: run the Weekly Review Artifact you built. Reflect on what worked, what didn't, what to carry forward.

**The discipline**: don't add more tools. Add more depth to the ones you have. Your Personal Voice project gets better every week as you upload more samples. Your skills library grows by one or two per week. Your memory accumulates. After 90 days the system is unrecognisable from where you started.`,
        estMinutes: 10,
        checklist: [
          { id: 'morning-routine', label: 'I have a morning Claude routine I can stick to' },
          { id: 'evening-routine', label: 'I have an end-of-day Claude routine I can stick to' },
        ],
      },
    ],
  },
  {
    id: 'installation-quickstart',
    number: 5,
    title: 'Installation Quickstart',
    oneLiner: 'Install Claude Code in your terminal and connect Gmail, Calendar, Drive.',
    prereqs: [],
    estMinutes: 30,
    steps: [
      {
        id: 'open-terminal',
        title: 'Open the terminal',
        body: `The terminal is a black screen where you type commands instead of clicking buttons. If it feels weird, that is normal. Everyone feels that way the first time.

- **Mac**: press Cmd+Space, type "Terminal", press Enter
- **Windows**: open "PowerShell" or install WSL ([Microsoft's WSL guide](https://learn.microsoft.com/en-us/windows/wsl/install))
- **Linux**: open your terminal of choice

You will see a window with a blinking cursor. Some text at the top with your username. That is it. You type, you press Enter, the computer does things.`,
        estMinutes: 2,
        checklist: [{ id: 'terminal-open', label: 'I have a terminal window open' }],
      },
      {
        id: 'install-node',
        title: 'Install Node.js',
        body: `Node.js is the runtime that runs developer tools. On Mac the easiest way is Homebrew.

If you do not have Homebrew on Mac, paste this first (it may ask for your password):`,
        commands: [
          {
            label: 'Install Homebrew (Mac only, skip if you already have it)',
            variants: {
              mac: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
            },
            expectedOutput:
              'Installation successful! followed by some next-steps text. Restart your terminal after.',
          },
          {
            label: 'Install Node.js',
            variants: {
              mac: 'brew install node',
              windows: 'Download the LTS installer from https://nodejs.org and run it. Restart your terminal afterwards.',
              linux: 'Use your package manager: sudo apt install nodejs npm (Debian/Ubuntu) or check your distro.',
            },
            expectedOutput:
              'Installed Node.js. After it finishes, run: node --version. You should see v20.x.x or similar.',
            commonErrors: [
              {
                match: 'brew: command not found',
                fix: 'Homebrew is not installed yet. Run the Homebrew install command above first, then restart your terminal.',
              },
            ],
          },
        ],
        estMinutes: 8,
        checklist: [
          { id: 'node-installed', label: 'node --version returns a version number' },
        ],
      },
      {
        id: 'install-claude-code',
        title: 'Install Claude Code',
        body: `One command in the terminal:`,
        commands: [
          {
            variants: {
              default: 'npm install -g @anthropic-ai/claude-code',
            },
            expectedOutput:
              'A wall of text scrolls past, ending with "added X packages" and your prompt returns. If you see red "error" or "permission denied", see the Stuck panel.',
            commonErrors: [
              {
                match: 'permission denied',
                fix: 'On Mac try the same command with sudo at the start: sudo npm install -g @anthropic-ai/claude-code',
              },
              {
                match: 'command not found',
                fix: 'Close the terminal, open a fresh one, try again. New shells pick up new commands.',
              },
            ],
          },
        ],
        estMinutes: 5,
        checklist: [
          { id: 'claude-installed', label: 'The install finished with "added X packages"' },
        ],
      },
      {
        id: 'sign-in-and-test',
        title: 'Sign in and test',
        body: `Now launch Claude Code and sign in.`,
        commands: [
          {
            variants: { default: 'claude' },
            expectedOutput:
              'A browser tab opens to sign you in. After you sign in, the terminal shows a prompt like "Claude>". Type "say hello", press Enter. If you get a reply, the install worked.',
          },
        ],
        estMinutes: 5,
        checklist: [
          { id: 'signed-in', label: 'I signed in and Claude replied to "say hello"' },
        ],
      },
      {
        id: 'connect-mcp',
        title: 'Connect Gmail, Calendar, Drive',
        body: `This is the step that unlocks everything. Inside Claude Code, type:

\`\`\`
/mcp
\`\`\`

A menu appears. Connect at minimum:

- **Gmail** (read inbox, draft replies)
- **Google Calendar** (check availability, create events)
- **Google Drive** (read and search documents)

Each one opens a browser tab to authorise. Click through.

**Privacy notes**:
- Read-only by default. Claude tells you before any write or send.
- I never let it auto-send email. Drafts only.
- Revoke any time in your Google account: Security → Third-party apps.
- For paid plans, your data is not used for AI training.`,
        estMinutes: 10,
        checklist: [
          { id: 'mcp-gmail', label: 'Gmail connected' },
          { id: 'mcp-calendar', label: 'Calendar connected' },
          { id: 'mcp-drive', label: 'Drive connected' },
        ],
      },
    ],
  },
  {
    id: 'first-7-days',
    number: 6,
    title: 'First 7 Days',
    oneLiner: 'A day-by-day plan to turn an installed tool into a daily habit.',
    prereqs: ['installation-quickstart'],
    estMinutes: 60,
    steps: [
      {
        id: 'day-1-pro-and-context',
        title: 'Day 1: Pro and your context file',
        body: `Sign up for Claude Pro. Open Custom Instructions and paste your "who I am" file from Day 1.

Then pick a task from your actual workday and do it in Claude.`,
        estMinutes: 10,
        checklist: [
          { id: 'pro-active', label: 'I am on a paid plan' },
          { id: 'instructions-pasted', label: "My 'who I am' file is in Custom Instructions" },
        ],
      },
      {
        id: 'day-2-desktop-and-gmail',
        title: 'Day 2: Desktop and Gmail',
        body: `Install Claude Desktop (Mac or Windows). Pin it. Connect Gmail via Settings → Connectors. Run one inbox query.

Try this: "Find every email I have not replied to from a director-level person or higher in the last 14 days."`,
        estMinutes: 15,
        checklist: [
          { id: 'desktop-installed', label: 'Claude Desktop is installed and pinned' },
          { id: 'first-gmail-query', label: 'I ran one Gmail query and got useful results' },
        ],
      },
      {
        id: 'day-3-personal-voice-project',
        title: 'Day 3: Build the Personal Voice project',
        body: `Create a Project called **Personal Voice**. Upload 5 samples of your writing. Set a system prompt that says "draft in this voice".

Test it on one real draft.`,
        estMinutes: 15,
        checklist: [
          { id: 'voice-project', label: 'Personal Voice project is built and tested' },
        ],
      },
      {
        id: 'day-4-daily-operator',
        title: 'Day 4: Build the Daily Operator',
        body: `Create a second Project called **Daily Operator**. Add your CLAUDE.md, your recurring meetings, your top three priorities.

Test it: "What should I work on right now?"`,
        estMinutes: 10,
        checklist: [
          { id: 'operator-project', label: 'Daily Operator project answers the morning question' },
        ],
      },
      {
        id: 'day-5-first-research',
        title: 'Day 5: First Research query',
        body: `Open Research. Run: "What has changed in [my industry] in the last 90 days that someone in my role should know?"

Save the output as a note.`,
        estMinutes: 5,
        checklist: [{ id: 'research-saved', label: 'I have a research note I can refer back to' }],
      },
      {
        id: 'day-6-artifact-template',
        title: 'Day 6: Build a reusable Artifact',
        body: `Pick one thing you do weekly. Ask Claude to build it as an Artifact.

Examples: a client status template, a meeting prep one-pager, a content calendar, a project status format.

Iterate until you would actually reuse it.`,
        estMinutes: 10,
        checklist: [{ id: 'artifact-ready', label: 'I have at least one reusable Artifact template' }],
      },
      {
        id: 'day-7-memory-and-review',
        title: 'Day 7: Memory and weekly review',
        body: `Seed at least 10 stable facts in Claude memory. Then run a weekly review of what worked, what did not, and what you will use Claude for next week.`,
        estMinutes: 10,
        checklist: [
          { id: 'memory-10', label: '10 stable facts are in Claude memory' },
          { id: 'week-1-reviewed', label: 'I reviewed my first week of using Claude' },
        ],
      },
    ],
  },
  {
    id: 'level-1',
    number: 7,
    title: 'Level 1 Foundations',
    oneLiner: 'Lock in daily reps, write your CLAUDE.md, start a vault.',
    prereqs: ['first-7-days'],
    estMinutes: 30,
    steps: [
      {
        id: 'pick-and-commit',
        title: 'Pick your main AI and commit',
        body: `Commit to Claude as your daily driver for 90 days. Do not bounce between tools comparing outputs in week one. You'll lose more time evaluating than you'll save using.

Pick Claude, use it for everything, build your context and skills around it. Re-evaluate after 90 days if you want.`,
        estMinutes: 5,
        checklist: [{ id: 'picked', label: 'I have picked my main AI for 90 days' }],
      },
      {
        id: 'write-claude-md',
        title: 'Write your CLAUDE.md',
        body: `Open a doc. Write:

- Your name and role
- The business you are in
- The voice and tone you want
- The things you never want the AI to do
- Frameworks you already use
- Current clients or projects

Save it as **CLAUDE.md** at the root of any folder you work in. Any Claude Code session in that folder reads it automatically. In the web app, paste it into Custom Instructions.`,
        estMinutes: 15,
        checklist: [{ id: 'claude-md-written', label: 'My CLAUDE.md is written and loaded' }],
      },
      {
        id: 'daily-reps',
        title: 'Daily reps for 30 days',
        body: `For 30 days, use the AI for at least one real task per day. Just one. Email drafts, meeting summaries, strategy questions, research, writing.

Track wins in a notes app. By day 30 you will have a list of repeat patterns. Those patterns become workflows in the next level.`,
        estMinutes: 5,
        checklist: [{ id: 'reps-committed', label: 'I have committed to 30 days of daily reps' }],
      },
      {
        id: 'start-vault',
        title: 'Start a notes vault',
        body: `Install **Obsidian** from obsidian.md (free). Create a single vault folder. Start dropping notes in. No structure required yet.

The vault is where Level 2 and beyond live. Get the habit started now.`,
        estMinutes: 5,
        checklist: [{ id: 'vault-created', label: 'Obsidian vault is set up' }],
      },
    ],
  },
  {
    id: 'self-onboarding-prompt',
    number: 8,
    title: 'Self-Onboarding Prompt',
    oneLiner: 'Paste one prompt. Get your entire vault bootstrapped from your real life.',
    prereqs: ['installation-quickstart'],
    estMinutes: 45,
    steps: [
      {
        id: 'prereqs-check',
        title: 'Pre-flight check',
        body: `Before you paste the prompt, confirm:

- Claude Code is installed and you can run \`claude\` in a terminal
- Gmail, Calendar, and Drive MCP servers are connected (\`/mcp\` inside Claude Code shows them green)
- You have Obsidian installed (or you are OK with plain folders)

If any of those are missing, jump back to **Installation Quickstart** first.`,
        estMinutes: 5,
        checklist: [
          { id: 'cc-running', label: 'Claude Code runs in my terminal' },
          { id: 'mcp-connected', label: 'Gmail, Calendar, Drive MCP all connected' },
        ],
      },
      {
        id: 'copy-and-paste',
        title: 'Copy the prompt and paste it in',
        body: `On the next screen, click the big "Copy the prompt" button. Open a fresh Claude Code session in your terminal (run \`claude\`). Paste the prompt as your first message.

The AI will ask you a series of questions. Answer them honestly and briefly.

After your answers, it will set up a vault folder, sweep your Gmail/Calendar/Drive, build a People folder from your most-contacted people, build Projects from detected work, and write a 30/60/90 plan.

Expect 30-40 minutes total. The agent will pause and confirm before each major phase.`,
        estMinutes: 35,
        checklist: [
          { id: 'prompt-pasted', label: 'I pasted the prompt and answered the questions' },
          { id: 'sweep-complete', label: 'The sweep ran and a vault was created' },
          { id: 'plan-generated', label: 'A LEARNING-PLAN.md was generated at my vault root' },
        ],
      },
      {
        id: 'review-and-commit',
        title: 'Review and commit',
        body: `Open your new vault in Obsidian. Look at:

- Top 5 people the agent flagged for outreach
- Top 3 stale commitments
- The Daily Note it wrote for today

Tweak anything that looks off. Then commit the vault to git so you have a forensic record from day one.

Congratulations. You now have a working AI operating system seeded with your real life.`,
        estMinutes: 5,
        checklist: [
          { id: 'vault-reviewed', label: 'I have reviewed the vault and adjusted what was off' },
          { id: 'vault-committed', label: 'The vault is committed to git' },
        ],
      },
    ],
  },
]

export const MILESTONE_ORDER: MilestoneId[] = MILESTONES.map((m) => m.id)

export function milestoneById(id: MilestoneId): Milestone | undefined {
  return MILESTONES.find((m) => m.id === id)
}

export function nextMilestone(id: MilestoneId): MilestoneId | null {
  const idx = MILESTONE_ORDER.indexOf(id)
  if (idx === -1 || idx === MILESTONE_ORDER.length - 1) return null
  return MILESTONE_ORDER[idx + 1]
}

export function prevMilestone(id: MilestoneId): MilestoneId | null {
  const idx = MILESTONE_ORDER.indexOf(id)
  if (idx <= 0) return null
  return MILESTONE_ORDER[idx - 1]
}
