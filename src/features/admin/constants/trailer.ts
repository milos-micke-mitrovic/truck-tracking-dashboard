// Trailer type options
export const TRAILER_TYPE_OPTIONS = [
  { value: 'Dry Van', label: 'Dry Van' },
  { value: 'Flatbed', label: 'Flatbed' },
  { value: 'Refrigerated', label: 'Refrigerated' },
  { value: 'Tanker', label: 'Tanker' },
  { value: 'Lowboy', label: 'Lowboy' },
] as const

export const TRAILER_TYPE_VALUES = [
  'Dry Van',
  'Flatbed',
  'Refrigerated',
  'Tanker',
  'Lowboy',
] as const
export type TrailerTypeValue = (typeof TRAILER_TYPE_VALUES)[number]

// Ownership options (labels come from translations)
export const OWNERSHIP_VALUES = ['company', 'contractor'] as const
export type OwnershipValue = (typeof OWNERSHIP_VALUES)[number]
