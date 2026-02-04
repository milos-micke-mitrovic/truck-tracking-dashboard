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
import type { RouteFormValues, Capacity, WeightUnit, UnitType } from '../../types'
import {
  CAPACITY_VALUES,
  WEIGHT_UNIT_VALUES,
  UNIT_TYPE_VALUES,
} from '../../constants'

type LoadTabProps = {
  form: UseFormReturn<RouteFormValues>
}

export function LoadTab({ form }: LoadTabProps) {
  const { t } = useTranslation('routes')

  const capacityOptions = CAPACITY_VALUES.map((v) => ({
    value: v,
    label: t(`enums.capacity.${v}`),
  }))

  const weightUnitOptions = WEIGHT_UNIT_VALUES.map((v) => ({
    value: v,
    label: t(`enums.weightUnits.${v}`),
  }))

  const unitTypeOptions = UNIT_TYPE_VALUES.map((v) => ({
    value: v,
    label: t(`enums.unitTypes.${v}`),
  }))

  return (
    <div className="space-y-3">
      <FormSection title={t('sheet.tabs.load')}>
        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={form.control}
            name="loadDetails.weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.load.weight')}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. 1,500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loadDetails.weightUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.load.weightUnit')}</FormLabel>
                <Select
                  options={weightUnitOptions}
                  value={field.value}
                  onChange={(v) => field.onChange(v as WeightUnit)}
                  placeholder={t('sheet.load.selectWeightUnit')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loadDetails.lengthFeet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.load.lengthFeet')}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. 53ft" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loadDetails.commodity"
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
            name="loadDetails.capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.load.capacity')}</FormLabel>
                <Select
                  options={capacityOptions}
                  value={field.value}
                  onChange={(v) => field.onChange(v as Capacity)}
                  placeholder={t('sheet.load.selectCapacity')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loadDetails.temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.load.temperature')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loadDetails.unitCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.load.unitCount')}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loadDetails.unitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.load.unitType')}</FormLabel>
                <Select
                  options={unitTypeOptions}
                  value={field.value}
                  onChange={(v) => field.onChange(v as UnitType)}
                  placeholder={t('sheet.load.selectUnitType')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>
    </div>
  )
}
