// Trailer status (backend format)
export const TRAILER_STATUS_VALUES = [
  'ACTIVE',
  'INACTIVE',
  'PENDING',
  'SUSPENDED',
] as const

// Trailer type (backend format)
export const TRAILER_TYPE_VALUES = [
  'DRY_VAN',
  'REFRIGERATED',
  'FLATBED',
  'TANKER',
  'CONTAINER',
] as const
export type TrailerTypeValue = (typeof TRAILER_TYPE_VALUES)[number]

// Ownership (backend format)
export const TRAILER_OWNERSHIP_VALUES = [
  'COMPANY_OWNED',
  'LEASED',
  'OWNER_OPERATOR',
] as const
export type OwnershipValue = (typeof TRAILER_OWNERSHIP_VALUES)[number]
