import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type { Broker, BrokerCreateRequest } from '../types'

// Query keys
export const brokerKeys = {
  all: ['brokers'] as const,
  lists: () => [...brokerKeys.all, 'list'] as const,
  details: () => [...brokerKeys.all, 'detail'] as const,
  detail: (id: string) => [...brokerKeys.details(), id] as const,
}

// API functions
async function fetchBrokers(): Promise<Broker[]> {
  return httpClient.get('/v1/brokers')
}

async function fetchBroker(id: string): Promise<Broker> {
  return httpClient.get(`/v1/brokers/${id}`)
}

async function createBroker(data: BrokerCreateRequest): Promise<Broker> {
  return httpClient.post('/v1/brokers', data)
}

async function deleteBroker(id: string): Promise<void> {
  return httpClient.delete(`/v1/brokers/${id}`)
}

async function syncBroker(id: string): Promise<Broker> {
  return httpClient.post(`/v1/brokers/${id}/sync`)
}

async function syncAllBrokers(): Promise<void> {
  return httpClient.post('/v1/brokers/sync-all')
}

// Hooks
export function useBrokers() {
  return useQuery({
    queryKey: brokerKeys.lists(),
    queryFn: fetchBrokers,
  })
}

export function useBroker(id: string) {
  return useQuery({
    queryKey: brokerKeys.detail(id),
    queryFn: () => fetchBroker(id),
    enabled: !!id,
  })
}

export function useCreateBroker() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBroker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokerKeys.all })
    },
  })
}

export function useDeleteBroker() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteBroker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokerKeys.all })
    },
  })
}

export function useSyncBroker() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: syncBroker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokerKeys.all })
    },
  })
}

export function useSyncAllBrokers() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: syncAllBrokers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokerKeys.all })
    },
  })
}
