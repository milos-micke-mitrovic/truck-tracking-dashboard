import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type { PageResponse, PageParams } from '@/shared/types'
import type { Route, RouteRequest, RouteFilters } from '../types'

// Query keys
export const routeKeys = {
  all: ['routes'] as const,
  lists: () => [...routeKeys.all, 'list'] as const,
  list: (params: RouteFilters & PageParams) =>
    [...routeKeys.lists(), params] as const,
  details: () => [...routeKeys.all, 'detail'] as const,
  detail: (id: number) => [...routeKeys.details(), id] as const,
  byDriver: (driverId: number) =>
    [...routeKeys.all, 'driver', driverId] as const,
  byVehicle: (vehicleId: number) =>
    [...routeKeys.all, 'vehicle', vehicleId] as const,
  byTenant: (tenantId: number) =>
    [...routeKeys.all, 'tenant', tenantId] as const,
  byStatus: (status: string) => [...routeKeys.all, 'status', status] as const,
}

// API functions
async function fetchRoutes(
  params: RouteFilters & PageParams
): Promise<PageResponse<Route>> {
  const searchParams = new URLSearchParams()
  if (params.page !== undefined) searchParams.set('page', String(params.page + 1))
  if (params.size !== undefined) searchParams.set('size', String(params.size))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortDir) searchParams.set('sortDir', params.sortDir)
  if (params.routeNumber) searchParams.set('routeNumber', params.routeNumber)
  if (params.routeName) searchParams.set('routeName', params.routeName)
  if (params.origin) searchParams.set('origin', params.origin)
  if (params.destination) searchParams.set('destination', params.destination)
  if (params.status && params.status !== 'all')
    searchParams.set('status', params.status)
  if (params.searchTerm) searchParams.set('searchTerm', params.searchTerm)

  return httpClient.get(`/routes?${searchParams}`)
}

async function fetchRoute(id: number): Promise<Route> {
  return httpClient.get(`/routes/${id}`)
}

async function createRoute(data: RouteRequest): Promise<Route> {
  return httpClient.post('/routes', data)
}

async function updateRoute(id: number, data: RouteRequest): Promise<Route> {
  return httpClient.put(`/routes/${id}`, data)
}

async function deleteRoute(id: number): Promise<void> {
  return httpClient.delete(`/routes/${id}`)
}

async function fetchRoutesByDriver(driverId: number): Promise<Route[]> {
  return httpClient.get(`/routes/driver/${driverId}`)
}

async function fetchRoutesByVehicle(vehicleId: number): Promise<Route[]> {
  return httpClient.get(`/routes/vehicle/${vehicleId}`)
}

async function fetchRoutesByTenant(tenantId: number): Promise<Route[]> {
  return httpClient.get(`/routes/tenant/${tenantId}`)
}

async function fetchRoutesByStatus(status: string): Promise<Route[]> {
  return httpClient.get(`/routes/status/${status}`)
}

async function searchRoutes(searchTerm: string): Promise<Route[]> {
  return httpClient.get(
    `/routes/search?searchTerm=${encodeURIComponent(searchTerm)}`
  )
}

async function fetchRouteByNumber(
  routeNumber: string,
  tenantId: number
): Promise<Route> {
  return httpClient.get(
    `/routes/number/${encodeURIComponent(routeNumber)}?tenantId=${tenantId}`
  )
}

// Hooks
export function useRoutes(params: RouteFilters & PageParams = {}) {
  return useQuery({
    queryKey: routeKeys.list(params),
    queryFn: () => fetchRoutes(params),
  })
}

export function useRoute(id: number) {
  return useQuery({
    queryKey: routeKeys.detail(id),
    queryFn: () => fetchRoute(id),
    enabled: id > 0,
  })
}

export function useRoutesByDriver(driverId: number) {
  return useQuery({
    queryKey: routeKeys.byDriver(driverId),
    queryFn: () => fetchRoutesByDriver(driverId),
    enabled: driverId > 0,
  })
}

export function useRoutesByVehicle(vehicleId: number) {
  return useQuery({
    queryKey: routeKeys.byVehicle(vehicleId),
    queryFn: () => fetchRoutesByVehicle(vehicleId),
    enabled: vehicleId > 0,
  })
}

export function useRoutesByTenant(tenantId: number) {
  return useQuery({
    queryKey: routeKeys.byTenant(tenantId),
    queryFn: () => fetchRoutesByTenant(tenantId),
    enabled: tenantId > 0,
  })
}

export function useRoutesByStatus(status: string) {
  return useQuery({
    queryKey: routeKeys.byStatus(status),
    queryFn: () => fetchRoutesByStatus(status),
    enabled: !!status,
  })
}

export function useSearchRoutes(searchTerm: string) {
  return useQuery({
    queryKey: [...routeKeys.all, 'search', searchTerm],
    queryFn: () => searchRoutes(searchTerm),
    enabled: !!searchTerm,
  })
}

export function useRouteByNumber(routeNumber: string, tenantId: number) {
  return useQuery({
    queryKey: [...routeKeys.all, 'number', routeNumber, tenantId],
    queryFn: () => fetchRouteByNumber(routeNumber, tenantId),
    enabled: !!routeNumber && tenantId > 0,
  })
}

export function useCreateRoute() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
    },
  })
}

export function useUpdateRoute() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RouteRequest }) =>
      updateRoute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
    },
  })
}

export function useDeleteRoute() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
    },
  })
}
