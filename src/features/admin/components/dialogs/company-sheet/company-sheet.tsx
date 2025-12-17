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
import type { CompanyFormValues, CompanySheetProps } from '../../../types'
import { getCompanyFormDefaults } from '../../../utils'

export function CompanySheet({
  open,
  onOpenChange,
  company,
  onSuccess,
}: CompanySheetProps) {
  const { t } = useTranslation('admin')
  const [activeTab, setActiveTab] = useState('general')
  const isEdit = !!company

  const form = useForm<CompanyFormValues>({
    defaultValues: getCompanyFormDefaults(company),
  })

  // Reset form when company changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset(getCompanyFormDefaults(company))
    }
  }, [open, company, form])

  // Reset tab when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setActiveTab('general')
    }
    onOpenChange(isOpen)
  }

  const handleSubmit = async (values: CompanyFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(isEdit ? 'Company updated:' : 'Company created:', values)

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
                ? t('companyDialog.editTitle')
                : t('companyDialog.addTitle')}
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
                  {t('companyDialog.tabs.general')}
                </TabsTrigger>
                <TabsTrigger value="documents">
                  {t('companyDialog.tabs.documents')}
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
