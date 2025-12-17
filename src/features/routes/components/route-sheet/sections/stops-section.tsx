import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
import { Button, IconButton, BodySmall } from '@/shared/ui'
import { FormSection } from '@/shared/components'
import { cn } from '@/shared/utils'
import type { RouteStop } from '../../../types'

type StopsSectionProps = {
  stops: RouteStop[]
  onAddStop: () => void
  onEditStop: (index: number) => void
  onRemoveStop: (index: number) => void
}

export function StopsSection({
  stops,
  onAddStop,
  onEditStop,
  onRemoveStop,
}: StopsSectionProps) {
  const { t } = useTranslation('routes')

  const formatStopLocation = (stop: RouteStop) => {
    return stop.locationName || t('sheet.stops.missing')
  }

  const formatStopSlot = (stop: RouteStop) => {
    if (!stop.startDate) return t('sheet.stops.missing')
    return new Date(stop.startDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <FormSection title={t('sheet.tabs.stops')}>
      <div className="space-y-3">
        {stops.length > 0 && (
          <div className="divide-y rounded-lg border">
            {stops.map((stop, index) => {
              const location = formatStopLocation(stop)
              const slot = formatStopSlot(stop)
              const isMissing = location === t('sheet.stops.missing')

              return (
                <div
                  key={stop.id}
                  className="hover:bg-muted/30 flex cursor-pointer items-center justify-between px-4 py-3"
                  onClick={() => onEditStop(index)}
                >
                  <div className="flex items-center gap-4">
                    <BodySmall className="w-20 font-medium">
                      {t(`sheet.stops.types.${stop.type}`)}
                    </BodySmall>
                    <BodySmall className={cn(isMissing && 'text-destructive')}>
                      {location}
                    </BodySmall>
                  </div>
                  <div className="flex items-center gap-2">
                    <BodySmall
                      className={cn(
                        'text-muted-foreground',
                        isMissing && 'text-destructive'
                      )}
                    >
                      {slot}
                    </BodySmall>
                    <IconButton
                      icon={<Trash2 className="h-4 w-4" />}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveStop(index)
                      }}
                      aria-label={t('sheet.stops.remove')}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddStop}
          className="w-full"
        >
          <Plus className="mr-1 h-4 w-4" />
          {t('sheet.stops.add')}
        </Button>
      </div>
    </FormSection>
  )
}
