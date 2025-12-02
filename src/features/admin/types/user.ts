import type { Status } from './common'

export type UserRole = 'company_admin' | 'support_personnel' | 'dispatcher'

export type Department =
  | 'dispatch'
  | 'accounting'
  | 'fleet_management'
  | 'operations'
  | 'safety'

export type User = {
  id: string
  companyIds: string[]
  companyNames: string[]
  name: string
  username: string
  extension: string
  email: string
  department: Department
  role: UserRole
  tags: string[]
  status: Status
}

export type UserFilters = {
  name?: string
  department?: Department | 'all'
  status?: Status | 'all'
}
