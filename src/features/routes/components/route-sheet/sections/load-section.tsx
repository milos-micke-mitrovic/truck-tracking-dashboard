import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form'
import { Input, Select } from '@/shared/ui/primitives'
import { FormSection } from '@/shared/components'
import {
  LENGTH_OPTIONS,
  CAPACITY_OPTIONS,
  UNIT_TYPE_VALUES,
} from '../../../constants'
import type { RouteFormValues } from '../../../types'

export function LoadSection() {
  const { t } = useTranslation('routes')
  const form = useFormContext<RouteFormValues>()

  const unitTypeOptions = UNIT_TYPE_VALUES.map((value) => ({
    value,
    label: t(`sheet.load.unitTypes.${value}`),
  }))

  return (
    <FormSection title={t('sheet.tabs.load')}>
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.load.weight')}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="lbs" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="commodity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.load.commodity')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.load.temperature')}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="°F" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.load.length')}</FormLabel>
                <Select
                  options={LENGTH_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('sheet.load.selectLength')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.load.capacity')}</FormLabel>
                <Select
                  options={CAPACITY_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('sheet.load.selectCapacity')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.load.unitType')}</FormLabel>
                <Select
                  options={unitTypeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('sheet.load.selectUnit')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="units"
          render={({ field }) => (
            <FormItem className="md:w-1/3">
              <FormLabel>{t('sheet.load.units')}</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormSection>
  )
}
