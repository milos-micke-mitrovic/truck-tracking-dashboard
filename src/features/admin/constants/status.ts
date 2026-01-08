// Status options (values only - labels come from translations)
export const STATUS_VALUES = ['active', 'inactive'] as const
export type StatusValue = (typeof STATUS_VALUES)[number]

// Company status (backend format)
export const COMPANY_STATUS_VALUES = [
  'ACTIVE',
  'INACTIVE',
  'PENDING',
  'SUSPENDED',
] as const

// Driver status (backend format)
export const DRIVER_STATUS_VALUES = [
  'ACTIVE',
  'INACTIVE',
  'PENDING',
  'SUSPENDED',
] as const

// Enabled/Disabled options
export const ENABLED_DISABLED_VALUES = ['enabled', 'disabled'] as const
export type EnabledDisabledValue = (typeof ENABLED_DISABLED_VALUES)[number]

// Online status options
export const ONLINE_STATUS_VALUES = ['online', 'offline'] as const
export type OnlineStatusValue = (typeof ONLINE_STATUS_VALUES)[number]
