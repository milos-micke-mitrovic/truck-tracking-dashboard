import type { ReactNode } from 'react'
import { Download, RefreshCw, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui'

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
    <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-wrap items-end gap-3">{filters}</div>
      <div className="flex items-center gap-2">
        {addButton}
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('actions.export')}</span>
          </Button>
        )}
        <Button variant="outline" size="icon" className="size-9">
          <SlidersHorizontal className="size-4" />
        </Button>
        {onRefresh && (
          <Button
            variant="outline"
            size="icon"
            className="size-9"
            onClick={onRefresh}
          >
            <RefreshCw className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
