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
const fetchCompanies = async (
  params: CompanyFilters & PaginationParams
): Promise<PaginatedResponse<Company>> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.name) searchParams.set('name', params.name)
  if (params.dotNumber) searchParams.set('dotNumber', params.dotNumber)
  if (params.status) searchParams.set('status', params.status)

  return httpClient.get(`/companies?${searchParams}`)
}

const fetchDrivers = async (
  params: DriverFilters & PaginationParams
): Promise<PaginatedResponse<Driver>> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.name) searchParams.set('name', params.name)
  if (params.phone) searchParams.set('phone', params.phone)
  if (params.status) searchParams.set('status', params.status)

  return httpClient.get(`/drivers?${searchParams}`)
}

const fetchVehicles = async (
  params: VehicleFilters & PaginationParams
): Promise<PaginatedResponse<Vehicle>> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.unitNumber) searchParams.set('unitNumber', params.unitNumber)
  if (params.status) searchParams.set('status', params.status)

  return httpClient.get(`/vehicles?${searchParams}`)
}

const fetchTrailers = async (
  params: TrailerFilters & PaginationParams
): Promise<PaginatedResponse<Trailer>> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.trailerId) searchParams.set('trailerId', params.trailerId)
  if (params.ownership) searchParams.set('ownership', params.ownership)
  if (params.status) searchParams.set('status', params.status)

  return httpClient.get(`/trailers?${searchParams}`)
}

const fetchUsers = async (
  params: UserFilters & PaginationParams
): Promise<PaginatedResponse<User>> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.name) searchParams.set('name', params.name)
  if (params.department) searchParams.set('department', params.department)
  if (params.status) searchParams.set('status', params.status)

  return httpClient.get(`/users?${searchParams}`)
}

const fetchEldDevices = async (
  params: EldDeviceFilters & PaginationParams
): Promise<PaginatedResponse<EldDevice>> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.serialNumber) searchParams.set('serialNumber', params.serialNumber)
  if (params.macAddress) searchParams.set('macAddress', params.macAddress)

  return httpClient.get(`/devices/eld?${searchParams}`)
}

const fetchPortableDevices = async (
  params: PortableDeviceFilters & PaginationParams
): Promise<PaginatedResponse<PortableDevice>> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.driverId) searchParams.set('driverId', params.driverId)

  return httpClient.get(`/devices/portable?${searchParams}`)
}

const fetchGpsDevices = async (
  params: GpsDeviceFilters & PaginationParams
): Promise<PaginatedResponse<GpsDevice>> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.serialNumber) searchParams.set('serialNumber', params.serialNumber)

  return httpClient.get(`/devices/gps?${searchParams}`)
}

const fetchCameraDevices = async (
  params: CameraDeviceFilters & PaginationParams
): Promise<PaginatedResponse<CameraDevice>> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.vehicleId) searchParams.set('vehicleId', params.vehicleId)

  return httpClient.get(`/devices/camera?${searchParams}`)
}

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
