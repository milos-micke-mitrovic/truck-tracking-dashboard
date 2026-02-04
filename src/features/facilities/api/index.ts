import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type {
  Facility,
  FacilityCreateRequest,
  FacilityUpdateRequest,
} from '../types'

// Query keys
export const facilityKeys = {
  all: ['facilities'] as const,
  lists: () => [...facilityKeys.all, 'list'] as const,
  details: () => [...facilityKeys.all, 'detail'] as const,
  detail: (id: string) => [...facilityKeys.details(), id] as const,
}

// API functions
async function fetchFacilities(): Promise<Facility[]> {
  return httpClient.get('/v1/facilities')
}

async function fetchFacility(id: string): Promise<Facility> {
  return httpClient.get(`/v1/facilities/${id}`)
}

async function createFacility(data: FacilityCreateRequest): Promise<Facility> {
  return httpClient.post('/v1/facilities', data)
}

async function updateFacility(
  id: string,
  data: FacilityUpdateRequest
): Promise<Facility> {
  return httpClient.put(`/v1/facilities/${id}`, data)
}

async function deleteFacility(id: string): Promise<void> {
  return httpClient.delete(`/v1/facilities/${id}`)
}

// Hooks
export function useFacilities() {
  return useQuery({
    queryKey: facilityKeys.lists(),
    queryFn: fetchFacilities,
  })
}

export function useFacility(id: string) {
  return useQuery({
    queryKey: facilityKeys.detail(id),
    queryFn: () => fetchFacility(id),
    enabled: !!id,
  })
}

export function useCreateFacility() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.all })
    },
  })
}

export function useUpdateFacility() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FacilityUpdateRequest }) =>
      updateFacility(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.all })
    },
  })
}

export function useDeleteFacility() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.all })
    },
  })
}
