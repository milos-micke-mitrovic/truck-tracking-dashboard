import type { PageParams } from '@/shared/types'
import type {
  CompanyFilters,
  DriverFilters,
  VehicleFilters,
  TrailerFilters,
  UserFilters,
} from '../types'

export const adminKeys = {
  all: ['admin'] as const,

  // Companies
  companies: () => [...adminKeys.all, 'companies'] as const,
  companiesList: (params: CompanyFilters & PageParams) =>
    [...adminKeys.companies(), 'list', params] as const,
  company: (id: number) => [...adminKeys.companies(), 'detail', id] as const,
  companyDocuments: (companyId?: number) =>
    [...adminKeys.companies(), 'documents', companyId] as const,

  // Drivers
  drivers: () => [...adminKeys.all, 'drivers'] as const,
  driversList: (params: DriverFilters & PageParams) =>
    [...adminKeys.drivers(), 'list', params] as const,
  driver: (id: number) => [...adminKeys.drivers(), 'detail', id] as const,

  // Vehicles
  vehicles: () => [...adminKeys.all, 'vehicles'] as const,
  vehiclesList: (params: VehicleFilters & PageParams) =>
    [...adminKeys.vehicles(), 'list', params] as const,
  vehicle: (id: number) => [...adminKeys.vehicles(), 'detail', id] as const,
  vehiclesByCompany: (companyId: number) =>
    [...adminKeys.vehicles(), 'company', companyId] as const,
  vehiclesByTenant: (tenantId: number) =>
    [...adminKeys.vehicles(), 'tenant', tenantId] as const,
  vehiclesByStatus: (status: string) =>
    [...adminKeys.vehicles(), 'status', status] as const,

  // Trailers
  trailers: () => [...adminKeys.all, 'trailers'] as const,
  trailersList: (params: TrailerFilters & PageParams) =>
    [...adminKeys.trailers(), 'list', params] as const,
  trailer: (id: number) => [...adminKeys.trailers(), 'detail', id] as const,
  trailersByCompany: (companyId: number) =>
    [...adminKeys.trailers(), 'company', companyId] as const,
  trailersByVehicle: (vehicleId: number) =>
    [...adminKeys.trailers(), 'vehicle', vehicleId] as const,

  // Users
  users: () => [...adminKeys.all, 'users'] as const,
  usersList: (params: UserFilters & PageParams) =>
    [...adminKeys.users(), 'list', params] as const,
  user: (id: number) => [...adminKeys.users(), 'detail', id] as const,
  usersByRole: (role: string) => [...adminKeys.users(), 'role', role] as const,
  usersByStatus: (status: string) =>
    [...adminKeys.users(), 'status', status] as const,
}
