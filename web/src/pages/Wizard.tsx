import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Shell } from '../components/Shell'
import { ProgressSidebar } from '../components/ProgressSidebar'
import { StepCard } from '../components/StepCard'
import { StuckPanel } from '../components/StuckPanel'
import { milestoneById, nextMilestone, prevMilestone, MILESTONES } from '../content/milestones'
import { useProgress } from '../state/useProgress'
import { cn } from '../lib/cn'
import type { MilestoneId } from '../content/types'

export function Wizard() {
  const { milestoneId, stepId } = useParams()
  const navigate = useNavigate()
  const setCurrent = useProgress((s) => s.setCurrent)
  const completeMilestone = useProgress((s) => s.completeMilestone)

  const milestone = milestoneById(milestoneId as MilestoneId)

  useEffect(() => {
    if (!milestone) {
      navigate('/', { replace: true })
      return
    }
    // If no stepId, redirect to first step
    if (!stepId) {
      const first = milestone.steps[0]?.id
      if (first) navigate(`/wizard/${milestone.id}/${first}`, { replace: true })
      return
    }
    setCurrent(milestone.id, stepId)
  }, [milestone, stepId, navigate, setCurrent])

  if (!milestone || !stepId) return null

  const stepIdx = milestone.steps.findIndex((s) => s.id === stepId)
  const step = milestone.steps[stepIdx]

  if (!step) {
    return (
      <Shell>
        <div className="p-10">Step not found.</div>
      </Shell>
    )
  }

  const prevStep = milestone.steps[stepIdx - 1]
  const nextStep = milestone.steps[stepIdx + 1]
  const nextMs = nextMilestone(milestone.id)
  const prevMs = prevMilestone(milestone.id)

  function goPrev() {
    if (prevStep) {
      navigate(`/wizard/${milestone!.id}/${prevStep.id}`)
    } else if (prevMs) {
      const m = milestoneById(prevMs)
      const last = m?.steps[m.steps.length - 1]
      if (m && last) navigate(`/wizard/${m.id}/${last.id}`)
    }
  }

  function goNext() {
    if (nextStep) {
      navigate(`/wizard/${milestone!.id}/${nextStep.id}`)
    } else {
      // Last step of milestone, mark milestone complete and advance
      completeMilestone(milestone!.id)
      if (milestone!.id === 'self-onboarding-prompt') {
        // already at the final milestone, send to the prompt deploy screen which is part of it
        navigate('/prompt')
      } else if (nextMs) {
        const m = milestoneById(nextMs)
        if (m) navigate(`/wizard/${m.id}/${m.steps[0].id}`)
      }
    }
  }

  // Special handling: milestone 8 deep-links to prompt deploy on its last step
  const onLastStep = !nextStep
  const showPromptDeployLink = milestone.id === 'self-onboarding-prompt' && onLastStep

  return (
    <Shell>
      <div className="flex">
        <ProgressSidebar />
        <div className="flex-1 min-w-0">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 grid xl:grid-cols-[minmax(0,1fr),260px] gap-6">
            <div className="min-w-0">
              {/* breadcrumb */}
              <div className="text-sm text-ink-muted mb-2">
                <Link to="/" className="hover:text-ink">
                  Home
                </Link>
                <span className="mx-1.5 text-ink-subtle">/</span>
                <span className="text-ink">
                  {milestone.title}: Step {stepIdx + 1} of {milestone.steps.length}
                </span>
              </div>

              <StepCard milestone={milestone} step={step} />

              {/* nav */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={goPrev}
                  disabled={!prevStep && !prevMs}
                  className={cn('btn-ghost', !prevStep && !prevMs && 'opacity-40 cursor-not-allowed')}
                >
                  <ArrowLeft size={16} />
                  {prevStep ? 'Previous step' : prevMs ? 'Previous milestone' : 'Start'}
                </button>
                <div className="flex items-center gap-2">
                  {showPromptDeployLink ? (
                    <Link to="/prompt" className="btn-primary">
                      Open the prompt screen
                      <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <button onClick={goNext} className="btn-primary">
                      {nextStep
                        ? 'Next step'
                        : nextMs
                        ? `Next: ${milestoneById(nextMs)?.title}`
                        : 'Finish'}
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>

              {onLastStep && (
                <div className="mt-6 card p-4 flex items-center gap-3">
                  <CheckCircle2 className="text-ok" size={20} />
                  <div className="text-sm">
                    You're at the end of <strong>{milestone.title}</strong>. Click {' '}
                    {showPromptDeployLink ? 'Open the prompt screen' : 'Next milestone'} to continue.
                  </div>
                </div>
              )}
            </div>

            {/* Stuck panel */}
            <aside className="xl:sticky xl:top-20 xl:self-start min-w-0">
              <StuckPanel step={step} milestone={milestone} />
              <div className="mt-4 text-xs text-ink-subtle px-2">
                Tip: progress lives only in your browser. Bookmark this page to resume later.
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Shell>
  )
}

export function MilestonesIndex() {
  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">All milestones</h1>
        <p className="text-ink-muted mb-8">Jump to any milestone. Your progress is saved as you go.</p>
        <div className="space-y-3">
          {MILESTONES.map((m) => (
            <Link
              key={m.id}
              to={`/wizard/${m.id}`}
              className="card p-5 flex items-start gap-4 hover:border-border-strong transition"
            >
              <div className="w-10 h-10 rounded-full bg-accent-subtle text-accent-dark flex items-center justify-center font-semibold shrink-0">
                {m.number}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-ink">{m.title}</div>
                <div className="text-sm text-ink-muted mt-0.5">{m.oneLiner}</div>
                <div className="text-xs text-ink-subtle mt-1">
                  {m.steps.length} steps, about {m.estMinutes} min
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  )
}
