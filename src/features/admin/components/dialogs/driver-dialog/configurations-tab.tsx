import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Select, Checkbox, TabsContent } from '@/shared/ui'
import { FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { FormSection } from '@/shared/components'
import type { DriverFormValues } from '../../../types'
import { CYCLE_RULE_OPTIONS, CONSTANT_EXCEPTIONS_VALUES } from '../../../constants'

export function ConfigurationsTab() {
  const { t } = useTranslation('admin')
  const { control } = useFormContext<DriverFormValues>()

  const constantExceptionsOptions = CONSTANT_EXCEPTIONS_VALUES.map((value) => ({
    value,
    label: t(`companyDialog.exceptions.${value === 'short_haul' ? 'shortHaul' : value === 'adverse_conditions' ? 'adverseConditions' : value}`),
  }))

  return (
    <TabsContent value="configurations" className="mt-0 space-y-3">
      {/* HoS Configuration */}
      <FormSection title={t('companyDialog.hosConfig')}>
        <FormField
          control={control}
          name="cycleRule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('companyDialog.cycleRule')}</FormLabel>
              <Select
                options={[...CYCLE_RULE_OPTIONS]}
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
      </FormSection>

      {/* App Configuration */}
      <FormSection title={t('companyDialog.appConfig')}>
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
      </FormSection>
    </TabsContent>
  )
}
