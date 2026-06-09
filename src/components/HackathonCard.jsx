import { Link } from 'react-router-dom'
import { Calendar, ExternalLink, ChevronRight, CheckCircle2, Circle } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { formatDate, isOverdue, daysUntil } from '../lib/utils'

export default function HackathonCard({ hackathon }) {
  const phases = hackathon.phases || []
  const completedPhases = phases.filter(p => p.is_completed).length
  const totalPhases = phases.length
  const progress = totalPhases > 0 ? (completedPhases / totalPhases) * 100 : 0
  const days = daysUntil(hackathon.overall_deadline)
  const overdue = isOverdue(hackathon.overall_deadline) && hackathon.status !== 'completed'

  return (
    <Link
      to={`/hackathons/${hackathon.id}`}
      className="card group block hover:border-blue/40 hover:shadow-blue-glow transition-all duration-300 animate-fade-in"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl tracking-wide text-white group-hover:text-blue-glow transition-colors truncate">
              {hackathon.name}
            </h3>
            <p className="text-white-dim text-sm font-body mt-0.5 truncate">{hackathon.organizer}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={hackathon.status} />
            <ChevronRight size={16} className="text-white-dim group-hover:text-blue-glow group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Description */}
        {hackathon.description && (
          <p className="text-white-dim text-sm font-body line-clamp-2 mb-4 leading-relaxed">
            {hackathon.description}
          </p>
        )}

        {/* Our idea chip */}
        {hackathon.our_idea && (
          <div className="mb-4 bg-blue/5 border border-blue/15 rounded-lg px-3 py-2">
            <span className="text-xs font-mono text-blue-glow uppercase tracking-widest">Our Idea</span>
            <p className="text-white text-sm mt-0.5 line-clamp-1">{hackathon.our_idea}</p>
          </div>
        )}

        {/* Phase progress */}
        {totalPhases > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono text-white-dim">Phases</span>
              <span className="text-xs font-mono text-white-dim">{completedPhases}/{totalPhases}</span>
            </div>
            <div className="h-1.5 bg-black-4 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue to-blue-glow rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Phase dots */}
            <div className="flex gap-1.5 mt-2">
              {phases.slice(0, 8).map(phase => (
                <div key={phase.id} title={phase.name}>
                  {phase.is_completed
                    ? <CheckCircle2 size={12} className="text-blue-glow" />
                    : <Circle size={12} className="text-white-dim/30" />
                  }
                </div>
              ))}
              {phases.length > 8 && (
                <span className="text-xs text-white-dim font-mono">+{phases.length - 8}</span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <Calendar size={12} className={overdue ? 'text-red' : 'text-white-dim'} />
            {hackathon.overall_deadline ? (
              <span className={overdue ? 'text-red' : 'text-white-dim'}>
                {overdue ? 'Overdue · ' : ''}{formatDate(hackathon.overall_deadline)}
              </span>
            ) : (
              <span className="text-white-dim">No deadline set</span>
            )}
          </div>

          {hackathon.link && (
            <a
              href={hackathon.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-white-dim hover:text-blue-glow transition-colors font-mono"
            >
              <ExternalLink size={11} />
              Visit
            </a>
          )}
        </div>

        {/* Urgency strip */}
        {!overdue && days !== null && days <= 7 && hackathon.status !== 'completed' && (
          <div className="mt-3 bg-red/5 border border-red/20 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
            <span className="text-xs font-mono text-red">
              {days === 0 ? 'Due today!' : `${days} day${days === 1 ? '' : 's'} left`}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
