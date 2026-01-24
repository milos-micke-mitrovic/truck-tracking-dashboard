import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type { PageResponse, PageParams } from '@/shared/types'
import type { Driver, DriverListItem, DriverRequest, DriverFilters } from '../types'
import { adminKeys } from './keys'

// API functions
async function fetchDrivers(
  params: DriverFilters & PageParams
): Promise<PageResponse<DriverListItem>> {
  const searchParams = new URLSearchParams()
  if (params.page !== undefined) searchParams.set('page', String(params.page + 1))
  if (params.size !== undefined) searchParams.set('size', String(params.size))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortDir) searchParams.set('sortDir', params.sortDir)
  if (params.name) searchParams.set('name', params.name)
  if (params.username) searchParams.set('username', params.username)
  if (params.phoneNumber) searchParams.set('phoneNumber', params.phoneNumber)
  if (params.companyId) searchParams.set('companyId', String(params.companyId))
  if (params.vehicleId) searchParams.set('vehicleId', String(params.vehicleId))
  if (params.status && params.status !== 'all')
    searchParams.set('status', params.status)

  return httpClient.get(`/drivers?${searchParams}`)
}

async function fetchDriver(id: number): Promise<Driver> {
  return httpClient.get(`/drivers/${id}`)
}

async function createDriver(data: DriverRequest): Promise<Driver> {
  return httpClient.post('/drivers', data)
}

async function updateDriver(id: number, data: DriverRequest): Promise<Driver> {
  return httpClient.put(`/drivers/${id}`, data)
}

async function deleteDriver(id: number): Promise<void> {
  return httpClient.delete(`/drivers/${id}`)
}

// Hooks
export function useDrivers(params: DriverFilters & PageParams = {}) {
  return useQuery({
    queryKey: adminKeys.driversList(params),
    queryFn: () => fetchDrivers(params),
  })
}

export function useDriver(id: number) {
  return useQuery({
    queryKey: adminKeys.driver(id),
    queryFn: () => fetchDriver(id),
    enabled: id > 0,
  })
}

export function useCreateDriver() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.drivers() })
    },
  })
}

export function useUpdateDriver() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DriverRequest }) =>
      updateDriver(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.drivers() })
    },
  })
}

export function useDeleteDriver() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.drivers() })
    },
  })
}
