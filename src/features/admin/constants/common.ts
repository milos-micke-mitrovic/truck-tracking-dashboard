// Cycle rule options (used by both company and driver)
export const CYCLE_RULE_OPTIONS = [
  { value: 'usa_70_8', label: 'USA 70 hour / 8 days' },
  { value: 'usa_60_7', label: 'USA 60 hour / 7 days' },
  { value: 'canada_70_7', label: 'Canada 70 hour / 7 days' },
  { value: 'canada_120_14', label: 'Canada 120 hour / 14 days' },
] as const

export const DEFAULT_CYCLE_RULE = 'usa_70_8'

// Constant exceptions values (labels come from translations)
export const CONSTANT_EXCEPTIONS_VALUES = [
  'none',
  'short_haul',
  'adverse_conditions',
] as const
export type ConstantExceptionValue = (typeof CONSTANT_EXCEPTIONS_VALUES)[number]

export const DEFAULT_CONSTANT_EXCEPTIONS = 'none'
