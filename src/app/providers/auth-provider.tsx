import { createContext, useContext, useState, type ReactNode } from 'react'
import { AUTH_STORAGE_KEY } from '@/shared/utils'
import type { User, AuthState } from '@/features/auth/types'

type AuthContextType = AuthState & {
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function getStoredAuth(): { user: User; token: string } | null {
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
      isAuthenticated: true,
    }
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(getInitialState)

  const login = (user: User, token: string) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }))
    setState({
      user,
      token,
      isAuthenticated: true,
    })
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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
