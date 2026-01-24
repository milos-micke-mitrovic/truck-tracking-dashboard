import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { AUTH_STORAGE_KEY } from '@/shared/utils'
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
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  }, [])

  // Update tokens after a successful refresh (called from http-client)
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
