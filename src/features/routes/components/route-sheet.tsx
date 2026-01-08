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
  Textarea,
  LocationPicker,
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
import { DocumentsSection } from '@/shared/components'
import { getApiErrorMessage } from '@/shared/utils'
import { useAuth } from '@/features/auth'
import { useUploadTempFile } from '@/shared/api/documents'
import { useVehicles, useDrivers } from '@/features/admin/api'
import { ROUTE_DOCUMENT_TYPES } from '@/features/admin/constants'
import { useCreateRoute, useUpdateRoute } from '../api'
import { ROUTE_STATUS_VALUES } from '../constants'
import type { RouteFormValues, RouteSheetProps, RouteStatus, RouteDocumentFormValue } from '../types'

// Convert date string (YYYY-MM-DD) to ISO 8601 with timezone for backend
const toZonedDateTime = (dateStr: string | undefined): string | undefined => {
  if (!dateStr) return undefined
  return `${dateStr}T00:00:00Z`
}

const getDefaultValues = (): RouteFormValues => ({
  routeNumber: '',
  routeName: '',
  status: 'PENDING',
  origin: '',
  destination: '',
  distanceMiles: 0,
  estimatedDurationHours: 0,
  vehicleId: undefined,
  driverId: undefined,
  scheduledStartDate: '',
  scheduledEndDate: '',
  actualStartDate: '',
  actualEndDate: '',
  notes: '',
  documents: [],
})

export function RouteSheet({
  open,
  onOpenChange,
  route,
  onSuccess,
}: RouteSheetProps) {
  const { t } = useTranslation('routes')
  const { user } = useAuth()
  const isEdit = !!route

  const createMutation = useCreateRoute()
  const updateMutation = useUpdateRoute()
  const uploadMutation = useUploadTempFile()

  // Fetch vehicles and drivers for select dropdowns
  const { data: vehiclesData } = useVehicles({ size: 100 })
  const { data: driversData } = useDrivers({ size: 100 })

  const vehicleOptions = useMemo(
    () => [
      { value: '', label: t('sheet.selectVehicle') },
      ...(vehiclesData?.content || []).map((v) => ({
        value: String(v.id),
        label: `${v.unitId} - ${v.make} ${v.model}`,
      })),
    ],
    [vehiclesData, t]
  )

  const driverOptions = useMemo(
    () => [
      { value: '', label: t('sheet.selectDriver') },
      ...(driversData?.content || []).map((d) => ({
        value: String(d.id),
        label: d.name,
      })),
    ],
    [driversData, t]
  )

  const statusOptions = useMemo(
    () =>
      ROUTE_STATUS_VALUES.map((value) => ({
        value,
        label: t(`status.${value.toLowerCase()}`),
      })),
    [t]
  )

  const form = useForm<RouteFormValues>({
    defaultValues: getDefaultValues(),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'documents',
  })

  // Reset form when sheet opens or route changes
  useEffect(() => {
    if (open) {
      if (route) {
        form.reset({
          routeNumber: route.routeNumber,
          routeName: route.routeName,
          status: route.status,
          origin: route.origin,
          destination: route.destination,
          distanceMiles: route.distanceMiles,
          estimatedDurationHours: route.estimatedDurationHours,
          vehicleId: route.vehicle?.id || route.vehicleId,
          driverId: route.driver?.id || route.driverId,
          scheduledStartDate: route.scheduledStartDate?.split('T')[0] || '',
          scheduledEndDate: route.scheduledEndDate?.split('T')[0] || '',
          actualStartDate: route.actualStartDate?.split('T')[0] || '',
          actualEndDate: route.actualEndDate?.split('T')[0] || '',
          notes: route.notes || '',
          documents:
            route.documents?.map((doc) => ({
              id: doc.id,
              type: doc.type,
              originalFileName: doc.name,
              expirationDate: doc.expirationDate || undefined,
              isNew: false,
            })) || [],
        })
      } else {
        form.reset(getDefaultValues())
      }
    }
  }, [open, route, form])

  // Document type options
  const documentTypeOptions = ROUTE_DOCUMENT_TYPES.map((type) => ({
    value: type,
    label: t(`sheet.documentTypes.${type}`),
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
      toast.error('Upload failed')
    }
  }

  // Add new document row
  const handleAddDocument = () => {
    append({
      type: '',
      isNew: true,
    } as RouteDocumentFormValue)
  }

  const handleSubmit = async (values: RouteFormValues) => {
    if (!user?.tenantId) {
      toast.error('User tenant not found')
      return
    }

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
      tenantId: user.tenantId,
      routeNumber: values.routeNumber,
      routeName: values.routeName,
      status: values.status,
      origin: values.origin,
      destination: values.destination,
      distanceMiles: values.distanceMiles,
      estimatedDurationHours: values.estimatedDurationHours,
      vehicleId: values.vehicleId || undefined,
      driverId: values.driverId || undefined,
      scheduledStartDate: toZonedDateTime(values.scheduledStartDate)!,
      scheduledEndDate: toZonedDateTime(values.scheduledEndDate)!,
      actualStartDate: toZonedDateTime(values.actualStartDate),
      actualEndDate: toZonedDateTime(values.actualEndDate),
      notes: values.notes || undefined,
      documents: documentRequests.length > 0 ? documentRequests : undefined,
    }

    try {
      if (isEdit && route) {
        await updateMutation.mutateAsync({ id: route.id, data: requestData })
        toast.success('Route updated successfully')
      } else {
        await createMutation.mutateAsync(requestData)
        toast.success('Route created successfully')
      }
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('sheet.error')))
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="lg" className="flex flex-col overflow-hidden p-0">
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
                    {t('sheet.cancel')}
                  </Button>
                </SheetClose>
                <Button type="submit" size="sm" loading={isLoading}>
                  {t('sheet.save')}
                </Button>
              </>
            }
          >
            <SheetTitle>
              {isEdit ? t('sheet.editTitle') : t('sheet.addTitle')}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
            {/* Route Number and Name */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="routeNumber"
                rules={{ required: t('validation.required') }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('sheet.routeNumber')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="routeName"
                rules={{ required: t('validation.required') }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('sheet.routeName')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Origin and Destination */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="origin"
                rules={{ required: t('validation.required') }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <LocationPicker
                      label={t('sheet.origin')}
                      required
                      value={field.value}
                      onChange={(address) => field.onChange(address)}
                      placeholder={t('sheet.origin')}
                      error={fieldState.error?.message}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                rules={{ required: t('validation.required') }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <LocationPicker
                      label={t('sheet.destination')}
                      required
                      value={field.value}
                      onChange={(address) => field.onChange(address)}
                      placeholder={t('sheet.destination')}
                      error={fieldState.error?.message}
                    />
                  </FormItem>
                )}
              />
            </div>

            {/* Distance and Duration */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="distanceMiles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sheet.distanceMiles')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimatedDurationHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sheet.estimatedDurationHours')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Vehicle and Driver */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sheet.vehicle')}</FormLabel>
                    <Select
                      options={vehicleOptions}
                      value={field.value ? String(field.value) : ''}
                      onChange={(v) =>
                        field.onChange(v ? parseInt(v, 10) : undefined)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="driverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sheet.driver')}</FormLabel>
                    <Select
                      options={driverOptions}
                      value={field.value ? String(field.value) : ''}
                      onChange={(v) =>
                        field.onChange(v ? parseInt(v, 10) : undefined)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Scheduled Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="scheduledStartDate"
                rules={{ required: t('validation.required') }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('sheet.scheduledStartDate')}</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('sheet.selectDate')}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scheduledEndDate"
                rules={{ required: t('validation.required') }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('sheet.scheduledEndDate')}</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('sheet.selectDate')}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Actual Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="actualStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sheet.actualStartDate')}</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('sheet.selectDate')}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="actualEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sheet.actualEndDate')}</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('sheet.selectDate')}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sheet.status')}</FormLabel>
                  <Select
                    options={statusOptions}
                    value={field.value}
                    onChange={(v) => field.onChange(v as RouteStatus)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sheet.notes')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Documents */}
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
              namespace="routes"
            />
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
