import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/shared/ui'
import { Form } from '@/shared/ui/form'
import { GeneralTab } from './general-tab'
import { DocumentsTab } from './documents-tab'
import type { DriverFormValues, DriverSheetProps } from '../../../types'
import { getDriverFormDefaults } from '../../../utils'

export function DriverSheet({
  open,
  onOpenChange,
  driver,
  onSuccess,
}: DriverSheetProps) {
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
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent size="2xl" className="flex flex-col overflow-hidden p-0">
        <Form
          form={form}
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <SheetHeader
            className="border-b px-6 py-3"
            actions={
              <>
                <SheetClose asChild>
                  <Button type="button" variant="outline" size="sm">
                    {t('dialogs.cancel')}
                  </Button>
                </SheetClose>
                <Button
                  type="submit"
                  size="sm"
                  loading={form.formState.isSubmitting}
                >
                  {t('dialogs.save')}
                </Button>
              </>
            }
          >
            <SheetTitle>
              {isEdit
                ? t('driverDialog.editTitle')
                : t('driverDialog.addTitle')}
            </SheetTitle>
          </SheetHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex-shrink-0 overflow-x-auto px-6 py-2">
              <TabsList className="w-max">
                <TabsTrigger value="general">
                  {t('driverDialog.tabs.general')}
                </TabsTrigger>
                <TabsTrigger value="documents">
                  {t('driverDialog.tabs.documents')}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <GeneralTab />
              <DocumentsTab />
            </div>
          </Tabs>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
