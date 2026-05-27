import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, Download, ArrowLeft, Sparkles } from 'lucide-react'
import { Shell } from '../components/Shell'
import { useProgress } from '../state/useProgress'
import { generateCheatsheet } from '../lib/cheatsheet'
import { cn } from '../lib/cn'

export function Cheatsheet() {
  const state = useProgress()
  const cheatsheet = useMemo(() => generateCheatsheet(state), [state])
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(cheatsheet)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      // ignore
    }
  }

  const onDownload = () => {
    const blob = new Blob([cheatsheet], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-claude-operator-stack.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-subtle px-3 py-1 text-xs font-medium text-accent-dark mb-4">
            <Sparkles size={14} />
            Your personalised stack summary
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            Your Claude Operator Stack
          </h1>
          <p className="text-ink-muted leading-relaxed max-w-2xl mx-auto">
            A one-page markdown summary of what you've built, what to write next, and a weekly review prompt to keep it sharp. Save it. Drop it in your vault. Refresh it every 90 days.
          </p>
        </div>

        <div className="card p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={onCopy}
              className={cn('btn-primary flex-1 justify-center', copied && 'bg-ok hover:bg-ok')}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy as markdown'}
            </button>
            <button onClick={onDownload} className="btn-secondary flex-1 justify-center">
              <Download size={16} />
              Download .md
            </button>
          </div>
          <pre className="p-4 bg-bg-subtle rounded-xl text-xs font-mono whitespace-pre-wrap text-ink max-h-[480px] overflow-y-auto">
            {cheatsheet}
          </pre>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-2">Where to put this</h2>
          <ul className="text-sm text-ink-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-ink">In your vault</strong> as{' '}
              <code className="bg-bg-subtle px-1.5 py-0.5 rounded text-xs">_vault-index.md</code>{' '}
              or{' '}
              <code className="bg-bg-subtle px-1.5 py-0.5 rounded text-xs">My Claude Stack.md</code>
              . Now Claude reads it every session.
            </li>
            <li>
              <strong className="text-ink">In your CLAUDE.md</strong> as a "current setup" section so
              every Claude Code session starts knowing what you have built.
            </li>
            <li>
              <strong className="text-ink">On LinkedIn or your blog</strong> if you want to share what
              you set up. Sharing the recipe attracts people who want the same thing.
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link to="/wizard" className="btn-ghost">
            <ArrowLeft size={14} />
            Back to all milestones
          </Link>
        </div>
      </section>
    </Shell>
  )
}
