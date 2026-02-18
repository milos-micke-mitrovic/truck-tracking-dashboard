import { useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Select,
  Switch,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui'
import { FormSection } from '@/shared/components'
import { useCompanies, useDrivers, useVehicles, useUsers } from '@/features/admin/api'
import { useAuth } from '@/features/auth'
import type { RouteFormValues } from '../../types'

type CarrierTabProps = {
  form: UseFormReturn<RouteFormValues>
}

export function CarrierTab({ form }: CarrierTabProps) {
  const { t } = useTranslation('routes')
  const { user } = useAuth()

  const { data: companiesData } = useCompanies({ size: 100, tenantId: user?.tenantId })
  const { data: usersData } = useUsers({ size: 100, role: 'DISPATCHER', tenantId: user?.tenantId })
  const { data: vehiclesData } = useVehicles({ size: 100, tenantId: user?.tenantId })
  const { data: driversData } = useDrivers({ size: 100, tenantId: user?.tenantId })

  const companyOptions = useMemo(
    () =>
      (companiesData?.content || []).map((c) => ({
        value: String(c.id),
        label: c.fullName,
      })),
    [companiesData]
  )

  const dispatcherOptions = useMemo(
    () =>
      (usersData?.content || []).map((u) => ({
        value: String(u.id),
        label: u.name,
      })),
    [usersData]
  )

  const vehicleOptions = useMemo(
    () =>
      (vehiclesData?.content || []).map((v) => ({
        value: String(v.id),
        label: `${v.unitId} - ${v.make} ${v.model}`,
      })),
    [vehiclesData]
  )

  const driverOptions = useMemo(
    () =>
      (driversData?.content || []).map((d) => ({
        value: String(d.id),
        label: d.name,
      })),
    [driversData]
  )

  return (
    <div className="space-y-3">
      <FormSection title={t('sheet.tabs.carrier')}>
        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={form.control}
            name="companyId"
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('sheet.carrier.company')}</FormLabel>
                <Select
                  searchable
                  options={companyOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('sheet.carrier.selectCompany')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dispatcherId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.carrier.dispatcher')}</FormLabel>
                <Select
                  searchable
                  options={dispatcherOptions}
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
                  searchable
                  options={vehicleOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('sheet.carrier.selectVehicle')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="driverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sheet.carrier.driver')}</FormLabel>
                <Select
                  searchable
                  options={driverOptions}
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
                  searchable
                  options={driverOptions}
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
          name="autoDispatch"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label={t('sheet.carrier.autoDispatch')}
                  description={t('sheet.carrier.autoDispatchDescription')}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </FormSection>
    </div>
  )
}
