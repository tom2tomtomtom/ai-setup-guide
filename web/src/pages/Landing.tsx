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
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent-subtle px-3 py-1 text-xs font-medium text-accent-dark mb-6">
          <Sparkles size={14} />
          No terminal needed for Day 1
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
          Clone an operator's Claude stack.
        </h1>
        <p className="text-lg sm:text-xl text-ink-muted leading-relaxed max-w-2xl mx-auto">
          A guided walkthrough that drops you into Tom Hyde's actual working setup. 88 skills, 57 commands, 8 review agents, the lot. Free. No signup. Done in an evening.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/quiz" className="btn-primary text-lg px-6 py-4">
            Take the 2-minute quiz
            <ArrowRight size={18} />
          </Link>
          <Link to="/wizard/mindset" className="btn-secondary">
            Skip the quiz, show me the milestones
          </Link>
        </div>
        <p className="text-xs text-ink-subtle mt-5">
          For Day 1 you only need a browser. Terminal arrives later, when you're ready.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
          <Stat number="88" label="curated skills" />
          <Stat number="57" label="slash commands" />
          <Stat number="8" label="review agents" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16 grid sm:grid-cols-3 gap-4">
        <Feature
          icon={<Compass size={20} />}
          title="We meet you where you are"
          body="A short quiz figures out your starting point so you don't sit through stuff you already know."
        />
        <Feature
          icon={<Wrench size={20} />}
          title="Step by step, with copy buttons"
          body="Every command has a one-click copy. Every step tells you what success looks like and what to do when it doesn't."
        />
        <Feature
          icon={<Sparkles size={20} />}
          title="Resume any time"
          body="Progress lives in your browser. Close the tab, open it tomorrow, pick up where you left off."
        />
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="card p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">Why Claude is my preferred AI OS</h2>
          <p className="text-sm text-ink-subtle mb-5">
            This guide is Claude-only on purpose. Five reasons.
          </p>
          <ol className="space-y-4 text-ink-muted leading-relaxed">
            <li>
              <span className="text-ink font-medium">The writing is sharper.</span>{' '}
              Less hedging, less corporate, fewer apologies. That matters when every piece of output goes to a client.
            </li>
            <li>
              <span className="text-ink font-medium">Projects, Skills, and Connectors compose into a real operator stack.</span>{' '}
              Other tools have features. Claude has primitives that combine. A Project for each client, a Skill for each repeated task, Connectors that read my actual world. The whole is more than the parts.
            </li>
            <li>
              <span className="text-ink font-medium">Claude Code turns the terminal into an agent.</span>{' '}
              It writes code, runs shell, edits files, orchestrates sub-agents, calls connectors. My entire engineering practice runs through it. No other CLI is even close.
            </li>
            <li>
              <span className="text-ink font-medium">Memory and Projects mean I never re-explain who I am.</span>{' '}
              Six months of context accumulates. By month three, sessions feel like talking to a colleague who has read your notes.
            </li>
            <li>
              <span className="text-ink font-medium">Anthropic ships in the right places.</span>{' '}
              Computer Use, Coworker, Skills, Connectors, Artifacts. Each release extended the operator surface, not the chatbot surface. The pace is matched to how I actually want to use it.
            </li>
          </ol>
          <p className="mt-6 text-ink-muted leading-relaxed">
            I run my whole business on Claude. My consultancy. AIDEN, the platform I sell. My daily writing. My code. My BD pipeline. This guide reflects that. I'm not going to teach you something I don't use myself.
          </p>
          <p className="mt-3 text-ink-muted leading-relaxed">
            If you're already committed to a different tool, that's fine. OpenAI and Google both have their own onboarding. Come back when you want to climb into operator mode.
          </p>
        </div>
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

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="card py-5 px-3">
      <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">{number}</div>
      <div className="text-xs sm:text-sm text-ink-muted mt-1">{label}</div>
    </div>
  )
}
