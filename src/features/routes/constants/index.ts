import type { RouteStatus, StopType, ArrivalSlotType, UnitType } from '../types'

export const ROUTE_STATUS_VALUES: RouteStatus[] = [
  'assigned',
  'in_transit',
  'completed',
]

export const ROUTE_STATUS_COLORS: Record<
  RouteStatus,
  { bg: string; text: string }
> = {
  assigned: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-900 dark:text-amber-300',
  },
  in_transit: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-900 dark:text-yellow-300',
  },
  completed: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-900 dark:text-green-300',
  },
}

export const STOP_TYPE_VALUES: StopType[] = ['pickup', 'delivery']

export const ARRIVAL_SLOT_TYPE_VALUES: ArrivalSlotType[] = [
  'window',
  'appointment',
  'fcfs',
]

export const UNIT_TYPE_VALUES: UnitType[] = ['pallets', 'cases', 'pieces']

export const LENGTH_OPTIONS = [
  { value: '48', label: '48 ft' },
  { value: '53', label: '53 ft' },
]

export const CAPACITY_OPTIONS = [
  { value: 'full', label: 'Full' },
  { value: 'partial', label: 'Partial' },
]

export const ACCESSORY_OPTIONS = [
  { value: 'liftgate', label: 'Liftgate' },
  { value: 'pallet_jack', label: 'Pallet Jack' },
  { value: 'straps', label: 'Straps' },
  { value: 'blankets', label: 'Blankets' },
  { value: 'tarps', label: 'Tarps' },
]

export const DOCUMENT_TYPE_OPTIONS = [
  { value: 'bol', label: 'BOL' },
  { value: 'pod', label: 'POD' },
  { value: 'lumper', label: 'Lumper Receipt' },
  { value: 'scale', label: 'Scale Ticket' },
]
