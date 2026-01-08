// Vehicle status values (matches backend enum)
export const VEHICLE_STATUS_VALUES = [
  'ACTIVE',
  'INACTIVE',
  'PENDING',
  'SUSPENDED',
] as const
export type VehicleStatusValue = (typeof VEHICLE_STATUS_VALUES)[number]

// Vehicle ownership values (matches backend enum)
export const VEHICLE_OWNERSHIP_VALUES = [
  'COMPANY_OWNED',
  'LEASED',
  'OWNER_OPERATOR',
] as const
export type VehicleOwnershipValue = (typeof VEHICLE_OWNERSHIP_VALUES)[number]

// Fuel type values
export const FUEL_TYPE_VALUES = [
  'DIESEL',
  'GASOLINE',
  'ELECTRIC',
  'HYBRID',
  'CNG',
  'LNG',
] as const
export type FuelTypeValue = (typeof FUEL_TYPE_VALUES)[number]

// Vehicle make options
export const VEHICLE_MAKE_OPTIONS = [
  { value: 'VOLVO TRUCK', label: 'Volvo Truck' },
  { value: 'FREIGHTLINER', label: 'Freightliner' },
  { value: 'INTERNATIONAL', label: 'International' },
  { value: 'KENWORTH', label: 'Kenworth' },
  { value: 'PETERBILT', label: 'Peterbilt' },
  { value: 'MACK', label: 'Mack' },
  { value: 'WESTERN STAR', label: 'Western Star' },
  { value: 'HINO', label: 'Hino' },
  { value: 'ISUZU', label: 'Isuzu' },
] as const

export const VEHICLE_MAKE_VALUES = [
  'VOLVO TRUCK',
  'FREIGHTLINER',
  'INTERNATIONAL',
  'KENWORTH',
  'PETERBILT',
  'MACK',
  'WESTERN STAR',
  'HINO',
  'ISUZU',
] as const
export type VehicleMakeValue = (typeof VEHICLE_MAKE_VALUES)[number]
