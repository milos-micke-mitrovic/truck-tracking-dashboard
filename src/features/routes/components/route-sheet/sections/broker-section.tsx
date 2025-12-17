import { useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, Upload } from 'lucide-react'
import { IconButton } from '@/shared/ui'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form'
import { Input, Select } from '@/shared/ui/primitives'
import { FormSection } from '@/shared/components'
import type { RouteFormValues } from '../../../types'
import {
  mockBrokerCompanies as MOCK_BROKER_COMPANIES,
  mockRepresentatives as MOCK_REPRESENTATIVES,
} from '@/mocks/data'

export function BrokerSection() {
  const { t } = useTranslation('routes')
  const form = useFormContext<RouteFormValues>()

  const rateConfirmationRef = useRef<HTMLInputElement>(null)
  const driverRateConfirmationRef = useRef<HTMLInputElement>(null)

  const rateConfirmation = form.watch('rateConfirmation')
  const driverRateConfirmation = form.watch('driverRateConfirmation')

  return (
    <FormSection title={t('sheet.tabs.broker')}>
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="brokerCompanyId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t('sheet.broker.company')}</FormLabel>
                  <Select
                    options={MOCK_BROKER_COMPANIES}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('sheet.broker.selectCompany')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <IconButton
              icon={<Plus className="h-4 w-4" />}
              variant="secondary"
              className="mt-6"
              aria-label={t('sheet.broker.addCompany')}
            />
          </div>
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="brokerRepresentativeId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t('sheet.broker.representative')}</FormLabel>
                  <Select
                    options={MOCK_REPRESENTATIVES}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('sheet.broker.selectRep')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <IconButton
              icon={<Plus className="h-4 w-4" />}
              variant="secondary"
              className="mt-6"
              aria-label={t('sheet.broker.addRepresentative')}
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={form.control}
            name="brokerIdentifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.broker.brokerIdentifier')}</FormLabel>
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
                <FormLabel>{t('sheet.broker.internalIdentifier')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={form.control}
            name="brokerRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.broker.brokerRate')}</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="$0.00" />
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
                <FormLabel>{t('sheet.broker.driverRate')}</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="$0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={form.control}
            name="rateConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.broker.rateConfirmation')}</FormLabel>
                <input
                  ref={rateConfirmationRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                />
                <button
                  type="button"
                  onClick={() => rateConfirmationRef.current?.click()}
                  className="border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">
                    {rateConfirmation?.name || t('sheet.broker.uploadFile')}
                  </span>
                </button>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="driverRateConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('sheet.broker.driverRateConfirmation')}
                </FormLabel>
                <input
                  ref={driverRateConfirmationRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                />
                <button
                  type="button"
                  onClick={() => driverRateConfirmationRef.current?.click()}
                  className="border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">
                    {driverRateConfirmation?.name ||
                      t('sheet.broker.uploadFile')}
                  </span>
                </button>
              </FormItem>
            )}
          />
        </div>
      </div>
    </FormSection>
  )
}
