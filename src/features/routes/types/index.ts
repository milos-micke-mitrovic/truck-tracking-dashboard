export type RouteStatus = 'assigned' | 'in_transit' | 'completed'

export type Route = {
  id: string
  companyId: string
  companyName: string
  identifier: string
  referenceNumber: string
  rate: number
  ratePerMile: number
  distance: number
  stops: number
  originCity: string
  originState: string
  originDate: string
  destinationCity: string
  destinationState: string
  destinationDate: string
  unitNumber: string
  driverName: string
  dispatcher: string
  status: RouteStatus
  statusDate: string
}

export type RouteFilters = {
  status?: RouteStatus | 'all'
  company?: string
  identifier?: string
  rate?: string
  trip?: string
}

// Route Sheet Form Types
export type StopType = 'pickup' | 'delivery'
export type ArrivalSlotType = 'window' | 'appointment' | 'fcfs'
export type UnitType = 'pallets' | 'cases' | 'pieces'

export type StopReferenceNumber = {
  type: string
  value: string
}

export type RouteStop = {
  id: string
  type: StopType
  locationId: string
  locationName?: string
  arrivalSlotType: ArrivalSlotType
  startDate: string
  endDate: string
  referenceNumbers: StopReferenceNumber[]
  accessories: string[]
  requiredDocuments: string[]
  instructions: string
}

export type RouteFormValues = {
  // Carrier Section
  companyId: string
  dispatcherId: string
  tags: string[]
  vehicleId: string
  driverId: string
  coDriverId: string
  autoDispatch: boolean
  // Broker Section
  brokerCompanyId: string
  brokerRepresentativeId: string
  brokerIdentifier: string
  internalIdentifier: string
  brokerRate: string
  driverRate: string
  rateConfirmation: File | null
  driverRateConfirmation: File | null
  // Stops Section
  stops: RouteStop[]
  // Route Section
  routeId: string
  emptyMilesCalculated: number
  emptyMilesManual: string
  loadedMilesCalculated: number
  loadedMilesManual: string
  // Load Section
  weight: string
  length: string
  commodity: string
  capacity: string
  temperature: string
  units: string
  unitType: UnitType | ''
}

export type RouteSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  route?: Route | null
  onSuccess?: () => void
}
