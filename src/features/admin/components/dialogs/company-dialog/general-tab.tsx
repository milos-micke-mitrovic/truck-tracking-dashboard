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
import { H4 } from '@/shared/ui/typography'
import type { CompanyFormValues } from '../../../types'

export function GeneralTab() {
  const { t } = useTranslation('admin')
  const { control } = useFormContext<CompanyFormValues>()

  const planOptions = [
    { value: 'basic', label: t('plan.basic') },
    { value: 'premium', label: t('plan.premium') },
    { value: 'enterprise', label: t('plan.enterprise') },
  ]

  const statusOptions = [
    { value: 'active', label: t('status.active') },
    { value: 'inactive', label: t('status.inactive') },
  ]

  const industryOptions = [
    { value: 'transportation', label: t('companyDialog.industry.transportation') },
    { value: 'logistics', label: t('companyDialog.industry.logistics') },
    { value: 'manufacturing', label: t('companyDialog.industry.manufacturing') },
    { value: 'retail', label: t('companyDialog.industry.retail') },
    { value: 'construction', label: t('companyDialog.industry.construction') },
    { value: 'agriculture', label: t('companyDialog.industry.agriculture') },
  ]

  const cargoTypeOptions = [
    { value: 'property', label: t('companyDialog.cargoType.property') },
    { value: 'passengers', label: t('companyDialog.cargoType.passengers') },
    { value: 'hazmat', label: t('companyDialog.cargoType.hazmat') },
    { value: 'household_goods', label: t('companyDialog.cargoType.householdGoods') },
  ]

  return (
    <TabsContent value="general" className="mt-0 space-y-3">
      {/* Company Info */}
      <div className="space-y-3 p-3 border rounded-lg">
        <H4 className="text-primary">{t('companyDialog.companyInfo')}</H4>

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
      </div>

      {/* Contact section */}
      <div className="space-y-3 p-3 border rounded-lg">
        <H4 className="text-primary">{t('companyDialog.contact')}</H4>
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
      </div>

      {/* Subscription section */}
      <div className="space-y-3 p-3 border rounded-lg">
        <H4 className="text-primary">{t('companyDialog.subscription')}</H4>
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
      </div>

      {/* Business Type section */}
      <div className="space-y-3 p-3 border rounded-lg">
        <H4 className="text-primary">{t('companyDialog.businessType')}</H4>
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
      </div>
    </TabsContent>
  )
}
