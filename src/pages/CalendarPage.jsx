import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  ListChecks,
} from 'lucide-react'
import { useHackathons } from '../hooks/useHackathons'
import { format, addDays, addMonths, endOfMonth, endOfWeek, isSameDay, isSameMonth, isToday, isValid, parseISO, startOfMonth, startOfWeek, subMonths } from 'date-fns'

function parseDate(value) {
  if (!value) return null
  const date = typeof value === 'string' ? parseISO(value) : new Date(value)
  return isValid(date) ? date : null
}

export default function CalendarPage() {
  const { hackathons, loading } = useHackathons(null)
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => new Date())

  const events = useMemo(() => {
    return hackathons.flatMap((hackathon) => {
      const items = []
      if (hackathon.overall_deadline) {
        const date = parseDate(hackathon.overall_deadline)
        if (date) {
          items.push({
            date,
            title: `${hackathon.name} deadline`,
            type: 'Hackathon',
            hackathonId: hackathon.id,
            hackathonName: hackathon.name,
          })
        }
      }

      return items.concat(
        (hackathon.phases || [])
          .map((phase) => {
            const date = parseDate(phase.deadline)
            if (!date) return null
            return {
              date,
              title: phase.name || 'Phase deadline',
              subtext: hackathon.name,
              type: 'Phase',
              hackathonId: hackathon.id,
              hackathonName: hackathon.name,
              description: phase.description || phase.what_to_submit || '',
            }
          })
          .filter(Boolean)
      )
    })
  }, [hackathons])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = []
  let day = calendarStart
  while (day <= calendarEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  const selectedEvents = events.filter((event) => isSameDay(event.date, selectedDate))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center">
              <CalendarDays size={18} className="text-blue-glow" />
            </div>
            <div>
              <h1 className="page-title">Calendar</h1>
              <p className="text-white-dim font-mono text-sm mt-1">
                View hackathon deadlines and phase due dates by day.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row items-start sm:items-center">
          <Link to="/" className="btn-secondary text-sm py-2 px-3">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-black-2 px-3 py-2">
            <button
              type="button"
              onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
              className="text-white-dim hover:text-white"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-sm font-display text-white">{format(monthStart, 'MMMM yyyy')}</div>
            <button
              type="button"
              onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
              className="text-white-dim hover:text-white"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2 text-xs uppercase tracking-[0.24em] text-white-dim">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName) => (
              <div key={dayName} className="text-center">
                {dayName}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((dateItem) => {
              const dayEvents = events.filter((event) => isSameDay(event.date, dateItem))
              const isCurrentMonth = isSameMonth(dateItem, monthStart)
              const selected = isSameDay(dateItem, selectedDate)
              return (
                <button
                  key={dateItem.toISOString()}
                  type="button"
                  onClick={() => setSelectedDate(dateItem)}
                  className={`min-h-[100px] rounded-2xl border p-3 text-left transition-all duration-150 ${
                    selected ? 'border-blue bg-blue/10 shadow-blue-glow' : 'border-border bg-black-3 hover:border-blue/20'
                  } ${isCurrentMonth ? '' : 'opacity-40'} ${isToday(dateItem) ? 'ring-1 ring-blue/30' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-white-dim'}`}>
                      {format(dateItem, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.24em] text-blue">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event, idx) => (
                      <div key={`${event.title}-${idx}`} className="overflow-hidden text-[11px] text-white-dim leading-4">
                        {event.type === 'Phase' ? `${event.title}` : `${event.title}`}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-white-dim/70">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card border p-5">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <div className="text-sm text-white-dim">Selected date</div>
                <div className="text-xl font-display text-white">{format(selectedDate, 'EEEE, MMMM d')}</div>
              </div>
              <div className="rounded-full border border-blue/20 bg-blue/5 px-3 py-1 text-xs text-blue-glow uppercase tracking-[0.24em]">
                {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="h-16 rounded-2xl bg-black-3 animate-pulse" />
                ))}
              </div>
            ) : selectedEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-white-dim">
                No events scheduled for this day.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event, idx) => (
                  <div key={`${event.title}-${idx}`} className="rounded-3xl border border-border bg-black-2 p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="text-sm font-semibold text-white">{event.title}</div>
                        <div className="text-xs text-white-dim">{event.type === 'Phase' ? `Phase • ${event.subtext}` : 'Hackathon deadline'}</div>
                      </div>
                      <div className="text-xs uppercase tracking-[0.24em] text-blue-glow">
                        {event.type}
                      </div>
                    </div>
                    {event.description && (
                      <p className="text-sm text-white-dim mb-3">{event.description}</p>
                    )}
                    <Link to={`/hackathons/${event.hackathonId}`} className="inline-flex items-center gap-2 text-xs text-blue-glow hover:text-white transition-colors">
                      <ListChecks size={14} />
                      View hackathon
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
