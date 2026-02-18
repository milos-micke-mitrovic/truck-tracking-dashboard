// Driver status (backend format)
export type DriverStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'

// Document type for drivers (from API response)
export type DriverDocument = {
  id: number
  type: string
  name: string
  path: string
  expirationDate: string | null
  createdAt: string
  updatedAt: string
}

// Document request for create/update
export type DriverDocumentRequest = {
  type: string
  tempFileName: string
  originalFileName: string
  expirationDate?: string
}

// Document form value (UI state during editing)
export type DriverDocumentFormValue = {
  id?: number // Only present for existing documents
  type: string
  tempFileName?: string // For new uploads
  originalFileName?: string
  expirationDate?: string
  isNew?: boolean // Flag to distinguish new vs existing
}

// List item - what /api/drivers returns (summary for table)
export type DriverListItem = {
  id: number
  companyId: number
  companyName: string
  name: string // Combined firstName + lastName
  phoneNumber: string | null
  status: DriverStatus
  username: string
  vehicleId: number | null
}

// Full driver entity - what /api/drivers/{id} returns (for edit form)
export type Driver = {
  id: number
  tenantId: number
  companyId: number
  vehicleId: number | null
  // Personal info
  firstName: string
  lastName: string
  birthDate: string | null
  // Contact
  phoneNumber: string
  email: string
  address: string
  // Credentials
  username: string
  // License
  country: string
  state: string
  licenseNumber: string
  // Assignment
  homeTerminal: string
  // Status
  status: DriverStatus
  // Timestamps
  createdAt: string
  updatedAt: string
  // Documents
  documents: DriverDocument[]
}

// Request type for create/update
export type DriverRequest = {
  tenantId: number
  companyId: number
  vehicleId?: number | null
  firstName: string
  lastName: string
  birthDate?: string | null
  phoneNumber?: string
  email?: string
  address?: string
  username: string
  password?: string // Only for create or password change
  country?: string
  state?: string
  licenseNumber?: string
  homeTerminal?: string
  status: DriverStatus
  documents?: DriverDocumentRequest[]
  documentIdsToDelete?: number[]
}

// Filters (matches BE DriverFilterRequest)
export type DriverFilters = {
  tenantId?: number
  name?: string
  username?: string
  phoneNumber?: string
  companyId?: number
  vehicleId?: number
  status?: DriverStatus | 'all'
}

// Form values for driver dialog
export type DriverFormValues = {
  companyId: number | null
  vehicleId: number | null
  firstName: string
  lastName: string
  birthDate: string
  phoneNumber: string
  email: string
  address: string
  username: string
  password: string
  country: string
  state: string
  licenseNumber: string
  homeTerminal: string
  status: DriverStatus
  documents: DriverDocumentFormValue[]
}

// Sheet props
export type DriverSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  driverId?: number // Pass ID, sheet will fetch full data
  onSuccess?: () => void
}
