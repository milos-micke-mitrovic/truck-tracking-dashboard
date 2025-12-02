// Vehicle make options
export const VEHICLE_MAKE_OPTIONS = [
  { value: 'VOLVO TRUCK', label: 'Volvo Truck' },
  { value: 'FREIGHTLINER', label: 'Freightliner' },
  { value: 'INTERNATIONAL', label: 'International' },
  { value: 'KENWORTH', label: 'Kenworth' },
  { value: 'PETERBILT', label: 'Peterbilt' },
  { value: 'MACK', label: 'Mack' },
] as const

export const VEHICLE_MAKE_VALUES = [
  'VOLVO TRUCK',
  'FREIGHTLINER',
  'INTERNATIONAL',
  'KENWORTH',
  'PETERBILT',
  'MACK',
] as const
export type VehicleMakeValue = (typeof VEHICLE_MAKE_VALUES)[number]
