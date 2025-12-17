// Compensation type options (labels come from translations)
export const COMPENSATION_TYPE_VALUES = [
  'per_mile',
  'per_hour',
  'percentage',
  'flat_rate',
] as const
export type CompensationTypeValue = (typeof COMPENSATION_TYPE_VALUES)[number]

// Scheduled items options (labels come from translations)
export const SCHEDULED_ITEMS_VALUES = ['weekly', 'biweekly', 'monthly'] as const
export type ScheduledItemsValue = (typeof SCHEDULED_ITEMS_VALUES)[number]
