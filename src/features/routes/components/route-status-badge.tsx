import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils'
import { Caption } from '@/shared/ui'
import type { RouteStatus } from '../types'
import { ROUTE_STATUS_COLORS } from '../constants'

type RouteStatusBadgeProps = {
  status: RouteStatus | null | undefined
  date?: string | null
  className?: string
}

export function RouteStatusBadge({
  status,
  date,
  className,
}: RouteStatusBadgeProps) {
  const { t } = useTranslation('routes')
  const actualStatus = status || 'INACTIVE'
  const colors = ROUTE_STATUS_COLORS[actualStatus]

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : null

  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span
        className={cn(
          'inline-flex w-fit items-center rounded-md px-2 py-0.5 text-xs font-medium',
          colors.bg,
          colors.text
        )}
      >
        {t(`status.${actualStatus.toLowerCase()}`)}
      </span>
      {formattedDate && <Caption>{formattedDate}</Caption>}
    </div>
  )
}
