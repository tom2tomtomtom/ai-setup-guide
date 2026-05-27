import { Link, useParams } from 'react-router-dom'
import { Check, Lock } from 'lucide-react'
import { MILESTONES } from '../content/milestones'
import { useProgress } from '../state/useProgress'
import { cn } from '../lib/cn'

export function ProgressSidebar() {
  const { milestoneId } = useParams()
  const completed = useProgress((s) => s.completedMilestones)
  const completedSteps = useProgress((s) => s.completedSteps)

  return (
    <nav className="hidden lg:block w-64 shrink-0 border-r border-border bg-bg-card">
      <div className="p-4 sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
        <div className="text-xs font-medium uppercase tracking-wide text-ink-muted mb-3 px-2">
          Your path
        </div>
        <ol className="space-y-1">
          {MILESTONES.map((m) => {
            const isDone = Boolean(completed[m.id])
            const isCurrent = milestoneId === m.id
            const stepDone = m.steps.filter(
              (s) => completedSteps[`${m.id}/${s.id}`] || isStepFullyChecked(m.id, s.id, completedSteps),
            ).length
            return (
              <li key={m.id}>
                <Link
                  to={`/wizard/${m.id}`}
                  className={cn(
                    'flex items-start gap-3 px-3 py-2 rounded-xl transition',
                    isCurrent
                      ? 'bg-accent-subtle text-ink'
                      : isDone
                      ? 'text-ink-muted hover:bg-bg-subtle'
                      : 'text-ink hover:bg-bg-subtle',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold',
                      isCurrent
                        ? 'bg-accent text-white'
                        : isDone
                        ? 'bg-ok text-white'
                        : 'bg-bg-subtle text-ink-muted',
                    )}
                  >
                    {isDone ? <Check size={12} strokeWidth={3} /> : m.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{m.title}</div>
                    <div className="text-xs text-ink-subtle truncate">
                      {stepDone}/{m.steps.length} steps
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ol>
        <div className="mt-6 px-3 py-3 rounded-xl bg-bg-subtle text-xs text-ink-muted">
          <Lock size={12} className="inline mr-1" />
          Progress saved in your browser only.
        </div>
      </div>
    </nav>
  )
}

function isStepFullyChecked(
  milestoneId: string,
  stepId: string,
  completedSteps: Record<string, true>,
): boolean {
  // a step is done if any of its checklist items is checked OR the step key itself is checked
  const prefix = `${milestoneId}/${stepId}`
  return Object.keys(completedSteps).some((k) => k.startsWith(prefix))
}
