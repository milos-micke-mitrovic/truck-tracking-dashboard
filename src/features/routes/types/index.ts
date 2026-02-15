import type { FacilityShort } from '@/features/facilities'
import type { BrokerShort } from '@/features/brokers'

// --- Enum types ---

export type RouteStatus =
  | 'BOOKED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'AT_PICKUP'
  | 'LOADED'
  | 'AT_DELIVERY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'INVOICED'
  | 'PAID'
  | 'CANCELLED'

export type RouteType = 'SHORTEST_FASTEST' | 'CHEAPEST' | 'ALTERNATE'

export type StopType = 'PICKUP' | 'DELIVERY'

export type StopStatus =
  | 'PENDING'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'LOADING'
  | 'UNLOADING'
  | 'DEPARTED'
  | 'COMPLETED'
  | 'SKIPPED'

export type ArrivalSlotType =
  | 'WINDOW'
  | 'FCFS'
  | 'BY_APPOINTMENT'
  | 'EXACT_TIME'

export type Capacity = 'FULL' | 'PARTIAL'

export type WeightUnit = 'LBS' | 'KG'

export type UnitType =
  | 'PALLETS'
  | 'BAGS'
  | 'BALES'
  | 'BINS'
  | 'BOXES'
  | 'BUNCHES'
  | 'BUNDLES'

export type AccessoryType =
  | 'SAFETY_VEST'
  | 'HARD_HAT'
  | 'SAFETY_GLASSES'
  | 'STEEL_TOED_BOOTS'
  | 'WORK_GLOVES'
  | 'FACE_MASK_RESPIRATOR'
  | 'FLAME_RESISTANT_CLOTHING'
  | 'HAIR_NET_BEARD_NET'
  | 'LOAD_LOCKS_LOAD_BARS'
  | 'TIE_DOWN_STRAPS'
  | 'PALLET_JACK'
  | 'HAND_TRUCK_DOLLY'
  | 'LIFTGATE'
  | 'TARPS'
  | 'HOSES_AND_FITTINGS'
  | 'BULKHEADS'
  | 'TRAILER_SEAL'
  | 'OVERSIZE_LOAD_BANNER_FLAGS'

export type RequiredDocumentType =
  | 'BOL_PHOTO'
  | 'POD_PHOTO'
  | 'TIRES_PHOTO'
  | 'TRAILER_PHOTO'
  | 'SECURED_FREIGHT_PHOTO'
  | 'SEAL_PHOTO'
  | 'EMPTY_SCALE_PHOTO'
  | 'LOADED_SCALE_PHOTO'
  | 'ESCORT_PHOTO'
  | 'LUMPER_RECEIPT_PHOTO'

export type ReferenceNumberType =
  | 'APPT_CONF'
  | 'BOL'
  | 'CUSTOMER'
  | 'DEL_CONSIGNEE'
  | 'DELIVERY'
  | 'GATE_CHECK_IN'
  | 'ITEM'

// --- Short response types (nested in RouteResponse) ---

export type CompanyShort = {
  id: string
  displayName: string
  dotNumber: string | null
  mcNumber: string | null
}

export type UserShort = {
  id: string
  name: string
  email: string
  role: string
}

export type VehicleShort = {
  id: string
  unitId: string
  make: string
  model: string
  status: string
}

export type DriverShort = {
  id: string
  name: string
  phoneNumber: string | null
  status: string
}

// --- Response types ---

export type ReferenceNumberResponse = {
  id: string
  type: ReferenceNumberType
  value: string
}

export type RouteStopResponse = {
  id: string
  type: StopType
  facility: FacilityShort | null
  stopOrder: number
  arrivalSlotType: ArrivalSlotType | null
  arrivalStartDate: string | null
  arrivalEndDate: string | null
  actualArrivalDate: string | null
  actualDepartureDate: string | null
  status: StopStatus
  referenceNumbers: ReferenceNumberResponse[]
  accessories: AccessoryType[]
  requiredDocuments: RequiredDocumentType[]
}

export type LoadDetailsResponse = {
  id: string
  weight: string | null
  weightUnit: WeightUnit | null
  lengthFeet: string | null
  commodity: string | null
  capacity: Capacity | null
  temperature: string | null
  unitCount: number | null
  unitType: UnitType | null
}

export type RouteResponse = {
  id: string
  tenantId: number
  company: CompanyShort
  dispatcher: UserShort | null
  vehicle: VehicleShort | null
  driver: DriverShort | null
  coDriver: DriverShort | null
  broker: BrokerShort | null
  brokerRepresentative: string | null
  brokerIdentifier: string | null
  internalIdentifier: string | null
  brokerRate: number
  driverRate: number
  ratePerMile: number | null
  totalMiles: number | null
  totalStops: number
  estimatedDuration: string | null
  routeHighway: string | null
  tolls: number | null
  fuelCost: number | null
  routeType: RouteType | null
  status: RouteStatus
  autoDispatched: boolean
  dispatchedAt: string | null
  bookedAt: string | null
  completedAt: string | null
  stops: RouteStopResponse[]
  loadDetails: LoadDetailsResponse | null
  createdAt: string
  updatedAt: string
}

export type RouteShortResponse = {
  id: string
  companyName: string
  brokerIdentifier: string | null
  internalIdentifier: string | null
  brokerRate: number
  ratePerMile: number | null
  totalMiles: number | null
  totalStops: number
  originCity: string | null
  originDate: string | null
  destinationCity: string | null
  destinationDate: string | null
  unitNumber: string | null
  driverName: string | null
  dispatcherName: string | null
  status: RouteStatus
  bookedAt: string | null
  createdAt: string
}

// --- Request types ---

export type StopReferenceNumberRequest = {
  type: ReferenceNumberType
  value: string
}

export type StopRequest = {
  type: StopType
  facilityId?: number
  stopOrder: number
  arrivalSlotType?: ArrivalSlotType
  arrivalStartDate?: string
  arrivalEndDate?: string
  referenceNumbers?: StopReferenceNumberRequest[]
  accessories?: AccessoryType[]
  requiredDocuments?: RequiredDocumentType[]
}

export type StopUpdateRequest = {
  type?: StopType
  facilityId?: number
  stopOrder?: number
  arrivalSlotType?: ArrivalSlotType
  arrivalStartDate?: string
  arrivalEndDate?: string
  actualArrivalDate?: string
  actualDepartureDate?: string
  status?: StopStatus
  referenceNumbers?: StopReferenceNumberRequest[]
  accessories?: AccessoryType[]
  requiredDocuments?: RequiredDocumentType[]
}

export type LoadDetailsRequest = {
  weight?: string
  weightUnit?: WeightUnit
  lengthFeet?: string
  commodity?: string
  capacity?: Capacity
  temperature?: string
  unitCount?: number
  unitType?: UnitType
}

export type RouteCreateRequest = {
  companyId: number
  dispatcherId?: number
  vehicleId?: number
  driverId?: number
  coDriverId?: number
  autoDispatch?: boolean
  brokerId?: number
  brokerRepresentative?: string
  brokerIdentifier?: string
  internalIdentifier?: string
  brokerRate?: number
  driverRate?: number
  stops: StopRequest[]
  totalMiles?: number
  estimatedDuration?: string
  routeHighway?: string
  tolls?: number
  fuelCost?: number
  routeType?: RouteType
  loadDetails?: LoadDetailsRequest
}

export type RouteUpdateRequest = {
  companyId?: number
  dispatcherId?: number
  vehicleId?: number
  driverId?: number
  coDriverId?: number
  brokerId?: number
  brokerRepresentative?: string
  brokerIdentifier?: string
  internalIdentifier?: string
  brokerRate?: number
  driverRate?: number
  stops?: StopRequest[]
  totalMiles?: number
  estimatedDuration?: string
  routeHighway?: string
  tolls?: number
  fuelCost?: number
  routeType?: RouteType
  loadDetails?: LoadDetailsRequest
}

export type RouteStatusUpdateRequest = {
  status: RouteStatus
}

// --- Filter types ---

export type RouteFilters = {
  identifier?: string
  vehicleId?: string
  dispatcherId?: string
  status?: RouteStatus | 'all'
  bookedAtFrom?: string
  bookedAtTo?: string
  companyId?: string
  brokerId?: string
  driverId?: string
}

// --- Form types ---

export type ReferenceNumberFormValue = {
  type: ReferenceNumberType | ''
  value: string
}

export type StopFormValues = {
  type: StopType
  facilityId: string
  arrivalSlotType: ArrivalSlotType | ''
  arrivalStartDate: string
  arrivalEndDate: string
  referenceNumbers: ReferenceNumberFormValue[]
  accessories: AccessoryType[]
  requiredDocuments: RequiredDocumentType[]
}

export type LoadDetailsFormValues = {
  weight: string
  weightUnit: WeightUnit | ''
  lengthFeet: string
  commodity: string
  capacity: Capacity | ''
  temperature: string
  unitCount: string
  unitType: UnitType | ''
}

export type RouteFormValues = {
  // Carrier tab
  companyId: string
  dispatcherId: string
  vehicleId: string
  driverId: string
  coDriverId: string
  autoDispatch: boolean
  // Booking tab
  brokerId: string
  brokerRepresentative: string
  brokerIdentifier: string
  internalIdentifier: string
  brokerRate: string
  driverRate: string
  // Stops tab
  stops: StopFormValues[]
  // Route details tab
  totalMiles: string
  estimatedDuration: string
  routeHighway: string
  tolls: string
  fuelCost: string
  routeType: RouteType | ''
  // Load tab
  loadDetails: LoadDetailsFormValues
}
