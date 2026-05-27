import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, Compass, Wrench } from 'lucide-react'
import { Shell } from '../components/Shell'
import { useProgress } from '../state/useProgress'
import { useEffect } from 'react'

export function Landing() {
  const navigate = useNavigate()
  const quizCompleted = useProgress((s) => s.quizCompleted)
  const lastTouchedAt = useProgress((s) => s.lastTouchedAt)
  const currentMilestone = useProgress((s) => s.currentMilestone)

  useEffect(() => {
    if (quizCompleted && currentMilestone && lastTouchedAt) {
      const age = Date.now() - new Date(lastTouchedAt).getTime()
      if (age > 60 * 60 * 1000) {
        navigate('/resume', { replace: true })
      }
    }
  }, [quizCompleted, lastTouchedAt, currentMilestone, navigate])

  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent-subtle px-3 py-1 text-xs font-medium text-accent-dark mb-6">
          <Sparkles size={14} />
          A guided setup for your personal AI stack
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
          Set up your AI. Step by step.
        </h1>
        <p className="text-lg sm:text-xl text-ink-muted leading-relaxed max-w-2xl mx-auto">
          A friendly walkthrough from "I just got an AI account" to "my Gmail, calendar, and notes
          are powering a real assistant on my computer." Built by Tom Hyde. Free. No signup.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/quiz" className="btn-primary text-lg px-6 py-4">
            Take the 2-minute quiz
            <ArrowRight size={18} />
          </Link>
          <Link to="/wizard/mindset" className="btn-secondary">
            I know what I'm doing, just take me in
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20 grid sm:grid-cols-3 gap-4">
        <Feature
          icon={<Compass size={20} />}
          title="We meet you where you are"
          body="A short quiz figures out your starting point so you don't sit through stuff you already know."
        />
        <Feature
          icon={<Wrench size={20} />}
          title="Step by step, with copy buttons"
          body="Every command has a one-click copy. Every step tells you what success looks like, and what to do when it doesn't."
        />
        <Feature
          icon={<Sparkles size={20} />}
          title="Resume any time"
          body="Your progress lives in your browser. Close the tab, open it tomorrow, pick up where you left off."
        />
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-20 text-center">
        <p className="text-sm text-ink-subtle">
          The full source is open on{' '}
          <a
            className="text-accent hover:underline"
            href="https://github.com/tom2tomtomtom/ai-setup-guide"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          . Read the long-form guide, fork the repo, or self-host this wizard.
        </p>
      </section>
    </Shell>
  )
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card p-5">
      <div className="w-9 h-9 rounded-lg bg-accent-subtle text-accent-dark flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-ink-muted leading-relaxed">{body}</p>
    </div>
  )
}
