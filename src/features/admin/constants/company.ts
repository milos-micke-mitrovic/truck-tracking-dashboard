// Plan options (labels come from translations)
export const PLAN_VALUES = ['basic', 'premium', 'enterprise'] as const
export type PlanValue = (typeof PLAN_VALUES)[number]

export const DEFAULT_PLAN: PlanValue = 'basic'

// Fleet options
export const FLEET_OPTIONS = [
  { value: 'starter', label: 'Starter' },
  { value: 'established', label: 'Established' },
  { value: 'eminent', label: 'Eminent' },
] as const

export const FLEET_VALUES = ['starter', 'established', 'eminent'] as const
export type FleetValue = (typeof FLEET_VALUES)[number]

// Industry options (labels come from translations)
export const INDUSTRY_VALUES = [
  'transportation',
  'logistics',
  'manufacturing',
  'retail',
  'construction',
  'agriculture',
] as const
export type IndustryValue = (typeof INDUSTRY_VALUES)[number]

export const DEFAULT_INDUSTRY: IndustryValue = 'transportation'

// Cargo type options (labels come from translations)
export const CARGO_TYPE_VALUES = ['property', 'passengers', 'hazmat', 'household_goods'] as const
export type CargoTypeValue = (typeof CARGO_TYPE_VALUES)[number]

export const DEFAULT_CARGO_TYPE: CargoTypeValue = 'property'

// ELD configuration defaults
export const DEFAULT_VEHICLE_MOTION_SPEED_THRESHOLD = 5

// Accounting configuration
export const WEEK_DAY_VALUES = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export type WeekDayValue = (typeof WEEK_DAY_VALUES)[number]

export const DEFAULT_WEEK_PERIOD_START_DAY: WeekDayValue = 'mon'

export const SETTLEMENT_TEMPLATE_VALUES = ['standard', 'weekly', 'biweekly', 'monthly'] as const
export type SettlementTemplateValue = (typeof SETTLEMENT_TEMPLATE_VALUES)[number]

export const DEFAULT_SETTLEMENT_TEMPLATE: SettlementTemplateValue = 'standard'
