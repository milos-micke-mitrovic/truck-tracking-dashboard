// Department options (labels come from translations)
export const DEPARTMENT_VALUES = [
  'dispatch',
  'accounting',
  'fleet_management',
  'operations',
  'safety',
] as const
export type DepartmentValue = (typeof DEPARTMENT_VALUES)[number]

// Role options (labels come from translations)
export const ROLE_VALUES = [
  'company_admin',
  'support_personnel',
  'dispatcher',
] as const
export type RoleValue = (typeof ROLE_VALUES)[number]
