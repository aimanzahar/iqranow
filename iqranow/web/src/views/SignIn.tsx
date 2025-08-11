import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
 
export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { setToken, loadUser } = useAuthStore()
 
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      const res = await axios.post('/api/login', { email, password })
      setToken(res.data.token)
      await loadUser()
      navigate('/dashboard')
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }
 
  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <h2 className="text-3xl font-bold">Welcome back</h2>
      <p className="text-white/70 mt-2">Sign in to continue your learning.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="text-sm text-white/70">Email</label>
          <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                 className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"/>
        </div>
        <div>
          <label htmlFor="password" className="text-sm text-white/70">Password</label>
          <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}
                 className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"/>
        </div>
        <button disabled={loading} className="w-full py-3 rounded-xl bg-brand-500 font-semibold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand-400">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        {error && <div className="text-red-400" role="alert">{error}</div>}
      </form>
    </div>
  )
}
