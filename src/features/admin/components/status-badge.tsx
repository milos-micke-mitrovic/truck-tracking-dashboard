import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/ui'

type Status =
  | 'active'
  | 'inactive'
  | 'online'
  | 'offline'
  | 'enabled'
  | 'disabled'

type StatusBadgeProps = {
  status: Status
}

const statusColors: Record<Status, 'success' | 'muted'> = {
  active: 'success',
  inactive: 'muted',
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
