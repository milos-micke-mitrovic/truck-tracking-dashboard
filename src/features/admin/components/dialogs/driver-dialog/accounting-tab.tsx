import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input, Select, TabsContent } from '@/shared/ui'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form'
import { FormSection } from '@/shared/components'
import type { DriverFormValues } from '../../../types'
import { COMPENSATION_TYPE_VALUES, SCHEDULED_ITEMS_VALUES } from '../../../constants'

export function AccountingTab() {
  const { t } = useTranslation('admin')
  const { control } = useFormContext<DriverFormValues>()

  const compensationTypeOptions = [
    { value: '', label: t('driverDialog.selectType') },
    ...COMPENSATION_TYPE_VALUES.map((value) => ({
      value,
      label: t(`driverDialog.compensationType.${value === 'per_mile' ? 'perMile' : value === 'per_hour' ? 'perHour' : value === 'flat_rate' ? 'flatRate' : value}`),
    })),
  ]

  const scheduledItemsOptions = [
    { value: '', label: t('driverDialog.selectScheduledItems') },
    ...SCHEDULED_ITEMS_VALUES.map((value) => ({
      value,
      label: t(`driverDialog.scheduledItems.${value}`),
    })),
  ]

  return (
    <TabsContent value="accounting" className="mt-0 space-y-3">
      {/* Compensation */}
      <FormSection title={t('driverDialog.compensation')}>
        <div className="grid md:grid-cols-2 gap-3">
          <FormField
            control={control}
            name="compensationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.type')}</FormLabel>
                <Select
                  options={compensationTypeOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="compensationRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.rate')}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      {/* Escrow */}
      <FormSection title={t('driverDialog.escrow')}>
        <div className="grid md:grid-cols-2 gap-3">
          <FormField
            control={control}
            name="escrowDeposited"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.deposited')}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="escrowMinimum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.minimum')}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      {/* Settlement */}
      <FormSection title={t('driverDialog.settlement')}>
        <div className="grid md:grid-cols-3 gap-3">
          <FormField
            control={control}
            name="debt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.debt')}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="settlementMinimalAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.settlementMinimalAmount')}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="scheduledItems"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.scheduledItems.label')}</FormLabel>
                <Select
                  options={scheduledItemsOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>
    </TabsContent>
  )
}
