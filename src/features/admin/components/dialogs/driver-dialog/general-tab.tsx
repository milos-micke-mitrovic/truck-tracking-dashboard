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
import { H4 } from '@/shared/ui/typography'
import type { DriverFormValues } from '../../../types'

export function GeneralTab() {
  const { t } = useTranslation('admin')
  const { control } = useFormContext<DriverFormValues>()

  const statusOptions = [
    { value: 'active', label: t('status.active') },
    { value: 'inactive', label: t('status.inactive') },
  ]

  return (
    <TabsContent value="general" className="mt-0 space-y-3">
      {/* Personal Info section */}
      <div className="space-y-3 p-3 border rounded-lg">
        <H4 className="text-primary">{t('driverDialog.personalInfo')}</H4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        </div>

        <FormField
          control={control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="sm:w-1/2">
              <FormLabel>{t('driverDialog.dateOfBirth')}</FormLabel>
              <FormControl>
                <Input type="date" value={field.value || ''} onChange={field.onChange} />
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
            <FormItem className="sm:w-1/2">
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

      {/* Contact section */}
      <div className="space-y-3 p-3 border rounded-lg">
        <H4 className="text-primary">{t('driverDialog.contact')}</H4>
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
        </div>

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

      {/* Comments */}
      <FormField
        control={control}
        name="comments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('driverDialog.comments')}</FormLabel>
            <FormControl>
              <Textarea rows={3} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  )
}
