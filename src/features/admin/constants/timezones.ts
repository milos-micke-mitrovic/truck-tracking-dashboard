// US timezone options
export const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'America/Anchorage', label: 'Alaska Time' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time' },
] as const

export const TIMEZONE_VALUES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
] as const
export type TimezoneValue = (typeof TIMEZONE_VALUES)[number]

export const DEFAULT_TIMEZONE: TimezoneValue = 'America/Chicago'
export const DEFAULT_STARTING_TIME = '00:00:00'
