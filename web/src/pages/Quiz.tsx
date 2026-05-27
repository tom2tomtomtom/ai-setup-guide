import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronRight, RotateCcw } from 'lucide-react'
import { Shell } from '../components/Shell'
import { QUIZ_QUESTIONS, scoreProfile } from '../content/quiz'
import { useProgress, type Profile } from '../state/useProgress'
import { milestoneById } from '../content/milestones'
import { cn } from '../lib/cn'

export function Quiz() {
  const navigate = useNavigate()
  const setProfile = useProgress((s) => s.setProfile)
  const setRecommendedMilestone = useProgress((s) => s.setRecommendedMilestone)
  const setQuizCompleted = useProgress((s) => s.setQuizCompleted)
  const profile = useProgress((s) => s.profile)
  const [answers, setAnswers] = useState<Partial<Profile>>({})
  const [showResult, setShowResult] = useState(false)

  const required = ['aiUsage', 'os', 'terminalComfort', 'paidPlan', 'nodeInstalled', 'triedClaudeCode']
  const allAnswered = required.every((k) => answers[k as keyof Profile] !== undefined)

  function setAnswer<K extends keyof Profile>(key: K, value: Profile[K]) {
    setAnswers((a) => ({ ...a, [key]: value }))
  }

  function toggleGoal(value: string) {
    const current = (answers.goals as string[] | undefined) ?? profile.goals ?? []
    const next = current.includes(value) ? current.filter((g) => g !== value) : [...current, value]
    setAnswers((a) => ({ ...a, goals: next }))
  }

  function submit() {
    const merged: Profile = { ...profile, ...answers } as Profile
    setProfile(merged)
    const { recommended } = scoreProfile(merged)
    setRecommendedMilestone(recommended)
    setQuizCompleted(true)
    setShowResult(true)
  }

  if (showResult) {
    const merged: Profile = { ...profile, ...answers } as Profile
    const { recommended, reasoning } = scoreProfile(merged)
    const milestone = milestoneById(recommended)
    return (
      <Shell>
        <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <div className="card p-8 sm:p-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-subtle px-3 py-1 text-xs font-medium text-accent-dark mb-5">
              You're starting at
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
              {milestone?.title}
            </h1>
            <p className="text-ink-muted leading-relaxed max-w-xl mx-auto">{reasoning}</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate(`/wizard/${recommended}`)}
                className="btn-primary text-lg px-6 py-4"
              >
                Let's go
                <ArrowRight size={18} />
              </button>
              <Link to="/wizard/mindset" className="btn-secondary">
                Actually I'm further along, take me to all milestones
              </Link>
            </div>
            <button
              onClick={() => {
                setShowResult(false)
                setAnswers({})
              }}
              className="mt-6 btn-ghost text-sm"
            >
              <RotateCcw size={14} />
              Retake the quiz
            </button>
          </div>
        </section>
      </Shell>
    )
  }

  return (
    <Shell>
      <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            7 questions, under 2 minutes
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">
            Where are you right now?
          </h1>
          <p className="text-ink-muted mt-2">
            Answer honestly. We use this to skip the bits you already know.
          </p>
        </div>

        <div className="space-y-8">
          {QUIZ_QUESTIONS.map((q, idx) => (
            <div key={q.id} className="card p-5 sm:p-6">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Question {idx + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1">{q.title}</h3>
              {q.help && <p className="text-sm text-ink-muted mb-3">{q.help}</p>}

              {q.type === 'scored' && (
                <div className="grid sm:grid-cols-2 gap-2 mt-3">
                  {q.options.map((opt) => {
                    const active = answers[q.id as keyof Profile] === opt.value
                    return (
                      <button
                        key={String(opt.value)}
                        onClick={() => setAnswer(q.id as 'aiUsage', opt.value as 0 | 1 | 2 | 3)}
                        className={cn(
                          'text-left rounded-xl border p-3 transition',
                          active
                            ? 'border-accent bg-accent-subtle'
                            : 'border-border bg-bg-card hover:border-border-strong hover:bg-bg-subtle',
                        )}
                      >
                        <div className="font-medium text-ink">{opt.label}</div>
                        {opt.sublabel && (
                          <div className="text-xs text-ink-muted mt-0.5">{opt.sublabel}</div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {q.type === 'os' && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {q.options.map((opt) => {
                    const active = answers.os === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setAnswer('os', opt.value)}
                        className={cn(
                          'rounded-xl border p-4 text-center transition font-medium',
                          active
                            ? 'border-accent bg-accent-subtle text-ink'
                            : 'border-border bg-bg-card hover:border-border-strong hover:bg-bg-subtle text-ink',
                        )}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              )}

              {q.type === 'multi' && (
                <div className="grid sm:grid-cols-2 gap-2 mt-3">
                  {q.options.map((opt) => {
                    const goals = (answers.goals as string[] | undefined) ?? []
                    const active = goals.includes(opt.value)
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleGoal(opt.value)}
                        className={cn(
                          'text-left rounded-xl border p-3 transition',
                          active
                            ? 'border-accent bg-accent-subtle'
                            : 'border-border bg-bg-card hover:border-border-strong hover:bg-bg-subtle',
                        )}
                      >
                        <div className="font-medium text-ink">{opt.label}</div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={submit}
            disabled={!allAnswered}
            className={cn('btn-primary text-lg px-7 py-4', !allAnswered && 'opacity-50 cursor-not-allowed')}
          >
            See where I'm starting
            <ChevronRight size={18} />
          </button>
        </div>
        {!allAnswered && (
          <p className="text-center text-xs text-ink-subtle mt-3">
            Answer questions 1-6 to see your recommended starting point. Goals are optional.
          </p>
        )}
      </section>
    </Shell>
  )
}
