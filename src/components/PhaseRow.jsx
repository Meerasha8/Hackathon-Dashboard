import { useState } from 'react'
import { CheckCircle2, Circle, Pencil, Trash2, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDate, isOverdue, daysUntil } from '../lib/utils'
import { togglePhaseComplete, updatePhase, deletePhase } from '../hooks/useHackathons'
import PhaseForm from './PhaseForm'
import toast from 'react-hot-toast'

export default function PhaseRow({ phase, index, onRefetch }) {
  const [editing, setEditing] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [toggling, setToggling] = useState(false)

  const overdue = isOverdue(phase.deadline) && !phase.is_completed
  const days = daysUntil(phase.deadline)

  const handleToggle = async () => {
    setToggling(true)
    try {
      await togglePhaseComplete(phase.id, phase.is_completed)
      if (typeof pendo !== 'undefined') {
        pendo.track('phase_completion_toggled', {
          phase_id: phase.id,
          hackathon_id: phase.hackathon_id,
          phase_name: phase.name,
          new_is_completed: !phase.is_completed,
        })
      }
      toast.success(phase.is_completed ? 'Phase marked pending' : 'Phase marked complete!')
      onRefetch()
    } catch (e) {
      toast.error('Failed to update phase')
    }
    setToggling(false)
  }

  const handleSave = async (data) => {
    try {
      await updatePhase(phase.id, {
        ...data,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      })
      if (typeof pendo !== 'undefined') {
        pendo.track('phase_updated', {
          phase_id: phase.id,
          hackathon_id: phase.hackathon_id,
          phase_name: data.name,
          has_deadline: Boolean(data.deadline),
          is_completed: data.is_completed,
        })
      }
      toast.success('Phase updated')
      setEditing(false)
      onRefetch()
    } catch (e) {
      toast.error('Failed to update phase')
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete phase "${phase.name}"?`)) return
    try {
      await deletePhase(phase.id)
      if (typeof pendo !== 'undefined') {
        pendo.track('phase_deleted', {
          phase_id: phase.id,
          hackathon_id: phase.hackathon_id,
          phase_name: phase.name,
          was_completed: phase.is_completed,
        })
      }
      toast.success('Phase deleted')
      onRefetch()
    } catch (e) {
      toast.error('Failed to delete phase')
    }
  }

  if (editing) {
    return (
      <PhaseForm
        phase={phase}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className={`card transition-all duration-200 ${phase.is_completed ? 'opacity-70' : ''} ${overdue ? 'border-red/20' : 'hover:border-blue/20'}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Complete toggle */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            className="mt-0.5 shrink-0 transition-transform hover:scale-110"
          >
            {phase.is_completed
              ? <CheckCircle2 size={20} className="text-blue-glow" />
              : <Circle size={20} className="text-white-dim/40 hover:text-blue-glow transition-colors" />
            }
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-xs text-white-dim shrink-0">#{String(index + 1).padStart(2, '0')}</span>
                <h4 className={`font-body font-medium text-sm truncate ${phase.is_completed ? 'line-through text-white-dim' : 'text-white'}`}>
                  {phase.name}
                </h4>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setExpanded(v => !v)}
                  className="p-1.5 text-white-dim hover:text-white transition-colors rounded-lg hover:bg-black-4"
                >
                  {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="p-1.5 text-white-dim hover:text-blue-glow transition-colors rounded-lg hover:bg-blue/10"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-white-dim hover:text-red transition-colors rounded-lg hover:bg-red/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Deadline row */}
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {phase.deadline && (
                <span className={`flex items-center gap-1 text-xs font-mono ${overdue ? 'text-red' : 'text-white-dim'}`}>
                  <Calendar size={11} />
                  {formatDate(phase.deadline)}
                  {overdue && ' · Overdue'}
                  {!overdue && days !== null && days <= 7 && days >= 0 && (
                    <span className="text-yellow-400 ml-1">{days === 0 ? '· Due today' : `· ${days}d left`}</span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 ml-8 space-y-2.5 animate-slide-up">
            {phase.description && (
              <div>
                <span className="label">Description</span>
                <p className="text-sm text-white-dim leading-relaxed">{phase.description}</p>
              </div>
            )}
            {phase.what_to_submit && (
              <div>
                <span className="label flex items-center gap-1">
                  <FileText size={10} /> What to Submit
                </span>
                <p className="text-sm text-white leading-relaxed bg-black-2 rounded-lg p-3 border border-border">
                  {phase.what_to_submit}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
