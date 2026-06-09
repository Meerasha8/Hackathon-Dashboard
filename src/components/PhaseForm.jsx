import { useState } from 'react'
import { Check, X, GripVertical } from 'lucide-react'

const EMPTY_PHASE = {
  name: '',
  description: '',
  deadline: '',
  what_to_submit: '',
  is_completed: false,
}

export default function PhaseForm({ phase = EMPTY_PHASE, onSave, onCancel, isNew = false }) {
  const [form, setForm] = useState({
    name: phase.name || '',
    description: phase.description || '',
    deadline: phase.deadline ? phase.deadline.split('T')[0] : '',
    what_to_submit: phase.what_to_submit || '',
    is_completed: phase.is_completed || false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-black-2 border border-blue/30 rounded-xl p-4 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <GripVertical size={14} className="text-white-dim/30" />
        <span className="text-xs font-mono text-blue-glow uppercase tracking-widest">
          {isNew ? 'New Phase' : 'Edit Phase'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="label">Phase Name *</label>
          <input
            className="input"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Round 1 - Ideation"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="label">Deadline</label>
          <input
            className="input"
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label">Completed?</label>
          <label className="flex items-center gap-3 h-[42px] cursor-pointer">
            <div
              onClick={() => setForm(prev => ({ ...prev, is_completed: !prev.is_completed }))}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.is_completed ? 'bg-blue' : 'bg-black-4 border border-border'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.is_completed ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
            </div>
            <span className={`text-sm font-body ${form.is_completed ? 'text-blue-glow' : 'text-white-dim'}`}>
              {form.is_completed ? 'Done' : 'Pending'}
            </span>
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className="label">Description</label>
          <textarea
            className="input resize-none"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            placeholder="What is this phase about?"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label">What to Submit</label>
          <textarea
            className="input resize-none"
            name="what_to_submit"
            value={form.what_to_submit}
            onChange={handleChange}
            rows={2}
            placeholder="Submission requirements for this phase..."
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary text-sm py-1.5">
          <X size={14} />
          Cancel
        </button>
        <button type="submit" className="btn-primary text-sm py-1.5">
          <Check size={14} />
          {isNew ? 'Add Phase' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
