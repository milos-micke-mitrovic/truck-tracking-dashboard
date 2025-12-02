import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input, Select, Checkbox, TabsContent } from '@/shared/ui'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form'
import { Caption } from '@/shared/ui/typography'
import { FormSection } from '@/shared/components'
import type { CompanyFormValues } from '../../../types'
import { CYCLE_RULE_OPTIONS, CONSTANT_EXCEPTIONS_VALUES } from '../../../constants'

export function ConfigurationsTab() {
  const { t } = useTranslation('admin')
  const { control } = useFormContext<CompanyFormValues>()

  const constantExceptionsOptions = CONSTANT_EXCEPTIONS_VALUES.map((value) => ({
    value,
    label: t(`companyDialog.exceptions.${value === 'short_haul' ? 'shortHaul' : value === 'adverse_conditions' ? 'adverseConditions' : value}`),
  }))

  return (
    <TabsContent value="configurations" className="mt-0 space-y-3">
      {/* ELD Configuration */}
      <FormSection title={t('companyDialog.eldConfig')}>
        <FormField
          control={control}
          name="vehicleMotionSpeedThreshold"
          render={({ field }) => (
            <FormItem className="sm:w-1/2">
              <FormLabel>{t('companyDialog.speedThreshold')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <Caption>{t('companyDialog.speedThresholdHint')}</Caption>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

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

      {/* Accounting Configuration */}
      <FormSection title={t('companyDialog.accountingConfig')}>
        <Caption color="muted">{t('companyDialog.accountingConfigPlaceholder')}</Caption>
      </FormSection>
    </TabsContent>
  )
}
