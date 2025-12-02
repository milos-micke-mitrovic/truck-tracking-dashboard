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
import { H4 } from '@/shared/ui/typography'
import type { DriverFormValues } from '../../../types'

export function AccountingTab() {
  const { t } = useTranslation('admin')
  const { control } = useFormContext<DriverFormValues>()

  const compensationTypeOptions = [
    { value: '', label: t('driverDialog.selectType') },
    { value: 'per_mile', label: t('driverDialog.compensationType.perMile') },
    { value: 'per_hour', label: t('driverDialog.compensationType.perHour') },
    { value: 'percentage', label: t('driverDialog.compensationType.percentage') },
    { value: 'flat_rate', label: t('driverDialog.compensationType.flatRate') },
  ]

  const scheduledItemsOptions = [
    { value: '', label: t('driverDialog.selectScheduledItems') },
    { value: 'weekly', label: t('driverDialog.scheduledItems.weekly') },
    { value: 'biweekly', label: t('driverDialog.scheduledItems.biweekly') },
    { value: 'monthly', label: t('driverDialog.scheduledItems.monthly') },
  ]

  return (
    <TabsContent value="accounting" className="mt-0 space-y-3">
      {/* Compensation */}
      <div className="space-y-3 p-3 border rounded-lg">
        <H4 className="text-primary">{t('driverDialog.compensation')}</H4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      </div>

      {/* Escrow */}
      <div className="space-y-3 p-3 border rounded-lg">
        <H4 className="text-primary">{t('driverDialog.escrow')}</H4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      </div>

      {/* Settlement */}
      <div className="space-y-3 p-3 border rounded-lg">
        <H4 className="text-primary">{t('driverDialog.settlement')}</H4>
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
    </TabsContent>
  )
}
