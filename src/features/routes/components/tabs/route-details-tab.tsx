import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Input,
  Select,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui'
import { FormSection } from '@/shared/components'
import type { RouteFormValues, RouteType } from '../../types'
import { ROUTE_TYPE_VALUES } from '../../constants'

type RouteDetailsTabProps = {
  form: UseFormReturn<RouteFormValues>
}

export function RouteDetailsTab({ form }: RouteDetailsTabProps) {
  const { t } = useTranslation('routes')

  const routeTypeOptions = ROUTE_TYPE_VALUES.map((v) => ({
    value: v,
    label: t(`enums.routeTypes.${v}`),
  }))

  return (
    <div className="space-y-3">
      <FormSection title={t('sheet.tabs.routeDetails')}>
        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={form.control}
            name="totalMiles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.routeDetails.totalMiles')}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estimatedDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('sheet.routeDetails.estimatedDuration')}
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. 6h 51m" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="routeHighway"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.routeDetails.routeHighway')}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. I-80" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="routeType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.routeDetails.routeType')}</FormLabel>
                <Select
                  options={routeTypeOptions}
                  value={field.value}
                  onChange={(v) => field.onChange(v as RouteType)}
                  placeholder={t('sheet.routeDetails.selectRouteType')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tolls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.routeDetails.tolls')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fuelCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.routeDetails.fuelCost')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>
    </div>
  )
}
