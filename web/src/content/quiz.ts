import type { MilestoneId, OS } from './types'
import type { Profile } from '../state/useProgress'

export type ScoredOption<V extends number = number> = {
  value: V
  label: string
  sublabel?: string
}

export type MultiOption = { value: string; label: string }

export type QuizQuestion =
  | {
      id: 'aiUsage'
      type: 'scored'
      title: string
      help?: string
      options: ScoredOption<0 | 1 | 2 | 3>[]
    }
  | {
      id: 'os'
      type: 'os'
      title: string
      help?: string
      options: { value: OS; label: string }[]
    }
  | {
      id: 'terminalComfort'
      type: 'scored'
      title: string
      help?: string
      options: ScoredOption<0 | 1 | 2 | 3>[]
    }
  | {
      id: 'paidPlan'
      type: 'scored'
      title: string
      help?: string
      options: ScoredOption<0 | 1 | 2 | 3>[]
    }
  | {
      id: 'nodeInstalled'
      type: 'scored'
      title: string
      help?: string
      options: ScoredOption<0 | 1 | 2>[]
    }
  | {
      id: 'triedClaudeCode'
      type: 'scored'
      title: string
      help?: string
      options: ScoredOption<0 | 1 | 2>[]
    }
  | {
      id: 'goals'
      type: 'multi'
      title: string
      help?: string
      options: MultiOption[]
    }

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'aiUsage',
    type: 'scored',
    title: 'Have you ever had a real back-and-forth with an AI assistant?',
    options: [
      { value: 0, label: 'Never', sublabel: 'I have not really used one' },
      { value: 1, label: 'Tried it once or twice' },
      { value: 2, label: 'I use one most weeks' },
      { value: 3, label: 'Every day, in my work' },
    ],
  },
  {
    id: 'os',
    type: 'os',
    title: 'What kind of computer are you on?',
    options: [
      { value: 'mac', label: 'Mac' },
      { value: 'windows', label: 'Windows' },
      { value: 'linux', label: 'Linux' },
    ],
  },
  {
    id: 'terminalComfort',
    type: 'scored',
    title: 'How does the terminal (the black screen with text) feel?',
    help: 'Be honest. Most people are not comfortable here. That is fine.',
    options: [
      { value: 0, label: "I don't know what that is" },
      { value: 1, label: 'I have seen one but never used it' },
      { value: 2, label: 'I can navigate, run a few commands' },
      { value: 3, label: 'I live in it' },
    ],
  },
  {
    id: 'paidPlan',
    type: 'scored',
    title: 'Are you currently paying for any AI?',
    help: 'Free tiers are fine to start, but you will hit limits within a week.',
    options: [
      { value: 0, label: 'No, free tier only' },
      { value: 1, label: 'Claude Pro' },
      { value: 2, label: 'Claude Max' },
      { value: 3, label: 'Claude Max plus API usage' },
    ],
  },
  {
    id: 'nodeInstalled',
    type: 'scored',
    title: 'Do you have Node.js installed?',
    help: 'Node is what runs many developer tools. If you do not know what it is, that is OK.',
    options: [
      { value: 0, label: 'No idea what that means' },
      { value: 1, label: 'I think so, but unsure' },
      { value: 2, label: 'Yes, confirmed installed' },
    ],
  },
  {
    id: 'triedClaudeCode',
    type: 'scored',
    title: 'Have you ever installed Claude Code?',
    help: 'Claude Code is the terminal version of Claude. It runs commands, edits files, and connects to your apps.',
    options: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Tried once, did not stick' },
      { value: 2, label: 'Yes, I am using it now' },
    ],
  },
  {
    id: 'goals',
    type: 'multi',
    title: 'What do you want from this in the next 30 days?',
    help: 'Pick anything that fits. We will tailor the guidance.',
    options: [
      { value: 'save-time-on-email', label: 'Save time on email' },
      { value: 'write-better', label: 'Write better' },
      { value: 'build-things', label: 'Build things' },
      { value: 'run-a-business', label: 'Run a business with AI' },
      { value: 'learn-how', label: 'Learn how all this works' },
    ],
  },
]

export function scoreProfile(profile: Profile): {
  recommended: MilestoneId
  reasoning: string
} {
  const sum =
    profile.aiUsage +
    profile.terminalComfort +
    profile.paidPlan +
    profile.nodeInstalled +
    profile.triedClaudeCode

  // Override: terminal-illiterate users are floored at Day 1
  if (profile.terminalComfort === 0) {
    if (profile.aiUsage <= 1) {
      return {
        recommended: 'mindset',
        reasoning:
          "You have not used AI much and the terminal is unfamiliar. We are starting at the very beginning so nothing feels like a leap.",
      }
    }
    return {
      recommended: 'day-1-win',
      reasoning:
        "You have used AI a little, but the terminal is unfamiliar. We are keeping you in the browser for Day 1, no installs.",
    }
  }

  // Sum bucketing
  if (sum <= 2) {
    return {
      recommended: 'mindset',
      reasoning:
        "Starting at the very beginning. Read the four big ideas first, then go to Day 1 for your first real win.",
    }
  }
  if (sum <= 4) {
    return {
      recommended: 'day-1-win',
      reasoning:
        "You have some exposure to AI. Start with a Day 1 win in your browser, then climb from there.",
    }
  }
  if (sum <= 6) {
    return {
      recommended: 'know-claude',
      reasoning:
        "You are comfortable using AI but the deeper features will be new. Start by mapping the full surface area of Claude.",
    }
  }
  if (sum <= 8) {
    return {
      recommended: 'installation-quickstart',
      reasoning:
        "You are paid up and comfortable enough with the terminal. Skip the orientation and install Claude Code.",
    }
  }
  if (sum <= 10) {
    return {
      recommended: 'first-7-days',
      reasoning:
        "You have the tools installed. Build the first seven days of a real stack.",
    }
  }
  return {
    recommended: 'level-1',
    reasoning:
      "You are already operating. Lock in the Level 1 daily reps and run the Self-Onboarding Prompt to bootstrap your vault.",
  }
}
