import { useEffect, useState } from 'react'
import axios from 'axios'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Progress() {
  const [daily, setDaily] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setError(null)
        const token = localStorage.getItem('token') || ''
        const res = await axios.get('/api/progress', {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        })
        setDaily(res.data.daily)
        setSessions(res.data.recentSessions)
      } catch (e: any) {
        setError(e?.response?.data?.message || e.message)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold">Your Progress</h2>
      <p className="text-white/70 mt-2">Track improvement and review your recent sessions.</p>
      {error && <div className="mt-4 text-red-400" role="alert">{error}</div>}

      <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="text-sm text-white/70 mb-3">Daily Average Score (30 days)</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.5)' }} hide/>
              <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.5)' }} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Line type="monotone" dataKey="avgScore" stroke="#0ea5e9" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <div className="text-sm text-white/70 mb-3">Recent Sessions</div>
        <div className="grid md:grid-cols-2 gap-4">
          {sessions.map((s) => (
            <div key={s.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-white/60 text-xs">{new Date(s.createdAt).toLocaleString()}</div>
              <div className="mt-2 text-lg font-semibold">Score: {s.score ?? '—'}{s.score !== null ? '%' : ''}</div>
              <div className="mt-1 text-white/80 text-sm line-clamp-2">{s.recognizedText || '—'}</div>
            </div>
          ))}
          {sessions.length === 0 && <div className="text-white/60">No sessions yet.</div>}
        </div>
      </div>
    </div>
  )
}
