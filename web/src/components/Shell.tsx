import { Link } from 'react-router-dom'
import { Code2 } from 'lucide-react'
import { cn } from '../lib/cn'

export function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col">
      <header className="border-b border-border bg-bg-card/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-ink">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent" />
            AI Setup Guide
          </Link>
          <a
            href="https://github.com/tom2tomtomtom/ai-setup-guide"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            <Code2 size={16} />
            <span className="hidden sm:inline">Source on GitHub</span>
          </a>
        </div>
      </header>
      <main className={cn('flex-1', className)}>{children}</main>
      <footer className="border-t border-border bg-bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-ink-muted flex flex-col sm:flex-row gap-2 sm:justify-between">
          <div>
            By <span className="text-ink">Tom Hyde</span>. CC BY 4.0. Fork it, adapt it, ship your own version.
          </div>
          <div className="text-ink-subtle">No accounts. No tracking. Everything in your browser.</div>
        </div>
      </footer>
    </div>
  )
}
