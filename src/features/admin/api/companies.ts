import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type { PageResponse, PageParams } from '@/shared/types'
import type { Company, CompanyListItem, CompanyRequest, CompanyFilters, CompanyDocumentItem } from '../types'
import { adminKeys } from './keys'

// API functions
async function fetchCompanies(
  params: CompanyFilters & PageParams
): Promise<PageResponse<CompanyListItem>> {
  const searchParams = new URLSearchParams()
  if (params.page !== undefined) searchParams.set('page', String(params.page + 1))
  if (params.size !== undefined) searchParams.set('size', String(params.size))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortDir) searchParams.set('sortDir', params.sortDir)
  if (params.fullName) searchParams.set('fullName', params.fullName)
  if (params.dotNumber) searchParams.set('dotNumber', params.dotNumber)
  if (params.mcNumber) searchParams.set('mcNumber', params.mcNumber)
  if (params.address) searchParams.set('address', params.address)
  if (params.phoneNumber) searchParams.set('phoneNumber', params.phoneNumber)
  if (params.emailDomain) searchParams.set('emailDomain', params.emailDomain)
  if (params.status && params.status !== 'all')
    searchParams.set('status', params.status)

  return httpClient.get(`/companies?${searchParams}`, {
    tenantId: params.tenantId,
  })
}

async function fetchCompany(id: number): Promise<Company> {
  return httpClient.get(`/companies/${id}`)
}

async function createCompany(data: CompanyRequest): Promise<Company> {
  return httpClient.post('/companies', data)
}

async function updateCompany(id: number, data: CompanyRequest): Promise<Company> {
  return httpClient.put(`/companies/${id}`, data)
}

async function deleteCompany(id: number): Promise<void> {
  return httpClient.delete(`/companies/${id}`)
}

async function fetchCompanyDocuments(companyId?: number): Promise<CompanyDocumentItem[]> {
  const params = new URLSearchParams()
  if (companyId !== undefined) params.set('companyId', String(companyId))
  return httpClient.get(`/documents/companies?${params}`)
}

// Hooks
export function useCompanies(params: CompanyFilters & PageParams = {}) {
  return useQuery({
    queryKey: adminKeys.companiesList(params),
    queryFn: () => fetchCompanies(params),
  })
}

export function useCompany(id: number) {
  return useQuery({
    queryKey: adminKeys.company(id),
    queryFn: () => fetchCompany(id),
    enabled: id > 0,
  })
}

export function useCreateCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.companies() })
    },
  })
}

export function useUpdateCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CompanyRequest }) =>
      updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.companies() })
    },
  })
}

export function useDeleteCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.companies() })
    },
  })
}

export function useCompanyDocuments(companyId?: number) {
  return useQuery({
    queryKey: adminKeys.companyDocuments(companyId),
    queryFn: () => fetchCompanyDocuments(companyId),
  })
}
