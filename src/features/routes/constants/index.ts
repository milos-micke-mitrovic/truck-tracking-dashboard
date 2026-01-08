import type { RouteStatus } from '../types'

export const ROUTE_STATUS_VALUES: RouteStatus[] = [
  'ACTIVE',
  'INACTIVE',
  'PENDING',
  'SUSPENDED',
]

export const ROUTE_STATUS_COLORS: Record<
  RouteStatus,
  { bg: string; text: string }
> = {
  ACTIVE: {
    bg: 'bg-green-100',
    text: 'text-green-900',
  },
  INACTIVE: {
    bg: 'bg-gray-100',
    text: 'text-gray-900',
  },
  PENDING: {
    bg: 'bg-amber-100',
    text: 'text-amber-900',
  },
  SUSPENDED: {
    bg: 'bg-red-100',
    text: 'text-red-900',
  },
}
