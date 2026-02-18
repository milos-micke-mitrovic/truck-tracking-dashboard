import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type { PageResponse, PageParams } from '@/shared/types'
import type { Trailer, TrailerListItem, TrailerRequest, TrailerFilters } from '../types'
import { adminKeys } from './keys'

// API functions
async function fetchTrailers(
  params: TrailerFilters & PageParams
): Promise<PageResponse<TrailerListItem>> {
  const searchParams = new URLSearchParams()
  if (params.page !== undefined) searchParams.set('page', String(params.page + 1))
  if (params.size !== undefined) searchParams.set('size', String(params.size))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortDir) searchParams.set('sortDir', params.sortDir)
  if (params.unitId) searchParams.set('unitId', params.unitId)
  if (params.type && params.type !== 'all') searchParams.set('type', params.type)
  if (params.model) searchParams.set('model', params.model)
  if (params.vin) searchParams.set('vin', params.vin)
  if (params.licensePlate) searchParams.set('licensePlate', params.licensePlate)
  if (params.ownership && params.ownership !== 'all')
    searchParams.set('ownership', params.ownership)
  if (params.status && params.status !== 'all')
    searchParams.set('status', params.status)
  if (params.companyId) searchParams.set('companyId', String(params.companyId))
  if (params.vehicleId) searchParams.set('vehicleId', String(params.vehicleId))

  return httpClient.get(`/trailers?${searchParams}`, { tenantId: params.tenantId })
}

async function fetchTrailer(id: number): Promise<Trailer> {
  return httpClient.get(`/trailers/${id}`)
}

async function fetchTrailerByVin(vin: string): Promise<Trailer> {
  return httpClient.get(`/trailers/vin/${vin}`)
}

async function fetchTrailersByCompany(companyId: number): Promise<TrailerListItem[]> {
  return httpClient.get(`/trailers/company/${companyId}`)
}

async function fetchTrailersByVehicle(vehicleId: number): Promise<TrailerListItem[]> {
  return httpClient.get(`/trailers/vehicle/${vehicleId}`)
}

async function fetchTrailersByStatus(status: string): Promise<TrailerListItem[]> {
  return httpClient.get(`/trailers/status/${status}`)
}

async function fetchTrailersByType(type: string): Promise<TrailerListItem[]> {
  return httpClient.get(`/trailers/type/${type}`)
}

async function searchTrailers(model: string): Promise<TrailerListItem[]> {
  return httpClient.get(`/trailers/search?model=${encodeURIComponent(model)}`)
}

async function createTrailer(data: TrailerRequest): Promise<Trailer> {
  return httpClient.post('/trailers', data)
}

async function updateTrailer(id: number, data: TrailerRequest): Promise<Trailer> {
  return httpClient.put(`/trailers/${id}`, data)
}

async function deleteTrailer(id: number): Promise<void> {
  return httpClient.delete(`/trailers/${id}`)
}

// Hooks
export function useTrailers(params: TrailerFilters & PageParams = {}) {
  return useQuery({
    queryKey: adminKeys.trailersList(params),
    queryFn: () => fetchTrailers(params),
  })
}

export function useTrailer(id: number) {
  return useQuery({
    queryKey: adminKeys.trailer(id),
    queryFn: () => fetchTrailer(id),
    enabled: id > 0,
  })
}

export function useTrailerByVin(vin: string) {
  return useQuery({
    queryKey: [...adminKeys.trailers(), 'vin', vin],
    queryFn: () => fetchTrailerByVin(vin),
    enabled: !!vin,
  })
}

export function useTrailersByCompany(companyId: number) {
  return useQuery({
    queryKey: adminKeys.trailersByCompany(companyId),
    queryFn: () => fetchTrailersByCompany(companyId),
    enabled: companyId > 0,
  })
}

export function useTrailersByVehicle(vehicleId: number) {
  return useQuery({
    queryKey: adminKeys.trailersByVehicle(vehicleId),
    queryFn: () => fetchTrailersByVehicle(vehicleId),
    enabled: vehicleId > 0,
  })
}

export function useTrailersByStatus(status: string) {
  return useQuery({
    queryKey: [...adminKeys.trailers(), 'status', status],
    queryFn: () => fetchTrailersByStatus(status),
    enabled: !!status,
  })
}

export function useTrailersByType(type: string) {
  return useQuery({
    queryKey: [...adminKeys.trailers(), 'type', type],
    queryFn: () => fetchTrailersByType(type),
    enabled: !!type,
  })
}

export function useSearchTrailers(model: string) {
  return useQuery({
    queryKey: [...adminKeys.trailers(), 'search', model],
    queryFn: () => searchTrailers(model),
    enabled: !!model,
  })
}

export function useCreateTrailer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTrailer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.trailers() })
    },
  })
}

export function useUpdateTrailer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TrailerRequest }) =>
      updateTrailer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.trailers() })
    },
  })
}

export function useDeleteTrailer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTrailer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.trailers() })
    },
  })
}
