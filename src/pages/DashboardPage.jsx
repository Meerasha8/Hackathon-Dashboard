import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Trophy, Zap, Clock, CheckCircle2 } from 'lucide-react'
import { useHackathons } from '../hooks/useHackathons'
import HackathonCard from '../components/HackathonCard'
import { STATUS_CONFIG, ALL_STATUSES } from '../lib/utils'

export default function DashboardPage() {
  const { hackathons, loading } = useHackathons(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = hackathons.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.organizer?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || h.status === statusFilter
    return matchSearch && matchStatus
  })

  // Stats
  const active = hackathons.filter(h => h.status === 'active').length
  const registered = hackathons.filter(h => h.status === 'registered').length
  const ideaSubmitted = hackathons.filter(h => h.status === 'idea_submitted').length
  const submitted = hackathons.filter(h => h.status === 'submitted').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-white-dim font-mono text-sm mt-1">
            {hackathons.length} active hackathon{hackathons.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/hackathons/new" className="btn-primary hidden sm:flex">
          <Plus size={16} />
          New Hackathon
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 stagger-children">
        <StatCard icon={Zap} label="Active" value={active} color="text-green-400" bg="bg-green-500/10 border-green-500/20" />
        <StatCard icon={Trophy} label="Registered" value={registered} color="text-purple-400" bg="bg-purple-500/10 border-purple-500/20" />
        <StatCard icon={Clock} label="Idea Submitted" value={ideaSubmitted} color="text-yellow-400" bg="bg-yellow-500/10 border-yellow-500/20" />
        <StatCard icon={CheckCircle2} label="Submitted" value={submitted} color="text-blue-glow" bg="bg-blue/10 border-blue/20" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white-dim pointer-events-none" />
          <input
            className="input pl-9"
            placeholder="Search hackathons..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterBtn active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>All</FilterBtn>
          {ALL_STATUSES.filter(s => s !== 'completed').map(s => (
            <FilterBtn key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
              {STATUS_CONFIG[s].label}
            </FilterBtn>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingGrid />
      ) : filtered.length === 0 ? (
        <EmptyState search={search} statusFilter={statusFilter} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {filtered.map(h => <HackathonCard key={h.id} hackathon={h} />)}
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className={`card border ${bg} p-4 flex items-center gap-3`}>
      <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
        <Icon size={18} className={color} />
      </div>
      <div>
        <div className={`text-2xl font-display tracking-wide ${color}`}>{value}</div>
        <div className="text-xs font-mono text-white-dim">{label}</div>
      </div>
    </div>
  )
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200
        ${active
          ? 'bg-blue text-white shadow-blue-glow'
          : 'bg-black-3 border border-border text-white-dim hover:text-white hover:border-blue/40'
        }`}
    >
      {children}
    </button>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card p-5 animate-pulse">
          <div className="h-5 bg-black-4 rounded w-2/3 mb-3" />
          <div className="h-3 bg-black-4 rounded w-1/3 mb-4" />
          <div className="h-3 bg-black-4 rounded w-full mb-2" />
          <div className="h-3 bg-black-4 rounded w-4/5 mb-6" />
          <div className="h-1.5 bg-black-4 rounded-full" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ search, statusFilter }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue/10 border border-blue/20 flex items-center justify-center mb-4">
        <Trophy size={28} className="text-blue/50" />
      </div>
      <h3 className="font-display text-2xl text-white tracking-wide mb-2">No Hackathons Found</h3>
      <p className="text-white-dim font-body text-sm max-w-xs">
        {search || statusFilter !== 'all'
          ? 'Try adjusting your filters or search query.'
          : 'Start tracking your first hackathon journey.'}
      </p>
      {!search && statusFilter === 'all' && (
        <Link to="/hackathons/new" className="btn-primary mt-6">
          <Plus size={16} />
          Add Your First Hackathon
        </Link>
      )}
    </div>
  )
}
