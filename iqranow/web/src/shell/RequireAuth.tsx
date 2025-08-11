import { ReactNode, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { token, initializeFromStorage } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    initializeFromStorage()
  }, [initializeFromStorage])

  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }

  return <>{children}</>
}
