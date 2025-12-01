import type { ReactNode } from 'react'
import { Download, RefreshCw, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button, IconButton } from '@/shared/ui'

type AdminToolbarProps = {
  filters?: ReactNode
  addButton?: ReactNode
  onExport?: () => void
  onRefresh?: () => void
}

export function AdminToolbar({
  filters,
  addButton,
  onExport,
  onRefresh,
}: AdminToolbarProps) {
  const { t } = useTranslation('admin')

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">{filters}</div>
      <div className="flex items-center gap-2">
        {addButton}
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            prefixIcon={<Download className="size-4" />}
            onClick={onExport}
          >
            <span className="hidden sm:inline">{t('actions.export')}</span>
          </Button>
        )}
        <IconButton
          variant="outline"
          icon={<SlidersHorizontal className="size-4" />}
          aria-label={t('actions.filters')}
        />
        {onRefresh && (
          <IconButton
            variant="outline"
            icon={<RefreshCw className="size-4" />}
            onClick={onRefresh}
            aria-label={t('actions.refresh')}
          />
        )}
      </div>
    </div>
  )
}
