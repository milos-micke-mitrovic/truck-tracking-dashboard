import { useFormContext, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
import { Button, IconButton, Input, Select, TabsContent } from '@/shared/ui'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form'
import { H4 } from '@/shared/ui/typography'
import type { CompanyFormValues } from '../../../types'

export function TerminalsTab() {
  const { t } = useTranslation('admin')
  const { control } = useFormContext<CompanyFormValues>()

  const { fields: terminalFields, append: appendTerminal, remove: removeTerminal } = useFieldArray({
    control,
    name: 'terminals',
  })

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'America/Anchorage', label: 'Alaska Time' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time' },
  ]

  const addTerminal = () => {
    appendTerminal({
      id: `terminal-${Date.now()}`,
      address: '',
      timezone: 'America/Chicago',
      startingTime: '00:00:00',
    })
  }

  return (
    <TabsContent value="terminals" className="mt-0 space-y-3">
      {terminalFields.map((field, index) => (
        <div key={field.id} className="space-y-3 p-3 border rounded-lg relative">
          <div className="flex items-center justify-between">
            <H4 className="text-primary">
              {t('companyDialog.terminal')} {index + 1}
            </H4>
            {terminalFields.length > 1 && (
              <IconButton
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                icon={<Trash2 />}
                aria-label="Remove terminal"
                onClick={() => removeTerminal(index)}
              />
            )}
          </div>

          <FormField
            control={control}
            name={`terminals.${index}.address`}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              control={control}
              name={`terminals.${index}.timezone`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('companyDialog.timezone')}</FormLabel>
                  <Select
                    options={timezoneOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`terminals.${index}.startingTime`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('companyDialog.startingTime')}</FormLabel>
                  <FormControl>
                    <Input type="time" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        prefixIcon={<Plus />}
        onClick={addTerminal}
      >
        {t('companyDialog.addTerminal')}
      </Button>
    </TabsContent>
  )
}
