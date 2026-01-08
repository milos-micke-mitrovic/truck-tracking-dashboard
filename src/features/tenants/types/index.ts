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
