import { useMemo } from 'react'
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
import { useBrokers } from '@/features/brokers'
import type { RouteFormValues } from '../../types'

type BookingTabProps = {
  form: UseFormReturn<RouteFormValues>
}

export function BookingTab({ form }: BookingTabProps) {
  const { t } = useTranslation('routes')

  const { data: brokersData } = useBrokers()

  const brokerOptions = useMemo(
    () =>
      (brokersData || []).map((b) => ({
        value: String(b.id),
        label: b.legalName || b.dbaName || b.mcNumber,
      })),
    [brokersData]
  )

  return (
    <div className="space-y-3">
      <FormSection title={t('sheet.tabs.booking')}>
        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={form.control}
            name="brokerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.booking.broker')}</FormLabel>
                <Select
                  searchable
                  creatable
                  options={brokerOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('sheet.booking.selectBroker')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brokerMcNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.booking.brokerMcNumber')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('sheet.booking.brokerMcNumberPlaceholder')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brokerRepresentative"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.booking.brokerRepresentative')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brokerIdentifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.booking.brokerIdentifier')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="internalIdentifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.booking.internalIdentifier')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brokerRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.booking.brokerRate')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="driverRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.booking.driverRate')}</FormLabel>
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
