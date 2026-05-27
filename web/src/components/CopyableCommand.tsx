import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useProgress } from '../state/useProgress'
import type { Command, OS } from '../content/types'
import { cn } from '../lib/cn'

function pickVariant(cmd: Command, os: OS | null): string | null {
  if (os && cmd.variants[os]) return cmd.variants[os] as string
  if (cmd.variants.default) return cmd.variants.default
  // fall back to any defined variant
  const first = Object.values(cmd.variants).find(Boolean)
  return (first as string) ?? null
}

export function CopyableCommand({ command }: { command: Command }) {
  const profile = useProgress((s) => s.profile)
  const setProfile = useProgress((s) => s.setProfile)
  const [copied, setCopied] = useState(false)

  const osChoices: OS[] = ['mac', 'windows', 'linux'].filter((o) =>
    Boolean(command.variants[o as OS] || command.variants.default),
  ) as OS[]

  const hasOsTabs = osChoices.length > 1 && !command.variants.default
  const activeOs = profile.os ?? osChoices[0] ?? 'mac'
  const text = pickVariant(command, profile.os)

  const onCopy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // fallback for unsupported browsers: highlight the text
    }
  }

  if (!text) return null

  return (
    <div className="card overflow-hidden my-4">
      {command.label && (
        <div className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-muted border-b border-border bg-bg-subtle">
          {command.label}
        </div>
      )}
      {hasOsTabs && (
        <div className="flex gap-1 px-2 pt-2">
          {osChoices.map((o) => (
            <button
              key={o}
              onClick={() => setProfile({ os: o })}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-lg transition',
                activeOs === o
                  ? 'bg-ink text-bg'
                  : 'text-ink-muted hover:bg-bg-subtle hover:text-ink',
              )}
            >
              {o === 'mac' ? 'Mac' : o === 'windows' ? 'Windows' : 'Linux'}
            </button>
          ))}
        </div>
      )}
      <div className="relative">
        <pre className="m-0 p-4 text-sm font-mono text-ink whitespace-pre-wrap break-words overflow-x-auto">
          {text}
        </pre>
        <button
          onClick={onCopy}
          className={cn(
            'absolute top-2 right-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition',
            copied
              ? 'bg-ok text-white'
              : 'bg-bg-subtle text-ink-muted hover:bg-border hover:text-ink',
          )}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {command.expectedOutput && (
        <div className="px-4 py-3 text-xs text-ink-muted border-t border-border bg-bg-subtle">
          <strong className="text-ink">What you should see:</strong> {command.expectedOutput}
        </div>
      )}
    </div>
  )
}
