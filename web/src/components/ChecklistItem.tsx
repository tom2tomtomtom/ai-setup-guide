import { Check } from 'lucide-react'
import { useProgress } from '../state/useProgress'
import { cn } from '../lib/cn'

export function ChecklistItem({ stepKey, id, label }: { stepKey: string; id: string; label: string }) {
  const key = `${stepKey}#${id}`
  const checked = useProgress((s) => Boolean(s.completedSteps[key]))
  const completeStep = useProgress((s) => s.completeStep)
  const uncompleteStep = useProgress((s) => s.uncompleteStep)

  return (
    <label
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl cursor-pointer transition',
        checked ? 'bg-accent-subtle/60' : 'hover:bg-bg-subtle',
      )}
    >
      <button
        type="button"
        onClick={() => (checked ? uncompleteStep(key) : completeStep(key))}
        className={cn(
          'mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition',
          checked
            ? 'bg-accent border-accent text-white'
            : 'border-border-strong bg-bg-card hover:border-accent',
        )}
        aria-pressed={checked}
      >
        {checked && <Check size={12} strokeWidth={3} />}
      </button>
      <span className={cn('text-sm', checked ? 'text-ink-muted line-through' : 'text-ink')}>
        {label}
      </span>
    </label>
  )
}
