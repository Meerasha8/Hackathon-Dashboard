import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Archive, Search, Trophy, Plus } from 'lucide-react'
import { useHackathons } from '../hooks/useHackathons'
import HackathonCard from '../components/HackathonCard'

export default function CompletedPage() {
  const { hackathons, loading } = useHackathons(true)
  const [search, setSearch] = useState('')

  const filtered = hackathons.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.organizer?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Archive size={16} className="text-white-dim" />
            </div>
            <h1 className="page-title">Completed</h1>
          </div>
          <p className="text-white-dim font-mono text-sm">
            {hackathons.length} completed hackathon{hackathons.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Stats summary */}
      {hackathons.length > 0 && (
        <div className="card p-5 mb-8 border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-display text-white-dim">{hackathons.length}</div>
              <div className="text-xs font-mono text-white-dim/60 mt-0.5">Total Completed</div>
            </div>
            <div>
              <div className="text-3xl font-display text-white-dim">
                {hackathons.reduce((acc, h) => acc + (h.phases?.length || 0), 0)}
              </div>
              <div className="text-xs font-mono text-white-dim/60 mt-0.5">Total Phases</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-3xl font-display text-white-dim">
                {hackathons.reduce((acc, h) => acc + (h.phases?.filter(p => p.is_completed).length || 0), 0)}
              </div>
              <div className="text-xs font-mono text-white-dim/60 mt-0.5">Phases Completed</div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {hackathons.length > 0 && (
        <div className="relative mb-6 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white-dim pointer-events-none" />
          <input
            className="input pl-9"
            placeholder="Search completed..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse opacity-60">
              <div className="h-5 bg-black-4 rounded w-2/3 mb-3" />
              <div className="h-3 bg-black-4 rounded w-1/3 mb-4" />
              <div className="h-1.5 bg-black-4 rounded-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <Archive size={28} className="text-white-dim/30" />
          </div>
          <h3 className="font-display text-2xl text-white-dim tracking-wide mb-2">No Completed Hackathons</h3>
          <p className="text-white-dim/60 font-body text-sm max-w-xs">
            {search
              ? 'No completed hackathons match your search.'
              : 'Completed hackathons will appear here once you mark them as done.'}
          </p>
          {!search && (
            <Link to="/" className="btn-secondary mt-6 text-sm">
              <Trophy size={14} />
              Back to Dashboard
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children opacity-90">
          {filtered.map(h => <HackathonCard key={h.id} hackathon={h} />)}
        </div>
      )}
    </div>
  )
}
