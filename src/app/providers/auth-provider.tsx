import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { AUTH_STORAGE_KEY } from '@/shared/utils'
import { decodeJwt } from '@/features/auth/utils'
import { refreshAccessToken } from '@/features/auth/api'
import { router } from '@/app/routes/router'
import type { User, AuthState } from '@/features/auth/types'

type StoredAuth = {
  user: User
  token: string
  refreshToken: string
}

type AuthContextType = AuthState & {
  login: (user: User, token: string, refreshToken: string) => void
  logout: () => void
  updateTokens: (token: string, refreshToken: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Refresh 60 seconds before expiry
const REFRESH_BUFFER_MS = 60 * 1000

function getStoredAuth(): StoredAuth | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Invalid JSON, clear storage
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
  return null
}

function getInitialState(): AuthState {
  const stored = getStoredAuth()
  if (stored) {
    return {
      user: stored.user,
      token: stored.token,
      refreshToken: stored.refreshToken || null,
      isAuthenticated: true,
    }
  }
  return {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(getInitialState)
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }, [])

  const login = useCallback((user: User, token: string, refreshToken: string) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token, refreshToken }))
    setState({
      user,
      token,
      refreshToken,
      isAuthenticated: true,
    })
  }, [])

  const logout = useCallback(() => {
    clearRefreshTimer()
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  }, [clearRefreshTimer])

  const updateTokens = useCallback((token: string, refreshToken: string) => {
    setState((prev) => {
      if (!prev.user) return prev
      const newState = { ...prev, token, refreshToken }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        user: prev.user,
        token,
        refreshToken,
      }))
      return newState
    })
  }, [])

  // Schedule a proactive refresh based on the token's exp claim
  const scheduleRefresh = useCallback((token: string, currentRefreshToken: string) => {
    clearRefreshTimer()

    const payload = decodeJwt(token)
    if (!payload?.exp) return

    const expiresAt = payload.exp * 1000
    const delay = expiresAt - Date.now() - REFRESH_BUFFER_MS

    if (delay <= 0) {
      // Token already expired or about to — refresh immediately
      refreshAccessToken(currentRefreshToken).catch(() => {
        // Refresh failed; the next API call will trigger 401 → auth:logout
      })
      return
    }

    refreshTimerRef.current = setTimeout(() => {
      refreshAccessToken(currentRefreshToken).catch(() => {
        // Refresh failed; the next API call will trigger 401 → auth:logout
      })
    }, delay)
  }, [clearRefreshTimer])

  // Listen for custom events from http-client
  useEffect(() => {
    function handleTokensUpdated(e: Event) {
      const { accessToken, refreshToken } = (e as CustomEvent).detail
      updateTokens(accessToken, refreshToken)
    }

    function handleLogout() {
      logout()
      router.navigate('/login')
    }

    window.addEventListener('auth:tokens-updated', handleTokensUpdated)
    window.addEventListener('auth:logout', handleLogout)

    return () => {
      window.removeEventListener('auth:tokens-updated', handleTokensUpdated)
      window.removeEventListener('auth:logout', handleLogout)
    }
  }, [updateTokens, logout])

  // Schedule proactive refresh whenever token changes
  useEffect(() => {
    if (state.token && state.refreshToken) {
      scheduleRefresh(state.token, state.refreshToken)
    }
    return clearRefreshTimer
  }, [state.token, state.refreshToken, scheduleRefresh, clearRefreshTimer])

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateTokens }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
