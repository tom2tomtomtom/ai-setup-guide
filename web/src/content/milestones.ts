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
        id: 'open-claude-or-chatgpt',
        title: 'Open Claude or ChatGPT (5 min)',
        body: `In your browser, go to one of:

- **claude.ai** (Anthropic)
- **chatgpt.com** (OpenAI)

Sign up with your email. The free tier is enough for today. You can upgrade later.

If you genuinely cannot decide, pick **Claude**. The writing tends to be sharper.`,
        estMinutes: 5,
        checklist: [
          { id: 'signed-up', label: 'I have signed up and I am logged in' },
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
- **Connections** (MCP): Claude reads Gmail, Calendar, Drive, Slack, GitHub on your behalf
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
          { id: 'know-features', label: 'I know what Projects, Skills, MCP, and Research do' },
          { id: 'know-models', label: 'I know the three models and when to use each' },
        ],
      },
    ],
  },
  {
    id: 'core-features',
    number: 4,
    title: 'Core Features',
    oneLiner: 'Build your first Project, try sub-agents, seed your memory.',
    prereqs: ['know-claude'],
    estMinutes: 45,
    steps: [
      {
        id: 'build-personal-voice-project',
        title: 'Build your Personal Voice project',
        body: `In Claude (Pro), click **Projects** in the sidebar. Create a new one called **Personal Voice**.

In the project's custom instructions, paste your "who I am" file from Day 1. Then upload 5 samples of your past writing: emails, posts, drafts. Anything that sounds like you.

From now on, when you need something written in your voice, open the Personal Voice project and ask there. Every reply will be drafted in your tone.`,
        estMinutes: 15,
        checklist: [
          { id: 'project-created', label: 'Personal Voice project is set up with my writing samples' },
          { id: 'tested-draft', label: 'I tested it on one real draft' },
        ],
      },
      {
        id: 'try-research',
        title: 'Try Research',
        body: `Pick a question you would normally open ten tabs to answer. Ask Claude's Research mode.

Examples:
- "What has changed in [my industry] in the last 90 days that I should know?"
- "Find five companies similar to mine that have raised in the last year. What is their go-to-market?"
- "Find the three most credible critiques of [methodology]. Steelman each one."

Research takes 2-5 minutes. It searches the web, reads sources, cites everything. It replaces an hour of tab-juggling.`,
        estMinutes: 10,
        checklist: [
          { id: 'research-done', label: 'I ran one Research query and kept the output' },
        ],
      },
      {
        id: 'seed-memory',
        title: 'Seed Claude memory',
        body: `Tell Claude to remember some stable facts about you. Open any chat and say:

> "Remember the following about me, and use these in future conversations: time zone is [X], primary business is [Y], my partner is [Z], I never want you to use em-dashes, my top three priorities right now are [A], [B], [C]."

Add anything that is stable enough to be true for months. Skip anything project-specific, that belongs in your vault later.`,
        estMinutes: 10,
        checklist: [
          { id: 'memory-seeded', label: 'I have seeded at least 5 stable facts in Claude memory' },
        ],
      },
      {
        id: 'try-an-artifact',
        title: 'Try an Artifact',
        body: `Ask Claude to make something visual or structured. Examples:

- "Build me a one-page client status summary template I can reuse weekly."
- "Make a simple ROI calculator: three inputs, three projected outcomes."
- "Draw me an architecture diagram of my current setup in mermaid."

The output renders inline in the chat. You can iterate ("make it shorter", "change the tone"), and each version is saved so you can flip between them.`,
        estMinutes: 10,
        checklist: [
          { id: 'artifact-iterated', label: 'I built and iterated on one artifact' },
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
        body: `Install Claude Desktop (Mac or Windows). Pin it. Connect Gmail via MCP. Run one inbox query.

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
        body: `Pick one of Claude or ChatGPT as your daily driver. Commit to it for 90 days. Do not bounce between them in week one comparing outputs.

If you genuinely cannot decide, pick Claude.`,
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

- Claude Code (or Codex) is installed and you can run \`claude\` in a terminal
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
