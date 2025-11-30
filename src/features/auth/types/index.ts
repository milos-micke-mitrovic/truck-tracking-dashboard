export type User = {
  id: string
  name: string
  email: string
  username: string
  role: 'admin' | 'dispatcher' | 'driver'
  avatar?: string
}

export type LoginCredentials = {
  username: string
  password: string
}

export type LoginResponse = {
  user: User
  token: string
}

export type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
