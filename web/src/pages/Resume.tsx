import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, RotateCcw, Plus } from 'lucide-react'
import { Shell } from '../components/Shell'
import { useProgress } from '../state/useProgress'
import { milestoneById } from '../content/milestones'

export function Resume() {
  const navigate = useNavigate()
  const currentMilestone = useProgress((s) => s.currentMilestone)
  const currentStepId = useProgress((s) => s.currentStepId)
  const reset = useProgress((s) => s.reset)

  const milestone = currentMilestone ? milestoneById(currentMilestone) : null
  const step = milestone?.steps.find((s) => s.id === currentStepId)

  return (
    <Shell>
      <section className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="card p-8 sm:p-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight mb-3">Welcome back.</h1>
          {milestone && step ? (
            <>
              <p className="text-ink-muted leading-relaxed mb-2">
                You were in <strong className="text-ink">{milestone.title}</strong> on the step:
              </p>
              <p className="text-lg text-ink mb-8">"{step.title}"</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => navigate(`/wizard/${milestone.id}/${step.id}`)}
                  className="btn-primary text-lg px-6 py-3"
                >
                  Continue where I left off
                  <ArrowRight size={18} />
                </button>
                <Link to="/wizard/mindset" className="btn-secondary">
                  See all milestones
                </Link>
              </div>
              <button
                onClick={() => {
                  if (confirm('Wipe progress and start fresh?')) {
                    reset()
                    navigate('/')
                  }
                }}
                className="mt-6 btn-ghost text-sm"
              >
                <RotateCcw size={14} />
                Reset and start over
              </button>
            </>
          ) : (
            <>
              <p className="text-ink-muted mb-6">Nothing in progress yet.</p>
              <Link to="/quiz" className="btn-primary">
                Take the quiz
                <Plus size={16} />
              </Link>
            </>
          )}
        </div>
      </section>
    </Shell>
  )
}
