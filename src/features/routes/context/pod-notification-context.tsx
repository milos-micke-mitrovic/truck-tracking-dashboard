import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import { useAuth } from '@/features/auth'
import { isSuperAdmin } from '@/features/auth'
import { createDispatcherSse, type PodSubmittedHandler } from '@/shared/services/dispatcher-sse'
import { routeKeys } from '../api'

// API functions
async function fetchUnreadCounts(): Promise<Record<string, number>> {
  return httpClient.get('/dispatcher/notifications/unread-counts')
}

async function markNotificationsRead(referenceId: string): Promise<void> {
  return httpClient.patch('/dispatcher/notifications/read', { referenceId })
}

// Query keys
const notificationKeys = {
  all: ['dispatcher-notifications'] as const,
  unreadCounts: () => [...notificationKeys.all, 'unread-counts'] as const,
}

type PodNotificationContextType = {
  notifications: Map<string, number>
  totalUnread: number
  clearRouteNotifications: (routeId: string) => void
}

const PodNotificationContext = createContext<PodNotificationContextType | null>(null)

export function PodNotificationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const disconnectRef = useRef<(() => void) | null>(null)
  const isDispatcher = isAuthenticated && user && !isSuperAdmin(user)

  // Fetch unread counts from BE
  const { data: unreadCounts } = useQuery({
    queryKey: notificationKeys.unreadCounts(),
    queryFn: fetchUnreadCounts,
    enabled: !!isDispatcher,
    refetchOnWindowFocus: true,
  })

  const notifications = useMemo(
    () => new Map(
      Object.entries(unreadCounts || {}).map(([routeId, count]) => [routeId, count])
    ),
    [unreadCounts]
  )
  const totalUnread = useMemo(
    () => Array.from(notifications.values()).reduce((sum, count) => sum + count, 0),
    [notifications]
  )

  // Mark notifications read for a route
  const markReadMutation = useMutation({
    mutationFn: markNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCounts() })
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCounts() })
    },
  })

  const clearRouteNotifications = useCallback((routeId: string) => {
    // Optimistically update cache
    queryClient.setQueryData<Record<string, number>>(
      notificationKeys.unreadCounts(),
      (prev) => {
        if (!prev) return prev
        const next = { ...prev }
        delete next[routeId]
        return next
      }
    )
    markReadMutation.mutate(routeId)
  }, [queryClient, markReadMutation])

  // Establish SSE connection when authenticated
  useEffect(() => {
    if (!isDispatcher || !user) {
      return
    }

    const handlePodSubmitted: PodSubmittedHandler = (payload) => {
      // Optimistically increment the count for this route
      queryClient.setQueryData<Record<string, number>>(
        notificationKeys.unreadCounts(),
        (prev) => {
          const routeId = String(payload.data.routeId)
          const next = { ...(prev || {}) }
          next[routeId] = (next[routeId] || 0) + 1
          return next
        }
      )
      toast.info(payload.body, { duration: 5000 })
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
    }

    disconnectRef.current = createDispatcherSse(handlePodSubmitted)

    return () => {
      disconnectRef.current?.()
      disconnectRef.current = null
    }
  }, [isDispatcher, queryClient])

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
