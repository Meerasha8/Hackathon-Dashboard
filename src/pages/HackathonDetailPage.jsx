import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, ExternalLink, Pencil, Trash2, Plus, Calendar,
  FileText, Lightbulb, Save, X, ChevronDown, ChevronUp
} from 'lucide-react'
import { useHackathon, updateHackathon, deleteHackathon, createPhase } from '../hooks/useHackathons'
import { ALL_STATUSES, STATUS_CONFIG, formatDateTime, formatDate, isOverdue, daysUntil } from '../lib/utils'
import StatusBadge from '../components/StatusBadge'
import PhaseRow from '../components/PhaseRow'
import PhaseForm from '../components/PhaseForm'
import toast from 'react-hot-toast'

export default function HackathonDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hackathon, loading, refetch } = useHackathon(id)
  const [editingInfo, setEditingInfo] = useState(false)
  const [addingPhase, setAddingPhase] = useState(false)
  const [infoForm, setInfoForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showSubmission, setShowSubmission] = useState(false)

  if (loading) return <LoadingDetail />
  if (!hackathon) return <NotFound />

  const phases = hackathon.phases || []
  const completedPhases = phases.filter(p => p.is_completed).length
  const progress = phases.length > 0 ? (completedPhases / phases.length) * 100 : 0
  const days = daysUntil(hackathon.overall_deadline)
  const overdue = isOverdue(hackathon.overall_deadline) && hackathon.status !== 'completed'

  const startEdit = () => {
    setInfoForm({
      name: hackathon.name,
      organizer: hackathon.organizer || '',
      description: hackathon.description || '',
      link: hackathon.link || '',
      our_idea: hackathon.our_idea || '',
      what_to_submit: hackathon.what_to_submit || '',
      overall_deadline: hackathon.overall_deadline ? hackathon.overall_deadline.split('T')[0] + 'T' + hackathon.overall_deadline.split('T')[1]?.slice(0, 5) : '',
      status: hackathon.status,
    })
    setEditingInfo(true)
  }

  const handleSaveInfo = async () => {
    if (!infoForm.name.trim()) return toast.error('Name is required')
    setSaving(true)
    try {
      await updateHackathon(id, {
        ...infoForm,
        overall_deadline: infoForm.overall_deadline ? new Date(infoForm.overall_deadline).toISOString() : null,
      })
      toast.success('Hackathon updated')
      setEditingInfo(false)
      refetch()
    } catch (e) {
      toast.error('Failed to update')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm(`Permanently delete "${hackathon.name}"? This cannot be undone.`)) return
    try {
      await deleteHackathon(id)
      toast.success('Hackathon deleted')
      navigate('/')
    } catch (e) {
      toast.error('Failed to delete')
    }
  }

  const handleAddPhase = async (data) => {
    try {
      await createPhase(id, {
        ...data,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      }, phases.length)
      toast.success('Phase added')
      setAddingPhase(false)
      refetch()
    } catch (e) {
      toast.error('Failed to add phase')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-8">
      {/* Back */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="btn-secondary text-sm py-1.5 px-3">
          <ArrowLeft size={14} />
        </Link>
        <nav className="text-xs font-mono text-white-dim">
          <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
          <span className="mx-2 text-white-dim/30">/</span>
          <span className="text-white">{hackathon.name}</span>
        </nav>
      </div>

      {/* Hero card */}
      <div className="card p-6 mb-6 relative overflow-hidden">
        {/* BG glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue/5 rounded-full blur-3xl pointer-events-none" />

        {!editingInfo ? (
          <>
            <div className="flex items-start justify-between gap-4 mb-4 relative">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <StatusBadge status={hackathon.status} />
                  {overdue && (
                    <span className="badge bg-red/10 text-red border border-red/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
                      Overdue
                    </span>
                  )}
                  {!overdue && days !== null && days <= 7 && days >= 0 && (
                    <span className="badge bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      {days === 0 ? 'Due today' : `${days}d left`}
                    </span>
                  )}
                </div>
                <h1 className="font-display text-3xl sm:text-4xl tracking-wide text-white leading-tight">
                  {hackathon.name}
                </h1>
                {hackathon.organizer && (
                  <p className="text-white-dim font-body text-sm mt-1">{hackathon.organizer}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={startEdit} className="btn-secondary text-sm py-1.5 px-3">
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={handleDelete} className="btn-danger text-sm py-1.5 px-3">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {hackathon.description && (
              <p className="text-white-dim font-body text-sm leading-relaxed mb-4">{hackathon.description}</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap gap-4 mb-4">
              {hackathon.overall_deadline && (
                <MetaItem icon={<Calendar size={13} />} label="Deadline" value={formatDateTime(hackathon.overall_deadline)}
                  valueClass={overdue ? 'text-red' : 'text-white'} />
              )}
              {hackathon.link && (
                <MetaItem icon={<ExternalLink size={13} />} label="Link"
                  value={<a href={hackathon.link} target="_blank" rel="noopener noreferrer"
                    className="text-blue-glow hover:underline truncate max-w-xs">{hackathon.link}</a>} />
              )}
            </div>

            {/* Progress bar */}
            {phases.length > 0 && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-mono text-white-dim">Phase Progress</span>
                  <span className="text-xs font-mono text-white-dim">{completedPhases}/{phases.length} completed</span>
                </div>
                <div className="h-2 bg-black-4 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue to-blue-glow rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <EditInfoForm
            form={infoForm}
            onChange={(field, val) => setInfoForm(p => ({ ...p, [field]: val }))}
            onSave={handleSaveInfo}
            onCancel={() => setEditingInfo(false)}
            saving={saving}
          />
        )}
      </div>

      {/* Two column: Idea + Submission */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {hackathon.our_idea && (
          <InfoCard icon={<Lightbulb size={14} className="text-yellow-400" />} title="Our Idea">
            <p className="text-white font-body text-sm leading-relaxed">{hackathon.our_idea}</p>
          </InfoCard>
        )}
        {hackathon.what_to_submit && (
          <InfoCard
            icon={<FileText size={14} className="text-blue-glow" />}
            title="What to Submit"
            collapsible
            expanded={showSubmission}
            onToggle={() => setShowSubmission(v => !v)}
          >
            <p className="text-white font-body text-sm leading-relaxed">{hackathon.what_to_submit}</p>
          </InfoCard>
        )}
      </div>

      {/* Phases */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h2 className="font-mono text-sm text-white uppercase tracking-widest">Phases</h2>
            <span className="badge bg-blue/10 text-blue-glow border border-blue/20">
              {completedPhases}/{phases.length}
            </span>
          </div>
          <button
            onClick={() => setAddingPhase(v => !v)}
            className="btn-primary text-sm py-1.5"
          >
            <Plus size={14} />
            Add Phase
          </button>
        </div>

        {/* Add phase form */}
        {addingPhase && (
          <div className="mb-4">
            <PhaseForm
              isNew
              onSave={handleAddPhase}
              onCancel={() => setAddingPhase(false)}
            />
          </div>
        )}

        {/* Phase list */}
        {phases.length === 0 && !addingPhase ? (
          <div className="text-center py-10 border border-dashed border-border rounded-xl">
            <p className="text-white-dim text-sm font-body mb-3">No phases added yet</p>
            <button onClick={() => setAddingPhase(true)} className="btn-secondary text-sm">
              <Plus size={14} /> Add First Phase
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {phases.map((phase, idx) => (
              <PhaseRow key={phase.id} phase={phase} index={idx} onRefetch={refetch} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function MetaItem({ icon, label, value, valueClass = 'text-white-dim' }) {
  return (
    <div className="flex items-start gap-1.5">
      <span className="text-white-dim mt-0.5">{icon}</span>
      <div>
        <div className="text-xs font-mono text-white-dim/60 uppercase tracking-widest">{label}</div>
        <div className={`text-sm font-mono ${valueClass}`}>{value}</div>
      </div>
    </div>
  )
}

function InfoCard({ icon, title, children, collapsible, expanded, onToggle }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-mono text-white-dim uppercase tracking-widest">{title}</span>
        </div>
        {collapsible && (
          <button onClick={onToggle} className="text-white-dim hover:text-white transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>
      {(!collapsible || expanded) && children}
      {collapsible && !expanded && (
        <button onClick={onToggle} className="text-xs text-blue-glow font-mono hover:underline">
          Show details
        </button>
      )}
    </div>
  )
}

function EditInfoForm({ form, onChange, onSave, onCancel, saving }) {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-blue-glow uppercase tracking-widest">Editing Hackathon</span>
        <div className="flex gap-2">
          <button onClick={onCancel} className="btn-secondary text-sm py-1.5 px-3">
            <X size={13} /> Cancel
          </button>
          <button onClick={onSave} disabled={saving} className="btn-primary text-sm py-1.5 px-3">
            {saving
              ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><Save size={13} /> Save</>
            }
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="label">Name *</label>
          <input className="input" value={form.name} onChange={e => onChange('name', e.target.value)} required />
        </div>
        <div>
          <label className="label">Organizer</label>
          <input className="input" value={form.organizer} onChange={e => onChange('organizer', e.target.value)} />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={e => onChange('status', e.target.value)}>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Link</label>
          <input className="input" value={form.link} onChange={e => onChange('link', e.target.value)} type="url" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Description</label>
          <textarea className="input resize-none" value={form.description} rows={2}
            onChange={e => onChange('description', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Our Idea</label>
          <textarea className="input resize-none" value={form.our_idea} rows={2}
            onChange={e => onChange('our_idea', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">What to Submit</label>
          <textarea className="input resize-none" value={form.what_to_submit} rows={2}
            onChange={e => onChange('what_to_submit', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Overall Deadline</label>
          <input className="input" type="datetime-local" value={form.overall_deadline}
            onChange={e => onChange('overall_deadline', e.target.value)} />
        </div>
      </div>
    </div>
  )
}

function LoadingDetail() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="card p-6 mb-6 animate-pulse">
        <div className="h-6 bg-black-4 rounded w-20 mb-4" />
        <div className="h-8 bg-black-4 rounded w-2/3 mb-3" />
        <div className="h-4 bg-black-4 rounded w-1/3 mb-6" />
        <div className="h-2 bg-black-4 rounded-full" />
      </div>
      <div className="card p-5 animate-pulse">
        <div className="h-4 bg-black-4 rounded w-24 mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 bg-black-4 rounded-xl mb-3" />
        ))}
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl font-display text-white-dim/20 mb-4">404</div>
      <h2 className="font-display text-2xl text-white mb-2">Hackathon Not Found</h2>
      <p className="text-white-dim text-sm mb-6">This hackathon may have been deleted.</p>
      <Link to="/" className="btn-primary">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
    </div>
  )
}
