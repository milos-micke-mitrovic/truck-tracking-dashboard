import { useEffect, useMemo, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
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
  DatePicker,
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
import { adminKeys } from '../../api/keys'
import {
  useTrailer,
  useCreateTrailer,
  useUpdateTrailer,
  useDeleteTrailer,
  useCompanies,
  useVehicles,
} from '../../api'
import type {
  Trailer,
  TrailerFormValues,
  TrailerSheetProps,
  TrailerStatus,
  TrailerOwnership,
  TrailerType,
  TrailerDocumentFormValue,
} from '../../types'
import {
  TRAILER_STATUS_VALUES,
  TRAILER_OWNERSHIP_VALUES,
  TRAILER_TYPE_VALUES,
  TRAILER_DOCUMENT_TYPES,
} from '../../constants'

const getFormDefaults = (trailer?: Trailer | null): TrailerFormValues => ({
  companyId: trailer?.companyId || null,
  currentVehicleId: trailer?.currentVehicleId || null,
  unitId: trailer?.unitId || '',
  vin: trailer?.vin || '',
  type: trailer?.type || '',
  model: trailer?.model || '',
  year: trailer?.year?.toString() || '',
  lengthFeet: trailer?.lengthFeet?.toString() || '',
  licensePlate: trailer?.licensePlate || '',
  state: trailer?.state || '',
  registrationExpiry: trailer?.registrationExpiry || '',
  ownership: trailer?.ownership || '',
  homeTerminal: trailer?.homeTerminal || '',
  status: trailer?.status || 'ACTIVE',
  documents:
    trailer?.documents?.map((doc) => ({
      id: doc.id,
      type: doc.type,
      originalFileName: doc.name,
      expirationDate: doc.expirationDate || undefined,
      isNew: false,
    })) || [],
})

export function TrailerSheet({
  open,
  onOpenChange,
  trailerId,
  onSuccess,
}: TrailerSheetProps) {
  const { t } = useTranslation('admin')
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const isEdit = !!trailerId

  // Fetch full trailer data when editing
  const { data: trailer, isLoading: isLoadingTrailer } = useTrailer(
    trailerId || 0
  )

  // Fetch companies and vehicles for selectors
  const { data: companiesData } = useCompanies({ size: 100, tenantId: user?.tenantId })
  const { data: vehiclesData } = useVehicles({ size: 100, tenantId: user?.tenantId })

  const createMutation = useCreateTrailer()
  const updateMutation = useUpdateTrailer()
  const deleteMutation = useDeleteTrailer()
  const uploadMutation = useUploadTempFile()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const form = useForm<TrailerFormValues>({
    defaultValues: getFormDefaults(),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'documents',
  })

  // Track deleted document IDs for existing documents
  const [deletedDocumentIds, setDeletedDocumentIds] = useState<number[]>([])

  // Reset form when sheet opens or trailer data loads
  useEffect(() => {
    if (open) {
      setDeletedDocumentIds([])
      if (isEdit && trailer) {
        form.reset(getFormDefaults(trailer))
      } else if (!isEdit) {
        form.reset(getFormDefaults())
      }
    }
  }, [open, isEdit, trailer, form])

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

  // Company options
  const companyOptions = useMemo(
    () => [
      { value: '', label: t('vehicleSheet.selectCompany') },
      ...(companiesData?.content || []).map((c) => ({
        value: String(c.id),
        label: c.fullName,
      })),
    ],
    [companiesData, t]
  )

  // Vehicle options
  const vehicleOptions = useMemo(
    () => [
      { value: '', label: t('filters.vehicle') },
      ...(vehiclesData?.content || []).map((v) => ({
        value: String(v.id),
        label: v.unitId,
      })),
    ],
    [vehiclesData, t]
  )

  // Document type options
  const documentTypeOptions = TRAILER_DOCUMENT_TYPES.map((type) => ({
    value: type,
    label: t(`vehicleSheet.documentTypes.${type}`),
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
    } as TrailerDocumentFormValue)
  }

  const handleSubmit = async (values: TrailerFormValues) => {
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
      if (!values.companyId) {
        throw new Error('Missing company ID')
      }

      const requestData = {
        tenantId: user.tenantId,
        companyId: values.companyId,
        currentVehicleId: values.currentVehicleId || undefined,
        unitId: values.unitId,
        vin: values.vin,
        type: values.type as TrailerType,
        model: values.model,
        year: values.year ? parseInt(values.year) : undefined,
        lengthFeet: values.lengthFeet ? parseInt(values.lengthFeet) : undefined,
        licensePlate: values.licensePlate,
        state: values.state || undefined,
        registrationExpiry: values.registrationExpiry || undefined,
        ownership: values.ownership as TrailerOwnership,
        homeTerminal: values.homeTerminal || undefined,
        status: values.status,
        documents: documentRequests.length > 0 ? documentRequests : undefined,
        documentIdsToDelete: deletedDocumentIds.length > 0 ? deletedDocumentIds : undefined,
      }

      if (isEdit && trailerId) {
        await updateMutation.mutateAsync({ id: trailerId, data: requestData })
        toast.success(t('trailerSheet.updateSuccess'))
      } else {
        await createMutation.mutateAsync(requestData)
        toast.success(t('trailerSheet.createSuccess'))
      }

      onOpenChange(false)
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('trailerSheet.error')))
    }
  }

  const handleDelete = async () => {
    if (!trailerId) return
    try {
      queryClient.removeQueries({ queryKey: adminKeys.trailer(trailerId) })
      await deleteMutation.mutateAsync(trailerId)
      toast.success(t('deleteConfirm.success', { entity: t('tabs.trailers') }))
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
        {isEdit && isLoadingTrailer ? (
          <>
            <SheetHeader className="border-b px-6 py-3">
              <SheetTitle>{t('trailerSheet.editTitle')}</SheetTitle>
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
                {isEdit ? t('trailerSheet.editTitle') : t('actions.addTrailer')}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <FormSection title={t('trailerSheet.identification')}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="unitId"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('columns.trailerId')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licensePlate"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('columns.licensePlate')}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vin"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel required>{t('columns.vin')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title={t('vehicleSheet.assignment')}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="companyId"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('columns.company')}</FormLabel>
                        <Select
                          options={companyOptions}
                          value={field.value ? String(field.value) : ''}
                          onChange={(v) =>
                            field.onChange(v ? parseInt(v, 10) : null)
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentVehicleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('columns.vehicle')}</FormLabel>
                        <Select
                          options={vehicleOptions}
                          value={field.value ? String(field.value) : ''}
                          onChange={(v) =>
                            field.onChange(v ? parseInt(v, 10) : null)
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title={t('trailerSheet.specifications')}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="type"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('columns.type')}</FormLabel>
                        <Select
                          options={TRAILER_TYPE_VALUES.map((value) => ({
                            value,
                            label: t(`trailerType.${value.toLowerCase()}`),
                          }))}
                          value={field.value}
                          onChange={(v) => field.onChange(v as TrailerType)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('columns.model')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('columns.year')}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lengthFeet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('trailerSheet.lengthFeet')}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ownership"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('columns.ownership')}</FormLabel>
                        <Select
                          options={TRAILER_OWNERSHIP_VALUES.map((value) => ({
                            value,
                            label: t(`trailerOwnership.${value.toLowerCase()}`),
                          }))}
                          value={field.value}
                          onChange={(v) => field.onChange(v as TrailerOwnership)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('columns.status')}</FormLabel>
                        <Select
                          options={TRAILER_STATUS_VALUES.map((value) => ({
                            value,
                            label: t(`status.${value.toLowerCase()}`),
                          }))}
                          value={field.value}
                          onChange={(v) => field.onChange(v as TrailerStatus)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title={t('trailerSheet.registration')}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('driverDialog.state')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="registrationExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('trailerSheet.registrationExpiry')}
                        </FormLabel>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t('common:selectDate')}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="homeTerminal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('driverDialog.homeTerminal')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
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
                entityType="trailer"
              />
            </div>
          </Form>
        )}

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title={t('deleteConfirm.trailer.title')}
          description={t('deleteConfirm.trailer.description')}
          onConfirm={handleDelete}
          loading={deleteMutation.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}
