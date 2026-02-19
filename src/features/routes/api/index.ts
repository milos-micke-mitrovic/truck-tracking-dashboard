import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type { PageResponse, PageParams } from '@/shared/types'
import type {
  RouteShortResponse,
  RouteResponse,
  RouteCreateRequest,
  RouteUpdateRequest,
  RouteStatusUpdateRequest,
  RouteFilters,
  RouteStopResponse,
  StopRequest,
  StopUpdateRequest,
  ParsePdfResponse,
  PodSubmissionResponse,
} from '../types'

// Query keys
export const routeKeys = {
  all: ['routes'] as const,
  lists: () => [...routeKeys.all, 'list'] as const,
  list: (params: RouteFilters & PageParams) =>
    [...routeKeys.lists(), params] as const,
  details: () => [...routeKeys.all, 'detail'] as const,
  detail: (id: string) => [...routeKeys.details(), id] as const,
  stops: (routeId: string) => [...routeKeys.all, 'stops', routeId] as const,
  pods: (routeId: string) => [...routeKeys.all, 'pods', routeId] as const,
}

// --- Route API functions ---

async function fetchRoutes(
  params: RouteFilters & PageParams
): Promise<PageResponse<RouteShortResponse>> {
  const searchParams = new URLSearchParams()
  if (params.page !== undefined) searchParams.set('page', String(params.page))
  if (params.size !== undefined) searchParams.set('size', String(params.size))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortDir) searchParams.set('sortDir', params.sortDir)
  if (params.identifier) searchParams.set('identifier', params.identifier)
  if (params.vehicleId) searchParams.set('vehicleId', params.vehicleId)
  if (params.dispatcherId) searchParams.set('dispatcherId', params.dispatcherId)
  if (params.status && params.status !== 'all')
    searchParams.set('status', params.status)
  if (params.bookedAtFrom) searchParams.set('bookedAtFrom', params.bookedAtFrom)
  if (params.bookedAtTo) searchParams.set('bookedAtTo', params.bookedAtTo)
  if (params.companyId) searchParams.set('companyId', params.companyId)
  if (params.brokerId) searchParams.set('brokerId', params.brokerId)
  if (params.driverId) searchParams.set('driverId', params.driverId)

  return httpClient.get(`/routes?${searchParams}`)
}

async function fetchRoute(id: string): Promise<RouteResponse> {
  return httpClient.get(`/routes/${id}`)
}

async function createRoute(
  data: RouteCreateRequest
): Promise<RouteResponse> {
  return httpClient.post('/routes', data)
}

async function updateRoute(
  id: string,
  data: RouteUpdateRequest
): Promise<RouteResponse> {
  return httpClient.put(`/routes/${id}`, data)
}

async function deleteRoute(id: string): Promise<void> {
  return httpClient.delete(`/routes/${id}`)
}

async function updateRouteStatus(
  id: string,
  data: RouteStatusUpdateRequest
): Promise<RouteResponse> {
  return httpClient.patch(`/routes/${id}/status`, data)
}

// --- Stop API functions ---

async function fetchRouteStops(routeId: string): Promise<RouteStopResponse[]> {
  return httpClient.get(`/routes/${routeId}/stops`)
}

async function createRouteStop(
  routeId: string,
  data: StopRequest
): Promise<RouteStopResponse> {
  return httpClient.post(`/routes/${routeId}/stops`, data)
}

async function updateRouteStop(
  routeId: string,
  stopId: string,
  data: StopUpdateRequest
): Promise<RouteStopResponse> {
  return httpClient.put(`/routes/${routeId}/stops/${stopId}`, data)
}

async function deleteRouteStop(
  routeId: string,
  stopId: string
): Promise<void> {
  return httpClient.delete(`/routes/${routeId}/stops/${stopId}`)
}

// --- Route hooks ---

export function useRoutes(params: RouteFilters & PageParams = {}) {
  return useQuery({
    queryKey: routeKeys.list(params),
    queryFn: () => fetchRoutes(params),
  })
}

export function useRoute(id: string | undefined) {
  return useQuery({
    queryKey: routeKeys.detail(id!),
    queryFn: () => fetchRoute(id!),
    enabled: !!id,
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
    mutationFn: ({ id, data }: { id: string; data: RouteUpdateRequest }) =>
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

export function useUpdateRouteStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: RouteStatusUpdateRequest
    }) => updateRouteStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
    },
  })
}

// --- Stop hooks ---

export function useRouteStops(routeId: string) {
  return useQuery({
    queryKey: routeKeys.stops(routeId),
    queryFn: () => fetchRouteStops(routeId),
    enabled: !!routeId,
  })
}

export function useCreateRouteStop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      routeId,
      data,
    }: {
      routeId: string
      data: StopRequest
    }) => createRouteStop(routeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
    },
  })
}

export function useUpdateRouteStop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      routeId,
      stopId,
      data,
    }: {
      routeId: string
      stopId: string
      data: StopUpdateRequest
    }) => updateRouteStop(routeId, stopId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
    },
  })
}

export function useDeleteRouteStop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      routeId,
      stopId,
    }: {
      routeId: string
      stopId: string
    }) => deleteRouteStop(routeId, stopId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
    },
  })
}

// --- POD API functions ---

async function fetchRoutePods(
  routeId: string
): Promise<PodSubmissionResponse[]> {
  return httpClient.get(`/routes/${routeId}/pods`)
}

// --- POD hooks ---

export function useRoutePods(routeId: string | null) {
  return useQuery({
    queryKey: routeKeys.pods(routeId!),
    queryFn: () => fetchRoutePods(routeId!),
    enabled: !!routeId,
  })
}

export async function downloadPodDocument(documentId: number): Promise<void> {
  const url = `${import.meta.env.VITE_API_URL || '/api'}/pod/documents/${documentId}/download`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`)
  }

  const contentDisposition = response.headers.get('Content-Disposition')
  let filename = `pod_document_${documentId}`
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/)
    if (match) {
      filename = match[1]
    }
  }

  const blob = await response.blob()
  const blobUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(blobUrl)
}

// --- PDF Parse API functions ---

// Helper to get auth token
function getToken(): string | null {
  try {
    const stored = localStorage.getItem('auth')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.token || null
    }
  } catch {
    return null
  }
  return null
}

async function parsePdfForRoute(file: File): Promise<ParsePdfResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(
    `${import.meta.env.VITE_API_URL || '/api'}/confirmations/parse-pdf`,
    {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Parse failed: ${response.statusText}`)
  }

  return response.json()
}

// --- PDF Parse hooks ---

export function useParsePdf() {
  return useMutation({
    mutationFn: parsePdfForRoute,
  })
}
