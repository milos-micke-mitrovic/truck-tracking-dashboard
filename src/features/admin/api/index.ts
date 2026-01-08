// Query keys
export { adminKeys } from './keys'

// Companies
export {
  useCompanies,
  useCompany,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
} from './companies'

// Drivers
export {
  useDrivers,
  useDriver,
  useCreateDriver,
  useUpdateDriver,
  useDeleteDriver,
} from './drivers'

// Trailers
export {
  useTrailers,
  useTrailer,
  useTrailerByVin,
  useTrailersByCompany,
  useTrailersByVehicle,
  useTrailersByStatus,
  useTrailersByType,
  useSearchTrailers,
  useCreateTrailer,
  useUpdateTrailer,
  useDeleteTrailer,
} from './trailers'

// Users
export {
  useUsers,
  useUser,
  useUserByEmail,
  useUserByUsername,
  useUsersByCompany,
  useUsersByRole,
  useUsersByStatus,
  useActiveUsers,
  useSearchUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useToggleUserStatus,
} from './users'

// Vehicles
export {
  useVehicles,
  useVehicle,
  useVehicleByVin,
  useVehiclesByCompany,
  useVehiclesByTenant,
  useVehiclesByStatus,
  useSearchVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
} from './vehicles'
