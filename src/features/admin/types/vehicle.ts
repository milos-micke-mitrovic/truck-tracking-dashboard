// Vehicle status values match backend enum
export type VehicleStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'

// Vehicle ownership values match backend enum
export type VehicleOwnership = 'COMPANY_OWNED' | 'LEASED' | 'OWNER_OPERATOR'

// Fuel type values
export type FuelType =
  | 'DIESEL'
  | 'GASOLINE'
  | 'ELECTRIC'
  | 'HYBRID'
  | 'CNG'
  | 'LNG'

// Vehicle make values
export type VehicleMake =
  | 'VOLVO TRUCK'
  | 'FREIGHTLINER'
  | 'INTERNATIONAL'
  | 'KENWORTH'
  | 'PETERBILT'
  | 'MACK'
  | 'WESTERN STAR'
  | 'HINO'
  | 'ISUZU'

// Vehicle document type
export type VehicleDocument = {
  id: number
  type: string
  name: string
  path: string
  expirationDate: string | null
  createdAt: string
  updatedAt: string
}

// Full vehicle entity from backend
export type Vehicle = {
  id: number
  tenantId: number
  unitId: string
  status: VehicleStatus
  ownership: VehicleOwnership
  vin: string
  make: string
  model: string
  year: number
  fuelType: FuelType | null
  licensePlate: string
  state: string | null
  country: string | null
  engineHours: number | null
  registrationExpiry: string | null
  companyId: number
  currentDriverId: number | null
  homeTerminal: string | null
  currentLocation: string | null
  odometerMiles: number | null
  insurancePolicyNumber: string | null
  insuranceExpiry: string | null
  cargoCapacityCubicFt: number | null
  cargoCapacityLbs: number | null
  hasRefrigeration: boolean
  isHazmatCertified: boolean
  createdAt: string
  updatedAt: string
  documents: VehicleDocument[]
}

// Simplified vehicle for list views
export type VehicleListItem = {
  id: number
  company: string
  unitId: string
  licensePlate: string
  vin: string
  model: string
  make: string
  year: number
  driver: string | null
  status: VehicleStatus
}

// Document request for create/update
export type VehicleDocumentRequest = {
  type: string
  tempFileName: string
  originalFileName: string
  expirationDate?: string
}

// Request type for creating a vehicle
export type VehicleCreateRequest = {
  tenantId: number
  unitId: string
  status?: VehicleStatus
  ownership: VehicleOwnership
  vin: string
  make: string
  model: string
  year: number
  fuelType?: FuelType
  licensePlate: string
  state?: string
  registrationExpiry?: string
  companyId: number
  currentDriverId?: number
  homeTerminal?: string
  currentLocation?: string
  odometerMiles?: number
  insurancePolicyNumber?: string
  insuranceExpiry?: string
  cargoCapacityCubicFt?: number
  cargoCapacityLbs?: number
  hasRefrigeration?: boolean
  isHazmatCertified?: boolean
  documents?: VehicleDocumentRequest[]
  documentIdsToDelete?: number[]
}

// Request type for updating a vehicle
export type VehicleUpdateRequest = Partial<VehicleCreateRequest>

// Filters for vehicle list (matches BE VehicleFilterRequest)
export type VehicleFilters = {
  unitId?: string
  licensePlate?: string
  vin?: string
  make?: string
  model?: string
  year?: number
  status?: VehicleStatus | 'all'
  companyId?: number
}

// Document form value (UI state during editing)
export type VehicleDocumentFormValue = {
  id?: number
  type: string
  tempFileName?: string
  originalFileName?: string
  expirationDate?: string
  isNew?: boolean
}

// Form values for vehicle sheet
export type VehicleFormValues = {
  companyId: number | null
  currentDriverId: number | null
  unitId: string
  vin: string
  make: string
  model: string
  year: string
  ownership: VehicleOwnership | ''
  fuelType: FuelType | ''
  licensePlate: string
  state: string
  registrationExpiry: string
  homeTerminal: string
  currentLocation: string
  odometerMiles: string
  insurancePolicyNumber: string
  insuranceExpiry: string
  cargoCapacityCubicFt: string
  cargoCapacityLbs: string
  hasRefrigeration: boolean
  isHazmatCertified: boolean
  status: VehicleStatus
  documents: VehicleDocumentFormValue[]
}

// Sheet props
export type VehicleSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicleId?: number // Pass ID, sheet will fetch full data
  onSuccess?: () => void
}
