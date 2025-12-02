import type { Status } from './common'

export type VehicleMake =
  | 'VOLVO TRUCK'
  | 'FREIGHTLINER'
  | 'INTERNATIONAL'
  | 'KENWORTH'
  | 'PETERBILT'
  | 'MACK'

export type Vehicle = {
  id: string
  companyId: string
  companyName: string
  unitNumber: string
  licensePlate: string
  vin: string
  model: string
  make: VehicleMake
  year: number
  driverId: string | null
  driverName: string | null
  tags: string[]
  status: Status
}

export type VehicleFilters = {
  unitNumber?: string
  status?: Status | 'all'
}
