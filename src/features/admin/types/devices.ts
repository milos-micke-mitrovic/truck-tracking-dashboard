import type { Status, OnlineStatus } from './common'

// ELD Device
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

export type EldDeviceFilters = {
  serialNumber?: string
  macAddress?: string
}

// Portable Device
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

export type PortableDeviceFilters = {
  driverId?: string | 'all'
}

// GPS Device
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

export type GpsDeviceFilters = {
  serialNumber?: string
}

// Camera Device
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

export type CameraDeviceFilters = {
  vehicleId?: string | 'all'
}
