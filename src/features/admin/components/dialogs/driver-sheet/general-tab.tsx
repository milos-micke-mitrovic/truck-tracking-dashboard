import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input, Select, Textarea, TabsContent } from '@/shared/ui'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form'
import { FormSection } from '@/shared/components'
import type { DriverFormValues } from '../../../types'
import {
  STATUS_VALUES,
  COUNTRY_VALUES,
  getStateOptionsByCountry,
} from '../../../constants'

export function GeneralTab() {
  const { t } = useTranslation('admin')
  const { control, watch } = useFormContext<DriverFormValues>()

  const licenseCountry = watch('licenseCountry')

  const statusOptions = STATUS_VALUES.map((value) => ({
    value,
    label: t(`status.${value}`),
  }))

  const countryOptions = COUNTRY_VALUES.map((value) => ({
    value,
    label: t(`driverDialog.countries.${value}`),
  }))

  const stateOptions = getStateOptionsByCountry(licenseCountry)

  return (
    <TabsContent value="general" className="mt-0 space-y-3">
      {/* Personal Info section */}
      <FormSection title={t('driverDialog.personalInfo')}>
        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={control}
            name="firstName"
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.firstName')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="lastName"
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.lastName')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.dateOfBirth')}</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value || ''}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="status"
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('columns.status')}</FormLabel>
                <Select
                  options={statusOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      {/* Contact section */}
      <FormSection title={t('driverDialog.contact')}>
        <div className="grid gap-3 md:grid-cols-3">
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('columns.phone')}</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('columns.email')}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('columns.address')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      {/* Credentials section */}
      <FormSection title={t('driverDialog.credentials')}>
        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={control}
            name="username"
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.username')} *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.newPassword')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('driverDialog.newPassword')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      {/* License section */}
      <FormSection title={t('driverDialog.license')}>
        <div className="grid gap-3 md:grid-cols-3">
          <FormField
            control={control}
            name="licenseCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.country')}</FormLabel>
                <Select
                  options={countryOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="licenseState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.state')}</FormLabel>
                <Select
                  options={stateOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.licenseNumber')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      {/* Assigned To section */}
      <FormSection title={t('driverDialog.assignedTo')}>
        <div className="grid gap-3 md:grid-cols-2">
          <FormField
            control={control}
            name="homeTerminal"
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.homeTerminal')} *</FormLabel>
                <Select
                  options={[]}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('driverDialog.selectTerminal')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="suggestedVehicles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driverDialog.suggestedVehicles')}</FormLabel>
                <Select
                  options={[]}
                  value={field.value?.[0] || ''}
                  onChange={(value) => field.onChange([value])}
                  placeholder={t('driverDialog.selectVehicle')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      {/* Comments */}
      <FormField
        control={control}
        name="comments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('driverDialog.comments')}</FormLabel>
            <FormControl>
              <Textarea rows={2} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  )
}
