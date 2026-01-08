export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'DISPATCHER' | 'DRIVER' | 'ACCOUNTING' | 'USER'
  tenantId: number
  companyId?: number
  department?: string
  status: string
}

export type LoginCredentials = {
  tenantId: number
  email: string
  password: string
}

export type LoginResponse = {
  token: string
}

export type JwtPayload = {
  sub: string
  tenant_id: number
  role: string
  first_name: string
  last_name: string
  email: string
  exp: number
  iat: number
}

export type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}
