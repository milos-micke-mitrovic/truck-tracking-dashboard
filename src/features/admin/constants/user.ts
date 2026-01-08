// User status values (matches backend enum)
export const USER_STATUS_VALUES = [
  'ACTIVE',
  'INACTIVE',
  'PENDING',
  'SUSPENDED',
] as const
export type UserStatusValue = (typeof USER_STATUS_VALUES)[number]

// Role options (matches backend enum)
export const ROLE_VALUES = [
  'USER',
  'ADMIN',
  'MANAGER',
  'DRIVER',
  'DISPATCHER',
  'ACCOUNTING',
] as const
export type RoleValue = (typeof ROLE_VALUES)[number]
