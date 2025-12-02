import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type {
  Company,
  Driver,
  Vehicle,
  Trailer,
  User,
  EldDevice,
  PortableDevice,
  GpsDevice,
  CameraDevice,
  CompanyFilters,
  DriverFilters,
  VehicleFilters,
  TrailerFilters,
  UserFilters,
  EldDeviceFilters,
  PortableDeviceFilters,
  GpsDeviceFilters,
  CameraDeviceFilters,
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
function buildSearchParams<T extends Record<string, unknown>>(params: T): URLSearchParams {
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
  eldDevices: () => [...adminKeys.all, 'eldDevices'] as const,
  eldDevicesList: (filters: EldDeviceFilters & PaginationParams) =>
    [...adminKeys.eldDevices(), filters] as const,
  portableDevices: () => [...adminKeys.all, 'portableDevices'] as const,
  portableDevicesList: (filters: PortableDeviceFilters & PaginationParams) =>
    [...adminKeys.portableDevices(), filters] as const,
  gpsDevices: () => [...adminKeys.all, 'gpsDevices'] as const,
  gpsDevicesList: (filters: GpsDeviceFilters & PaginationParams) =>
    [...adminKeys.gpsDevices(), filters] as const,
  cameraDevices: () => [...adminKeys.all, 'cameraDevices'] as const,
  cameraDevicesList: (filters: CameraDeviceFilters & PaginationParams) =>
    [...adminKeys.cameraDevices(), filters] as const,
}

// API functions
const fetchCompanies = createFetchFn<Company, CompanyFilters & PaginationParams>('/companies')
const fetchDrivers = createFetchFn<Driver, DriverFilters & PaginationParams>('/drivers')
const fetchVehicles = createFetchFn<Vehicle, VehicleFilters & PaginationParams>('/vehicles')
const fetchTrailers = createFetchFn<Trailer, TrailerFilters & PaginationParams>('/trailers')
const fetchUsers = createFetchFn<User, UserFilters & PaginationParams>('/users')
const fetchEldDevices = createFetchFn<EldDevice, EldDeviceFilters & PaginationParams>('/devices/eld')
const fetchPortableDevices = createFetchFn<PortableDevice, PortableDeviceFilters & PaginationParams>('/devices/portable')
const fetchGpsDevices = createFetchFn<GpsDevice, GpsDeviceFilters & PaginationParams>('/devices/gps')
const fetchCameraDevices = createFetchFn<CameraDevice, CameraDeviceFilters & PaginationParams>('/devices/camera')

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

export function useEldDevices(
  params: EldDeviceFilters & PaginationParams = {}
) {
  return useQuery({
    queryKey: adminKeys.eldDevicesList(params),
    queryFn: () => fetchEldDevices(params),
  })
}

export function usePortableDevices(
  params: PortableDeviceFilters & PaginationParams = {}
) {
  return useQuery({
    queryKey: adminKeys.portableDevicesList(params),
    queryFn: () => fetchPortableDevices(params),
  })
}

export function useGpsDevices(
  params: GpsDeviceFilters & PaginationParams = {}
) {
  return useQuery({
    queryKey: adminKeys.gpsDevicesList(params),
    queryFn: () => fetchGpsDevices(params),
  })
}

export function useCameraDevices(
  params: CameraDeviceFilters & PaginationParams = {}
) {
  return useQuery({
    queryKey: adminKeys.cameraDevicesList(params),
    queryFn: () => fetchCameraDevices(params),
  })
}
