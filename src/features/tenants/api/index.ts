import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type { Tenant, TenantRequest } from '../types'

// Query keys
export const tenantKeys = {
  all: ['tenants'] as const,
  list: () => [...tenantKeys.all, 'list'] as const,
  active: () => [...tenantKeys.all, 'active'] as const,
  detail: (id: number) => [...tenantKeys.all, 'detail', id] as const,
  byCode: (code: string) => [...tenantKeys.all, 'code', code] as const,
  search: (name: string) => [...tenantKeys.all, 'search', name] as const,
}

// API functions
async function fetchTenants(): Promise<Tenant[]> {
  return httpClient.get('/tenants')
}

async function fetchActiveTenants(): Promise<Tenant[]> {
  return httpClient.get('/tenants/active')
}

async function fetchTenant(id: number): Promise<Tenant> {
  return httpClient.get(`/tenants/${id}`)
}

async function fetchTenantByCode(code: string): Promise<Tenant> {
  return httpClient.get(`/tenants/code/${code}`)
}

async function searchTenants(name: string): Promise<Tenant[]> {
  return httpClient.get(`/tenants/search?name=${encodeURIComponent(name)}`)
}

async function createTenant(data: TenantRequest): Promise<Tenant> {
  return httpClient.post('/tenants', data)
}

async function updateTenant(id: number, data: TenantRequest): Promise<Tenant> {
  return httpClient.put(`/tenants/${id}`, data)
}

async function deleteTenant(id: number): Promise<void> {
  return httpClient.delete(`/tenants/${id}`)
}

async function toggleTenantStatus(id: number): Promise<void> {
  return httpClient.patch(`/tenants/${id}/toggle-status`)
}

// Hooks
export function useTenants() {
  return useQuery({
    queryKey: tenantKeys.list(),
    queryFn: fetchTenants,
  })
}

export function useActiveTenants() {
  return useQuery({
    queryKey: tenantKeys.active(),
    queryFn: fetchActiveTenants,
  })
}

export function useTenant(id: number) {
  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: () => fetchTenant(id),
    enabled: id > 0,
  })
}

export function useTenantByCode(code: string) {
  return useQuery({
    queryKey: tenantKeys.byCode(code),
    queryFn: () => fetchTenantByCode(code),
    enabled: !!code,
  })
}

export function useSearchTenants(name: string) {
  return useQuery({
    queryKey: tenantKeys.search(name),
    queryFn: () => searchTenants(name),
    enabled: !!name,
  })
}

export function useCreateTenant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all })
    },
  })
}

export function useUpdateTenant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TenantRequest }) =>
      updateTenant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all })
    },
  })
}

export function useDeleteTenant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all })
    },
  })
}

export function useToggleTenantStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleTenantStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all })
    },
  })
}
