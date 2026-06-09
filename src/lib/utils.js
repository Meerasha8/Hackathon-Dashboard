import { format, formatDistanceToNow, isPast, isToday, differenceInDays } from 'date-fns'

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return format(new Date(dateStr), 'dd MMM yyyy')
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return format(new Date(dateStr), 'dd MMM yyyy, hh:mm a')
}

export function timeFromNow(dateStr) {
  if (!dateStr) return ''
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function isOverdue(dateStr) {
  if (!dateStr) return false
  return isPast(new Date(dateStr))
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  return differenceInDays(new Date(dateStr), new Date())
}

export const STATUS_CONFIG = {
  upcoming: {
    label: 'Upcoming',
    color: 'bg-blue/10 text-blue-glow border border-blue/20',
    dot: 'bg-blue',
  },
  active: {
    label: 'Active',
    color: 'bg-green-500/10 text-green-400 border border-green-500/20',
    dot: 'bg-green-400',
  },
  registered: {
    label: 'Registered',
    color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    dot: 'bg-purple-400',
  },
  idea_submitted: {
    label: 'Idea Submitted',
    color: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    dot: 'bg-yellow-400',
  },
  submitted: {
    label: 'Submitted',
    color: 'bg-blue/10 text-blue-glow border border-blue/20',
    dot: 'bg-blue-glow',
  },
  completed: {
    label: 'Completed',
    color: 'bg-white/5 text-white-dim border border-white/10',
    dot: 'bg-white-dim',
  },
}

export const ALL_STATUSES = [
  'upcoming',
  'registered',
  'idea_submitted',
  'active',
  'submitted',
  'completed',
]
