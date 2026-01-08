import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type { PageResponse, PageParams } from '@/shared/types'
import type {
  Vehicle,
  VehicleListItem,
  VehicleCreateRequest,
  VehicleUpdateRequest,
  VehicleFilters,
} from '../types'
import { adminKeys } from './keys'

// API functions
async function fetchVehicles(
  params: VehicleFilters & PageParams
): Promise<PageResponse<VehicleListItem>> {
  const searchParams = new URLSearchParams()
  if (params.page !== undefined) searchParams.set('page', String(params.page))
  if (params.size !== undefined) searchParams.set('size', String(params.size))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortDir) searchParams.set('sortDir', params.sortDir)
  if (params.unitId) searchParams.set('unitId', params.unitId)
  if (params.vin) searchParams.set('vin', params.vin)
  if (params.make) searchParams.set('make', params.make)
  if (params.model) searchParams.set('model', params.model)
  if (params.status && params.status !== 'all')
    searchParams.set('status', params.status)
  if (params.companyId) searchParams.set('companyId', String(params.companyId))

  return httpClient.get(`/vehicles?${searchParams}`)
}

async function fetchVehicle(id: number): Promise<Vehicle> {
  return httpClient.get(`/vehicles/${id}`)
}

async function fetchVehicleByVin(vin: string): Promise<Vehicle> {
  return httpClient.get(`/vehicles/vin/${encodeURIComponent(vin)}`)
}

async function fetchVehiclesByCompany(companyId: number): Promise<VehicleListItem[]> {
  return httpClient.get(`/vehicles/company/${companyId}`)
}

async function fetchVehiclesByTenant(tenantId: number): Promise<VehicleListItem[]> {
  return httpClient.get(`/vehicles/tenant/${tenantId}`)
}

async function fetchVehiclesByStatus(status: string): Promise<VehicleListItem[]> {
  return httpClient.get(`/vehicles/status/${status}`)
}

async function searchVehicles(searchTerm: string): Promise<VehicleListItem[]> {
  return httpClient.get(
    `/vehicles/search?searchTerm=${encodeURIComponent(searchTerm)}`
  )
}

async function createVehicle(data: VehicleCreateRequest): Promise<Vehicle> {
  return httpClient.post('/vehicles', data)
}

async function updateVehicle(
  id: number,
  data: VehicleUpdateRequest
): Promise<Vehicle> {
  return httpClient.put(`/vehicles/${id}`, data)
}

async function deleteVehicle(id: number): Promise<void> {
  return httpClient.delete(`/vehicles/${id}`)
}

// Hooks
export function useVehicles(params: VehicleFilters & PageParams = {}) {
  return useQuery({
    queryKey: adminKeys.vehiclesList(params),
    queryFn: () => fetchVehicles(params),
  })
}

export function useVehicle(id: number) {
  return useQuery({
    queryKey: adminKeys.vehicle(id),
    queryFn: () => fetchVehicle(id),
    enabled: id > 0,
  })
}

export function useVehicleByVin(vin: string) {
  return useQuery({
    queryKey: [...adminKeys.vehicles(), 'vin', vin],
    queryFn: () => fetchVehicleByVin(vin),
    enabled: !!vin,
  })
}

export function useVehiclesByCompany(companyId: number) {
  return useQuery({
    queryKey: adminKeys.vehiclesByCompany(companyId),
    queryFn: () => fetchVehiclesByCompany(companyId),
    enabled: companyId > 0,
  })
}

export function useVehiclesByTenant(tenantId: number) {
  return useQuery({
    queryKey: adminKeys.vehiclesByTenant(tenantId),
    queryFn: () => fetchVehiclesByTenant(tenantId),
    enabled: tenantId > 0,
  })
}

export function useVehiclesByStatus(status: string) {
  return useQuery({
    queryKey: adminKeys.vehiclesByStatus(status),
    queryFn: () => fetchVehiclesByStatus(status),
    enabled: !!status,
  })
}

export function useSearchVehicles(searchTerm: string) {
  return useQuery({
    queryKey: [...adminKeys.vehicles(), 'search', searchTerm],
    queryFn: () => searchVehicles(searchTerm),
    enabled: !!searchTerm,
  })
}

export function useCreateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.vehicles() })
    },
  })
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: VehicleUpdateRequest }) =>
      updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.vehicles() })
    },
  })
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.vehicles() })
    },
  })
}
