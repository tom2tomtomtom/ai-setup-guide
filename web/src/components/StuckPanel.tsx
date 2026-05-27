import { useState } from 'react'
import { LifeBuoy, ChevronDown, Copy, Check, MessageSquare } from 'lucide-react'
import { useProgress } from '../state/useProgress'
import type { Milestone, Step } from '../content/types'
import { cn } from '../lib/cn'
import { generateHelpPrompt } from '../lib/helpPrompt'

export function StuckPanel({ step, milestone }: { step: Step; milestone: Milestone }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const profile = useProgress((s) => s.profile)

  const errors: { match: string; fix: string }[] = []
  for (const c of step.commands ?? []) {
    for (const e of c.commonErrors ?? []) errors.push(e)
  }
  for (const e of step.commonErrors ?? []) errors.push(e)

  const helpPrompt = generateHelpPrompt(milestone, step, profile)
  const hasCommands = (step.commands?.length ?? 0) > 0

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(helpPrompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
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
          Stuck on this step?
        </span>
        <ChevronDown
          size={16}
          className={cn('text-ink-muted transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-border space-y-5">
          {errors.length > 0 && (
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
                Quick fixes for this step
              </div>
              <ul className="space-y-2">
                {errors.map((e, i) => (
                  <li key={i} className="text-sm">
                    <div className="font-mono text-xs bg-bg-subtle px-1.5 py-0.5 rounded text-ink-muted inline-block mb-1">
                      {e.match}
                    </div>
                    <div className="text-ink-muted">{e.fix}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted mb-2 flex items-center gap-1.5">
              <MessageSquare size={12} />
              Ask Claude with full context
            </div>
            <p className="text-sm text-ink-muted mb-3">
              {hasCommands
                ? "This prompt tells Claude what step you're on, what you tried, and asks Claude to interview you instead of guessing. Paste it into Claude (web, desktop, or Claude Code)."
                : "This prompt tells Claude what concept is confusing you and asks Claude to interview you first, then explain with one concrete example. Paste it into Claude."}
            </p>
            <button
              onClick={onCopy}
              className={cn('btn-primary w-full justify-center text-sm py-2.5 mb-2', copied && 'bg-ok hover:bg-ok')}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied. Now paste into Claude.' : 'Copy the help prompt'}
            </button>
            <button
              onClick={() => setShowPrompt((s) => !s)}
              className="btn-ghost w-full justify-center text-xs"
            >
              {showPrompt ? 'Hide the prompt' : 'Show the prompt before copying'}
            </button>
            {showPrompt && (
              <pre className="mt-3 p-3 bg-bg-subtle rounded-xl text-xs font-mono whitespace-pre-wrap text-ink max-h-72 overflow-y-auto">
                {helpPrompt}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
