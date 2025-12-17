import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form'
import { Select, Checkbox } from '@/shared/ui/primitives'
import { FormSection } from '@/shared/components'
import type { RouteFormValues } from '../../../types'
import {
  mockCompanies as MOCK_COMPANIES,
  mockDispatchers as MOCK_DISPATCHERS,
  mockTags as MOCK_TAGS,
  mockVehicles as MOCK_VEHICLES,
  mockDrivers as MOCK_DRIVERS,
} from '@/mocks/data'

export function CarrierSection() {
  const { t } = useTranslation('routes')
  const form = useFormContext<RouteFormValues>()

  return (
    <FormSection title={t('sheet.tabs.carrier')}>
      <div className="space-y-3">
        <FormField
          control={form.control}
          name="companyId"
          rules={{ required: t('validation.required') }}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t('sheet.carrier.company')}</FormLabel>
              <Select
                options={MOCK_COMPANIES}
                value={field.value}
                onChange={field.onChange}
                placeholder={t('sheet.carrier.selectCompany')}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={form.control}
            name="dispatcherId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.carrier.dispatcher')}</FormLabel>
                <Select
                  options={MOCK_DISPATCHERS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('sheet.carrier.selectDispatcher')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.carrier.vehicle')}</FormLabel>
                <Select
                  options={MOCK_VEHICLES}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('sheet.carrier.selectVehicle')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={form.control}
            name="driverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.carrier.driver')}</FormLabel>
                <Select
                  options={MOCK_DRIVERS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('sheet.carrier.selectDriver')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coDriverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.carrier.coDriver')}</FormLabel>
                <Select
                  options={MOCK_DRIVERS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('sheet.carrier.selectCoDriver')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('sheet.carrier.tags')}</FormLabel>
              <Select
                options={MOCK_TAGS}
                value={field.value?.[0] || ''}
                onChange={(v) => field.onChange(v ? [v] : [])}
                placeholder={t('sheet.carrier.selectTags')}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="autoDispatch"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer font-normal">
                  {t('sheet.carrier.autoDispatch')}
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>
    </FormSection>
  )
}
