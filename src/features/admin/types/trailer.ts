// Trailer status (backend format)
export type TrailerStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'

// Trailer ownership (backend format)
export type TrailerOwnership = 'COMPANY_OWNED' | 'LEASED' | 'OWNER_OPERATOR'

// Trailer type (backend format)
export type TrailerType =
  | 'DRY_VAN'
  | 'REFRIGERATED'
  | 'FLATBED'
  | 'TANKER'
  | 'CONTAINER'

// Document for trailers
export type TrailerDocument = {
  id: number
  type: string
  name: string
  path: string
  expirationDate: string | null
  createdAt: string
  updatedAt: string
}

// Trailer entity (matches backend)
export type Trailer = {
  id: number
  tenantId: number
  unitId: string
  status: TrailerStatus
  ownership: TrailerOwnership
  vin: string
  type: TrailerType
  model: string
  year: number | null
  lengthFeet: number | null
  licensePlate: string
  state: string
  country: string
  registrationExpiry: string | null
  companyId: number
  currentVehicleId: number | null
  homeTerminal: string
  createdAt: string
  updatedAt: string
  documents: TrailerDocument[]
}

// List item (simplified response for lists)
export type TrailerListItem = {
  id: number
  company: string
  unitId: string
  type: TrailerType
  model: string
  vin: string
  licensePlate: string
  ownership: TrailerOwnership
  currentVehicle: string | null
  status: TrailerStatus
}

// Document request for create/update
export type TrailerDocumentRequest = {
  type: string
  tempFileName: string
  originalFileName: string
  expirationDate?: string
}

// Request type for create/update
export type TrailerRequest = {
  tenantId: number
  unitId: string
  status: TrailerStatus
  ownership: TrailerOwnership
  vin: string
  type: TrailerType
  model: string
  year?: number | null
  lengthFeet?: number | null
  licensePlate: string
  state?: string
  registrationExpiry?: string | null
  companyId: number
  currentVehicleId?: number | null
  homeTerminal?: string
  currentLocation?: string
  documents?: TrailerDocumentRequest[]
  documentIdsToDelete?: number[]
}

// Filters
export type TrailerFilters = {
  unitId?: string
  type?: TrailerType | 'all'
  model?: string
  vin?: string
  licensePlate?: string
  ownership?: TrailerOwnership | 'all'
  status?: TrailerStatus | 'all'
  companyId?: number
  tenantId?: number
  vehicleId?: number
}

// Document form value for creating/editing
export type TrailerDocumentFormValue = {
  id?: number
  type: string
  tempFileName?: string
  originalFileName?: string
  expirationDate?: string
  isNew?: boolean
}

// Form values for trailer dialog
export type TrailerFormValues = {
  companyId: number | null
  currentVehicleId: number | null
  unitId: string
  vin: string
  type: TrailerType | ''
  model: string
  year: string
  lengthFeet: string
  licensePlate: string
  state: string
  registrationExpiry: string
  ownership: TrailerOwnership | ''
  homeTerminal: string
  status: TrailerStatus
  documents: TrailerDocumentFormValue[]
}

// Sheet props
export type TrailerSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  trailerId?: number // Pass ID, sheet will fetch full data
  onSuccess?: () => void
}
