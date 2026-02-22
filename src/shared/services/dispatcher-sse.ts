import { AUTH_STORAGE_KEY } from '@/shared/utils'

type PodSubmittedData = {
  routeId: number
  stopId: number
  podId: number
  stopOrder: number
}

type SseEventPayload = {
  type: string
  title: string
  body: string
  data: PodSubmittedData
  referenceId: number
  timestamp: string
}

export type PodSubmittedHandler = (data: SseEventPayload) => void

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
const BASE_RECONNECT_DELAY_MS = 1000
const MAX_RECONNECT_DELAY_MS = 30_000

function getToken(): string | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored).token || null
    }
  } catch {
    return null
  }
  return null
}

export function createDispatcherSse(
  tenantId: number,
  userId: number,
  onPodSubmitted: PodSubmittedHandler
): () => void {
  let eventSource: EventSource | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let reconnectAttempts = 0
  let disposed = false

  function connect() {
    if (disposed) return

    const token = getToken()
    let url = `${API_BASE_URL}/sse/dispatch/subscribe/${tenantId}/${userId}`
    if (token) {
      url += `?token=${encodeURIComponent(token)}`
    }

    try {
      eventSource = new EventSource(url)

      eventSource.onopen = () => {
        reconnectAttempts = 0
        console.log('[Dispatcher SSE] Connected')
      }

      eventSource.onerror = () => {
        eventSource?.close()
        eventSource = null
        scheduleReconnect()
      }

      eventSource.addEventListener('POD_SUBMITTED', (event: MessageEvent) => {
        try {
          const data = JSON.parse(String(event.data)) as SseEventPayload
          onPodSubmitted(data)
        } catch {
          // Ignore parse errors
        }
      })
    } catch {
      scheduleReconnect()
    }
  }

  function scheduleReconnect() {
    if (disposed) return
    const delay = Math.min(
      BASE_RECONNECT_DELAY_MS * Math.pow(2, reconnectAttempts),
      MAX_RECONNECT_DELAY_MS
    )
    reconnectAttempts++
    reconnectTimer = setTimeout(connect, delay)
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'visible' && !eventSource) {
      reconnectAttempts = 0
      connect()
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  connect()

  return () => {
    disposed = true
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
    }
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
  }
}
