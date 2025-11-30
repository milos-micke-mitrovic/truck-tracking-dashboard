// Common types
export type Status = 'active' | 'inactive'
export type EnabledDisabled = 'enabled' | 'disabled'
export type OnlineStatus = 'online' | 'offline'

// Company
export type Company = {
  id: string
  name: string
  dotNumber: string
  address: string
  phone: string
  emailDomain: string
  fleet: 'eminent' | 'established' | 'starter'
  plan: 'basic' | 'premium' | 'enterprise'
  terminalCount: number
  status: Status
}

// Driver
export type Driver = {
  id: string
  companyId: string
  companyName: string
  name: string
  username: string
  phone: string
  personalUse: EnabledDisabled
  yardMoves: EnabledDisabled
  exempt: EnabledDisabled
  cycle: EnabledDisabled
  status: Status
}

// Vehicle
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

// Trailer
export type TrailerOwnership = 'company' | 'contractor'

export type Trailer = {
  id: string
  companyId: string
  companyName: string
  trailerId: string
  type: string
  model: string
  vin: string
  licensePlate: string
  ownership: TrailerOwnership
  status: Status
}

// User
export type UserRole = 'company_admin' | 'support_personnel' | 'dispatcher'
export type Department =
  | 'dispatch'
  | 'accounting'
  | 'fleet_management'
  | 'operations'
  | 'safety'

export type User = {
  id: string
  companyIds: string[]
  companyNames: string[]
  name: string
  username: string
  extension: string
  email: string
  department: Department
  role: UserRole
  tags: string[]
  status: Status
}

// Devices - ELD
export type EldDevice = {
  id: string
  companyId: string
  companyName: string
  manufacturer: string
  model: string
  serialNumber: string
  macAddress: string
  firmwareVersion: string | null
  iccid: string | null
  vehicleId: string | null
  vehicleUnitNumber: string | null
  status: Status
}

// Devices - Portable
export type Platform = 'iOS' | 'Android'

export type PortableDevice = {
  id: string
  companyId: string
  companyName: string
  platform: Platform
  platformVersion: string
  identifier: string
  appVersion: string
  driverId: string | null
  driverName: string | null
  sequenceId: number
  online: OnlineStatus
}

// Devices - GPS
export type GpsDevice = {
  id: string
  companyId: string
  companyName: string
  serialNumber: string
  manufacturer: string
  model: string
  assetId: string | null
  assetLabel: string | null
  status: Status
}

// Devices - Camera
export type CameraDevice = {
  id: string
  companyId: string
  companyName: string
  manufacturer: string
  model: string
  serialNumber: string
  vehicleId: string | null
  vehicleUnitNumber: string | null
  status: Status
}

// Filter types for each entity
export type CompanyFilters = {
  name?: string
  dotNumber?: string
  status?: Status | 'all'
}

export type DriverFilters = {
  name?: string
  phone?: string
  status?: Status | 'all'
}

export type VehicleFilters = {
  unitNumber?: string
  status?: Status | 'all'
}

export type TrailerFilters = {
  trailerId?: string
  ownership?: TrailerOwnership | 'all'
  status?: Status | 'all'
}

export type UserFilters = {
  name?: string
  department?: Department | 'all'
  status?: Status | 'all'
}

export type EldDeviceFilters = {
  serialNumber?: string
  macAddress?: string
}

export type PortableDeviceFilters = {
  driverId?: string | 'all'
}

export type GpsDeviceFilters = {
  serialNumber?: string
}

export type CameraDeviceFilters = {
  vehicleId?: string | 'all'
}
