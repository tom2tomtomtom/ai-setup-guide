import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, Sparkles } from 'lucide-react'
import { Shell } from '../components/Shell'
import { SELF_ONBOARDING_PROMPT } from '../content/selfOnboardingPrompt'
import { useProgress } from '../state/useProgress'
import { cn } from '../lib/cn'

const PHASES = [
  '1. Discovery: answered the 10 questions',
  '2. Vault setup: folders and CLAUDE.md created',
  '3. Connect: Gmail, Calendar, Drive confirmed',
  '4. Digital sweep: contacts, threads, projects extracted',
  '5. Vault bootstrap: People, Projects, Pipeline, Daily Note written',
  '6. Review: top 5 people, stale commitments, ambiguous projects flagged',
  '7. Learning plan: 30/60/90 saved to LEARNING-PLAN.md',
  '8. Commit: vault initial commit, optional push',
  '9. Handover: tomorrow morning task, weekly review prompt',
]

export function PromptDeploy() {
  const [copied, setCopied] = useState(false)
  const completedSteps = useProgress((s) => s.completedSteps)
  const completeStep = useProgress((s) => s.completeStep)
  const uncompleteStep = useProgress((s) => s.uncompleteStep)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(SELF_ONBOARDING_PROMPT)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      // ignore
    }
  }

  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-subtle px-3 py-1 text-xs font-medium text-accent-dark mb-4">
            <Sparkles size={14} />
            The final step
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            Deploy the Self-Onboarding Prompt
          </h1>
          <p className="text-ink-muted leading-relaxed">
            Copy the prompt below. Open a fresh Claude Code session in your terminal. Paste. Answer
            the questions. The agent does the rest.
          </p>
        </div>

        <div className="card p-6 mb-6">
          <button
            onClick={onCopy}
            className={cn(
              'btn-primary w-full justify-center text-lg py-4 mb-4',
              copied && 'bg-ok hover:bg-ok',
            )}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            {copied ? 'Copied. Now paste in Claude Code.' : 'Copy the whole prompt'}
          </button>
          <details className="text-sm">
            <summary className="cursor-pointer text-ink-muted hover:text-ink">
              Show the prompt
            </summary>
            <pre className="mt-3 p-4 bg-bg-subtle rounded-xl text-xs font-mono whitespace-pre-wrap text-ink overflow-x-auto max-h-96 overflow-y-auto">
              {SELF_ONBOARDING_PROMPT}
            </pre>
          </details>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-1">Track the 9 phases as the agent runs</h2>
          <p className="text-sm text-ink-muted mb-4">
            Tick each phase as the agent confirms it. It should take 30 to 40 minutes total.
          </p>
          <ul className="space-y-1">
            {PHASES.map((label, i) => {
              const key = `prompt/phase-${i + 1}`
              const checked = Boolean(completedSteps[key])
              return (
                <li key={key}>
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
                    >
                      {checked && <Check size={12} strokeWidth={3} />}
                    </button>
                    <span className={cn('text-sm', checked && 'text-ink-muted line-through')}>
                      {label}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="card p-6 mt-6">
          <h2 className="font-semibold mb-2">Finished? Generate your stack cheatsheet.</h2>
          <p className="text-sm text-ink-muted mb-4">
            A one-page markdown summary of what you built, your daily routine, three skills to write next, and a Sunday-night review prompt. Save it, drop it in your vault, refresh it every 90 days.
          </p>
          <Link to="/cheatsheet" className="btn-primary w-full justify-center">
            <Sparkles size={16} />
            Open my cheatsheet
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link to="/wizard/self-onboarding-prompt" className="btn-ghost">
            Back to the milestone
          </Link>
        </div>
      </section>
    </Shell>
  )
}
