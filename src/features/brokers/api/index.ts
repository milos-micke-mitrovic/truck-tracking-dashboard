import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type { Broker, BrokerCreateRequest, BrokerSearchResult } from '../types'

// Query keys
export const brokerKeys = {
  all: ['brokers'] as const,
  lists: () => [...brokerKeys.all, 'list'] as const,
  details: () => [...brokerKeys.all, 'detail'] as const,
  detail: (id: string) => [...brokerKeys.details(), id] as const,
  search: (q: string) => [...brokerKeys.all, 'search', q] as const,
}

// API functions
async function fetchBrokers(): Promise<Broker[]> {
  return httpClient.get('/brokers')
}

async function fetchBroker(id: string): Promise<Broker> {
  return httpClient.get(`/brokers/${id}`)
}

async function createBroker(data: BrokerCreateRequest): Promise<Broker> {
  return httpClient.post('/brokers', data)
}

async function deleteBroker(id: string): Promise<void> {
  return httpClient.delete(`/brokers/${id}`)
}

async function syncBroker(id: string): Promise<Broker> {
  return httpClient.post(`/brokers/${id}/sync`)
}

async function syncAllBrokers(): Promise<void> {
  return httpClient.post('/brokers/sync-all')
}

async function searchBrokers(query: string, limit = 10): Promise<BrokerSearchResult[]> {
  return httpClient.get(`/brokers/search?q=${encodeURIComponent(query)}&limit=${limit}`)
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

export function useBrokerSearch(query: string) {
  return useQuery({
    queryKey: brokerKeys.search(query),
    queryFn: () => searchBrokers(query),
    enabled: query.length >= 2,
  })
}
