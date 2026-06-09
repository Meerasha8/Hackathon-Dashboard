import { STATUS_CONFIG } from '../lib/utils'

export default function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming
  const textSize = size === 'sm' ? 'text-xs' : 'text-xs'

  return (
    <span className={`badge ${config.color} ${textSize}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse-slow`} />
      {config.label}
    </span>
  )
}
