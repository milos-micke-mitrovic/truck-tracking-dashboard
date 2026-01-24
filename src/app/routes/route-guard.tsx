import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import type { User } from '@/features/auth/types'

type RouteGuardProps = {
  requireAuth?: boolean
  allowedRoles?: User['role'][]
  children: ReactNode
}

export function RouteGuard({
  requireAuth = true,
  allowedRoles,
  children,
}: RouteGuardProps) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Redirect authenticated users away from public routes
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/routes" replace />
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      // Redirect to routes page if user doesn't have required role
      return <Navigate to="/routes" replace />
    }
  }

  return children
}
