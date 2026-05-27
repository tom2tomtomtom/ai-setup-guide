export type OS = 'mac' | 'windows' | 'linux'

export type Command = {
  label?: string
  variants: Partial<Record<OS, string>> & { default?: string }
  expectedOutput?: string
  commonErrors?: { match: string; fix: string }[]
}

export type Step = {
  id: string
  title: string
  body: string
  commands?: Command[]
  checklist?: { id: string; label: string }[]
  estMinutes?: number
  commonErrors?: { match: string; fix: string }[]
}

export type MilestoneId =
  | 'mindset'
  | 'day-1-win'
  | 'know-claude'
  | 'core-features'
  | 'installation-quickstart'
  | 'first-7-days'
  | 'level-1'
  | 'self-onboarding-prompt'

export type Milestone = {
  id: MilestoneId
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  title: string
  oneLiner: string
  prereqs: MilestoneId[]
  steps: Step[]
  estMinutes: number
}
