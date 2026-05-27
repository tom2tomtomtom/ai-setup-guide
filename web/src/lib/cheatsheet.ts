import type { ProgressState } from '../state/useProgress'
import { MILESTONES } from '../content/milestones'

function osLabel(os: ProgressState['profile']['os']): string {
  switch (os) {
    case 'mac':
      return 'macOS'
    case 'windows':
      return 'Windows'
    case 'linux':
      return 'Linux'
    default:
      return 'unspecified'
  }
}

function planLabel(p: ProgressState['profile']['paidPlan']): string {
  switch (p) {
    case 0:
      return 'Free tier'
    case 1:
      return 'Claude Pro'
    case 2:
      return 'Claude Max'
    case 3:
      return 'Claude Max + API usage'
    default:
      return 'Unspecified'
  }
}

function ymd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function suggestedSkills(profile: ProgressState['profile']): string[] {
  const out: string[] = []
  if (profile.goals.includes('save-time-on-email')) {
    out.push('`email-in-my-voice` — drafts replies to forwarded emails in your tone')
    out.push('`inbox-triage` — ranks unread mail by urgency and drafts replies in batches')
  }
  if (profile.goals.includes('write-better')) {
    out.push('`tone-pass` — rewrites any text in your captured voice, banned words stripped')
    out.push('`one-page-pitch` — turns rough notes into a one-page pitch one-pager')
  }
  if (profile.goals.includes('build-things')) {
    out.push('`spec-it` — turns a vault idea into an implementation-ready spec')
    out.push('`feature-developer` — proposes the next feature based on usage signals')
  }
  if (profile.goals.includes('run-a-business')) {
    out.push('`deal-review` — weekly pipeline health and chase strategy')
    out.push('`morning-pulse` — scans Gmail + Calendar, surfaces three priorities')
  }
  if (profile.goals.includes('learn-how')) {
    out.push('`explain-like-im-curious` — gives concrete examples, asks questions back')
    out.push('`weekly-review` — Sunday-night reflection prompt')
  }
  if (out.length === 0) {
    out.push('`daily-plan` — reads calendar + inbox + priorities, returns today\'s plan')
    out.push('`meeting-to-actions` — turns meeting notes into owner-tagged actions')
    out.push('`email-in-my-voice` — drafts replies to forwarded emails in your tone')
  }
  return out.slice(0, 3)
}

function nextConcepts(profile: ProgressState['profile']): { topic: string; query: string }[] {
  const list: { topic: string; query: string }[] = []
  if (profile.nodeInstalled < 2) {
    list.push({ topic: 'Node.js and npm', query: 'install node.js for beginners 2026' })
  }
  if (profile.terminalComfort < 2) {
    list.push({ topic: 'Terminal basics', query: 'terminal basics for beginners 2026' })
  }
  if (profile.triedClaudeCode < 2) {
    list.push({ topic: 'Claude Code', query: 'claude code getting started 2026' })
  }
  list.push({ topic: 'GitHub and git', query: 'git and github for beginners 2026' })
  list.push({ topic: 'Obsidian for personal knowledge', query: 'obsidian for beginners 2026' })
  return list.slice(0, 5)
}

export function generateCheatsheet(state: ProgressState): string {
  const { profile, completedMilestones, completedSteps } = state
  const completedNames = MILESTONES.filter((m) => completedMilestones[m.id]).map((m) => m.title)
  const totalStepsDone = Object.keys(completedSteps).length
  const skills = suggestedSkills(profile)
  const concepts = nextConcepts(profile)
  const today = ymd(new Date())

  const lines: string[] = []
  lines.push('# My Claude Operator Stack')
  lines.push('')
  lines.push(`Generated ${today} from Tom Hyde's AI Setup Guide.`)
  lines.push('')
  lines.push('## Setup snapshot')
  lines.push('')
  lines.push(`- **OS**: ${osLabel(profile.os)}`)
  lines.push(`- **Current plan**: ${planLabel(profile.paidPlan)}`)
  lines.push(`- **Goals for the next 30 days**: ${profile.goals.length ? profile.goals.join(', ') : 'not set'}`)
  lines.push(`- **Milestones completed**: ${completedNames.length}/8${completedNames.length ? ` (${completedNames.join(', ')})` : ''}`)
  lines.push(`- **Total checklist items ticked**: ${totalStepsDone}`)
  lines.push('')
  lines.push('## What I built')
  lines.push('')
  if (completedNames.length === 0) {
    lines.push('Nothing complete yet. Start at the milestone the quiz recommended.')
  } else {
    completedNames.forEach((n) => lines.push(`- ${n}`))
  }
  lines.push('')
  lines.push('## My daily Claude routine')
  lines.push('')
  lines.push('- **Morning**: open the Daily Operator Project. Ask "What should I focus on today?"')
  lines.push('- **Mid-day**: anything that needs writing runs through the Personal Voice Project first.')
  lines.push('- **Inbox**: triage via the Inbox Coach Project. Save drafts in Gmail, send myself.')
  lines.push('- **Research**: use Research mode instead of Google for any multi-source question.')
  lines.push('- **End of day**: ask Claude "What did I commit to today that I haven\'t done yet?"')
  lines.push('- **Sunday night**: run the weekly review Artifact.')
  lines.push('')
  lines.push('## Three skills to write first')
  lines.push('')
  skills.forEach((s) => lines.push(`- ${s}`))
  lines.push('')
  lines.push('## Technical concepts to learn next')
  lines.push('')
  concepts.forEach((c) => lines.push(`- **${c.topic}** — search YouTube: \`${c.query}\``))
  lines.push('')
  lines.push('## My stack starter (clone-able)')
  lines.push('')
  lines.push('- **Claude Code Portable Bundle**: 88 skills, 57 commands, 8 review agents.')
  lines.push('  Source: https://github.com/tom2tomtomtom/ai-setup-guide/tree/main/portable-setup')
  lines.push('- **Vault template**: starter folder structure for People, Projects, Business, Daily Notes.')
  lines.push('  Source: https://github.com/tom2tomtomtom/ai-setup-guide/tree/main/templates')
  lines.push('- **CLAUDE.md template**: drop into any project root to brief the agent on who you are.')
  lines.push('  Source: https://github.com/tom2tomtomtom/ai-setup-guide/blob/main/templates/claude-md-template.md')
  lines.push('')
  lines.push('## Weekly review prompt (run every Sunday night)')
  lines.push('')
  lines.push('```')
  lines.push("It's Sunday night. Help me review the past week and prepare for the next.")
  lines.push('Read my Gmail, Calendar, and Daily Notes from the last 7 days.')
  lines.push('')
  lines.push('Answer these in order, one at a time, waiting for my reply between:')
  lines.push('1. What were my three biggest wins this week?')
  lines.push("2. What did I commit to but not deliver? Why?")
  lines.push('3. What kept appearing in my calendar or inbox that I should systematise?')
  lines.push('4. What energy did I lose to context-switching?')
  lines.push("5. What's the one thing I want to be true by next Sunday?")
  lines.push('')
  lines.push('Then write a one-paragraph reflection note and save it to my vault as')
  lines.push('Daily Notes/[next-week-date]-weekly-review.md')
  lines.push('```')
  lines.push('')
  lines.push('## Where to go from here')
  lines.push('')
  lines.push('- Resume the wizard at setup.aiden.services to pick up where you left off')
  lines.push('- Re-run the digital sweep prompt every quarter to keep your vault fresh')
  lines.push("- When you find yourself doing the same task three times, write a skill")
  lines.push('- Update this cheatsheet every 90 days')
  lines.push('')
  lines.push('---')
  lines.push('')
  lines.push("Made with the AI Setup Guide. Open source at github.com/tom2tomtomtom/ai-setup-guide.")
  return lines.join('\n')
}
