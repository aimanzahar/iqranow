import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import AccessibilityToolbar from '../components/AccessibilityToolbar'

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
            <NavLink to="/signin" label="Sign In" />
            <NavLink to="/signup" label="Sign Up" />
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
