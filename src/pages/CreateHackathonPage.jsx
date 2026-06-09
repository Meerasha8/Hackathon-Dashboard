import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft, Trophy, GripVertical } from 'lucide-react'
import { createHackathon } from '../hooks/useHackathons'
import { ALL_STATUSES, STATUS_CONFIG } from '../lib/utils'
import toast from 'react-hot-toast'

const EMPTY_PHASE = { name: '', description: '', deadline: '', what_to_submit: '', is_completed: false }

export default function CreateHackathonPage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    organizer: '',
    description: '',
    link: '',
    our_idea: '',
    what_to_submit: '',
    overall_deadline: '',
    status: 'upcoming',
  })
  const [phases, setPhases] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const addPhase = () => setPhases(prev => [...prev, { ...EMPTY_PHASE, _id: Date.now() }])

  const updatePhase = (idx, field, value) => {
    setPhases(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p))
  }

  const removePhase = (idx) => setPhases(prev => prev.filter((_, i) => i !== idx))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Hackathon name is required')

    setSaving(true)
    try {
      const payload = {
        ...form,
        overall_deadline: form.overall_deadline ? new Date(form.overall_deadline).toISOString() : null,
        phases: phases.map((p, i) => ({
          name: p.name,
          description: p.description,
          deadline: p.deadline ? new Date(p.deadline).toISOString() : null,
          what_to_submit: p.what_to_submit,
          is_completed: p.is_completed,
          order: i,
        })).filter(p => p.name.trim()),
      }
      const hack = await createHackathon(payload)
      toast.success('Hackathon created!')
      navigate(`/hackathons/${hack.id}`)
    } catch (err) {
      toast.error(err.message || 'Failed to create hackathon')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/" className="btn-secondary text-sm py-1.5 px-3">
          <ArrowLeft size={14} />
        </Link>
        <div>
          <h1 className="page-title">New Hackathon</h1>
          <p className="text-white-dim font-mono text-xs mt-0.5">Fill in the details to start tracking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Section title="Basic Info" icon={<Trophy size={14} className="text-blue-glow" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Hackathon Name *</label>
              <input className="input" name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. HackMIT 2025" required autoFocus />
            </div>
            <div>
              <label className="label">Organizer</label>
              <input className="input" name="organizer" value={form.organizer} onChange={handleChange}
                placeholder="e.g. MIT" />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" name="status" value={form.status} onChange={handleChange}>
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Official Link</label>
              <input className="input" name="link" value={form.link} onChange={handleChange}
                placeholder="https://hackathon-site.com" type="url" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea className="input resize-none" name="description" value={form.description}
                onChange={handleChange} rows={3} placeholder="What is this hackathon about?" />
            </div>
          </div>
        </Section>

        {/* Our Idea & Submission */}
        <Section title="Our Participation" icon={<span className="text-blue-glow text-xs font-mono">💡</span>}>
          <div className="space-y-4">
            <div>
              <label className="label">Our Idea</label>
              <textarea className="input resize-none" name="our_idea" value={form.our_idea}
                onChange={handleChange} rows={3} placeholder="Describe your team's idea or project..." />
            </div>
            <div>
              <label className="label">What to Submit (Overall)</label>
              <textarea className="input resize-none" name="what_to_submit" value={form.what_to_submit}
                onChange={handleChange} rows={2} placeholder="General submission requirements..." />
            </div>
            <div>
              <label className="label">Overall Deadline</label>
              <input className="input" type="datetime-local" name="overall_deadline"
                value={form.overall_deadline} onChange={handleChange} />
            </div>
          </div>
        </Section>

        {/* Phases */}
        <Section
          title="Phases"
          icon={<span className="font-mono text-blue-glow text-xs">{phases.length}</span>}
          action={
            <button type="button" onClick={addPhase} className="btn-primary text-xs py-1 px-3">
              <Plus size={12} /> Add Phase
            </button>
          }
        >
          {phases.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-border rounded-xl">
              <p className="text-white-dim text-sm font-body mb-3">No phases yet</p>
              <button type="button" onClick={addPhase} className="btn-secondary text-sm">
                <Plus size={14} /> Add First Phase
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {phases.map((phase, idx) => (
                <PhaseInput
                  key={phase._id}
                  phase={phase}
                  index={idx}
                  onChange={(field, val) => updatePhase(idx, field, val)}
                  onRemove={() => removePhase(idx)}
                />
              ))}
            </div>
          )}
        </Section>

        {/* Submit */}
        <div className="flex gap-3 justify-end pt-2">
          <Link to="/" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Plus size={16} /> Create Hackathon</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

function Section({ title, icon, action, children }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-mono text-sm text-white uppercase tracking-widest">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function PhaseInput({ phase, index, onChange, onRemove }) {
  return (
    <div className="bg-black-2 border border-border rounded-xl p-4 group">
      <div className="flex items-center gap-2 mb-3">
        <GripVertical size={14} className="text-white-dim/30" />
        <span className="font-mono text-xs text-white-dim">Phase {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="ml-auto p-1 text-white-dim/30 hover:text-red transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="label">Phase Name *</label>
          <input className="input" value={phase.name} onChange={e => onChange('name', e.target.value)}
            placeholder="e.g. Round 1 - Submission" required />
        </div>
        <div>
          <label className="label">Deadline</label>
          <input className="input" type="date" value={phase.deadline}
            onChange={e => onChange('deadline', e.target.value)} />
        </div>
        <div>
          <label className="label">Completed?</label>
          <label className="flex items-center gap-3 h-[42px] cursor-pointer">
            <div
              onClick={() => onChange('is_completed', !phase.is_completed)}
              className={`w-11 h-6 rounded-full transition-colors relative ${phase.is_completed ? 'bg-blue' : 'bg-black-4 border border-border'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${phase.is_completed ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
            </div>
            <span className={`text-sm ${phase.is_completed ? 'text-blue-glow' : 'text-white-dim'}`}>
              {phase.is_completed ? 'Done' : 'Pending'}
            </span>
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Description</label>
          <textarea className="input resize-none" value={phase.description} rows={2}
            onChange={e => onChange('description', e.target.value)} placeholder="What happens in this phase?" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">What to Submit</label>
          <textarea className="input resize-none" value={phase.what_to_submit} rows={2}
            onChange={e => onChange('what_to_submit', e.target.value)} placeholder="Submission requirements..." />
        </div>
      </div>
    </div>
  )
}
