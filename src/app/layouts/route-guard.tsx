import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'

type RouteGuardProps = {
  requireAuth: boolean
  children: ReactNode
}

export function RouteGuard({ requireAuth, children }: RouteGuardProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  return children
}
