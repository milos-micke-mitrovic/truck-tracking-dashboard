import { useQuery } from '@tanstack/react-query'
import type { Route, RouteFilters } from '../types'
import { routes as MOCK_ROUTES } from '@/mocks/data'

type RoutesResponse = {
  data: Route[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

type RoutesParams = RouteFilters & {
  page?: number
  pageSize?: number
}

async function fetchRoutes(params: RoutesParams): Promise<RoutesResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filtered = [...MOCK_ROUTES]

  if (params.status && params.status !== 'all') {
    filtered = filtered.filter((r) => r.status === params.status)
  }

  if (params.company && params.company !== 'all') {
    filtered = filtered.filter((r) => r.companyId === params.company)
  }

  if (params.identifier) {
    const search = params.identifier.toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.identifier.toLowerCase().includes(search) ||
        r.referenceNumber.toLowerCase().includes(search)
    )
  }

  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    data: filtered.slice(start, end),
    meta: {
      page,
      pageSize,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
    },
  }
}

export function useRoutes(params: RoutesParams) {
  return useQuery({
    queryKey: ['routes', params],
    queryFn: () => fetchRoutes(params),
  })
}

export function useCompaniesForRoutes() {
  return useQuery({
    queryKey: ['routes-companies'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const unique = [
        ...new Map(
          MOCK_ROUTES.map((r) => [
            r.companyId,
            { id: r.companyId, name: r.companyName },
          ])
        ).values(),
      ]
      return unique
    },
  })
}
