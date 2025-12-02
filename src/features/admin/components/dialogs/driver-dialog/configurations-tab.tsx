import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Select, Checkbox, TabsContent } from '@/shared/ui'
import { FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { H4 } from '@/shared/ui/typography'
import type { DriverFormValues } from '../../../types'

export function ConfigurationsTab() {
  const { t } = useTranslation('admin')
  const { control } = useFormContext<DriverFormValues>()

  const cycleRuleOptions = [
    { value: 'usa_70_8', label: 'USA 70 hour / 8 days' },
    { value: 'usa_60_7', label: 'USA 60 hour / 7 days' },
    { value: 'canada_70_7', label: 'Canada 70 hour / 7 days' },
    { value: 'canada_120_14', label: 'Canada 120 hour / 14 days' },
  ]

  const constantExceptionsOptions = [
    { value: 'none', label: t('companyDialog.exceptions.none') },
    { value: 'short_haul', label: t('companyDialog.exceptions.shortHaul') },
    { value: 'adverse_conditions', label: t('companyDialog.exceptions.adverseConditions') },
  ]

  return (
    <TabsContent value="configurations" className="mt-0 space-y-3">
      {/* HoS Configuration */}
      <div className="space-y-3 p-3 border rounded-lg">
        <H4 className="text-primary">{t('companyDialog.hosConfig')}</H4>
        <FormField
          control={control}
          name="cycleRule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('companyDialog.cycleRule')}</FormLabel>
              <Select
                options={cycleRuleOptions}
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="constantExceptions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('companyDialog.constantExceptions')}</FormLabel>
              <Select
                options={constantExceptionsOptions}
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={control}
            name="personalUse"
            render={({ field }) => (
              <FormItem>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label={t('columns.personalUse')}
                />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="yardMoves"
            render={({ field }) => (
              <FormItem>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label={t('columns.yardMoves')}
                />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
          name="exempt"
          render={({ field }) => (
            <FormItem>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                label={t('driverDialog.exemptDriver')}
              />
            </FormItem>
          )}
        />
      </div>

      {/* App Configuration */}
      <div className="space-y-3 p-3 border rounded-lg">
        <H4 className="text-primary">{t('companyDialog.appConfig')}</H4>
        <div className="space-y-2">
          <FormField
            control={control}
            name="joinHosClocks"
            render={({ field }) => (
              <FormItem>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label={t('companyDialog.joinHosClocks')}
                />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="showTmsDashboard"
            render={({ field }) => (
              <FormItem>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label={t('companyDialog.showTmsDashboard')}
                />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="requirePasscodeToExitInspection"
            render={({ field }) => (
              <FormItem>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label={t('companyDialog.requirePasscode')}
                />
              </FormItem>
            )}
          />
        </div>
      </div>
    </TabsContent>
  )
}
