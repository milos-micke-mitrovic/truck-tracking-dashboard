// Route status from backend
export type RouteStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'

// Nested vehicle info in route response
export type RouteVehicle = {
  id: number
  company: string
  unitId: string
  licensePlate: string
  vin: string
  model: string
  make: string
  year: number
  driver: string
  status: string
}

// Nested driver info in route response
export type RouteDriver = {
  id: number
  companyId: number
  companyName: string
  name: string
  username: string
  phoneNumber: string
  vehicleId: number
  status: string
}

// Document attached to route
export type RouteDocument = {
  id: number
  type: string
  name: string
  path: string
  expirationDate: string | null
  createdAt: string
  updatedAt: string
}

// Route entity from backend
export type Route = {
  id: number
  tenantId: number
  routeNumber: string
  routeName: string
  status: RouteStatus
  origin: string
  destination: string
  distanceMiles: number
  estimatedDurationHours: number
  vehicle?: RouteVehicle | null
  driver?: RouteDriver | null
  vehicleId?: number
  driverId?: number
  scheduledStartDate: string
  scheduledEndDate: string
  actualStartDate?: string | null
  actualEndDate?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  documents?: RouteDocument[]
}

// Request body for create/update
export type RouteRequest = {
  tenantId: number
  routeNumber: string
  routeName: string
  status: RouteStatus
  origin: string
  destination: string
  distanceMiles: number
  estimatedDurationHours: number
  vehicleId?: number
  driverId?: number
  scheduledStartDate: string
  scheduledEndDate: string
  actualStartDate?: string
  actualEndDate?: string
  notes?: string
  documents?: {
    type: string
    tempFileName: string
    originalFileName: string
    expirationDate?: string
  }[]
}

// Filters for list
export type RouteFilters = {
  status?: RouteStatus | 'all'
  searchTerm?: string
}

// Route sheet props
export type RouteSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  route?: Route | null
  onSuccess?: () => void
}

// Document form value for creating/editing
export type RouteDocumentFormValue = {
  id?: number
  type: string
  tempFileName?: string
  originalFileName?: string
  expirationDate?: string
  isNew?: boolean
}

// Form values for route sheet
export type RouteFormValues = {
  routeNumber: string
  routeName: string
  status: RouteStatus
  origin: string
  destination: string
  distanceMiles: number
  estimatedDurationHours: number
  vehicleId?: number
  driverId?: number
  scheduledStartDate: string
  scheduledEndDate: string
  actualStartDate?: string
  actualEndDate?: string
  notes?: string
  documents: RouteDocumentFormValue[]
}
