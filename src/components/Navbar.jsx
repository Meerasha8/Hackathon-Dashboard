import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, Trophy, LayoutDashboard, Archive, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out')
    navigate('/login')
  }

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/completed', label: 'Completed', icon: Archive },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-black-2/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-blue rounded-lg flex items-center justify-center shadow-blue-glow group-hover:shadow-[0_0_28px_rgba(29,106,235,0.6)] transition-shadow">
            <Trophy size={14} className="text-white" />
          </div>
          <span className="font-display text-xl tracking-widest text-white">
            HACK<span className="text-blue">TRACK</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-body transition-all duration-200
                ${location.pathname === to
                  ? 'bg-blue/10 text-blue-glow border border-blue/20'
                  : 'text-white-dim hover:text-white hover:bg-black-4'
                }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link to="/hackathons/new" className="btn-primary text-sm py-1.5">
            <Plus size={14} />
            <span className="hidden sm:inline">New Hackathon</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-7 h-7 rounded-full bg-blue/20 border border-blue/30 flex items-center justify-center">
              <span className="text-xs font-mono text-blue-glow">
                {user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-white-dim hover:text-red transition-colors p-1"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-black-2 border-t border-border flex z-50">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors
              ${location.pathname === to ? 'text-blue-glow' : 'text-white-dim'}`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
        <button
          onClick={handleSignOut}
          className="flex-1 flex flex-col items-center gap-1 py-3 text-xs text-white-dim"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </nav>
  )
}
