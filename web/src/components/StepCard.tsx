import ReactMarkdown from 'react-markdown'
import type { Milestone, Step } from '../content/types'
import { CopyableCommand } from './CopyableCommand'
import { ChecklistItem } from './ChecklistItem'

export function StepCard({ milestone, step }: { milestone: Milestone; step: Step }) {
  const stepKey = `${milestone.id}/${step.id}`
  return (
    <article className="card p-6 sm:p-8">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">
          {milestone.title}
        </span>
        {step.estMinutes && (
          <span className="text-xs text-ink-subtle">about {step.estMinutes} min</span>
        )}
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">{step.title}</h1>
      <div className="prose prose-stone max-w-none prose-headings:font-semibold prose-headings:text-ink prose-strong:text-ink prose-code:bg-bg-subtle prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0">
        <ReactMarkdown>{step.body}</ReactMarkdown>
      </div>
      {step.commands?.map((cmd, i) => (
        <CopyableCommand key={i} command={cmd} />
      ))}
      {step.checklist && step.checklist.length > 0 && (
        <div className="mt-6 space-y-1">
          <div className="text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
            Mark complete when done
          </div>
          {step.checklist.map((c) => (
            <ChecklistItem key={c.id} stepKey={stepKey} id={c.id} label={c.label} />
          ))}
        </div>
      )}
    </article>
  )
}
