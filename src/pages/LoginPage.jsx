import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Trophy, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    if (error) {
      toast.error(error.message || 'Invalid credentials')
    } else {
      toast.success('Welcome back!')
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black grid-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm animate-slide-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue/10 border border-blue/30 rounded-2xl mb-4 shadow-blue-glow">
            <Trophy size={24} className="text-blue-glow" />
          </div>
          <h1 className="font-display text-4xl tracking-widest text-white">
            HACK<span className="text-blue">TRACK</span>
          </h1>
          <p className="text-white-dim text-sm font-mono mt-1">Hackathon progress tracker</p>
        </div>

        {/* Card */}
        <div className="card p-6">
          <div className="mb-5">
            <h2 className="font-display text-2xl tracking-wide text-white">Sign In</h2>
            <p className="text-white-dim text-sm font-body mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white-dim pointer-events-none" />
                <input
                  type="email"
                  className="input pl-9"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white-dim pointer-events-none" />
                <input
                  type="password"
                  className="input pl-9"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white-dim/40 text-xs font-mono mt-6">
          No public sign-up · Authorized access only
        </p>
      </div>
    </div>
  )
}
