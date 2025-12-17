import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormControl } from '@/shared/ui/form'
import { FormLabel } from '@/shared/ui/form'
import { Input } from '@/shared/ui/primitives'
import { FormSection } from '@/shared/components'
import { RouteMap } from '../route-map'
import type { RouteFormValues, RouteStop } from '../../../types'

type RouteSectionProps = {
  stops: RouteStop[]
}

export function RouteSection({ stops }: RouteSectionProps) {
  const { t } = useTranslation('routes')
  const form = useFormContext<RouteFormValues>()

  return (
    <FormSection title={t('sheet.tabs.route')}>
      <div className="space-y-3">
        <RouteMap stops={stops} />

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <FormLabel className="text-muted-foreground text-xs">
              {t('sheet.route.emptyMiles')}
            </FormLabel>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="emptyMilesCalculated"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        value={`${field.value}mi`}
                        disabled
                        className="bg-muted text-center"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emptyMilesManual"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Manual" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <FormLabel className="text-muted-foreground text-xs">
              {t('sheet.route.loadedMiles')}
            </FormLabel>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="loadedMilesCalculated"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        value={`${field.value}mi`}
                        disabled
                        className="bg-muted text-center"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="loadedMilesManual"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Manual" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  )
}
