import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils'
import { Badge, Caption } from '@/shared/ui'
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
  const actualStatus = status || 'BOOKED'
  const color = ROUTE_STATUS_COLORS[actualStatus] || 'muted'

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
      <Badge color={color as 'success' | 'warning' | 'destructive' | 'info' | 'muted'}>
        {t(`status.${actualStatus}`)}
      </Badge>
      {formattedDate && <Caption>{formattedDate}</Caption>}
    </div>
  )
}
