export type Tenant = {
  id: number
  code: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type TenantRequest = {
  code: string
  name: string
  isActive: boolean
}

export type TenantAdmin = {
  id: number
  companyId: number | null
  companyName: string | null
  name: string
  username: string | null
  email: string
  department: string | null
  role: string
  status: string
}
