import type { Milestone, Step } from '../content/types'
import type { Profile } from '../state/useProgress'

function osLabel(os: Profile['os']): string {
  switch (os) {
    case 'mac':
      return 'Mac (macOS)'
    case 'windows':
      return 'Windows'
    case 'linux':
      return 'Linux'
    default:
      return 'unspecified'
  }
}

function firstSentence(text: string): string {
  const stripped = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()
  const match = stripped.match(/^(.+?[.!?])(\s|$)/)
  return match ? match[1] : stripped.slice(0, 200)
}

function commandsForOs(step: Step, os: Profile['os']): string {
  if (!step.commands?.length) return ''
  const lines = step.commands.flatMap((c) => {
    const t =
      (os && c.variants[os]) ||
      c.variants.default ||
      Object.values(c.variants).find(Boolean) ||
      ''
    return t ? [c.label ? `# ${c.label}\n${t}` : t] : []
  })
  return lines.join('\n\n')
}

export function generateHelpPrompt(milestone: Milestone, step: Step, profile: Profile): string {
  const hasCommands = (step.commands?.length ?? 0) > 0
  const stepGoal = firstSentence(step.body)
  const cmds = commandsForOs(step, profile.os)
  const expected = step.commands?.find((c) => c.expectedOutput)?.expectedOutput

  if (hasCommands) {
    return [
      "I'm following Tom Hyde's AI Setup Guide and I'm stuck on a step.",
      '',
      'CONTEXT',
      `- Milestone: ${milestone.title}`,
      `- Step: ${step.title}`,
      `- What this step is trying to do: ${stepGoal}`,
      `- My operating system: ${osLabel(profile.os)}`,
      `- Commands the guide gave me:`,
      '',
      '```',
      cmds || '(none in this step)',
      '```',
      '',
      ...(expected
        ? [`- What should have happened: ${expected}`, '']
        : []),
      'WHAT ACTUALLY HAPPENED (I will paste this):',
      '[paste the exact command you ran]',
      '[paste the exact error message or output you got]',
      '[describe what you see on screen]',
      '',
      'HOW TO HELP ME',
      "- I am new to this. Do not assume technical knowledge.",
      "- Do not guess. If you need more info, ask me 1 or 2 specific clarifying questions first.",
      "- Once you understand the situation, give me ONE clear next action, not a list.",
      "- After I try your suggestion, ask me what I see now before moving to the next thing.",
      "- If the issue is environmental (OS version, Node version, permissions, network), tell me exactly what to check and the exact command to check it.",
      "- Keep replies short. Walls of text lose me.",
      "- Never use em-dashes in your reply.",
      '',
      "Ready when you are. Ask your first clarifying question.",
    ].join('\n')
  }

  return [
    "I'm reading Tom Hyde's AI Setup Guide and I'm stuck on understanding something.",
    '',
    'CONTEXT',
    `- Milestone: ${milestone.title}`,
    `- Section: ${step.title}`,
    `- What the section is trying to teach me: ${stepGoal}`,
    '',
    'WHAT IS CONFUSING ME (I will paste this):',
    '[describe what specifically is unclear, or paste the line or phrase that lost you]',
    '[say what you think it means so I can correct any misreading]',
    '',
    'HOW TO HELP ME',
    "- I am new to this. Use plain language and concrete examples.",
    "- Ask me 1 or 2 specific clarifying questions before you explain anything.",
    "- Once you understand what's confusing, explain it in three to five sentences with one real example I would recognise from my own work.",
    "- Then ask me whether it clicked before moving on.",
    "- Never use em-dashes in your reply.",
    '',
    'Ready when you are. Ask your first clarifying question.',
  ].join('\n')
}
