import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth'
import { isSuperAdmin } from '@/features/auth'
import { createDispatcherSse, type PodSubmittedHandler } from '@/shared/services/dispatcher-sse'

type PodNotificationContextType = {
  notifications: Map<string, number>
  totalUnread: number
  clearRouteNotifications: (routeId: string) => void
}

const PodNotificationContext = createContext<PodNotificationContextType | null>(null)

export function PodNotificationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Map<string, number>>(new Map())
  const disconnectRef = useRef<(() => void) | null>(null)

  const addNotification = useCallback((routeId: string) => {
    setNotifications((prev) => {
      const next = new Map(prev)
      next.set(routeId, (next.get(routeId) || 0) + 1)
      return next
    })
  }, [])

  const clearRouteNotifications = useCallback((routeId: string) => {
    setNotifications((prev) => {
      if (!prev.has(routeId) || prev.get(routeId) === 0) return prev
      const next = new Map(prev)
      next.delete(routeId)
      return next
    })
  }, [])

  const totalUnread = Array.from(notifications.values()).reduce((sum, count) => sum + count, 0)

  // Establish SSE connection when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user || isSuperAdmin(user)) {
      return
    }

    const handlePodSubmitted: PodSubmittedHandler = (payload) => {
      const routeId = String(payload.data.routeId)
      addNotification(routeId)
      toast.info(payload.body, { duration: 5000 })
    }

    disconnectRef.current = createDispatcherSse(
      user.tenantId,
      user.id,
      handlePodSubmitted
    )

    return () => {
      disconnectRef.current?.()
      disconnectRef.current = null
    }
  }, [isAuthenticated, user, addNotification])

  return (
    <PodNotificationContext.Provider
      value={{ notifications, totalUnread, clearRouteNotifications }}
    >
      {children}
    </PodNotificationContext.Provider>
  )
}

export function usePodNotifications() {
  const context = useContext(PodNotificationContext)
  if (!context) {
    throw new Error('usePodNotifications must be used within a PodNotificationProvider')
  }
  return context
}
