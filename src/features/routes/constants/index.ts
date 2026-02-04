import type {
  RouteStatus,
  RouteType,
  StopType,
  ArrivalSlotType,
  Capacity,
  WeightUnit,
  UnitType,
  AccessoryType,
  RequiredDocumentType,
  ReferenceNumberType,
} from '../types'

// --- Route Status ---

export const ROUTE_STATUS_VALUES: RouteStatus[] = [
  'BOOKED',
  'DISPATCHED',
  'IN_TRANSIT',
  'AT_PICKUP',
  'LOADED',
  'AT_DELIVERY',
  'DELIVERED',
  'COMPLETED',
  'INVOICED',
  'PAID',
  'CANCELLED',
]

export const ROUTE_STATUS_COLORS: Record<RouteStatus, string> = {
  BOOKED: 'info',
  DISPATCHED: 'info',
  IN_TRANSIT: 'warning',
  AT_PICKUP: 'warning',
  LOADED: 'warning',
  AT_DELIVERY: 'warning',
  DELIVERED: 'success',
  COMPLETED: 'success',
  INVOICED: 'muted',
  PAID: 'success',
  CANCELLED: 'destructive',
}

// --- Route Type ---

export const ROUTE_TYPE_VALUES: RouteType[] = [
  'SHORTEST_FASTEST',
  'CHEAPEST',
  'ALTERNATE',
]

// --- Stop Type ---

export const STOP_TYPE_VALUES: StopType[] = ['PICKUP', 'DELIVERY']

// --- Arrival Slot Type ---

export const ARRIVAL_SLOT_TYPE_VALUES: ArrivalSlotType[] = [
  'WINDOW',
  'FCFS',
  'BY_APPOINTMENT',
  'EXACT_TIME',
]

// --- Capacity ---

export const CAPACITY_VALUES: Capacity[] = ['FULL', 'PARTIAL']

// --- Weight Unit ---

export const WEIGHT_UNIT_VALUES: WeightUnit[] = ['LBS', 'KG']

// --- Unit Type ---

export const UNIT_TYPE_VALUES: UnitType[] = [
  'PALLETS',
  'BAGS',
  'BALES',
  'BINS',
  'BOXES',
  'BUNCHES',
  'BUNDLES',
]

// --- Accessory Type ---

export const ACCESSORY_TYPE_VALUES: AccessoryType[] = [
  'SAFETY_VEST',
  'HARD_HAT',
  'SAFETY_GLASSES',
  'STEEL_TOED_BOOTS',
  'WORK_GLOVES',
  'FACE_MASK_RESPIRATOR',
  'FLAME_RESISTANT_CLOTHING',
  'HAIR_NET_BEARD_NET',
  'LOAD_LOCKS_LOAD_BARS',
  'TIE_DOWN_STRAPS',
  'PALLET_JACK',
  'HAND_TRUCK_DOLLY',
  'LIFTGATE',
  'TARPS',
  'HOSES_AND_FITTINGS',
  'BULKHEADS',
  'TRAILER_SEAL',
  'OVERSIZE_LOAD_BANNER_FLAGS',
]

// --- Required Document Type ---

export const REQUIRED_DOCUMENT_TYPE_VALUES: RequiredDocumentType[] = [
  'BOL_PHOTO',
  'POD_PHOTO',
  'TIRES_PHOTO',
  'TRAILER_PHOTO',
  'SECURED_FREIGHT_PHOTO',
  'SEAL_PHOTO',
  'EMPTY_SCALE_PHOTO',
  'LOADED_SCALE_PHOTO',
  'ESCORT_PHOTO',
  'LUMPER_RECEIPT_PHOTO',
]

// --- Reference Number Type ---

export const REFERENCE_NUMBER_TYPE_VALUES: ReferenceNumberType[] = [
  'APPT_CONF',
  'BOL',
  'CUSTOMER',
  'DEL_CONSIGNEE',
  'DELIVERY',
  'GATE_CHECK_IN',
  'ITEM',
]
