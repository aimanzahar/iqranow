import { create } from 'zustand'
import axios from 'axios'

export interface AuthUser {
  id: number
  name: string
  email: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  initializing: boolean
  setToken: (token: string | null) => void
  loadUser: () => Promise<void>
  logout: () => void
  initializeFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  initializing: false,

  setToken: (token: string | null) => {
    if (token) {
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
    set({ token })
  },

  initializeFromStorage: () => {
    const saved = localStorage.getItem('token')
    if (saved) {
      get().setToken(saved)
      // Load user in background
      void get().loadUser()
    }
  },

  loadUser: async () => {
    const token = get().token
    if (!token) return
    try {
      set({ initializing: true })
      const res = await axios.get('/api/me')
      set({ user: res.data.user })
    } catch (error) {
      // Token may be invalid; clear it
      get().setToken(null)
      set({ user: null })
    } finally {
      set({ initializing: false })
    }
  },

  logout: () => {
    set({ user: null })
    get().setToken(null)
  },
}))
