import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/ui'
import { cn } from '@/shared/utils'

type StatusBadgeProps = {
  status: 'active' | 'inactive' | 'online' | 'offline' | 'enabled' | 'disabled'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation('admin')

  const variants: Record<string, string> = {
    active: 'bg-success/10 text-success border-success/20',
    inactive: 'bg-muted text-muted-foreground border-border',
    online: 'bg-success/10 text-success border-success/20',
    offline: 'bg-muted text-muted-foreground border-border',
    enabled: 'bg-success/10 text-success border-success/20',
    disabled: 'bg-muted text-muted-foreground border-border',
  }

  return (
    <Badge variant="outline" className={cn('font-normal', variants[status])}>
      {t(`status.${status}`)}
    </Badge>
  )
}
