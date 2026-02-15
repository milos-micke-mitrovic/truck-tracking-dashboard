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
  Spinner,
  Input,
  Select,
  Checkbox,
  DatePicker,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  ConfirmDialog,
} from '@/shared/ui'
import { FormSection, DocumentsSection } from '@/shared/components'
import { getApiErrorMessage } from '@/shared/utils'
import { useAuth } from '@/features/auth'
import { useUploadTempFile } from '@/shared/api/documents'
import { adminKeys } from '../../api/keys'
import {
  useVehicle,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  useCompanies,
  useDrivers,
} from '../../api'
import type {
  Vehicle,
  VehicleOwnership,
  FuelType,
  VehicleStatus,
  VehicleFormValues,
  VehicleSheetProps,
  VehicleDocumentFormValue,
} from '../../types'
import {
  VEHICLE_MAKE_OPTIONS,
  VEHICLE_STATUS_VALUES,
  VEHICLE_OWNERSHIP_VALUES,
  FUEL_TYPE_VALUES,
  VEHICLE_DOCUMENT_TYPES,
} from '../../constants'

const getFormDefaults = (vehicle?: Vehicle | null): VehicleFormValues => ({
  companyId: vehicle?.companyId || null,
  currentDriverId: vehicle?.currentDriverId || null,
  unitId: vehicle?.unitId || '',
  vin: vehicle?.vin || '',
  make: vehicle?.make || '',
  model: vehicle?.model || '',
  year: vehicle?.year?.toString() || '',
  ownership: vehicle?.ownership || '',
  fuelType: vehicle?.fuelType || '',
  licensePlate: vehicle?.licensePlate || '',
  state: vehicle?.state || '',
  registrationExpiry: vehicle?.registrationExpiry || '',
  homeTerminal: vehicle?.homeTerminal || '',
  currentLocation: vehicle?.currentLocation || '',
  odometerMiles: vehicle?.odometerMiles?.toString() || '',
  insurancePolicyNumber: vehicle?.insurancePolicyNumber || '',
  insuranceExpiry: vehicle?.insuranceExpiry || '',
  cargoCapacityCubicFt: vehicle?.cargoCapacityCubicFt?.toString() || '',
  cargoCapacityLbs: vehicle?.cargoCapacityLbs?.toString() || '',
  hasRefrigeration: vehicle?.hasRefrigeration || false,
  isHazmatCertified: vehicle?.isHazmatCertified || false,
  status: vehicle?.status || 'ACTIVE',
  documents:
    vehicle?.documents?.map((doc) => ({
      id: doc.id,
      type: doc.type,
      originalFileName: doc.name,
      expirationDate: doc.expirationDate || undefined,
      isNew: false,
    })) || [],
})

export function VehicleSheet({
  open,
  onOpenChange,
  vehicleId,
  onSuccess,
}: VehicleSheetProps) {
  const { t } = useTranslation('admin')
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const isEdit = !!vehicleId

  // Fetch full vehicle data when editing
  const { data: vehicle, isLoading: isLoadingVehicle } = useVehicle(
    vehicleId || 0
  )

  // Fetch companies and drivers for selectors
  const { data: companiesData } = useCompanies({ size: 100 })
  const { data: driversData } = useDrivers({ size: 100 })

  const createMutation = useCreateVehicle()
  const updateMutation = useUpdateVehicle()
  const deleteMutation = useDeleteVehicle()
  const uploadMutation = useUploadTempFile()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const form = useForm<VehicleFormValues>({
    defaultValues: getFormDefaults(),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'documents',
  })

  // Track deleted document IDs for existing documents
  const [deletedDocumentIds, setDeletedDocumentIds] = useState<number[]>([])

  // Reset form when sheet opens or vehicle data loads
  useEffect(() => {
    if (open) {
      setDeletedDocumentIds([])
      if (isEdit && vehicle) {
        form.reset(getFormDefaults(vehicle))
      } else if (!isEdit) {
        form.reset(getFormDefaults())
      }
    }
  }, [open, isEdit, vehicle, form])

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

  // Driver options
  const driverOptions = useMemo(
    () => [
      { value: '', label: t('vehicleSheet.selectDriver') },
      ...(driversData?.content || []).map((d) => ({
        value: String(d.id),
        label: d.name,
      })),
    ],
    [driversData, t]
  )

  const makeOptions = [...VEHICLE_MAKE_OPTIONS]

  const ownershipOptions = VEHICLE_OWNERSHIP_VALUES.map((value) => ({
    value,
    label: t(`trailerOwnership.${value.toLowerCase()}`),
  }))

  const fuelTypeOptions = FUEL_TYPE_VALUES.map((value) => ({
    value,
    label: value.charAt(0) + value.slice(1).toLowerCase(),
  }))

  const statusOptions = VEHICLE_STATUS_VALUES.map((value) => ({
    value,
    label: t(`status.${value.toLowerCase()}`),
  }))

  // Document type options
  const documentTypeOptions = VEHICLE_DOCUMENT_TYPES.map((type) => ({
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
    } as VehicleDocumentFormValue)
  }

  const handleSubmit = async (values: VehicleFormValues) => {
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
        currentDriverId: values.currentDriverId || undefined,
        unitId: values.unitId,
        vin: values.vin,
        make: values.make,
        model: values.model,
        year: values.year ? parseInt(values.year) : new Date().getFullYear(),
        ownership: values.ownership as VehicleOwnership,
        fuelType: (values.fuelType as FuelType) || undefined,
        licensePlate: values.licensePlate,
        state: values.state || undefined,
        registrationExpiry: values.registrationExpiry || undefined,
        homeTerminal: values.homeTerminal || undefined,
        currentLocation: values.currentLocation || undefined,
        odometerMiles: values.odometerMiles
          ? parseFloat(values.odometerMiles)
          : undefined,
        insurancePolicyNumber: values.insurancePolicyNumber || undefined,
        insuranceExpiry: values.insuranceExpiry || undefined,
        cargoCapacityCubicFt: values.cargoCapacityCubicFt
          ? parseFloat(values.cargoCapacityCubicFt)
          : undefined,
        cargoCapacityLbs: values.cargoCapacityLbs
          ? parseFloat(values.cargoCapacityLbs)
          : undefined,
        hasRefrigeration: values.hasRefrigeration,
        isHazmatCertified: values.isHazmatCertified,
        status: values.status as VehicleStatus,
        documents: documentRequests.length > 0 ? documentRequests : undefined,
        documentIdsToDelete: deletedDocumentIds.length > 0 ? deletedDocumentIds : undefined,
      }

      if (isEdit && vehicleId) {
        await updateMutation.mutateAsync({ id: vehicleId, data: requestData })
        toast.success(t('vehicleSheet.updateSuccess'))
      } else {
        await createMutation.mutateAsync(requestData)
        toast.success(t('vehicleSheet.createSuccess'))
      }

      onOpenChange(false)
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('vehicleSheet.error')))
    }
  }

  const handleDelete = async () => {
    if (!vehicleId) return
    try {
      queryClient.removeQueries({ queryKey: adminKeys.vehicle(vehicleId) })
      await deleteMutation.mutateAsync(vehicleId)
      toast.success(t('deleteConfirm.success', { entity: t('tabs.vehicles') }))
      setDeleteDialogOpen(false)
      onOpenChange(false)
    } catch {
      // Error toast is handled by QueryClient
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="xl" className="flex flex-col overflow-hidden p-0">
        {isEdit && isLoadingVehicle ? (
          <>
            <SheetHeader className="border-b px-6 py-3">
              <SheetTitle>{t('vehicleSheet.editTitle')}</SheetTitle>
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
                {isEdit ? t('vehicleSheet.editTitle') : t('actions.addVehicle')}
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-3 overflow-y-auto px-6 py-4">
              <FormSection title={t('vehicleSheet.identification')}>
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="unitId"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('columns.unitNumber')}</FormLabel>
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

              <FormSection title={t('vehicleSheet.specifications')}>
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="make"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('columns.make')}</FormLabel>
                        <Select
                          options={makeOptions}
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model"
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('columns.model')}</FormLabel>
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
                    rules={{ required: t('validation.required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('columns.year')}</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2024" {...field} />
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
                          options={ownershipOptions}
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('vehicleSheet.fuelType')}</FormLabel>
                        <Select
                          options={fuelTypeOptions}
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="odometerMiles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('vehicleSheet.odometer')}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isEdit && (
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('columns.status')}</FormLabel>
                          <Select
                            options={statusOptions}
                            value={field.value}
                            onChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </FormSection>

              <FormSection title={t('vehicleSheet.assignment')}>
                <div className="grid gap-3 md:grid-cols-2">
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
                    name="currentDriverId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('columns.driver')}</FormLabel>
                        <Select
                          options={driverOptions}
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
                  <FormField
                    control={form.control}
                    name="currentLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('vehicleSheet.currentLocation')}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title={t('vehicleSheet.registration')}>
                <div className="grid gap-3 md:grid-cols-2">
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
                </div>
              </FormSection>

              <FormSection title={t('vehicleSheet.insurance')}>
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="insurancePolicyNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('vehicleSheet.insurancePolicyNumber')}
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
                    name="insuranceExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('vehicleSheet.insuranceExpiry')}</FormLabel>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t('common:selectDate')}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title={t('vehicleSheet.cargo')}>
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="cargoCapacityCubicFt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('vehicleSheet.cargoCapacityCubicFt')}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cargoCapacityLbs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('vehicleSheet.cargoCapacityLbs')}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hasRefrigeration"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onChange={field.onChange}
                            label={t('vehicleSheet.hasRefrigeration')}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isHazmatCertified"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onChange={field.onChange}
                            label={t('vehicleSheet.isHazmatCertified')}
                          />
                        </FormControl>
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
                entityType="vehicle"
              />
            </div>
          </Form>
        )}

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title={t('deleteConfirm.vehicle.title')}
          description={t('deleteConfirm.vehicle.description')}
          onConfirm={handleDelete}
          loading={deleteMutation.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}
