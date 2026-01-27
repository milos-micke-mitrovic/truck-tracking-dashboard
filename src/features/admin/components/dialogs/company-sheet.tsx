import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  Button,
  Input,
  Select,
  Spinner,
  ConfirmDialog,
} from '@/shared/ui'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form'
import { FormSection, DocumentsSection } from '@/shared/components'
import { getApiErrorMessage } from '@/shared/utils'
import { useAuth } from '@/features/auth'
import { useUploadTempFile } from '@/shared/api/documents'
import { useCompany, useCreateCompany, useUpdateCompany, useDeleteCompany } from '../../api'
import type {
  Company,
  CompanyFormValues,
  CompanySheetProps,
  CompanyStatus,
  SubscriptionPlan,
  CompanyDocumentFormValue,
} from '../../types'
import { COMPANY_STATUS_VALUES, COMPANY_DOCUMENT_TYPES } from '../../constants'

const SUBSCRIPTION_PLAN_VALUES: SubscriptionPlan[] = [
  'BASIC',
  'STANDARD',
  'PREMIUM',
  'ENTERPRISE',
]

const getFormDefaults = (company?: Company | null): CompanyFormValues => ({
  fullName: company?.fullName || '',
  displayName: company?.displayName || '',
  dotNumber: company?.dotNumber || '',
  mcNumber: company?.mcNumber || '',
  address: company?.address || '',
  phoneNumber: company?.phoneNumber || '',
  emailDomain: company?.emailDomain || '',
  status: company?.status || 'ACTIVE',
  subscriptionPlan: 'BASIC',
  documents:
    company?.documents?.map((doc) => ({
      id: doc.id,
      type: doc.type,
      originalFileName: doc.name,
      expirationDate: doc.expirationDate || undefined,
      isNew: false,
    })) || [],
})

export function CompanySheet({
  open,
  onOpenChange,
  companyId,
  onSuccess,
}: CompanySheetProps) {
  const { t } = useTranslation('admin')
  const { user } = useAuth()
  const isEdit = !!companyId

  // Fetch full company data when editing
  const { data: company, isLoading: isLoadingCompany } = useCompany(
    companyId || 0
  )

  const createMutation = useCreateCompany()
  const updateMutation = useUpdateCompany()
  const deleteMutation = useDeleteCompany()
  const uploadMutation = useUploadTempFile()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const form = useForm<CompanyFormValues>({
    defaultValues: getFormDefaults(),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'documents',
  })

  // Track deleted document IDs for existing documents
  const [deletedDocumentIds, setDeletedDocumentIds] = useState<number[]>([])

  // Reset form when sheet opens or company data loads
  useEffect(() => {
    if (open) {
      setDeletedDocumentIds([])
      if (isEdit && company) {
        form.reset(getFormDefaults(company))
      } else if (!isEdit) {
        form.reset(getFormDefaults())
      }
    }
  }, [open, isEdit, company, form])

  // Track document ID for deletion (used by both remove and file clear)
  const trackDocumentDeletion = (index: number) => {
    const doc = form.getValues(`documents.${index}`)
    if (doc?.id && !deletedDocumentIds.includes(doc.id)) {
      setDeletedDocumentIds((prev) => [...prev, doc.id!])
    }
  }

  // Handle document removal - track IDs of existing documents for deletion
  const handleRemoveDocument = (index: number) => {
    trackDocumentDeletion(index)
    remove(index)
  }

  // Handle file clear - track ID and clear file fields
  const handleFileClear = (index: number) => {
    trackDocumentDeletion(index)
    form.setValue(`documents.${index}.tempFileName`, undefined)
    form.setValue(`documents.${index}.originalFileName`, undefined)
  }

  // Document type options
  const documentTypeOptions = COMPANY_DOCUMENT_TYPES.map((type) => ({
    value: type,
    label: t(`companyDialog.documentTypes.${type}`),
  }))

  // Handle file upload for a document
  const handleFileUpload = async (index: number, file: File) => {
    try {
      const result = await uploadMutation.mutateAsync(file)
      form.setValue(`documents.${index}.tempFileName`, result.tempFileName)
      form.setValue(
        `documents.${index}.originalFileName`,
        result.originalFileName
      )
      form.setValue(`documents.${index}.isNew`, true)
    } catch {
      toast.error(t('driverDialog.uploadError') || 'Upload failed')
    }
  }

  // Add new document row
  const handleAddDocument = () => {
    append({
      type: '',
      isNew: true,
    } as CompanyDocumentFormValue)
  }

  const handleSubmit = async (values: CompanyFormValues) => {
    try {
      // Prepare documents for submission (only new ones with uploads)
      const documentRequests = values.documents
        .filter((doc) => doc.isNew && doc.tempFileName && doc.type)
        .map((doc) => ({
          type: doc.type,
          tempFileName: doc.tempFileName!,
          originalFileName: doc.originalFileName!,
          expirationDate: doc.expirationDate,
        }))

      if (!user?.tenantId) {
        throw new Error('Missing tenant ID')
      }

      const requestData = {
        tenantId: user.tenantId,
        fullName: values.fullName,
        displayName: values.displayName,
        dotNumber: values.dotNumber,
        mcNumber: values.mcNumber,
        address: values.address,
        phoneNumber: values.phoneNumber,
        emailDomain: values.emailDomain,
        status: values.status,
        subscriptionPlan: values.subscriptionPlan,
        documents: documentRequests.length > 0 ? documentRequests : undefined,
        documentIdsToDelete: deletedDocumentIds.length > 0 ? deletedDocumentIds : undefined,
      }

      if (isEdit && companyId) {
        await updateMutation.mutateAsync({ id: companyId, data: requestData })
        toast.success(t('companyDialog.updateSuccess'))
      } else {
        await createMutation.mutateAsync(requestData)
        toast.success(t('companyDialog.createSuccess'))
      }

      onOpenChange(false)
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('companyDialog.error')))
    }
  }

  const handleDelete = async () => {
    if (!companyId) return
    try {
      await deleteMutation.mutateAsync(companyId)
      toast.success(t('deleteConfirm.success', { entity: t('tabs.companies') }))
      setDeleteDialogOpen(false)
      onOpenChange(false)
    } catch {
      // Error toast is handled by QueryClient
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="lg" className="flex flex-col overflow-hidden p-0">
        {isEdit && isLoadingCompany ? (
          <>
            <SheetHeader className="border-b px-6 py-3">
              <SheetTitle>{t('companyDialog.editTitle')}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-1 items-center justify-center">
              <Spinner size="lg" />
            </div>
          </>
        ) : (
          <Form
            form={form}
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <SheetHeader
              className="border-b px-6 py-3"
              actions={
                <>
                  {isEdit && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      {t('actions.delete')}
                    </Button>
                  )}
                  <SheetClose asChild>
                    <Button type="button" variant="outline" size="sm">
                      {t('dialogs.cancel')}
                    </Button>
                  </SheetClose>
                  <Button type="submit" size="sm" loading={isLoading}>
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

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <FormSection title={t('companyDialog.sections.general')}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('companyDialog.fullName')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. ABC Transport LLC"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="displayName"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('companyDialog.displayName')}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. ABC Transport" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dotNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('companyDialog.dotNumber')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. 1234567" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mcNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('companyDialog.mcNumber')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. 123456" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title={t('companyDialog.sections.contact')}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t('companyDialog.address')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. 123 Main St, Chicago, IL 60601"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('companyDialog.phoneNumber')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. +1-555-123-4567" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailDomain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('companyDialog.emailDomain')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. abctransport.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title={t('companyDialog.sections.settings')}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('companyDialog.status')}</FormLabel>
                        <Select
                          options={COMPANY_STATUS_VALUES.map((value) => ({
                            value,
                            label: t(`status.${value.toLowerCase()}`),
                          }))}
                          value={field.value}
                          onChange={(v) => field.onChange(v as CompanyStatus)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subscriptionPlan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('companyDialog.subscriptionPlan')}
                        </FormLabel>
                        <Select
                          options={SUBSCRIPTION_PLAN_VALUES.map((value) => ({
                            value,
                            label: value,
                          }))}
                          value={field.value}
                          onChange={(v) => field.onChange(v as SubscriptionPlan)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <DocumentsSection
                control={form.control}
                fields={fields}
                getDocument={(index) => form.watch(`documents.${index}`)}
                documentTypeOptions={documentTypeOptions}
                onFileUpload={handleFileUpload}
                onRemove={handleRemoveDocument}
                onAdd={handleAddDocument}
                onFileClear={handleFileClear}
                isUploading={uploadMutation.isPending}
                entityType="company"
              />
            </div>
          </Form>
        )}

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title={t('deleteConfirm.company.title')}
          description={t('deleteConfirm.company.description')}
          onConfirm={handleDelete}
          loading={deleteMutation.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}
