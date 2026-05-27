import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MilestoneId, OS } from '../content/types'

export type Profile = {
  os: OS | null
  aiUsage: 0 | 1 | 2 | 3
  terminalComfort: 0 | 1 | 2 | 3
  paidPlan: 0 | 1 | 2 | 3
  nodeInstalled: 0 | 1 | 2
  triedClaudeCode: 0 | 1 | 2
  goals: string[]
}

export type ProgressState = {
  version: 1
  profile: Profile
  quizCompleted: boolean
  recommendedMilestone: MilestoneId | null
  currentMilestone: MilestoneId | null
  currentStepId: string | null
  completedSteps: Record<string, true>
  deferredSteps: Record<string, true>
  completedMilestones: Partial<Record<MilestoneId, true>>
  startedAt: string | null
  lastTouchedAt: string | null

  setProfile: (partial: Partial<Profile>) => void
  setRecommendedMilestone: (id: MilestoneId | null) => void
  setQuizCompleted: (v: boolean) => void
  setCurrent: (milestoneId: MilestoneId, stepId: string | null) => void
  completeStep: (key: string) => void
  uncompleteStep: (key: string) => void
  deferStep: (key: string) => void
  completeMilestone: (id: MilestoneId) => void
  touch: () => void
  reset: () => void
}

const defaultProfile: Profile = {
  os: null,
  aiUsage: 0,
  terminalComfort: 0,
  paidPlan: 0,
  nodeInstalled: 0,
  triedClaudeCode: 0,
  goals: [],
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      version: 1,
      profile: defaultProfile,
      quizCompleted: false,
      recommendedMilestone: null,
      currentMilestone: null,
      currentStepId: null,
      completedSteps: {},
      deferredSteps: {},
      completedMilestones: {},
      startedAt: null,
      lastTouchedAt: null,

      setProfile: (partial) =>
        set((s) => ({
          profile: { ...s.profile, ...partial },
          startedAt: s.startedAt ?? new Date().toISOString(),
          lastTouchedAt: new Date().toISOString(),
        })),
      setRecommendedMilestone: (id) =>
        set(() => ({ recommendedMilestone: id, lastTouchedAt: new Date().toISOString() })),
      setQuizCompleted: (v) => set(() => ({ quizCompleted: v })),
      setCurrent: (milestoneId, stepId) =>
        set(() => ({
          currentMilestone: milestoneId,
          currentStepId: stepId,
          lastTouchedAt: new Date().toISOString(),
        })),
      completeStep: (key) =>
        set((s) => ({
          completedSteps: { ...s.completedSteps, [key]: true },
          lastTouchedAt: new Date().toISOString(),
        })),
      uncompleteStep: (key) =>
        set((s) => {
          const next = { ...s.completedSteps }
          delete next[key]
          return { completedSteps: next, lastTouchedAt: new Date().toISOString() }
        }),
      deferStep: (key) =>
        set((s) => ({
          deferredSteps: { ...s.deferredSteps, [key]: true },
          lastTouchedAt: new Date().toISOString(),
        })),
      completeMilestone: (id) =>
        set((s) => ({
          completedMilestones: { ...s.completedMilestones, [id]: true },
          lastTouchedAt: new Date().toISOString(),
        })),
      touch: () => set(() => ({ lastTouchedAt: new Date().toISOString() })),
      reset: () =>
        set(() => ({
          version: 1,
          profile: defaultProfile,
          quizCompleted: false,
          recommendedMilestone: null,
          currentMilestone: null,
          currentStepId: null,
          completedSteps: {},
          deferredSteps: {},
          completedMilestones: {},
          startedAt: null,
          lastTouchedAt: null,
        })),
    }),
    {
      name: 'ai-setup-guide:v1',
    },
  ),
)
