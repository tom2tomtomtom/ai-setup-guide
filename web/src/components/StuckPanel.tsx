import { useState } from 'react'
import { LifeBuoy, ChevronDown, Copy, Check } from 'lucide-react'
import { useProgress } from '../state/useProgress'
import type { Step } from '../content/types'
import { cn } from '../lib/cn'

export function StuckPanel({ step, milestoneTitle }: { step: Step; milestoneTitle: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const profile = useProgress((s) => s.profile)

  const errors: { match: string; fix: string }[] = []
  for (const c of step.commands ?? []) {
    for (const e of c.commonErrors ?? []) errors.push(e)
  }
  for (const e of step.commonErrors ?? []) errors.push(e)

  const helpPrompt = `I'm following Tom Hyde's "AI Setup Guide" and I'm stuck on the "${step.title}" step inside the "${milestoneTitle}" milestone. My OS is ${profile.os ?? 'unknown'}. Here is what was supposed to happen and what actually happened:

[paste the command you ran]
[paste the error message you got]

What is the most likely cause and the fastest fix? If you need more info, ask me one specific question.`

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(helpPrompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // ignore
    }
  }

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-bg-subtle"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-ink">
          <LifeBuoy size={16} className="text-accent" />
          Stuck?
        </span>
        <ChevronDown
          size={16}
          className={cn('text-ink-muted transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-border space-y-4">
          {errors.length > 0 && (
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
                Most likely causes
              </div>
              <ul className="space-y-2">
                {errors.map((e, i) => (
                  <li key={i} className="text-sm text-ink">
                    <span className="font-mono text-xs bg-bg-subtle px-1.5 py-0.5 rounded text-ink-muted">
                      {e.match}
                    </span>
                    <span className="block mt-1 text-ink-muted">{e.fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
              Or, ask Claude directly
            </div>
            <p className="text-sm text-ink-muted mb-2">
              Copy this prompt, paste it into Claude (web or desktop), and follow what it says.
            </p>
            <button onClick={onCopy} className={cn('btn-secondary w-full justify-center text-sm py-2')}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied prompt' : 'Copy help prompt'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
