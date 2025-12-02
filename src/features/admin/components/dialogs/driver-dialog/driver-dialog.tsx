import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/shared/ui'
import { Form } from '@/shared/ui/form'
import { GeneralTab } from './general-tab'
import { ConfigurationsTab } from './configurations-tab'
import { AccountingTab } from './accounting-tab'
import { DocumentsTab } from './documents-tab'
import type { DriverFormValues, DriverDialogProps } from '../../../types'
import { getDriverFormDefaults } from '../../../utils'

export function DriverDialog({ open, onOpenChange, driver, onSuccess }: DriverDialogProps) {
  const { t } = useTranslation('admin')
  const [activeTab, setActiveTab] = useState('general')
  const isEdit = !!driver

  const form = useForm<DriverFormValues>({
    defaultValues: getDriverFormDefaults(driver),
  })

  // Reset form when driver changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset(getDriverFormDefaults(driver))
    }
  }, [open, driver, form])

  // Reset tab when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setActiveTab('general')
    }
    onOpenChange(isOpen)
  }

  const handleSubmit = async (values: DriverFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(isEdit ? 'Driver updated:' : 'Driver created:', values)

    handleOpenChange(false)
    form.reset()
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-[850px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('driverDialog.editTitle') : t('driverDialog.addTitle')}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-shrink-0 -mx-6 px-6 pb-1">
            <TabsList className="w-max">
              <TabsTrigger value="general">{t('driverDialog.tabs.general')}</TabsTrigger>
              <TabsTrigger value="configurations">{t('driverDialog.tabs.configurations')}</TabsTrigger>
              <TabsTrigger value="accounting">{t('driverDialog.tabs.accounting')}</TabsTrigger>
              <TabsTrigger value="documents">{t('driverDialog.tabs.documents')}</TabsTrigger>
            </TabsList>
          </div>

          <Form form={form} onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto py-3">
              <GeneralTab />
              <ConfigurationsTab />
              <AccountingTab />
              <DocumentsTab />
            </div>

            <DialogFooter className="border-t pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                {t('dialogs.cancel')}
              </Button>
              <Button type="submit" loading={form.formState.isSubmitting}>
                {t('dialogs.save')}
              </Button>
            </DialogFooter>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
