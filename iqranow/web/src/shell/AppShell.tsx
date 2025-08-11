import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AccessibilityToolbar from '../components/AccessibilityToolbar'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/auth'

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation()
  const active = location.pathname === to
  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
        active ? 'bg-brand-500 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
      }`}
      to={to}
    >
      {label}
    </Link>
  )
}

export default function AppShell() {
  const navigate = useNavigate()
  const { user, token, logout, initializeFromStorage } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    initializeFromStorage()
  }, [initializeFromStorage])

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/signin')
  }

  const firstName = user?.name?.split(' ')[0] || 'Account'
  const initials = (user?.name || 'A U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-md">
            <motion.div
              className="h-9 w-9 rounded-xl bg-brand-500 shadow-glow"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="text-xl font-extrabold tracking-tight">IQRA'NOW</div>
          </Link>
          <nav className="flex items-center gap-2" aria-label="Primary">
            <NavLink to="/learn" label="Learn" />
            <NavLink to="/progress" label="Progress" />
            {token ? (
              <>
                <NavLink to="/dashboard" label="Dashboard" />
                <div className="relative">
                  <button
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                  >
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/10 text-white font-bold">
                      {initials}
                    </span>
                    <span className="hidden md:block text-sm text-white/90">{firstName}</span>
                  </button>
                  {menuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-40 rounded-xl bg-surface/90 backdrop-blur border border-white/10 shadow-lg overflow-hidden"
                    >
                      <Link
                        to="/dashboard"
                        role="menuitem"
                        className="block px-3 py-2 text-sm hover:bg-white/10"
                        onClick={() => setMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        role="menuitem"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-white/10"
                        onClick={handleLogout}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/signin" label="Sign In" />
                <NavLink to="/signup" label="Sign Up" />
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 py-6 text-center text-white/60 text-sm">
        © {new Date().getFullYear()} IQRA'NOW — Learn with excellence
      </footer>
      <AccessibilityToolbar />
    </div>
  )
}
