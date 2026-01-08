import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/ui'

type Status =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'suspended'
  | 'online'
  | 'offline'
  | 'enabled'
  | 'disabled'

type StatusBadgeProps = {
  status: Status
}

const statusColors: Record<Status, 'success' | 'muted' | 'warning' | 'info'> = {
  active: 'success',
  inactive: 'muted',
  pending: 'info',
  suspended: 'warning',
  online: 'success',
  offline: 'muted',
  enabled: 'success',
  disabled: 'muted',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation('admin')

  return (
    <Badge
      variant="outline"
      color={statusColors[status]}
      className="font-normal"
    >
      {t(`status.${status}`)}
    </Badge>
  )
}
