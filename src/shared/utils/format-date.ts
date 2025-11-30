import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'

export function formatDate(date: Date | string, formatStr = 'PP'): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date

  if (!isValid(parsedDate)) {
    return 'Invalid date'
  }

  return format(parsedDate, formatStr)
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'PPp')
}

export function formatRelative(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date

  if (!isValid(parsedDate)) {
    return 'Invalid date'
  }

  return formatDistanceToNow(parsedDate, { addSuffix: true })
}
