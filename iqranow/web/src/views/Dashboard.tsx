import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

interface Goal {
  id: number
  dailyVerses: number | null
  dailyMinutes: number | null
  createdAt: string
}

interface Session {
  id: number
  createdAt: string
  score: number | null
  recognizedText: string
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [daily, setDaily] = useState<any[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const latestGoal = goals[0]

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const [p, g] = await Promise.all([
          axios.get('/api/progress'),
          axios.get('/api/goals'),
        ])
        setDaily(p.data.daily)
        setSessions(p.data.recentSessions)
        setGoals(g.data.goals)
      } catch (e: any) {
        setError(e?.response?.data?.message || e.message)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const practicedDays = useMemo(() => daily.filter((d) => (d.count ?? 0) > 0).length, [daily])
  const averageScore = useMemo(() => {
    const vals = sessions.map((s) => s.score ?? 0).filter((v) => v > 0)
    if (!vals.length) return null
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  }, [sessions])
  const bestScore = useMemo(() => Math.max(0, ...sessions.map((s) => s.score ?? 0)), [sessions])

  async function saveGoal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const dailyVerses = Number(form.get('dailyVerses') || 0) || null
    const dailyMinutes = Number(form.get('dailyMinutes') || 0) || null
    const res = await axios.post('/api/goals', { dailyVerses, dailyMinutes })
    setGoals((prev) => [res.data.goal, ...prev])
    e.currentTarget.reset()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-brand-500/20 via-white/5 to-fuchsia-500/10 border border-white/10">
          <div className="text-sm text-white/70">Welcome back</div>
          <h2 className="mt-1 text-3xl md:text-4xl font-extrabold">
            {user?.name ? `Assalamu'alaikum, ${user.name}!` : 'Assalamu\'alaikum!'}
          </h2>
          <p className="mt-2 text-white/80">
            Keep up your recitation journey. Your progress this month is beautifully taking shape.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <div className="text-xs text-white/60">Days practiced</div>
              <div className="text-2xl font-bold">{practicedDays}</div>
            </div>
            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <div className="text-xs text-white/60">Avg score</div>
              <div className="text-2xl font-bold">{averageScore ?? '—'}{averageScore !== null ? '%' : ''}</div>
            </div>
            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <div className="text-xs text-white/60">Best score</div>
              <div className="text-2xl font-bold">{bestScore || '—'}{bestScore ? '%' : ''}</div>
            </div>
          </div>
          <div className="mt-6 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" hide/>
                <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.5)' }} width={30} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Area type="monotone" dataKey="avgScore" stroke="#0ea5e9" fillOpacity={1} fill="url(#scoreGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6">
            <Link to="/learn" className="px-4 py-2 rounded-full bg-brand-500 font-semibold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand-400">Practice now</Link>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
          <div className="text-sm text-white/70">Your current goal</div>
          <div className="mt-2 text-white/90">
            <div>Daily verses: <span className="font-semibold">{latestGoal?.dailyVerses ?? '—'}</span></div>
            <div>Daily minutes: <span className="font-semibold">{latestGoal?.dailyMinutes ?? '—'}</span></div>
          </div>
          <form onSubmit={saveGoal} className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-white/60" htmlFor="dailyVerses">Update daily verses</label>
              <input id="dailyVerses" name="dailyVerses" type="number" min={0} className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 p-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="text-xs text-white/60" htmlFor="dailyMinutes">Update daily minutes</label>
              <input id="dailyMinutes" name="dailyMinutes" type="number" min={0} className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 p-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <button className="w-full py-2 rounded-xl bg-brand-500 font-semibold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand-400">Save goal</button>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <div className="text-sm text-white/70 mb-3">Recent sessions</div>
        <div className="grid md:grid-cols-3 gap-4">
          {sessions.slice(0, 6).map((s) => (
            <div key={s.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-white/60 text-xs">{new Date(s.createdAt).toLocaleString()}</div>
              <div className="mt-2 text-lg font-semibold">Score: {s.score ?? '—'}{s.score !== null ? '%' : ''}</div>
              <div className="mt-1 text-white/80 text-sm line-clamp-2">{s.recognizedText || '—'}</div>
            </div>
          ))}
          {sessions.length === 0 && !loading && (
            <div className="text-white/60">No sessions yet. Start with a quick <Link to="/learn" className="underline">practice</Link>.</div>
          )}
        </div>
      </div>

      {error && <div className="mt-6 text-red-400" role="alert">{error}</div>}
    </div>
  )
}
