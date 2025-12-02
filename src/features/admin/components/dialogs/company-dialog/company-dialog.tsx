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
import { TerminalsTab } from './terminals-tab'
import { ConfigurationsTab } from './configurations-tab'
import { DocumentsTab } from './documents-tab'
import type { CompanyFormValues, CompanyDialogProps } from '../../../types'
import { getCompanyFormDefaults } from '../../../utils'

export function CompanyDialog({ open, onOpenChange, company, onSuccess }: CompanyDialogProps) {
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-[850px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('companyDialog.editTitle') : t('companyDialog.addTitle')}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-shrink-0 -mx-6 px-6 pb-1">
            <TabsList className="w-max">
              <TabsTrigger value="general">{t('companyDialog.tabs.general')}</TabsTrigger>
              <TabsTrigger value="terminals">{t('companyDialog.tabs.terminals')}</TabsTrigger>
              <TabsTrigger value="configurations">{t('companyDialog.tabs.configurations')}</TabsTrigger>
              <TabsTrigger value="documents">{t('companyDialog.tabs.documents')}</TabsTrigger>
            </TabsList>
          </div>

          <Form form={form} onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto py-3">
              <GeneralTab />
              <TerminalsTab />
              <ConfigurationsTab />
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
