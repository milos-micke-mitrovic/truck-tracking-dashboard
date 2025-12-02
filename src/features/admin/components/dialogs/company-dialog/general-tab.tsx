import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input, Select, TabsContent, ImageUpload } from '@/shared/ui'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form'
import { FormSection } from '@/shared/components'
import type { CompanyFormValues } from '../../../types'
import {
  PLAN_VALUES,
  STATUS_VALUES,
  INDUSTRY_VALUES,
  CARGO_TYPE_VALUES,
} from '../../../constants'

export function GeneralTab() {
  const { t } = useTranslation('admin')
  const { control } = useFormContext<CompanyFormValues>()

  const planOptions = PLAN_VALUES.map((value) => ({
    value,
    label: t(`plan.${value}`),
  }))

  const statusOptions = STATUS_VALUES.map((value) => ({
    value,
    label: t(`status.${value}`),
  }))

  const industryOptions = INDUSTRY_VALUES.map((value) => ({
    value,
    label: t(`companyDialog.industry.${value}`),
  }))

  const cargoTypeOptions = CARGO_TYPE_VALUES.map((value) => ({
    value,
    label: t(`companyDialog.cargoType.${value === 'household_goods' ? 'householdGoods' : value}`),
  }))

  return (
    <TabsContent value="general" className="mt-0 space-y-3">
      {/* Company Info */}
      <FormSection title={t('companyDialog.companyInfo')}>
        {/* Logo upload */}
        <FormField
          control={control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                label={t('companyDialog.logo')}
                hint={t('companyDialog.logoHint')}
              />
            </FormItem>
          )}
        />

        {/* Name fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            control={control}
            name="name"
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('companyDialog.fullName')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="displayName"
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('companyDialog.displayName')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* DOT Number */}
        <FormField
          control={control}
          name="dotNumber"
          rules={{ required: t('validation.required') }}
          render={({ field }) => (
            <FormItem className="sm:w-1/2">
              <FormLabel>{t('columns.dotNumber')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={control}
          name="address"
          rules={{ required: t('validation.required') }}
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
      </FormSection>

      {/* Contact section */}
      <FormSection title={t('companyDialog.contact')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            name="emailDomain"
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('columns.emailDomain')}</FormLabel>
                <FormControl>
                  <Input placeholder="company.com" prefixIcon={<span className="text-muted-foreground">@</span>} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      {/* Subscription section */}
      <FormSection title={t('companyDialog.subscription')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            control={control}
            name="plan"
            rules={{ required: t('validation.required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('columns.plan')}</FormLabel>
                <Select
                  options={planOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
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

      {/* Business Type section */}
      <FormSection title={t('companyDialog.businessType')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            control={control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('companyDialog.industry.label')}</FormLabel>
                <Select
                  options={industryOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="cargoType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('companyDialog.cargoType.label')}</FormLabel>
                <Select
                  options={cargoTypeOptions}
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
