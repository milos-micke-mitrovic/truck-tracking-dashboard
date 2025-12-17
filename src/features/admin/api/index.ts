import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type {
  Company,
  Driver,
  Vehicle,
  Trailer,
  User,
  CompanyFilters,
  DriverFilters,
  VehicleFilters,
  TrailerFilters,
  UserFilters,
} from '../types'

// Paginated response type
type PaginatedResponse<T> = {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

type PaginationParams = {
  page?: number
  pageSize?: number
}

// Generic fetch helper
function buildSearchParams<T extends Record<string, unknown>>(
  params: T
): URLSearchParams {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })
  return searchParams
}

function createFetchFn<T, TParams extends PaginationParams>(endpoint: string) {
  return async (params: TParams): Promise<PaginatedResponse<T>> => {
    const searchParams = buildSearchParams(params)
    return httpClient.get(`${endpoint}?${searchParams}`)
  }
}

// Query keys
export const adminKeys = {
  all: ['admin'] as const,
  companies: () => [...adminKeys.all, 'companies'] as const,
  companiesList: (filters: CompanyFilters & PaginationParams) =>
    [...adminKeys.companies(), filters] as const,
  drivers: () => [...adminKeys.all, 'drivers'] as const,
  driversList: (filters: DriverFilters & PaginationParams) =>
    [...adminKeys.drivers(), filters] as const,
  vehicles: () => [...adminKeys.all, 'vehicles'] as const,
  vehiclesList: (filters: VehicleFilters & PaginationParams) =>
    [...adminKeys.vehicles(), filters] as const,
  trailers: () => [...adminKeys.all, 'trailers'] as const,
  trailersList: (filters: TrailerFilters & PaginationParams) =>
    [...adminKeys.trailers(), filters] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  usersList: (filters: UserFilters & PaginationParams) =>
    [...adminKeys.users(), filters] as const,
}

// API functions
const fetchCompanies = createFetchFn<
  Company,
  CompanyFilters & PaginationParams
>('/companies')
const fetchDrivers = createFetchFn<Driver, DriverFilters & PaginationParams>(
  '/drivers'
)
const fetchVehicles = createFetchFn<Vehicle, VehicleFilters & PaginationParams>(
  '/vehicles'
)
const fetchTrailers = createFetchFn<Trailer, TrailerFilters & PaginationParams>(
  '/trailers'
)
const fetchUsers = createFetchFn<User, UserFilters & PaginationParams>('/users')

// Hooks
export function useCompanies(params: CompanyFilters & PaginationParams = {}) {
  return useQuery({
    queryKey: adminKeys.companiesList(params),
    queryFn: () => fetchCompanies(params),
  })
}

export function useDrivers(params: DriverFilters & PaginationParams = {}) {
  return useQuery({
    queryKey: adminKeys.driversList(params),
    queryFn: () => fetchDrivers(params),
  })
}

export function useVehicles(params: VehicleFilters & PaginationParams = {}) {
  return useQuery({
    queryKey: adminKeys.vehiclesList(params),
    queryFn: () => fetchVehicles(params),
  })
}

export function useTrailers(params: TrailerFilters & PaginationParams = {}) {
  return useQuery({
    queryKey: adminKeys.trailersList(params),
    queryFn: () => fetchTrailers(params),
  })
}

export function useUsers(params: UserFilters & PaginationParams = {}) {
  return useQuery({
    queryKey: adminKeys.usersList(params),
    queryFn: () => fetchUsers(params),
  })
}
