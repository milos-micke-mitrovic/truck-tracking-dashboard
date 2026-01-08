import { useEffect, useMemo } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
import {
  useDriver,
  useCreateDriver,
  useUpdateDriver,
  useCompanies,
  useVehicles,
} from '../../api'
import type {
  Driver,
  DriverFormValues,
  DriverSheetProps,
  DriverStatus,
  DriverDocumentFormValue,
} from '../../types'
import {
  DRIVER_STATUS_VALUES,
  COUNTRY_VALUES,
  DRIVER_DOCUMENT_TYPES,
  getStateOptionsByCountry,
} from '../../constants'

const getFormDefaults = (driver?: Driver | null): DriverFormValues => ({
  companyId: driver?.companyId || null,
  vehicleId: driver?.vehicleId || null,
  firstName: driver?.firstName || '',
  lastName: driver?.lastName || '',
  birthDate: driver?.birthDate || '',
  phoneNumber: driver?.phoneNumber || '',
  email: driver?.email || '',
  address: driver?.address || '',
  username: driver?.username || '',
  password: '',
  country: driver?.country || 'us',
  state: driver?.state || '',
  licenseNumber: driver?.licenseNumber || '',
  homeTerminal: driver?.homeTerminal || '',
  status: driver?.status || 'ACTIVE',
  documents:
    driver?.documents?.map((doc) => ({
      id: doc.id,
      type: doc.documentType,
      originalFileName: doc.fileName,
      isNew: false,
    })) || [],
})

export function DriverSheet({
  open,
  onOpenChange,
  driverId,
  onSuccess,
}: DriverSheetProps) {
  const { t } = useTranslation('admin')
  const { user } = useAuth()
  const isEdit = !!driverId

  // Fetch full driver data when editing
  const { data: driver, isLoading: isLoadingDriver } = useDriver(driverId || 0)

  // Fetch companies and vehicles for selectors
  const { data: companiesData } = useCompanies({ size: 100 })
  const { data: vehiclesData } = useVehicles({ size: 100 })

  const createMutation = useCreateDriver()
  const updateMutation = useUpdateDriver()
  const uploadMutation = useUploadTempFile()

  const form = useForm<DriverFormValues>({
    defaultValues: getFormDefaults(),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'documents',
  })

  const country = form.watch('country')

  // Reset form when sheet opens or driver data loads
  useEffect(() => {
    if (open) {
      if (isEdit && driver) {
        form.reset(getFormDefaults(driver))
      } else if (!isEdit) {
        form.reset(getFormDefaults())
      }
    }
  }, [open, isEdit, driver, form])

  // Company options
  const companyOptions = useMemo(
    () => [
      { value: '', label: t('driverDialog.selectCompany') || 'Select company' },
      ...(companiesData?.content || []).map((c) => ({
        value: String(c.id),
        label: c.displayName || c.fullName,
      })),
    ],
    [companiesData, t]
  )

  // Vehicle options
  const vehicleOptions = useMemo(
    () => [
      { value: '', label: t('driverDialog.selectVehicle') },
      ...(vehiclesData?.content || []).map((v) => ({
        value: String(v.id),
        label: `${v.unitId} - ${v.make} ${v.model}`,
      })),
    ],
    [vehiclesData, t]
  )

  // Document type options
  const documentTypeOptions = DRIVER_DOCUMENT_TYPES.map((type) => ({
    value: type,
    label: t(`driverDialog.documentTypes.${type}`),
  }))

  // Handle file upload for a document
  const handleFileUpload = async (index: number, file: File) => {
    try {
      const result = await uploadMutation.mutateAsync(file)
      form.setValue(`documents.${index}.tempFileName`, result.tempFileName)
      form.setValue(`documents.${index}.originalFileName`, result.originalFileName)
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
    } as DriverDocumentFormValue)
  }

  const handleSubmit = async (values: DriverFormValues) => {
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

      const requestData = {
        tenantId: user?.tenantId || 1,
        companyId: values.companyId || 1,
        vehicleId: values.vehicleId,
        firstName: values.firstName,
        lastName: values.lastName,
        birthDate: values.birthDate || undefined,
        phoneNumber: values.phoneNumber || undefined,
        email: values.email || undefined,
        address: values.address || undefined,
        username: values.username,
        password: values.password || undefined,
        country: values.country || undefined,
        state: values.state || undefined,
        licenseNumber: values.licenseNumber || undefined,
        homeTerminal: values.homeTerminal || undefined,
        status: values.status,
        documents: documentRequests.length > 0 ? documentRequests : undefined,
      }

      if (isEdit && driverId) {
        await updateMutation.mutateAsync({ id: driverId, data: requestData })
        toast.success(t('driverDialog.updateSuccess'))
      } else {
        await createMutation.mutateAsync(requestData)
        toast.success(t('driverDialog.createSuccess'))
      }

      onOpenChange(false)
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('driverDialog.error')))
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  const countryOptions = COUNTRY_VALUES.map((value) => ({
    value,
    label: t(`driverDialog.countries.${value}`),
  }))

  const stateOptions = getStateOptionsByCountry(country)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="lg" className="flex flex-col overflow-hidden p-0">
        {isEdit && isLoadingDriver ? (
          <>
            <SheetHeader className="border-b px-6 py-3">
              <SheetTitle>{t('driverDialog.editTitle')}</SheetTitle>
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
                  ? t('driverDialog.editTitle')
                  : t('driverDialog.addTitle')}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <FormSection title={t('driverDialog.personalInfo')}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('driverDialog.firstName')}
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
                    name="lastName"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('driverDialog.lastName')}
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
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('driverDialog.dateOfBirth')}</FormLabel>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t('driverDialog.selectDate')}
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
                          options={DRIVER_STATUS_VALUES.map((value) => ({
                            value,
                            label: t(`status.${value.toLowerCase()}`),
                          }))}
                          value={field.value}
                          onChange={(v) => field.onChange(v as DriverStatus)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title={t('driverDialog.contact')}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('columns.phone')}</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('columns.email')}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t('columns.address')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title={t('driverDialog.credentials')}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="username"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t('driverDialog.username')}
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
                    name="password"
                    rules={!isEdit ? { required: t('validation.required') } : {}}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required={!isEdit}>
                          {t('driverDialog.newPassword')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={
                              isEdit ? t('driverDialog.leaveBlank') : undefined
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title={t('driverDialog.license')}>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('driverDialog.country')}</FormLabel>
                        <Select
                          options={countryOptions}
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('driverDialog.state')}</FormLabel>
                        <Select
                          options={stateOptions}
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('driverDialog.licenseNumber')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title={t('driverDialog.assignedTo')}>
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
                    name="vehicleId"
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
                onRemove={remove}
                onAdd={handleAddDocument}
                onFileClear={(index) => {
                  form.setValue(`documents.${index}.tempFileName`, undefined)
                  form.setValue(`documents.${index}.originalFileName`, undefined)
                }}
                isUploading={uploadMutation.isPending}
              />
            </div>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  )
}
